
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  ArrowRight, 
  Gift, 
  Star,
  Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAnalytics } from "@/hooks/useAnalytics";

const ThankYou = () => {
  const navigate = useNavigate();
  const { currentUser, updatePremiumStatus } = useAuth();
  const { trackPremiumPurchase, trackButtonClick } = useAnalytics();
  const [isUpdating, setIsUpdating] = useState(true);

  useEffect(() => {
    // Update premium status after successful payment
    const updateStatus = async () => {
      if (currentUser) {
        try {
          console.log('🎉 Payment successful, updating premium status');
          
          // Track successful purchase
          trackPremiumPurchase({
            plan_type: 'monthly', // This should be passed from URL params in real implementation
            plan_price: 99, // This should be passed from URL params
            payment_status: 'completed'
          });
          
          // Update premium status in context
          await updatePremiumStatus(true);
          
          console.log('✅ Premium status updated successfully');
        } catch (error) {
          console.error('❌ Error updating premium status:', error);
        }
      }
      
      setIsUpdating(false);
    };

    updateStatus();
  }, [currentUser, updatePremiumStatus, trackPremiumPurchase]);
  
  const handleContinue = () => {
    navigate("/simulations-entry");
  };

  const handleViewAccount = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 text-center shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          {isUpdating ? (
            <div className="space-y-6">
              <Loader2 className="h-16 w-16 animate-spin mx-auto text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                מעדכן את חשבונך...
              </h1>
              <p className="text-gray-600">
                אנא המתן בזמן שאנחנו מעדכנים את הגישה הפרימיום שלך
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Success Icon */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Star className="w-4 h-4 text-white fill-current" />
                </div>
              </div>

              {/* Success Message */}
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  🎉 תשלום בוצע בהצלחה!
                </h1>
                <p className="text-xl text-gray-600">
                  ברוך הבא למועדון הפרימיום של אמיר"ם
                </p>
              </div>

              {/* Features Unlocked */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Gift className="w-6 h-6 text-purple-600" />
                  <h2 className="text-lg font-semibold text-purple-900">
                    מה נפתח לך עכשיו:
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>גישה לכל הסימולציות</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>מעל 1,000 שאלות</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>מעקב התקדמות מתקדם</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>תמיכה VIP בווטסאפ</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={handleContinue}
                  size="lg"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg flex items-center justify-center gap-3 shadow-lg"
                >
                  התחל להתרגל עכשיו
                  <ArrowRight className="w-5 h-5" />
                </Button>
                
                <Button
                  onClick={handleViewAccount}
                  variant="outline"
                  size="lg"
                  className="w-full py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  צפה בפרטי החשבון
                </Button>
              </div>

              {/* Contact Support */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">
                  צריך עזרה? אנחנו כאן בשבילך
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open('https://wa.me/972525602218', '_blank')}
                    className="text-green-600 hover:text-green-700"
                  >
                    ווטסאפ
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open('mailto:support@amiram.net', '_blank')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    אימייל
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default ThankYou;
