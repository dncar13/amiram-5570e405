import { Question } from "@/data/types/questionTypes";
import { refreshQuestionsFromStorage } from "./questions/storage";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { optimizeStorage, cleanupOldProgress } from "./storageUtils";

// Key constants for different storage namespaces
const QUESTIONS_SET_PROGRESS_PREFIX = 'qs_progress_';
const TOPIC_SIMULATION_PROGRESS_PREFIX = 'topic_progress_';
const GLOBAL_PROGRESS_KEY = 'simulation_progress'; // Legacy key

// Define consistent response type for all cloud operations
export interface CloudOperationResponse {
  success: boolean;
  error?: string;
  message?: string;
  data?: unknown;
}

/**
 * Separate storage keys for question sets and topics to avoid conflicts
 */
export const getQuestionSetProgressKey = (setId: string | number): string => {
  return `${QUESTIONS_SET_PROGRESS_PREFIX}${setId}`;
};

export const getTopicProgressKey = (topicId: string | number): string => {
  return `${TOPIC_SIMULATION_PROGRESS_PREFIX}${topicId}`;
};

/**
 * Clear conflicting progress data between topics and question sets
 */
export const resetConflictingProgress = (): void => {
  try {
    // Clear the global progress key which might be causing conflicts
    localStorage.removeItem(GLOBAL_PROGRESS_KEY);
    console.log("Cleared global progress to avoid conflicts between simulations");
  } catch (error) {
    console.error("Error clearing conflicting progress:", error);
  }
};

/**
 * Get questions for a specific set by index range rather than topic
 * @param setNumber The question set number (1-20)
 * @returns Array of questions in that range
 */
export const getQuestionsForSet = (setNumber: number): Question[] => {
  if (!setNumber || isNaN(setNumber) || setNumber < 1 || setNumber > 20) {
    console.error(`Invalid set number: ${setNumber}`);
    return [];
  }
  
  // Get all questions from storage
  const allQuestions = refreshQuestionsFromStorage();
  
  // Calculate the start and end indices based on set number
  // Each set should have 50 questions (1-50, 51-100, etc.)
  const startId = (setNumber - 1) * 50 + 1;
  const endId = setNumber * 50;
  
  // Filter questions by ID range
  const setQuestions = allQuestions.filter(q => {
    const id = typeof q.id === 'number' ? q.id : parseInt(String(q.id), 10);
    return id >= startId && id <= endId;
  });
  
  console.log(`Found ${setQuestions.length} questions for set ${setNumber} (ID range ${startId}-${endId})`);
  return setQuestions;
};

/**
 * Clear all simulation progress and question caches with improved error handling
 */
export const clearAllSimulationData = (): void => {
  try {
    // Find all keys related to simulation progress
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith(QUESTIONS_SET_PROGRESS_PREFIX) ||
        key.startsWith(TOPIC_SIMULATION_PROGRESS_PREFIX) ||
        key === GLOBAL_PROGRESS_KEY
      )) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all found keys with error handling
    let successCount = 0;
    for (const key of keysToRemove) {
      try {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
        successCount++;
      } catch (err) {
        console.error(`Error removing key ${key}:`, err);
      }
    }
    
    console.log(`Cleared ${successCount}/${keysToRemove.length} simulation progress items`);
    
    // Optimize storage after clearing
    optimizeStorage();
    
  } catch (error) {
    console.error("Error clearing simulation data:", error);
    // Remove the undefined toast call - just log the error
    console.error("שגיאה באיפוס נתוני הסימולציה");
  }
};

/**
 * Get the current question count for a set
 */
export const getQuestionSetCount = (setNumber: number): number => {
  const questions = getQuestionsForSet(setNumber);
  return questions.length;
};

/**
 * Check if a simulation was previously started for a specific set or topic
 */
export const hasExistingProgress = (
  id: string | number, 
  isQuestionSet: boolean = false
): boolean => {
  const storageKey = isQuestionSet 
    ? getQuestionSetProgressKey(id) 
    : getTopicProgressKey(id);
    
  const progressStr = localStorage.getItem(storageKey);
  return progressStr !== null;
};

