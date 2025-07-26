
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { getIframeUrl } from "@/services/cardcomService";
import { useAnalytics } from "@/hooks/useAnalytics";

interface CardcomPaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const CardcomPaymentForm = ({ amount, onSuccess, onCancel }: CardcomPaymentFormProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useIframe, setUseIframe] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const { trackBeginCheckout, trackPurchase, trackError: trackAnalyticsError, trackButtonClick } = useAnalytics();
  
  // In a real implementation, terminal number would come from environment variables
  const terminalNumber = "TERMINAL_NUMBER"; // Replace with actual terminal number
  
  // Track payment form view on component mount
  useEffect(() => {
    trackBeginCheckout({
      plan_type: 'monthly' as const, // This should be passed as a prop in real implementation
      plan_price: amount,
      payment_status: 'initiated'
    });
  }, [amount, trackBeginCheckout]);
  
  useEffect(() => {
    // Set up message listener for iframe communication
    const handleMessage = (event: MessageEvent) => {
      // Verify origin (should be Cardcom's domain)
      // In production, verify this is from Cardcom's domain
      
      try {
        const data = event.data;
        
        if (data.status === "success") {
          // Track successful payment
          trackPurchase({
            currency: 'ILS',
            value: amount,
            transaction_id: data.transaction_id || `cardcom_${Date.now()}`,
            payment_method: 'cardcom',
            items: [{
              item_id: 'premium_plan',
              item_name: 'Premium Subscription',
              category: 'subscription',
              price: amount,
              quantity: 1
            }]
          });
          
          // Payment successful
          onSuccess();
        } else if (data.status === "cancel" || data.status === "failure") {
          // Track payment failure/cancellation
          trackAnalyticsError(new Error(`Payment ${data.status}`), 'CardcomPayment', {
            amount,
            status: data.status,
            error_message: data.error_message || `Payment ${data.status}`
          });
          
          // Payment cancelled or failed
          onCancel();
        }
      } catch (err) {
        console.error("Error processing message from payment iframe", err);
        trackAnalyticsError(err instanceof Error ? err : new Error('Payment iframe message error'), 'CardcomPayment', {
          amount,
          action: 'iframe_message_processing'
        });
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onSuccess, onCancel]);
  
  // Handle iframe load events
  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  
  // Handle iframe errors
  const handleIframeError = () => {
    setIsLoading(false);
    setError("אירעה שגיאה בטעינת טופס התשלום. אנא נסו שוב מאוחר יותר.");
    
    // Track iframe loading error
    trackAnalyticsError(new Error('Payment iframe failed to load'), 'CardcomPayment', {
      amount,
      action: 'iframe_load_error'
    });
  };
  
  // For demo purposes, simulate direct payment without iframe
  const handleDirectPayment = () => {
    setIsLoading(true);
    
    // Track direct payment button click
    trackButtonClick('direct_payment', 'cardcom_payment_form');
    
    // Simulate payment processing
    setTimeout(() => {
      // Track successful payment simulation
      trackPurchase({
        currency: 'ILS',
        value: amount,
        transaction_id: `demo_${Date.now()}`,
        payment_method: 'demo',
        items: [{
          item_id: 'premium_plan',
          item_name: 'Premium Subscription',
          category: 'subscription',
          price: amount,
          quantity: 1
        }]
      });
      
      setIsLoading(false);
      onSuccess();
    }, 1500);
  };
  
  // Generate iframe URL
  const iframeUrl = getIframeUrl(amount, "he", { 
    terminalNumber, 
    userName: "USERNAME" 
  });
  
  return (
    <div className="w-full">
      {useIframe ? (
        <>
          {isLoading && (
            <div className="text-center p-4">
              <div className="spinner mb-2"></div>
              <p>טוען טופס תשלום...</p>
            </div>
          )}
          
          {error && (
            <div className="text-red-500 p-4 text-center">
              {error}
              <Button 
                onClick={() => {
                  setError(null);
                  trackButtonClick('retry_payment', 'cardcom_payment_form');
                }} 
                variant="outline" 
                className="mt-2"
              >
                נסה שוב
              </Button>
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            src={iframeUrl}
            width="100%"
            height="400"
            frameBorder="0"
            style={{ 
              display: isLoading || error ? 'none' : 'block', 
              width: '100%', 
              minHeight: '400px' 
            }}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title="טופס תשלום מאובטח"
          />
        </>
      ) : (
        <Button 
          onClick={handleDirectPayment}
          disabled={isLoading}
          className="w-full py-6 bg-electric-blue hover:bg-blue-600 text-lg flex items-center gap-2 justify-center"
        >
          {isLoading ? (
            <>מעבד תשלום...</>
          ) : (
            <>
              <ShieldCheck className="h-5 w-5" />
              לתשלום מאובטח {amount} ₪
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default CardcomPaymentForm;
