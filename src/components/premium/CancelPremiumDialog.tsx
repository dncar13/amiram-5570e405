
import React from "react";
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
import { DollarSign } from "lucide-react";

interface CancelPremiumDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const CancelPremiumDialog = ({
  isOpen,
  onClose,
  onConfirm = () => {},
}: CancelPremiumDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md text-right">
        <AlertDialogHeader className="text-right">
          <AlertDialogTitle className="text-xl flex items-center gap-2 justify-end">
            <DollarSign className="h-5 w-5 text-electric-orange" />
            ביטול מנוי פרימיום
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg text-right">
            האם אתה בטוח שברצונך לבטל את מנוי הפרימיום שלך?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-3 text-right">
          <p className="text-muted-foreground">לאחר הביטול:</p>
          <ul className="list-disc mr-6 space-y-2 text-sm text-muted-foreground">
            <li>תמשיך להנות מתכונות הפרימיום עד לסוף תקופת החיוב הנוכחית</li>
            <li>לא יבוצעו חיובים נוספים בהמשך</li>
            <li>תוכל להצטרף מחדש בכל עת ללא אובדן היסטוריית הלימוד שלך</li>
          </ul>
        </div>
        <AlertDialogFooter className="flex-row-reverse sm:justify-start">
          <AlertDialogCancel className="bg-muted hover:bg-muted/80">
            ביטול
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            אישור ביטול מנוי
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelPremiumDialog;