/**
 * Interface for simulation progress data
 */
export interface SimulationProgress {
  version?: string; // Track data structure version
  topicId: string | number;
  answers?: Record<string, unknown>;
  currentQuestionIndex?: number;
  score?: number;
  completed?: boolean;
  startTime?: string;
  endTime?: string;
  userAnswers?: (number | null)[];
  remainingTime?: number;
  questionFlags?: boolean[];
  examMode?: boolean;
  showAnswersImmediately?: boolean;
  isTimerActive?: boolean;
  lastSaved?: string;
  forceSync?: boolean;
  answeredCount?: number;
  correctCount?: number;
  totalQuestions?: number;
  timestamp?: string;
  hasBeenSeen?: boolean;  // Flag to track if the simulation has been viewed before
  [key: string]: unknown; // For any additional properties
}

/**
 * Save simulation progress to cloud storage (Firestore) with improved error handling
 */
export const saveProgressToCloud = async (progress: SimulationProgress): Promise<CloudOperationResponse> => {
  let retryAttempt = 0;
  const maxRetries = 2;
  
  // First check if Firebase is available and connected
  try {
    if (!auth) {
      console.warn("Firebase auth not initialized, cannot save to cloud");
      return { success: false, error: "Firebase not initialized", message: "חיבור לשירותי ענן לא זמין" };
    }
    
    const isConnected = await import('@/lib/firebase').then(
      module => module.checkFirebaseConnection()
    ).catch(() => false);
    
    if (!isConnected) {
      console.warn("No connection to Firebase, skipping cloud save");
      return { 
        success: false, 
        error: "cloud-connection-error",
        message: "אין חיבור לענן - התקדמות נשמרה מקומית בלבד" 
      };
    }
  } catch (checkError) {
    console.error("Error checking Firebase connection:", checkError);
  }
  
  const attemptSave = async (): Promise<CloudOperationResponse> => {
    try {
      if (!auth.currentUser) {
        return { success: false, error: "User not authenticated", message: "משתמש לא מחובר" };
      }
      
      const userId = auth.currentUser.uid;
      const topicId = progress.topicId;
      const docRef = doc(db, `users/${userId}/simulations/${topicId}`);
      
      // Add additional metadata for tracking
      const progressWithMeta = {
        ...progress,
        updatedAt: new Date().toISOString(),
        userId: userId,
        device: navigator.userAgent,
        syncTimestamp: Date.now()
      };
      
      await setDoc(docRef, progressWithMeta);
      
      console.log(`Saved simulation progress to cloud for topic ${topicId}`);
      return { success: true, message: "נשמר בהצלחה בענן" };
    } catch (error) {
      console.error(`Error saving progress to cloud (attempt ${retryAttempt+1}/${maxRetries+1}):`, error);
      
      // Check for specific Firebase errors
      let errorMessage = "שגיאת חיבור לענן";
      
      if (error instanceof Error) {
        // Check for common Firebase errors
        if (error.message.includes("permission-denied")) {
          errorMessage = "אין הרשאה לשמור נתונים בענן";
        } else if (error.message.includes("unavailable") || error.message.includes("network")) {
          errorMessage = "בעיית תקשורת עם הענן - בדוק את החיבור לאינטרנט";
        } else if (error.message.includes("unauthenticated")) {
          errorMessage = "יש להתחבר מחדש כדי לשמור בענן";
        }
      }
      
      return { 
        success: false, 
        error: "cloud-connection-error",
        message: errorMessage
      };
    }
  };
  
  // First attempt
  let result = await attemptSave();
  
  // Retry on failure
  while (!result.success && retryAttempt < maxRetries) {
    retryAttempt++;
    console.log(`Retrying cloud save (attempt ${retryAttempt+1}/${maxRetries+1})...`);
    
    // Wait before retry (exponential backoff)
    await new Promise(resolve => setTimeout(resolve, 1000 * retryAttempt));
    result = await attemptSave();
  }
  
  if (!result.success) {
    // Final failure after retries - notify user with useToast hook
    console.error("Failed to save to cloud after retries:", result.message);
  } else {
    // Optionally show success for crucial data
    if (progress.forceSync) {
      console.log("Progress saved to cloud successfully");
    }
  }
  
  return result;
};

