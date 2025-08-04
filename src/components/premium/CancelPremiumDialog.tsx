
import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DollarSign, Loader2, AlertTriangle, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { RefundPreview, RefundCalculation } from "@/types/cardcom.types";
import { 
  calculateRefundAmount, 
  getRefundFormulaExplanation,
  getProcessingTimeExplanation,
  getPlanDisplayName,
  mapPlanTypeToDb,
  type PlanTypeDB
} from "@/services/refundService";

interface SubscriptionData {
  id: string;
  planType: PlanTypeDB;
  startDate: Date;
  endDate: Date;
  originalAmount: number;
  transactionId: number;
}

interface CancelPremiumDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (refundPreview?: RefundPreview) => Promise<void>;
  subscriptionData?: SubscriptionData;
}

const CancelPremiumDialog = ({
  isOpen,
  onClose,
  onConfirm = async () => {},
  subscriptionData
}: CancelPremiumDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [refundCalculation, setRefundCalculation] = useState<RefundCalculation | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  // Calculate refund when dialog opens and subscription data is available
  useEffect(() => {
    if (isOpen && subscriptionData) {
      const calculation = calculateRefundAmount(
        subscriptionData.originalAmount,
        subscriptionData.startDate,
        subscriptionData.endDate,
        new Date(),
        subscriptionData.planType
      );
      setRefundCalculation(calculation);
      setShowConfirmation(false);
    } else {
      setRefundCalculation(null);
      setShowConfirmation(false);
    }
  }, [isOpen, subscriptionData]);

  const handleInitialConfirm = () => {
    if (refundCalculation) {
      setShowConfirmation(true);
    }
  };

  const handleFinalConfirm = async () => {
    if (!subscriptionData || !refundCalculation) return;
    
    setIsLoading(true);
    try {
      const refundPreview: RefundPreview = {
        calculation: refundCalculation,
        planType: subscriptionData.planType,
        subscriptionId: subscriptionData.id,
        transactionId: subscriptionData.transactionId,
        refundFormula: getRefundFormulaExplanation(),
        processingTime: getProcessingTimeExplanation()
      };

      await onConfirm(refundPreview);
      
      const successMessage = refundCalculation.eligibleForRefund && refundCalculation.refundAmount > 0
        ? "ביטול המנוי בוצע בהצלחה. החזר יבוצע תוך 14 ימי עסקים"
        : "ביטול המנוי בוצע בהצלחה";
      
      toast({
        title: "ביטול פרימיום בוצע בהצלחה",
        description: successMessage,
        variant: "default",
      });
      onClose();
    } catch (error) {
      console.error('Error cancelling premium:', error);
      toast({
        title: "שגיאה בביטול הפרימיום",
        description: "אנא נסה שוב מאוחר יותר",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setShowConfirmation(false);
  };

  if (!showConfirmation) {
    // Initial screen - show refund calculation and explanation
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="max-w-lg text-right">
          <AlertDialogHeader className="text-right">
            <AlertDialogTitle className="text-xl flex items-center gap-2 justify-end">
              <Calculator className="h-5 w-5 text-electric-orange" />
              ביטול מנוי פרימיום
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-right">
              המערכת תחשב החזר יחסי בהתאם לחוק הישראלי
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4 space-y-4 text-right">
            {/* Refund Formula Explanation */}
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                נוסחת החזר:
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {getRefundFormulaExplanation()}
              </p>
            </div>

            {/* Refund Calculation */}
            {refundCalculation && subscriptionData && (
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                <h4 className="font-semibold mb-3">פרטי החישוב:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>סוג מנוי:</span>
                    <span className="font-medium">{getPlanDisplayName(subscriptionData.planType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>סכום מקורי:</span>
                    <span className="font-medium">₪{refundCalculation.originalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>סה"כ ימים במנוי:</span>
                    <span className="font-medium">{refundCalculation.totalDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ימים שלא נוצלו:</span>
                    <span className="font-medium">{refundCalculation.unusedDays}</span>
                  </div>
                  {refundCalculation.eligibleForRefund ? (
                    <>
                      <div className="flex justify-between text-orange-600 dark:text-orange-400">
                        <span>דמי ביטול:</span>
                        <span className="font-medium">₪{refundCalculation.cancellationFee}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between text-green-600 dark:text-green-400 font-bold">
                        <span>סכום החזר:</span>
                        <span>₪{refundCalculation.refundAmount}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>סכום החזר:</span>
                      <span className="font-medium">₪0 (לא זכאי להחזר)</span>
                    </div>
                  )}
                </div>

                {/* Processing time info */}
                {refundCalculation.eligibleForRefund && refundCalculation.refundAmount > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground">
                      {getProcessingTimeExplanation()}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Daily subscription notice */}
            {subscriptionData?.planType === 'day' && (
              <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                      מנוי יומי - לא זכאי להחזר
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      מנוי יומי (₪20) אינו זכאי להחזר כיוון שהשירות מסופק מיידית.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* General info */}
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• הגישה לתכנים תסתיים מיידית לאחר הביטול</p>
              <p>• ניתן לרכוש תוכנית חדשה בכל עת</p>
              <p>• ביטול המנוי אינו ניתן לביטול</p>
            </div>
          </div>

          <AlertDialogFooter className="flex-row-reverse sm:justify-start">
            <AlertDialogCancel 
              className="bg-muted hover:bg-muted/80"
              disabled={isLoading}
            >
              ביטול
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleInitialConfirm}
              disabled={isLoading || !refundCalculation}
              className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
            >
              המשך לביטול
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Confirmation screen
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md text-right">
        <AlertDialogHeader className="text-right">
          <AlertDialogTitle className="text-xl flex items-center gap-2 justify-end">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            אישור ביטול מנוי
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg text-right">
            האם אתה בטוח שברצונך לבטל את המנוי?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4 space-y-3 text-right">
          {refundCalculation && refundCalculation.eligibleForRefund && refundCalculation.refundAmount > 0 ? (
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200 font-semibold">
                יתבצע החזר של ₪{refundCalculation.refundAmount}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                החזר יועבר תוך 14 ימי עסקים לאמצעי התשלום המקורי
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
              <p className="text-gray-800 dark:text-gray-200 font-semibold">
                לא יתבצע החזר
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {subscriptionData?.planType === 'day' 
                  ? 'מנוי יומי אינו זכאי להחזר'
                  : 'סכום ההחזר נמוך מהסכום המינימלי'
                }
              </p>
            </div>
          )}
          
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            פעולה זו אינה ניתנת לביטול!
          </p>
        </div>

        <AlertDialogFooter className="flex-row-reverse sm:justify-start">
          <AlertDialogCancel 
            onClick={handleBack}
            className="bg-muted hover:bg-muted/80"
            disabled={isLoading}
          >
            חזור
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleFinalConfirm}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                מבטל מנוי...
              </>
            ) : (
              "אישור ביטול מנוי"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelPremiumDialog;
