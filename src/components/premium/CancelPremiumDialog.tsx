
import React, { useState } from "react";
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
import { DollarSign, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CancelPremiumDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => Promise<void>;
}

const CancelPremiumDialog = ({
  isOpen,
  onClose,
  onConfirm = async () => {},
}: CancelPremiumDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      toast({
        title: "ביטול פרימיום בוצע בהצלחה",
        description: "הגישה הפרימיום שלך בוטלה",
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

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md text-right">
        <AlertDialogHeader className="text-right">
          <AlertDialogTitle className="text-xl flex items-center gap-2 justify-end">
            <DollarSign className="h-5 w-5 text-electric-orange" />
            איפוס גישה פרימיום
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg text-right">
            האם אתה בטוח שברצונך לאפס את הגישה הפרימיום שלך?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-3 text-right">
          <p className="text-muted-foreground">לאחר האיפוס:</p>
          <ul className="list-disc mr-6 space-y-2 text-sm text-muted-foreground">
            <li>הגישה שלך לתכנים יסתיימה מיידית</li>
            <li>לא קיימים חיובים נוספים (התשלום הוא חד-פעמי)</li>
            <li>תוכל לרכוש תוכנית חדשה בכל עת</li>
          </ul>
        </div>
        <AlertDialogFooter className="flex-row-reverse sm:justify-start">
          <AlertDialogCancel 
            className="bg-muted hover:bg-muted/80"
            disabled={isLoading}
          >
            ביטול
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                מבטל...
              </>
            ) : (
              "אישור איפוס"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelPremiumDialog;
