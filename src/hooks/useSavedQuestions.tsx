
import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/data/questionsData';
import { useAuth } from '@/context/AuthContext';
import { refreshQuestionsFromStorage } from '@/services/questionsService';

export interface SavedQuestion {
  id: number;
  question: Question;
  savedDate: string;
}

export const useSavedQuestions = () => {
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // שימוש במפתח קבוע לשאלות השמורות של המשתמש - על בסיס האימייל
  const userSavedKey = currentUser ? `saved_questions_${currentUser.email}` : null;
  
  // פונקציה לאתחול השאלות השמורות
  const initializeSavedQuestions = useCallback(async () => {
    console.log("Initializing saved questions...", { userSavedKey, currentUser: !!currentUser });
    
    if (!userSavedKey || !currentUser) {
      console.log("No user or userSavedKey, setting empty array");
      setSavedQuestions([]);
      setIsInitialized(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // קבלת כל השאלות מהזיכרון
      const allQuestions = await refreshQuestionsFromStorage();
      console.log("Total questions in storage:", allQuestions.length);

      // קבלת מזהי השאלות השמורות מהזיכרון המקומי
      const savedData = localStorage.getItem(userSavedKey);
      let userSavedIds: number[] = [];
      
      if (savedData) {
        try {
          userSavedIds = JSON.parse(savedData);
          console.log("Local saved IDs:", userSavedIds);
        } catch (parseError) {
          console.error("Error parsing saved questions data:", parseError);
          localStorage.removeItem(userSavedKey); // מחק נתונים פגומים
        }
      }
      
      // סינון השאלות שתואמות למזהים השמורים
      const userQuestions = userSavedIds
        .map((savedId: number) => {
          const question = allQuestions.find((q: Question) => q.id === savedId);
          if (!question) {
            console.warn("Question not found for saved ID:", savedId);
            return null;
          }
          
          return {
            id: savedId,
            question: question,
            savedDate: new Date().toISOString()
          };
        })
        .filter(Boolean); // הסרת ערכי null
      
      console.log("Final saved questions:", userQuestions.length);
      setSavedQuestions(userQuestions);
    } catch (error) {
      console.error("Error initializing saved questions:", error);
      setSavedQuestions([]);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [userSavedKey, currentUser]);

  // אתחול אוטומטי בטעינה ובעת שינוי משתמש
  useEffect(() => {
    console.log("useEffect triggered for saved questions initialization");
    initializeSavedQuestions();
    
    // הוספת מאזין לשינויים בזיכרון לסנכרון בין טאבים
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === userSavedKey) {
        console.log("Storage change detected, reinitializing");
        initializeSavedQuestions();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [initializeSavedQuestions, userSavedKey]);

  const saveQuestion = (question: Question) => {
    if (!currentUser || !userSavedKey || !isInitialized) {
      console.error("Cannot save - user not ready or not initialized");
      return false;
    }

    try {
      const savedData = localStorage.getItem(userSavedKey);
      let userSavedIds: number[] = [];
      
      if (savedData) {
        try {
          userSavedIds = JSON.parse(savedData);
        } catch (parseError) {
          console.error("Error parsing existing saved data:", parseError);
          userSavedIds = [];
        }
      }
      
      if (userSavedIds.includes(question.id)) {
        console.log("Question already saved");
        return false;
      }

      // הוספה לזיכרון המקומי מיד
      userSavedIds.push(question.id);
      localStorage.setItem(userSavedKey, JSON.stringify(userSavedIds));

      const newSavedQuestion: SavedQuestion = {
        id: question.id,
        question,
        savedDate: new Date().toISOString()
      };

      // עדכון מצב מיד למשוב מהיר
      setSavedQuestions(prev => [...prev, newSavedQuestion]);
      console.log(`Question #${question.id} saved successfully`);
      
      // הפצת אירוע לסנכרון בין טאבים
      window.dispatchEvent(new StorageEvent('storage', {
        key: userSavedKey,
        newValue: JSON.stringify(userSavedIds),
        storageArea: localStorage
      }));
      
      return true;
    } catch (error) {
      console.error("Error saving question:", error);
      return false;
    }
  };

  const removeQuestionById = (questionId: number) => {
    if (!currentUser || !userSavedKey || !isInitialized) {
      console.error("Cannot remove - user not ready or not initialized");
      return false;
    }

    try {
      const savedData = localStorage.getItem(userSavedKey);
      let userSavedIds: number[] = [];
      
      if (savedData) {
        try {
          userSavedIds = JSON.parse(savedData);
        } catch (parseError) {
          console.error("Error parsing existing saved data:", parseError);
          return false;
        }
      }
      
      const updatedIds = userSavedIds.filter((id: number) => id !== questionId);
      
      if (updatedIds.length === userSavedIds.length) {
        console.log("Question not found in saved list");
        return false;
      }

      // עדכון הזיכרון המקומי מיד
      localStorage.setItem(userSavedKey, JSON.stringify(updatedIds));
      
      // עדכון מצב מיד למשוב מהיר
      setSavedQuestions(prev => prev.filter(sq => sq.question.id !== questionId));
      console.log(`Question #${questionId} removed successfully`);
      
      // הפצת אירוע לסנכרון בין טאבים
      window.dispatchEvent(new StorageEvent('storage', {
        key: userSavedKey,
        newValue: JSON.stringify(updatedIds),
        storageArea: localStorage
      }));
      
      return true;
    } catch (error) {
      console.error("Error removing question:", error);
      return false;
    }
  };

  const isQuestionSaved = (questionId: number) => {
    if (!userSavedKey || !isInitialized) return false;
    try {
      const savedData = localStorage.getItem(userSavedKey);
      if (!savedData) return false;
      
      const userSavedIds = JSON.parse(savedData);
      return userSavedIds.includes(questionId);
    } catch {
      return false;
    }
  };

  return {
    savedQuestions,
    saveQuestion,
    removeQuestionById,
    isQuestionSaved,
    initializeSavedQuestions,
    isLoading,
    isInitialized
  };
};

export default useSavedQuestions;
