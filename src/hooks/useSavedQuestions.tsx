
import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/data/questionsData';
import { useAuth } from '@/context/AuthContext';
import { refreshQuestionsFromStorage } from '@/services/questionsService';
import { supabase } from '@/integrations/supabase/client';

export interface SavedQuestion {
  id: string | number; // Support both types during migration
  question: Question;
  savedDate: string;
}

// Utility to ensure ID is a number for legacy functions
const ensureNumberId = (id: string | number): number => {
  return typeof id === 'string' ? parseInt(id, 10) : id;
};

export const useSavedQuestions = () => {
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // שימוש במפתח קבוע לשאלות השמורות של המשתמש - על בסיס האימייל
  const userSavedKey = currentUser ? `saved_questions_${currentUser.email}` : null;
  
  // פונקציה לאתחול השאלות השמורות מ-Supabase
  const initializeSavedQuestions = useCallback(async () => {
    console.log("🔄 Initializing saved questions from Supabase...", { currentUser: !!currentUser });
    
    if (!currentUser) {
      console.log("❌ No user, setting empty array");
      setSavedQuestions([]);
      setIsInitialized(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // קבלת כל השאלות מהזיכרון
      const allQuestions = await refreshQuestionsFromStorage();
      console.log("📊 Total questions in storage:", allQuestions.length);

      // קבלת השאלות השמורות מ-Supabase
      const { data: savedData, error } = await supabase
        .from('saved_questions')
        .select(`
          question_id,
          saved_at
        `)
        .eq('user_id', currentUser.id);

      if (error) {
        console.error("❌ Error loading saved questions:", error);
        setSavedQuestions([]);
        return;
      }

      console.log("✅ Saved questions from Supabase:", savedData?.length || 0);

      // המרה לפורמט הנדרש
      const userQuestions = (savedData || [])
        .map((saved) => {
          const question = allQuestions.find((q: Question) => q.id.toString() === saved.question_id);
          if (!question) {
            console.warn("⚠️ Question not found for saved ID:", saved.question_id);
            return null;
          }
          
          return {
            id: question.id,
            question: question,
            savedDate: saved.saved_at
          };
        })
        .filter(Boolean); // הסרת ערכי null
      
      console.log("✅ Final saved questions:", userQuestions.length);
      setSavedQuestions(userQuestions);
    } catch (error) {
      console.error("❌ Error initializing saved questions:", error);
      setSavedQuestions([]);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [currentUser]);

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

  const saveQuestion = async (question: Question) => {
    if (!currentUser || !isInitialized) {
      console.error("❌ Cannot save - user not ready or not initialized");
      return false;
    }

    // בדיקה אם השאלה כבר שמורה
    if (isQuestionSaved(ensureNumberId(question.id))) {
      console.log("⚠️ Question already saved");
      return false;
    }

    try {
      console.log("💾 Saving question to Supabase:", question.id);
      
      const { error } = await supabase
        .from('saved_questions')
        .insert({
          user_id: currentUser.id,
          question_id: question.id.toString()
        });

      if (error) {
        console.error("❌ Error saving to Supabase:", error);
        return false;
      }

      const newSavedQuestion: SavedQuestion = {
        id: question.id,
        question,
        savedDate: new Date().toISOString()
      };

      // עדכון מצב מיד למשוב מהיר
      setSavedQuestions(prev => [...prev, newSavedQuestion]);
      console.log(`✅ Question #${question.id} saved successfully to Supabase`);
      
      return true;
    } catch (error) {
      console.error("❌ Error saving question:", error);
      return false;
    }
  };

  const removeQuestionById = async (questionId: string | number) => {
    if (!currentUser || !isInitialized) {
      console.error("❌ Cannot remove - user not ready or not initialized");
      return false;
    }

    try {
      console.log("🗑️ Removing question from Supabase:", questionId);
      
      const { error } = await supabase
        .from('saved_questions')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('question_id', questionId.toString());

      if (error) {
        console.error("❌ Error removing from Supabase:", error);
        return false;
      }
      
      // עדכון מצב מיד למשוב מהיר
      setSavedQuestions(prev => prev.filter(sq => ensureNumberId(sq.question.id) !== ensureNumberId(questionId)));
      console.log(`✅ Question #${questionId} removed successfully from Supabase`);
      
      return true;
    } catch (error) {
      console.error("❌ Error removing question:", error);
      return false;
    }
  };

  const isQuestionSaved = (questionId: string | number) => {
    if (!isInitialized) return false;
    const numId = ensureNumberId(questionId);
    return savedQuestions.some(sq => ensureNumberId(sq.question.id) === numId);
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
