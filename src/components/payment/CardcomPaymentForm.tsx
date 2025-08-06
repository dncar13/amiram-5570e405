
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { initializePayment } from "@/services/cardcomService";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "@/context/AuthContext";
import { couponValidationService } from "@/utils/couponValidationService";
import { isTestEnvironment, getCardComApiUrl } from "@/config/cardcom.config";
import type { PaymentInitRequest } from "@/types/cardcom.types";

interface CardcomPaymentFormProps {
  amount: number;
  planType: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  discountAmount?: number;
  couponCode?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CardcomPaymentForm = ({ 
  amount, 
  planType, 
  discountAmount, 
  couponCode, 
  onSuccess, 
  onCancel 
}: CardcomPaymentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const { trackBeginCheckout, trackPurchase, trackError: trackAnalyticsError, trackButtonClick } = useAnalytics();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Track payment form view on component mount
  useEffect(() => {
    trackBeginCheckout({
      plan_type: planType,
      plan_price: amount,
      payment_status: 'initiated'
    });
  }, [amount, planType, trackBeginCheckout]);
  
  // Handle successful payment (called when user returns from CardCom)
  const handlePaymentReturn = () => {
    // Don't track purchase here - it will be tracked on ThankYou page
    // This prevents duplicate purchase events
    console.log('📝 Payment return handled, purchase will be tracked on ThankYou page');
    
    onSuccess();
  };
  
  // Initialize CardCom payment
  const initializeCardComPayment = async () => {
    if (!currentUser) {
      // Save payment intent to session storage
      const paymentIntent = {
        plan: planType,
        amount,
        coupon: couponCode,
        discountAmount,
        timestamp: Date.now()
      };
      
      sessionStorage.setItem('paymentIntent', JSON.stringify(paymentIntent));
      
      // Track unauthenticated payment attempt
      trackButtonClick('payment_attempt_unauthenticated', 'cardcom_payment_form');
      
      // Redirect to login with payment context
      navigate('/login', { 
        state: { 
          from: '/premium',
          continuePurchase: true,
          plan: planType,
          message: 'כדי להשלים את הרכישה, יש להתחבר או להירשם. תועברו חזרה לכאן מיד לאחר ההתחברות.'
        }
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Lock coupon session to prevent modifications during payment
    couponValidationService.lockCouponSession();
    
    try {
      console.log('🚀 Initializing CardCom payment:', {
        planType,
        amount, // Final amount after discount
        amountType: typeof amount,
        userId: currentUser.id
      });

      // Validate amount before sending to payment service
      if (!amount || typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
        throw new Error(`Invalid payment amount: ${amount} (type: ${typeof amount})`);
      }

      const paymentRequest: PaymentInitRequest = {
        planType,
        amount, // This is already the final amount after discount
        userId: currentUser.id,
        userEmail: currentUser.email || undefined,
        userName: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
        discountAmount, // Pass discount details for URL parameters
        couponCode // Pass coupon code for URL parameters
      };

      const result = await initializePayment(paymentRequest);
      
      if (result.success && result.paymentUrl) {
        console.log('✅ Payment page created, redirecting:', result.paymentUrl);
        
        // Ensure we ALWAYS redirect to full CardCom page, never embed iframe
        if (!result.paymentUrl.includes('cardcom.solutions')) {
          throw new Error('Invalid payment URL - must be CardCom official domain');
        }
        
        // Track payment initiation
        trackButtonClick('payment_redirect', 'cardcom_payment_form');
        
        setIsRedirecting(true);
        
        // Force full page redirect to CardCom payment page - never iframe or embed
        window.location.href = result.paymentUrl;
      } else {
        throw new Error(result.error || 'Failed to create payment page');
      }
    } catch (error) {
      console.error('❌ Payment initialization error:', error);
      setError(
        error instanceof Error 
          ? `שגיאה ביצירת עמוד התשלום: ${error.message}`
          : 'אירעה שגיאה ביצירת עמוד התשלום. אנא נסו שוב.'
      );
      
      trackAnalyticsError(
        error instanceof Error ? error : new Error('Payment initialization failed'), 
        'CardcomPayment', 
        {
          amount,
          planType,
          action: 'payment_initialization'
        }
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle retry after error
  const handleRetry = () => {
    setError(null);
    trackButtonClick('retry_payment', 'cardcom_payment_form');
    initializeCardComPayment();
  };
  
  return (
    <div className="w-full space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-700 text-sm">{error}</p>
            <Button 
              onClick={handleRetry}
              variant="outline" 
              size="sm"
              className="mt-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              נסה שוב
            </Button>
          </div>
        </div>
      )}
      
      {isRedirecting && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-blue-700 text-sm">מעביר לעמוד התשלום המאובטח...</p>
        </div>
      )}
      
      {!currentUser && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-900">כמעט סיימתם!</span>
          </div>
          <p className="text-sm text-blue-700 mb-1">
            כדי להמשיך בתשלום, יש להתחבר או להירשם.
          </p>
          <p className="text-xs text-blue-600">
            ההרשמה מהירה - תוכלו להתחיל מיד לאחר מכן! 🚀
          </p>
        </div>
      )}
      
      <Button 
        onClick={initializeCardComPayment}
        disabled={isLoading || isRedirecting}
        className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold flex items-center gap-3 justify-center shadow-lg transition-all duration-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            יוצר עמוד תשלום...
          </>
        ) : isRedirecting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            מעביר לתשלום...
          </>
        ) : (
          <>
            <ShieldCheck className="h-5 w-5" />
            תשלום מאובטח {amount} ₪
          </>
        )}
      </Button>
      
      <div className="text-center text-xs text-gray-500">
        <p>התשלום מתבצע באתר המאובטח של CardCom</p>
        <p>לא נשמרים נתוני אשראי באתר שלנו</p>
        {isTestEnvironment() && (
          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800">
            <p className="font-semibold">🧪 מצב בדיקה - TEST MODE</p>
            <p>תשלומים לא יחויבו באמת</p>
            <p className="text-xs mt-1">API: {getCardComApiUrl()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardcomPaymentForm;

// Handle successful return from CardCom (this should be called from success page)
export const handleCardComReturn = (onSuccess: () => void) => {
  // This function can be called from the success page to trigger the success callback
  onSuccess();
};
