
import React from 'react';
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
import { AlertTriangle } from 'lucide-react';

interface RestartConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export const RestartConfirmationDialog: React.FC<RestartConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  title = "התחל מחדש את הסט?",
  description = "פעולה זו תמחק את כל ההתקדמות הנוכחית ותתחיל את הסט מההתחלה. פעולה זו לא ניתנת לביטול.",
  isLoading = false
}) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-white/10 text-white">
        <AlertDialogHeader>
          <div className="flex items-center space-x-3">
            <div className="bg-orange-500/20 rounded-full p-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
            </div>
            <AlertDialogTitle className="text-lg font-bold text-white">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-300 text-right mt-4">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse space-x-2 space-x-reverse">
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'מתחיל מחדש...' : 'כן, התחל מחדש'}
          </AlertDialogAction>
          <AlertDialogCancel 
            className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
            disabled={isLoading}
          >
            ביטול
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RestartConfirmationDialog;
