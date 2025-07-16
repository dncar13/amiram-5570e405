import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { RefreshCw, Loader2 } from 'lucide-react';

interface RestartConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  setName?: string;
  questionType?: string;
  difficulty?: string;
}

const RestartConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  setName,
  questionType,
  difficulty,
}: RestartConfirmationDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Restart failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md text-right bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-white/10 text-white">
        <AlertDialogHeader className="text-right">
          <AlertDialogTitle className="text-xl flex items-center gap-2 justify-end">
            <RefreshCw className="h-5 w-5 text-electric-orange" />
            התחל מחדש
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg text-right text-gray-300">
            {setName ? (
              <>האם אתה בטוח שברצונך להתחיל מחדש את "{setName}"?</>
            ) : (
              "האם אתה בטוח שברצונך להתחיל מחדש את הסימולציה?"
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-3 text-right">
          <p className="text-muted-foreground">לאחר ההתחלה מחדש:</p>
          <ul className="list-disc mr-6 space-y-2 text-sm text-muted-foreground">
            <li>כל ההתקדמות הנוכחית תימחק</li>
            <li>תתחיל מהשאלה הראשונה</li>
            <li>התוצאות הקודמות לא יישמרו</li>
            {questionType && (
              <li>סוג השאלות: {questionType}</li>
            )}
            {difficulty && (
              <li>רמת קושי: {difficulty}</li>
            )}
          </ul>
        </div>
        <AlertDialogFooter className="flex-row-reverse sm:justify-start">
          <AlertDialogCancel 
            className="bg-slate-600 hover:bg-slate-700 text-white"
            disabled={isLoading}
          >
            ביטול
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                מתחיל מחדש...
              </>
            ) : (
              "התחל מחדש"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RestartConfirmationDialog;
