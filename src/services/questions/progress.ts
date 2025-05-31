
import { Question } from "@/data/types/questionTypes";

// Constants
const SIMULATION_PROGRESS_KEY_PREFIX = 'simulation_progress_';
const GLOBAL_PROGRESS_KEY = 'simulation_progress';

export interface SimulationProgress {
  topicId: number;
  currentQuestionIndex: number;
  answeredCount?: number;
  correctCount?: number;
  totalQuestions: number;
  timestamp: string;
  userAnswers?: (number | null)[];
  remainingTime?: number;
  questionFlags?: boolean[];
  examMode?: boolean;
  showAnswersImmediately?: boolean;
  isTimerActive?: boolean;
}

/**
 * Generate progress key for a specific topic or default to global key
 */
export const getProgressKey = (topicId?: string | number): string => {
  if (!topicId || topicId === '0' || topicId === 0) {
    return GLOBAL_PROGRESS_KEY;
  }
  return `${SIMULATION_PROGRESS_KEY_PREFIX}${topicId}`;
};

/**
 * Get simulation progress from localStorage for a specific topic or the global progress
 */
export const getSimulationProgress = (topicId?: string | number): SimulationProgress | null => {
  try {
    // First try topic-specific storage if topicId is provided
    if (topicId && topicId !== '0' && topicId !== 0) {
      const progressKey = getProgressKey(topicId);
      const progressStr = localStorage.getItem(progressKey);
      
      if (progressStr) {
        try {
          const progress = JSON.parse(progressStr);
          console.log(`Found topic-specific progress for ${topicId}:`, progress);
          
          // Validate the progress object has the minimum required fields
          if (!progress || typeof progress !== 'object' || 
              progress.currentQuestionIndex === undefined || 
              progress.totalQuestions === undefined) {
            console.warn(`Invalid progress object for topic ${topicId}, removing it`);
            localStorage.removeItem(progressKey);
            return null;
          }
          
          return progress;
        } catch (e) {
          console.error(`Error parsing progress for topic ${topicId}:`, e);
          // Clean up corrupted data
          localStorage.removeItem(progressKey);
          return null;
        }
      }
      
      console.log(`No topic-specific progress found for ${topicId}, trying global progress`);
    }
    
    // Fall back to global progress storage
    const globalProgressStr = localStorage.getItem(GLOBAL_PROGRESS_KEY);
    if (globalProgressStr) {
      try {
        const globalProgress = JSON.parse(globalProgressStr);
        console.log('Found global progress:', globalProgress);
        
        // Validate
        if (!globalProgress || typeof globalProgress !== 'object' || 
            globalProgress.currentQuestionIndex === undefined || 
            globalProgress.totalQuestions === undefined) {
          console.warn('Invalid global progress object, removing it');
          localStorage.removeItem(GLOBAL_PROGRESS_KEY);
          return null;
        }
        
        return globalProgress;
      } catch (e) {
        console.error('Error parsing global progress:', e);
        localStorage.removeItem(GLOBAL_PROGRESS_KEY);
        return null;
      }
    }
    
    console.log('No simulation progress found in storage');
    return null;
  } catch (error) {
    console.error('Error retrieving simulation progress:', error);
    return null;
  }
};

/**
 * Save simulation progress to localStorage
 */
export const saveSimulationProgress = (progress: SimulationProgress): void => {
  try {
    if (!progress || !progress.topicId) {
      console.error('Cannot save progress without topicId');
      return;
    }
    
    // Clean up potentially invalid data
    const cleanProgress = {
      ...progress,
      userAnswers: progress.userAnswers?.slice(0, progress.totalQuestions) || [],
      questionFlags: progress.questionFlags?.slice(0, progress.totalQuestions) || []
    };
    
    // Save to topic-specific storage
    const topicProgressKey = getProgressKey(progress.topicId);
    localStorage.setItem(topicProgressKey, JSON.stringify(cleanProgress));
    console.log(`Saved progress for topic ${progress.topicId} to ${topicProgressKey}`);
    
    // Also save to global storage for fallback
    localStorage.setItem(GLOBAL_PROGRESS_KEY, JSON.stringify(cleanProgress));
    console.log('Saved progress to global storage');
  } catch (error) {
    console.error('Error saving simulation progress:', error);
  }
};

/**
 * Reset simulation progress for a specific topic or globally
 */
export const resetSimulation = (topicId?: string | number): void => {
  try {
    if (topicId) {
      // Remove topic-specific progress
      const topicProgressKey = getProgressKey(topicId);
      localStorage.removeItem(topicProgressKey);
      console.log(`Reset progress for topic ${topicId}`);
    } else {
      // Remove global progress only
      localStorage.removeItem(GLOBAL_PROGRESS_KEY);
      console.log('Reset global progress');
    }
  } catch (error) {
    console.error('Error resetting simulation progress:', error);
  }
};

// Event emitter for simulation progress changes
const progressListeners: Array<(progress: SimulationProgress | null) => void> = [];

/**
 * Register a listener for simulation progress changes
 */
export const onProgressChange = (callback: (progress: SimulationProgress | null) => void): () => void => {
  progressListeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = progressListeners.indexOf(callback);
    if (index > -1) {
      progressListeners.splice(index, 1);
    }
  };
};
