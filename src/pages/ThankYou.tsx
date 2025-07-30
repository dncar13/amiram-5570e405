
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { PLAN_PRICES } from "@/config/pricing";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseAuthService } from "@/services/supabaseAuth";

const ThankYou = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, updatePremiumStatus } = useAuth();
  const { trackPremiumPurchase, trackButtonClick } = useAnalytics();
  const [isUpdating, setIsUpdating] = useState(true);
  const [transactionDetails, setTransactionDetails] = useState<{
    planType: string;
    amount: number;
    transactionId: string | null;
    subscriptionId: string | null;
  } | null>(null);

  // Helper function to get plan display name in Hebrew
  const getPlanDisplayName = (plan: string): string => {
    const displayNames: Record<string, string> = {
      'day': 'יום אחד',
      'week': 'שבוע אחד', 
      'month': 'חודש אחד',
      '3months': '3 חודשים'
    };
    return displayNames[plan] || plan;
  };

  useEffect(() => {
    // Create subscription immediately and update premium status
    const createSubscriptionAndUpdateStatus = async () => {
      if (currentUser) {
        try {
          console.log('🎉 Payment successful, creating subscription and updating premium status');
          
          // Get payment details from URL parameters (passed from CardCom redirect)
          const urlPlanType = searchParams.get('plan') || 'monthly';
          const urlAmount = searchParams.get('amount') ? parseFloat(searchParams.get('amount')!) : PLAN_PRICES[urlPlanType as keyof typeof PLAN_PRICES] || 99;
          const urlDiscount = searchParams.get('discount') ? parseFloat(searchParams.get('discount')!) : 0;
          const urlCoupon = searchParams.get('coupon');
          const timestamp = searchParams.get('timestamp');
          
          console.log('💳 Payment details from URL:', {
            planType: urlPlanType,
            amount: urlAmount,
            discount: urlDiscount,
            coupon: urlCoupon,
            timestamp
          });

          // Create subscription immediately (don't wait for webhook)
          console.log('🔄 Creating subscription immediately...');
          
          // The plan types from URL should already match database schema
          const dbPlanType = urlPlanType as 'day' | 'week' | 'month' | '3months';
          
          const subscriptionResult = await SupabaseAuthService.createSubscription(
            currentUser.id, 
            dbPlanType as 'day' | 'week' | 'month' | '3months'
          );
          
          if (subscriptionResult.error) {
            console.error('❌ Error creating subscription:', subscriptionResult.error);
            throw subscriptionResult.error;
          }
          
          console.log('✅ Subscription created successfully:', subscriptionResult.subscription);
          
          // Set transaction details from URL parameters
          setTransactionDetails({
            planType: urlPlanType,
            amount: urlAmount,
            transactionId: `cardcom_${timestamp || Date.now()}`,
            subscriptionId: subscriptionResult.subscription?.id || null
          });
          
          // Track successful purchase
          trackPremiumPurchase({
            plan_type: urlPlanType,
            plan_price: urlAmount,
            payment_status: 'completed',
            transaction_id: `cardcom_${timestamp || Date.now()}`
          });

          // Update premium status to trigger UI refresh
          await updatePremiumStatus(true);
          
          console.log('🎊 Premium status updated successfully');
        } catch (error) {
          console.error('❌ Error creating subscription or updating premium status:', error);
          
          // Fallback: still show payment details even if subscription creation fails
          const urlPlanType = searchParams.get('plan') || 'monthly';
          const urlAmount = searchParams.get('amount') ? parseFloat(searchParams.get('amount')!) : PLAN_PRICES[urlPlanType as keyof typeof PLAN_PRICES] || 99;
          
          setTransactionDetails({
            planType: urlPlanType,
            amount: urlAmount,
            transactionId: null,
            subscriptionId: null
          });
        }
      }
      
      setIsUpdating(false);
    };

    createSubscriptionAndUpdateStatus();
  }, [currentUser, updatePremiumStatus, trackPremiumPurchase, searchParams]);
  
  const handleContinue = () => {
    navigate("/simulations-entry");
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

              {/* Purchase Details */}
              {transactionDetails ? (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">פרטי הרכישה</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">תוכנית:</span>
                      <span className="font-medium">{getPlanDisplayName(transactionDetails.planType)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">סכום ששולם:</span>
                      <span className="font-medium">{transactionDetails.amount} ₪</span>
                    </div>
                    {transactionDetails.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">מספר עסקה:</span>
                        <span className="font-mono text-xs">{transactionDetails.transactionId}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">פרטי הרכישה</h3>
                  <div className="text-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                    <p className="text-blue-700 text-sm">טוען פרטי רכישה...</p>
                  </div>
                </div>
              )}

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
