
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProgressService } from "@/services/progressService";

export interface ActivityRecord {
  date: string;
  topic: string;
  questionId: string;
  status: "correct" | "wrong" | "skipped";
  time: string;
  score?: number;
  correctAnswers?: number;
  totalAnswered?: number;
  isCorrect?: boolean;
  isCompleted?: boolean; // Added the missing property
}

// Create a custom event for activity updates
const ACTIVITY_UPDATED_EVENT = "activity_history_updated";

// Function to get user-specific activity key
const getUserActivityKey = (userEmail: string | null): string => {
  if (!userEmail) return "activity_history"; // fallback for no user
  return `activity_history_${userEmail}`;
};

// Helper function to get current user email from auth context
const getCurrentUserEmail = (): string | null => {
  try {
    // Try to get user from localStorage directly where Supabase stores auth data
    const authKeys = Object.keys(localStorage).filter(key => 
      key.includes('supabase') || key.includes('auth')
    );
    
    for (const key of authKeys) {
      try {
        const authData = JSON.parse(localStorage.getItem(key) || '{}');
        if (authData.user?.email) {
          return authData.user.email;
        }
        if (authData.access_token && authData.user?.email) {
          return authData.user.email;
        }
      } catch {
        continue;
      }
    }
    
    return null;
  } catch {
    return null;
  }
};

export const useActivityHistory = () => {
  const [history, setHistory] = useState<ActivityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // Get user-specific storage key
  const activityKey = getUserActivityKey(currentUser?.email || null);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      // First, try to load from database if user is authenticated
      if (currentUser) {
        const progressStats = await ProgressService.getUserProgressStats(currentUser.id);
        if (progressStats && progressStats.recent_activity && progressStats.recent_activity.length > 0) {
          // Convert database progress to ActivityRecord format
          const databaseHistory: ActivityRecord[] = progressStats.recent_activity.map(progress => ({
            date: new Date(progress.answered_at).toLocaleDateString('he-IL', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }),
            topic: 'שאלה', // Default topic
            questionId: progress.question_id,
            status: progress.answered_correctly ? 'correct' : 'wrong',
            time: progress.time_spent?.toString() || '0',
            isCorrect: progress.answered_correctly,
            isCompleted: true
          }));
          
          setHistory(databaseHistory);
          setIsLoading(false);
          return;
        }
      }
      
      // Fallback to localStorage
      const storedHistory = localStorage.getItem(activityKey);
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory) as ActivityRecord[];
        // Sort by date (newest first)
        const sortedHistory = parsedHistory.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setHistory(sortedHistory);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error("Failed to load activity history:", err);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [activityKey, currentUser]);

  useEffect(() => {
    loadHistory();
    
    // Add event listener for activity updates
    const handleActivityUpdate = () => {
      console.log("Activity update event received, reloading history...");
      loadHistory();
    };
    
    window.addEventListener(ACTIVITY_UPDATED_EVENT, handleActivityUpdate);
    
    return () => {
      window.removeEventListener(ACTIVITY_UPDATED_EVENT, handleActivityUpdate);
    };
  }, [loadHistory]);

  return {
    history,
    isLoading,
    refreshHistory: loadHistory
  };
};

export const saveActivity = (activity: ActivityRecord) => {
  try {
    // Check if we have a current user context to get the right storage key
    // Since this is called from outside the hook, we need to get user info
    const currentUserEmail = getCurrentUserEmail();
    const activityKey = getUserActivityKey(currentUserEmail);
    
    const storedHistory = localStorage.getItem(activityKey);
    let history: ActivityRecord[] = [];
    
    if (storedHistory) {
      history = JSON.parse(storedHistory);
    }
    
    const formattedDate = new Date().toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    
    // Ensure score calculation is valid
    if (activity.correctAnswers !== undefined && activity.totalAnswered !== undefined) {
      const correctAnswers = activity.correctAnswers || 0;
      const totalAnswered = activity.totalAnswered || 0;
      
      // Calculate score only if there are answered questions
      if (totalAnswered > 0) {
        activity.score = Math.round((correctAnswers / totalAnswered) * 100);
      } else {
        activity.score = 0;
      }
      
      console.log("Activity score calculation:", {
        correctAnswers,
        totalAnswered,
        calculatedScore: activity.score
      });
    }
    
    // Add the formatted date
    const activityWithFormattedDate = {
      ...activity,
      date: formattedDate
    };
    
    history.unshift(activityWithFormattedDate);
    
    // Limit history to 100 items
    if (history.length > 100) {
      history = history.slice(0, 100);
    }

    localStorage.setItem(activityKey, JSON.stringify(history));
    console.log("Activity saved:", activityWithFormattedDate);
    
    // Dispatch event to notify listeners that activity has been updated
    window.dispatchEvent(new Event(ACTIVITY_UPDATED_EVENT));
    
    return true;
  } catch (err) {
    console.error("Failed to save activity:", err);
    return false;
  }
};
