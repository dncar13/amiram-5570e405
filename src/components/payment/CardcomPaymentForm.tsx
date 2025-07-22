
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { getIframeUrl } from "@/services/cardcomService";

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
  
  // In a real implementation, terminal number would come from environment variables
  const terminalNumber = "TERMINAL_NUMBER"; // Replace with actual terminal number
  
  useEffect(() => {
    // Set up message listener for iframe communication
    const handleMessage = (event: MessageEvent) => {
      // Verify origin (should be Cardcom's domain)
      // In production, verify this is from Cardcom's domain
      
      try {
        const data = event.data;
        
        if (data.status === "success") {
          // Payment successful
          onSuccess();
        } else if (data.status === "cancel" || data.status === "failure") {
          // Payment cancelled or failed
          onCancel();
        }
      } catch (err) {
        console.error("Error processing message from payment iframe", err);
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
  };
  
  // For demo purposes, simulate direct payment without iframe
  const handleDirectPayment = () => {
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
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
                onClick={() => setError(null)} 
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
