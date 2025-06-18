
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookmarkIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Question } from "@/data/questionsData";
import { useSavedQuestions } from "@/hooks/useSavedQuestions";

interface SaveButtonProps {
  question: Question;
  className?: string;
  showViewSaved?: boolean;
  onSaveStatusChange?: (isSaved: boolean) => void;
}

export const SaveButton = ({ 
  question, 
  className = "", 
  onSaveStatusChange
}: SaveButtonProps) => {
  const { isPremium, currentUser } = useAuth();
  const { saveQuestion, isQuestionSaved, removeQuestionById, isInitialized } = useSavedQuestions();
  
  const isSaved = isQuestionSaved(question.id);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isPremium) {
      toast({
        title: "פיצ'ר פרימיום",
        description: "שמירת שאלות זמינה למנויי פרימיום בלבד. שדרג לחשבון פרימיום כדי לשמור שאלות!"
      });
      return;
    }
    
    if (!currentUser) {
      toast({
        title: "אנא התחבר",
        description: "עליך להתחבר כדי לשמור שאלות"
      });
      return;
    }

    if (!isInitialized) {
      toast({
        title: "מערכת טוענת",
        description: "אנא המתן רגע עד שהמערכת תסיים לטעון"
      });
      return;
    }

    try {
      if (isSaved) {
        if (removeQuestionById(question.id)) {
          toast({
            title: "הוסרה בהצלחה",
            description: "השאלה הוסרה מהשאלות השמורות",
            variant: "default",
          });
          if (onSaveStatusChange) onSaveStatusChange(false);
        } else {
          toast({
            title: "שגיאה",
            description: "לא ניתן להסיר את השאלה",
            variant: "destructive",
          });
        }
      } else {
        if (saveQuestion(question)) {
          toast({
            title: "נשמרה בהצלחה",
            description: "השאלה נשמרה ברשימת המועדפים",
            variant: "default",
          });
          if (onSaveStatusChange) onSaveStatusChange(true);
        } else {
          toast({
            title: "שגיאה",
            description: "לא ניתן לשמור את השאלה",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error saving question:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשמירת השאלה",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className={`flex items-center gap-1 ${isSaved ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'} ${className}`} 
        onClick={handleSaveClick}
        title={!isPremium ? "מנויי פרימיום בלבד" : isSaved ? "הסר מהשאלות השמורות" : "שמור שאלה"}
        disabled={!isInitialized}
      >
        <BookmarkIcon size={16} className={isSaved ? "fill-amber-500" : ""} />
        <span>{isSaved ? "שמור ✓" : "שמור"}</span>
      </Button>
    </div>
  );
};

export default SaveButton;
