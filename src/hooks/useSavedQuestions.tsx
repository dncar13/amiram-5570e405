
import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/data/questionsData';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { refreshQuestionsFromStorage } from '@/services/questionsService';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

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
  
  // שימוש במפתח קבוע לשאלות השמורות של המשתמש
  const userSavedKey = currentUser ? `user_saved_questions_${currentUser.uid}` : null;
  
  // פונקציה לשמירה בענן
  const saveToCloud = async (questionId: number) => {
    if (!currentUser || !auth.currentUser) return false;
    
    try {
      const userId = auth.currentUser.uid;
      const savedQuestionRef = doc(db, `users/${userId}/savedQuestions/${questionId}`);
      
      await setDoc(savedQuestionRef, {
        questionId: questionId,
        savedAt: new Date().toISOString(),
        userId: userId
      });
      
      return true;
    } catch (error) {
      console.error("Error saving question to cloud:", error);
      return false;
    }
  };
  
  // פונקציה להסרה מהענן
  const removeFromCloud = async (questionId: number) => {
    if (!currentUser || !auth.currentUser) return false;
    
    try {
      const userId = auth.currentUser.uid;
      const savedQuestionRef = doc(db, `users/${userId}/savedQuestions/${questionId}`);
      
      await deleteDoc(savedQuestionRef);
      return true;
    } catch (error) {
      console.error("Error removing question from cloud:", error);
      return false;
    }
  };
  
  // פונקציה לקבלת כל השאלות השמורות מהענן
  const getSavedQuestionsFromCloud = async () => {
    if (!currentUser || !auth.currentUser) return [];
    
    try {
      const userId = auth.currentUser.uid;
      const savedQuestionsRef = collection(db, `users/${userId}/savedQuestions`);
      const snapshot = await getDocs(savedQuestionsRef);
      
      const savedIds: number[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.questionId) {
          savedIds.push(data.questionId);
        }
      });
      
      return savedIds;
    } catch (error) {
      console.error("Error getting saved questions from cloud:", error);
      return [];
    }
  };

  // פונקציה לאתחול השאלות השמורות - משופרת לביצועים טובים יותר
  const initializeSavedQuestions = useCallback(async () => {
    console.log("Initializing saved questions...", { userSavedKey, currentUser: !!currentUser });
    
    if (!userSavedKey) {
      console.log("No user or userSavedKey, setting empty array");
      setSavedQuestions([]);
      setIsInitialized(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // קבלת מזהי השאלות השמורות מהזיכרון המקומי
      const userSavedIds = JSON.parse(localStorage.getItem(userSavedKey) || '[]');
      console.log("Local saved IDs:", userSavedIds);
      
      // אם המשתמש מחובר, נסה לסנכרן עם הענן
      if (currentUser && auth.currentUser) {
        console.log("User is logged in, syncing with cloud");
        
        try {
          const cloudSavedIds = await getSavedQuestionsFromCloud();
          console.log("Cloud saved IDs:", cloudSavedIds);
          
          if (cloudSavedIds.length > 0) {
            // מיזוג מזהי מקומיים וענן (הסרת כפילויות)
            const mergedIds = Array.from(new Set([...userSavedIds, ...cloudSavedIds]));
            
            // אם המזהים המורכבים שונים מהמקומיים, עדכן את הזיכרון המקומי
            if (mergedIds.length !== userSavedIds.length || !mergedIds.every(id => userSavedIds.includes(id))) {
              localStorage.setItem(userSavedKey, JSON.stringify(mergedIds));
              console.log("Updated local storage with merged question IDs");
            }
            
            // עדכון המשתנה המקומי למיפוי למטה
            userSavedIds.length = 0;
            userSavedIds.push(...mergedIds);
          }
        } catch (error) {
          console.error("Error syncing with cloud:", error);
        }
      }
      
      // קבלת כל השאלות מהזיכרון
      const allQuestions = refreshQuestionsFromStorage();
      console.log("Total questions in storage:", allQuestions.length);
      
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
      // toast({
      //   title: "שגיאה",
      //   description: "שגיאה בטעינת השאלות השמורות",
      //   variant: "destructive",
      // });
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
  }, [currentUser, userSavedKey, initializeSavedQuestions]);

  const saveQuestion = (question: Question) => {
    if (!currentUser || !userSavedKey) {
      toast({
        title: "אנא התחבר",
        description: "עליך להתחבר כדי לשמור שאלות",
        variant: "default",
      });
      return false;
    }

    try {
      const userSavedIds = JSON.parse(localStorage.getItem(userSavedKey) || '[]');
      
      if (userSavedIds.includes(question.id)) {
        toast({
          title: "כבר שמור",
          description: "השאלה כבר נמצאת ברשימת השאלות השמורות",
          variant: "default",
        });
        return false;
      }

      userSavedIds.push(question.id);
      localStorage.setItem(userSavedKey, JSON.stringify(userSavedIds));

      const newSavedQuestion: SavedQuestion = {
        id: question.id,
        question,
        savedDate: new Date().toISOString()
      };

      setSavedQuestions(prev => [...prev, newSavedQuestion]);
      console.log(`Question #${question.id} saved successfully`);
      
      // הצגת הודעת הצלחה
      toast({
        title: "נשמרה בהצלחה",
        description: "השאלה נשמרה ברשימת השאלות השמורות שלך",
        variant: "default",
      });
      
      // שמירה גם בענן אם המשתמש מחובר
      if (currentUser && auth.currentUser) {
        saveToCloud(question.id)
          .then(success => {
            if (success) {
              console.log(`Question #${question.id} saved to cloud`);
            }
          });
      }
      
      return true;
    } catch (error) {
      console.error("Error saving question:", error);
      // toast({
      //   title: "שגיאה",
      //   description: "שגיאה בשמירת השאלה",
      //   variant: "destructive",
      // });
      return false;
    }
  };

  const removeQuestionById = (questionId: number) => {
    if (!currentUser || !userSavedKey) return false;

    try {
      const userSavedIds = JSON.parse(localStorage.getItem(userSavedKey) || '[]');
      const updatedIds = userSavedIds.filter((id: number) => id !== questionId);
      
      if (updatedIds.length === userSavedIds.length) {
        toast({
          title: "לא נמצא",
          description: "השאלה לא נמצאה ברשימת השאלות השמורות",
          variant: "default",
        });
        return false;
      }

      localStorage.setItem(userSavedKey, JSON.stringify(updatedIds));
      setSavedQuestions(prev => prev.filter(sq => sq.question.id !== questionId));
      console.log(`Question #${questionId} removed successfully`);
      
      // הסרה גם מהענן אם המשתמש מחובר
      if (currentUser && auth.currentUser) {
        removeFromCloud(questionId)
          .then(success => {
            if (success) {
              console.log(`Question #${questionId} removed from cloud`);
            }
          });
      }
      
      return true;
    } catch (error) {
      console.error("Error removing question:", error);      // toast({
      //   title: "שגיאה",
      //   description: "שגיאה בהסרת השאלה",
      //   variant: "destructive",
      // });
      return false;
    }
  };

  const isQuestionSaved = (questionId: number) => {
    if (!userSavedKey) return false;
    try {
      const userSavedIds = JSON.parse(localStorage.getItem(userSavedKey) || '[]');
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
