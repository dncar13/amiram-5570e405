
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookmarkIcon, Flag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Question } from "@/data/questionsData";
import { useSavedQuestions } from "@/hooks/useSavedQuestions";

interface SaveButtonProps {
  question: Question;
  className?: string;
  showViewSaved?: boolean;
  onSaveStatusChange?: (isSaved: boolean) => void;
  variant?: 'bookmark' | 'flag';
  isFlagged?: boolean;
  onFlagChange?: (isFlagged: boolean) => void;
}

export const SaveButton = ({ 
  question, 
  className = "", 
  onSaveStatusChange,
  variant = 'bookmark',
  isFlagged = false,
  onFlagChange
}: SaveButtonProps) => {
  const { isPremium, currentUser } = useAuth();
  const { saveQuestion, isQuestionSaved, removeQuestionById } = useSavedQuestions();
  
  const isSaved = isQuestionSaved(question.id);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isPremium) {
      toast({
        title: "פיצ'ר פרימיום",
        description: variant === 'flag' 
          ? "סימון שאלות בדגל זמין למנויי פרימיום בלבד. שדרג לחשבון פרימיום!"
          : "שמירת שאלות זמינה למנויי פרימיום בלבד. שדרג לחשבון פרימיום כדי לשמור שאלות!"
      });
      return;
    }
    
    if (!currentUser) {
      toast({
        title: "אנא התחבר",
        description: variant === 'flag' ? "עליך להתחבר כדי לסמן שאלות" : "עליך להתחבר כדי לשמור שאלות"
      });
      return;
    }

    try {
      if (variant === 'flag') {
        const newFlaggedStatus = !isFlagged;
        
        if (newFlaggedStatus) {
          // Save the question when flagged
          if (saveQuestion({...question, flagged: true})) {
            toast({
              title: "סומן בדגל ✓",
              description: "השאלה סומנה ונשמרה ברשימת השאלות השמורות",
              variant: "default",
            });
            if (onFlagChange) onFlagChange(true);
          }
        } else {
          // Remove the question when unflagged
          if (removeQuestionById(question.id)) {
            toast({
              title: "הדגל הוסר",
              description: "השאלה הוסרה מהשאלות השמורות",
              variant: "default",
            });
            if (onFlagChange) onFlagChange(false);
          }
        }
      } else {
        if (isSaved) {
          if (removeQuestionById(question.id)) {
            toast({
              title: "הוסר בהצלחה",
              description: "השאלה הוסרה מהשאלות השמורות",
              variant: "default",
            });
            if (onSaveStatusChange) onSaveStatusChange(false);
          }
        } else {
          if (saveQuestion(question)) {
            toast({
              title: "נשמר בהצלחה",
              description: "השאלה נשמרה ברשימת המועדפים",
              variant: "default",
            });
            if (onSaveStatusChange) onSaveStatusChange(true);
          }
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

  if (variant === 'flag') {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className={`flex items-center gap-1 ${isFlagged ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'} ${className}`} 
        onClick={handleSaveClick}
        title={!isPremium ? "מנויי פרימיום בלבד" : isFlagged ? "הסר דגל" : "סמן בדגל"}
      >
        <Flag size={16} className={isFlagged ? "fill-red-500" : ""} />
        <span>{isFlagged ? "מסומן" : "דגל"}</span>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className={`flex items-center gap-1 ${isSaved ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'} ${className}`} 
        onClick={handleSaveClick}
        title={!isPremium ? "מנויי פרימיום בלבד" : isSaved ? "הסר מהשאלות השמורות" : "שמור שאלה"}
      >
        <BookmarkIcon size={16} className={isSaved ? "fill-amber-500" : ""} />
        <span>{isSaved ? "שמור ✓" : "שמור"}</span>
      </Button>
    </div>
  );
};

export default SaveButton;
