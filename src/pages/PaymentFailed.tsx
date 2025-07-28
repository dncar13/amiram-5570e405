import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  MessageSquare,
  CreditCard
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const { trackError, trackButtonClick } = useAnalytics();

  useEffect(() => {
    // Track payment failure
    trackError(new Error('Payment failed'), 'CardcomPayment', {
      page: 'payment_failed',
      timestamp: Date.now()
    });
  }, [trackError]);

  const handleRetry = () => {
    trackButtonClick('retry_payment', 'payment_failed_page');
    navigate("/premium");
  };

  const handleGoHome = () => {
    trackButtonClick('go_home', 'payment_failed_page');
    navigate("/");
  };

  const handleContactSupport = () => {
    trackButtonClick('contact_support', 'payment_failed_page');
    window.open('https://wa.me/972525602218', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 to-orange-50">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 text-center shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <div className="space-y-8">
            {/* Error Icon */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                ⚠️ תשלום לא הושלם
              </h1>
              <p className="text-xl text-gray-600">
                משהו השתבש במהלך עיבוד התשלום
              </p>
            </div>

            {/* Common Issues */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-blue-900">
                  סיבות נפוצות לכשל:
                </h2>
              </div>
              
              <div className="text-sm text-blue-800 space-y-2">
                <p>• כרטיס אשראי לא תקין או פג תוקף</p>
                <p>• אין מספיק זכות באשראי</p>
                <p>• הזנת פרטים שגויים</p>
                <p>• התשלום בוטל על ידי המשתמש</p>
                <p>• בעיה זמנית בחיבור לאינטרנט</p>
              </div>
            </div>

            {/* Solutions */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4">
                💡 מה אפשר לעשות:
              </h3>
              
              <div className="text-sm text-green-800 space-y-2 text-right">
                <p>✓ בדק את פרטי כרטיס האשראי</p>
                <p>✓ ודא שיש מספיק זכות באשראי</p>
                <p>✓ נסה כרטיס אשראי אחר</p>
                <p>✓ בדק את חיבור האינטרנט</p>
                <p>✓ צור איתנו קשר לעזרה</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={handleRetry}
                size="lg"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg flex items-center justify-center gap-3 shadow-lg"
              >
                <RefreshCw className="w-5 h-5" />
                נסה שוב
              </Button>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleContactSupport}
                  variant="outline"
                  size="lg"
                  className="py-3 border-green-300 text-green-700 hover:bg-green-50 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  צור קשר
                </Button>
                
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  size="lg"
                  className="py-3 border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  דף הבית
                </Button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">
                זקוק לעזרה? אנחנו כאן 24/7
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  <span>ווטסאפ: 0525602218</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span>📧</span>
                  <span>support@amiram.net</span>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600">
                🔒 <strong>הערת אבטחה:</strong> לא נשמרו נתוני כרטיס האשראי במערכת שלנו. 
                כל התשלומים מעובדים באופן מאובטח דרך CardCom.
              </p>
            </div>
          </div>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentFailed;