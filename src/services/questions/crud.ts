
import { Question } from "@/data/types/questionTypes";
import { allQuestions } from "@/data/questions";
import { toast } from "sonner";
import { getQuestions, saveQuestions } from "./storage";

/**
 * Get all questions from storage
 */
export const getAllQuestions = (): Question[] => {
  return getQuestions();
};

/**
 * Get question by ID
 */
export const getQuestionById = (id: string | number): Question | undefined => {
  const allQuestions = getQuestions();
  const numericId = typeof id === 'string' ? parseInt(id) : id;
  return allQuestions.find(q => {
    const questionId = typeof q.id === 'string' ? parseInt(q.id) : q.id;
    return questionId === numericId;
  });
};

/**
 * Update an existing question
 */
export const updateQuestion = (updatedQuestion: Question): boolean => {
  try {
    const currentQuestions = getQuestions();
    
    const index = currentQuestions.findIndex(q => q.id === updatedQuestion.id);
    if (index === -1) {
      toast.error("השאלה לא נמצאה");
      return false;
    }
    
    currentQuestions[index] = { ...updatedQuestion };
    
    saveQuestions(currentQuestions);
    
    console.log("Question updated:", updatedQuestion.id);
    toast.success("השאלה עודכנה בהצלחה");
    return true;
  } catch (error) {
    console.error("Error updating question:", error);
    toast.error("שגיאה בעדכון השאלה");
    return false;
  }
};

/**
 * Add a new question
 */
export const addQuestion = (newQuestion: Omit<Question, "id">): boolean => {
  try {
    const currentQuestions = getQuestions();
    
    const maxId = Math.max(...currentQuestions.map(q => typeof q.id === 'string' ? parseInt(q.id) : q.id), 0);
    const questionWithId: Question = {
      ...newQuestion,
      id: maxId + 1
    };
    
    currentQuestions.push(questionWithId);
    
    saveQuestions(currentQuestions);
    
    console.log("Question added:", questionWithId);
    console.log("Total questions now:", currentQuestions.length);
    
    toast.success("השאלה נוספה בהצלחה");
    return true;
  } catch (error) {
    console.error("Error adding question:", error);
    toast.error("שגיאה בהוספת השאלה");
    return false;
  }
};

/**
 * Delete question by ID
 */
export const deleteQuestion = (id: string | number): boolean => {
  try {
    const currentQuestions = getQuestions();
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    
    const initialLength = currentQuestions.length;
    const filteredQuestions = currentQuestions.filter(q => {
      const questionId = typeof q.id === 'string' ? parseInt(q.id) : q.id;
      return questionId !== numericId;
    });
    
    if (filteredQuestions.length === initialLength) {
      toast.error("השאלה לא נמצאה");
      return false;
    }
    
    saveQuestions(filteredQuestions);
    
    console.log("Question deleted:", id);
    toast.success("השאלה נמחקה בהצלחה");
    return true;
  } catch (error) {
    console.error("Error deleting question:", error);
    toast.error("שגיאה במחיקת השאלה");
    return false;
  }
};

/**
 * Save all current changes
 */
export const saveChanges = (): boolean => {
  try {
    // Force save all pending changes
    saveQuestions(getQuestions(), true);
    
    console.log("All changes saved to localStorage");
    toast.success("כל השינויים נשמרו בהצלחה");
    return true;
  } catch (error) {
    console.error("Error saving changes:", error);
    toast.error("שגיאה בשמירת השינויים");
    return false;
  }
};

/**
 * Reset questions to original data
 */
export const resetChanges = (): void => {
  try {
    saveQuestions([...allQuestions], true);
    console.log("Reset to original data and saved to localStorage");
    toast.info("השינויים בוטלו והנתונים אופסו");
  } catch (error) {
    console.error("Error resetting questions:", error);
    toast.error("שגיאה באיפוס השאלות");
  }
};
