import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentFailed() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Track failed payment
    console.log('Payment failed - Error page loaded');
    
    // Get error details from URL params if available
    const errorCode = searchParams.get('errorCode');
    const errorMessage = searchParams.get('errorMessage');
    
    if (errorCode) {
      console.log('Error Code:', errorCode);
      console.log('Error Message:', errorMessage);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-destructive/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-lg border p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-4">
          התשלום נכשל
        </h1>
        
        <p className="text-muted-foreground mb-6">
          מצטערים, התשלום לא הושלם בהצלחה.
          <br />
          אנא נסה שוב או בחר אמצעי תשלום אחר.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/premium')} 
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            נסה שוב
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/')} 
            className="w-full"
          >
            חזור לדף הבית
          </Button>
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>צריך עזרה?</strong>
            <br />
            אם הבעיה ממשיכה, אנא פנה לתמיכה שלנו
            או נסה להשתמש בכרטיס אשראי אחר.
          </p>
        </div>
      </div>
    </div>
  );
}