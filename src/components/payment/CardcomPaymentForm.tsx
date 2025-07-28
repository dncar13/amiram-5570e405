
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { initializePayment } from "@/services/cardcomService";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "@/context/AuthContext";
import type { PaymentInitRequest } from "@/types/cardcom.types";

interface CardcomPaymentFormProps {
  amount: number;
  originalAmount: number;
  planType: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  discountAmount?: number;
  couponCode?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CardcomPaymentForm = ({ 
  amount, 
  originalAmount, 
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
    // Track successful payment
    trackPurchase({
      currency: 'ILS',
      value: amount,
      transaction_id: `cardcom_${Date.now()}`,
      payment_method: 'cardcom',
      items: [{
        item_id: 'premium_plan',
        item_name: 'Premium Subscription',
        category: 'subscription',
        price: amount,
        quantity: 1
      }]
    });
    
    onSuccess();
  };
  
  // Initialize CardCom payment
  const initializeCardComPayment = async () => {
    if (!currentUser) {
      setError('אנא התחבר לחשבון כדי להמשיך בתשלום');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Initializing CardCom payment:', {
        planType,
        amount, // Final amount after discount
        userId: currentUser.id
      });

      const paymentRequest: PaymentInitRequest = {
        planType,
        amount, // This is already the final amount after discount
        userId: currentUser.id,
        userEmail: currentUser.email || undefined,
        userName: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]
      };

      const result = await initializePayment(paymentRequest);
      
      if (result.success && result.paymentUrl) {
        console.log('✅ Payment page created, redirecting:', result.paymentUrl);
        
        // Track payment initiation
        trackButtonClick('payment_redirect', 'cardcom_payment_form');
        
        setIsRedirecting(true);
        
        // Redirect to CardCom payment page
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
      
      <Button 
        onClick={initializeCardComPayment}
        disabled={isLoading || isRedirecting || !currentUser}
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
