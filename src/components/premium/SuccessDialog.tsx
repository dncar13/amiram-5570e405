
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

interface SuccessDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess: () => void;
}

const SuccessDialog = ({ isOpen, setIsOpen, onSuccess }: SuccessDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">התשלום התקבל בהצלחה!</DialogTitle>
          <DialogDescription className="text-center">
            ברכות! יש לך כעת גישה מלאה לכל נושאי הסימולציה
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center py-6">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={onSuccess}
            className="bg-electric-blue hover:bg-blue-600"
          >
            התחל ללמוד עכשיו
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