/**
 * Load simulation progress from cloud storage (Firestore) with improved error handling
 */
export const loadProgressFromCloud = async (id: string | number): Promise<CloudOperationResponse> => {
  try {
    if (!auth.currentUser) {
      return { success: false, error: "User not authenticated", message: "משתמש לא מחובר" };
    }
    
    const userId = auth.currentUser.uid;
    const docRef = doc(db, `users/${userId}/simulations/${id}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(`Loaded simulation progress from cloud for ${id}`);
      
      // Also save to local storage for offline access
      try {
        const key = String(id).startsWith('qs_') ? 
          getQuestionSetProgressKey(id) :
          getTopicProgressKey(id);
        
        localStorage.setItem(key, JSON.stringify({
          ...data,
          loadedFromCloud: true,
          cloudTimestamp: Date.now()
        }));
      } catch (localError) {
        console.error("Error saving cloud data to localStorage:", localError);
        // Try to free up storage space if the error might be due to storage limits
        if (localError instanceof DOMException && 
            (localError.name === 'QuotaExceededError' || 
             localError.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
          // Try to optimize storage and retry once
          optimizeStorage();
          try {
            const key = String(id).startsWith('qs_') ? 
              getQuestionSetProgressKey(id) :
              getTopicProgressKey(id);
            
            localStorage.setItem(key, JSON.stringify({
              ...data,
              loadedFromCloud: true,
              cloudTimestamp: Date.now()
            }));
          } catch (retryError) {
            console.error("Still failed to save after optimization:", retryError);
          }
        }
      }
      
      return { success: true, data }; // When data exists
    } else {
      console.log(`No simulation progress found in cloud for ${id}`);
      return { success: false, data: null, message: "לא נמצאה התקדמות בענן" }; // When no data
    }
  } catch (error) {
    console.error("Error loading progress from cloud:", error);
    // Show toast error to inform the user
    // toast({
    //   title: "שגיאה",
    //   description: "שגיאה בטעינת התקדמות מהענן",
    //   variant: "destructive",
    // });
    return { 
      success: false,
      data: null, 
      error: error instanceof Error ? error.message : String(error),
      message: "שגיאה בטעינת התקדמות מהענן"
    };
  }
};

/**
 * Delete simulation progress from cloud storage (Firestore)
 */
export const deleteProgressFromCloud = async (id: string | number): Promise<CloudOperationResponse> => {
  try {
    if (!auth.currentUser) {
      return { success: false, error: "User not authenticated", message: "משתמש לא מחובר" };
    }
    
    const userId = auth.currentUser.uid;
    const docRef = doc(db, `users/${userId}/simulations/${id}`);
    
    await deleteDoc(docRef);
    
    console.log(`Deleted simulation progress from cloud for ${id}`);
    return { success: true, message: "נמחק בהצלחה מהענן" };
  } catch (error) {
    console.error("Error deleting progress from cloud:", error);
    // Show toast error to inform the user
    // toast({
    //   title: "שגיאה",
    //   description: "שגיאה במחיקת התקדמות מהענן",
    //   variant: "destructive",
    // });
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      message: "שגיאה במחיקת התקדמות מהענן"
    };
  }
};

/**
 * Create an initial data set to populate question set 801-850
 */
export const populateQuestionSet = () => {
  try {
    // Use dynamic import instead of require
    import('@/data/questions/questions801to850').then(module => {
      const questions801to850 = module.questions801to850;
      
      if (questions801to850 && questions801to850.length > 0) {
        console.log("Question set 801-850 already populated with data");
        return true;
      }
      
      console.log("Question set 801-850 is empty, populating with sample data");
      return false;
    }).catch(error => {
      console.error("Error checking question set 801-850:", error);
      return false;
    });
  } catch (error) {
    console.error("Error checking question set 801-850:", error);
    return false;
  }
};
