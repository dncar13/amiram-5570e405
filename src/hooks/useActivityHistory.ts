
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export interface ActivityRecord {
  date: string;
  topic: string;
  questionId: string;
  status: "correct" | "wrong" | "skipped" | "flagged";
  time: string;
  score?: number;
  correctAnswers?: number;
  totalAnswered?: number;
  isCorrect?: boolean;
  isCompleted?: boolean;
  isFlagged?: boolean; // Track if question was flagged
}

const ACTIVITY_HISTORY_KEY = "activity_history";
// Create a custom event for activity updates
const ACTIVITY_UPDATED_EVENT = "activity_history_updated";

export const useActivityHistory = () => {
  const [history, setHistory] = useState<ActivityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  const loadHistory = () => {
    setIsLoading(true);
    try {
      const storedHistory = localStorage.getItem(ACTIVITY_HISTORY_KEY);
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
  };

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
  }, [currentUser]);

  return {
    history,
    isLoading,
    refreshHistory: loadHistory
  };
};

export const saveActivity = (activity: ActivityRecord) => {
  try {
    const storedHistory = localStorage.getItem(ACTIVITY_HISTORY_KEY);
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
    
    localStorage.setItem(ACTIVITY_HISTORY_KEY, JSON.stringify(history));
    console.log("Activity saved:", activityWithFormattedDate);
    
    // Dispatch event to notify listeners that activity has been updated
    window.dispatchEvent(new Event(ACTIVITY_UPDATED_EVENT));
    
    return true;
  } catch (err) {
    console.error("Failed to save activity:", err);
    return false;
  }
};

// Helper function to save flag activity
export const saveFlagActivity = (questionId: string, topic: string, isFlagged: boolean) => {
  const activity: ActivityRecord = {
    date: new Date().toISOString(),
    topic: topic,
    questionId: questionId,
    status: "flagged",
    time: "0",
    isFlagged: isFlagged
  };
  
  return saveActivity(activity);
};
