import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Calculator, Clock, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { SupabaseAuthService } from "@/services/supabaseAuth";
import { calculateRefundAmount, getPlanDisplayName } from "@/services/refundService";
import { supabase } from "@/integrations/supabase/client";

interface CancelPremiumDialogProps {
  children: React.ReactNode;
}

export const CancelPremiumDialog = ({ children }: CancelPremiumDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRefundCalculation, setShowRefundCalculation] = useState(false);
  const [refundData, setRefundData] = useState<any>(null);
  const { currentUser, updatePremiumStatus } = useAuth();

  const handleCalculateRefund = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const { subscriptionData, error } = await SupabaseAuthService.getUserSubscriptionForRefund(currentUser.id);
      
      if (error) {
        console.error('Error fetching subscription for refund:', error);
        
        // Handle specific error cases
        if (error.message.includes('לא נמצאה עסקת תשלום מושלמת')) {
          toast.error("לא ניתן לבטל מנוי זה - לא נמצאה עסקת תשלום מתאימה");
        } else {
          toast.error("שגיאה בקבלת פרטי המנוי: " + error.message);
        }
        return;
      }

      if (!subscriptionData) {
        toast.error("לא נמצא מנוי פעיל לביטול");
        return;
      }

      const refundCalculation = calculateRefundAmount(
        subscriptionData.originalAmount,
        subscriptionData.startDate,
        subscriptionData.endDate,
        new Date(),
        subscriptionData.planType
      );

      setRefundData({
        ...subscriptionData,
        calculation: refundCalculation
      });
      setShowRefundCalculation(true);
    } catch (error) {
      console.error('Error calculating refund:', error);
      toast.error("שגיאה בחישוב החזר: " + (error instanceof Error ? error.message : 'שגיאה לא ידועה'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCancellation = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('cancel-subscription-refund', {
        body: {
          userId: currentUser.id,
          subscriptionId: refundData.id,
          cancellationReason: "ביטול על ידי המשתמש"
        }
      });

      if (response.error) {
        console.error('Edge function invocation error:', response.error);
        throw new Error(response.error.message || 'שגיאה בקריאה לשירות הביטול');
      }

      const result = response.data;

      // Handle edge function returning error in response body
      if (result && result.error) {
        console.error('Edge function returned error:', result.error);
        throw new Error(result.error);
      }

      if (result && result.success) {
        // Update premium status
        await updatePremiumStatus(false);
        
        toast.success(result.message || 'המנוי בוטל בהצלחה');
        setIsOpen(false);
        setShowRefundCalculation(false);
        setRefundData(null);
      } else {
        throw new Error(result?.error || 'שגיאה לא ידועה בביטול המנוי');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      const errorMessage = error instanceof Error ? error.message : "שגיאה בביטול המנוי";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setShowRefundCalculation(false);
    setRefundData(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-right">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            ביטול מנוי פרימיום
          </DialogTitle>
          <DialogDescription className="text-right">
            {!showRefundCalculation 
              ? "לפני ביטול המנוי, תוכל לראות את פרטי ההחזר"
              : "פרטי החזר המנוי שלך"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!showRefundCalculation ? (
            // Initial warning screen
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <h3 className="font-semibold text-destructive mb-2">⚠️ חשוב לדעת:</h3>
                <ul className="text-sm space-y-1 text-right">
                  <li>• ביטול המנוי יבוטל גישה מיידית לתכנים הפרימיום</li>
                  <li>• החזר כספי יבוצע תוך 14 ימי עסקים (אם רלוונטי)</li>
                  <li>• מנוי יומי (₪20) אינו זכאי להחזר</li>
                  <li>• החזר מחושב לפי ימים שלא נוצלו פחות דמי ביטול (5% או ₪100)</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleCancel} 
                  variant="outline" 
                  className="flex-1"
                >
                  חזור
                </Button>
                <Button 
                  onClick={handleCalculateRefund}
                  disabled={isLoading}
                  className="flex-1 flex items-center gap-2"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Calculator className="w-4 h-4" />
                  )}
                  חשב החזר
                </Button>
              </div>
            </div>
          ) : (
            // Refund calculation screen
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  חישוב החזר
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>סוג מנוי:</span>
                    <span className="font-medium">{getPlanDisplayName(refundData.planType)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>סכום מקורי:</span>
                    <span className="font-medium">₪{refundData.originalAmount}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>ימים במנוי:</span>
                    <span className="font-medium">{refundData.calculation.totalDays}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>ימים שלא נוצלו:</span>
                    <span className="font-medium">{refundData.calculation.unusedDays}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span>דמי ביטול:</span>
                    <span className="font-medium text-destructive">₪{refundData.calculation.cancellationFee}</span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>סכום החזר:</span>
                    <span className="text-green-600">
                      {refundData.calculation.eligibleForRefund 
                        ? `₪${refundData.calculation.refundAmount}`
                        : "אין החזר"
                      }
                    </span>
                  </div>
                </div>
              </div>

              {refundData.calculation.eligibleForRefund && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">זמן עיבוד:</p>
                      <p className="text-blue-700">החזר יבוצע תוך 14 ימי עסקים לאמצעי התשלום המקורי</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowRefundCalculation(false)} 
                  variant="outline" 
                  className="flex-1"
                >
                  חזור
                </Button>
                <Button 
                  onClick={handleConfirmCancellation}
                  disabled={isLoading}
                  variant="destructive"
                  className="flex-1"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  אשר ביטול
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};