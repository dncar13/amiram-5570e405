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
  isCompleted?: boolean;
}

// Create a custom event for activity updates
const ACTIVITY_UPDATED_EVENT = "activity_history_updated";

export const useActivityHistory = () => {
  const [history, setHistory] = useState<ActivityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const loadHistory = useCallback(async () => {
    if (!currentUser) {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📊 Loading activity history from Supabase for user:', currentUser.id);
      
      const progressStats = await ProgressService.getUserProgressStats(currentUser.id);
      console.log('📊 [useActivityHistory] Progress stats:', JSON.stringify(progressStats, null, 2));
      
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
          topic: 'שאלה', // Default topic - could be enhanced with question type
          questionId: progress.question_id,
          status: progress.answered_correctly ? 'correct' : 'wrong',
          time: progress.time_spent?.toString() || '0',
          isCorrect: progress.answered_correctly,
          isCompleted: true
        }));
        
        console.log('✅ Activity history loaded from Supabase:', databaseHistory.length, 'records');
        setHistory(databaseHistory);
      } else {
        console.log('📝 No activity history found in Supabase');
        setHistory([]);
      }
    } catch (err) {
      console.error("❌ Failed to load activity history from Supabase:", err);
      setError((err as Error).message);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadHistory();
    
    // Add event listener for activity updates
    const handleActivityUpdate = () => {
      console.log("📢 Activity update event received, reloading history from Supabase...");
      loadHistory();
    };
    
    window.addEventListener(ACTIVITY_UPDATED_EVENT, handleActivityUpdate);
    
    return () => {
      window.removeEventListener(ACTIVITY_UPDATED_EVENT, handleActivityUpdate);
    };
  }, [loadHistory]);

  // Function to trigger a refresh (can be called by components)
  const refreshHistory = useCallback(() => {
    loadHistory();
  }, [loadHistory]);

  // Function to notify that new activity was saved (replaces saveActivity)
  const notifyActivityUpdate = useCallback(() => {
    window.dispatchEvent(new Event(ACTIVITY_UPDATED_EVENT));
  }, []);

  return {
    history,
    isLoading,
    error,
    refreshHistory,
    notifyActivityUpdate
  };
};

// REMOVED: saveActivity function that was saving to localStorage
// Activity saving is now handled directly by ProgressService.saveUserProgress()
// Components should call notifyActivityUpdate() after saving to trigger refresh