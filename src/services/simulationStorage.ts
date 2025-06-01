import { auth } from "@/lib/firebase";
import { 
  getTopicProgressKey,
  getQuestionSetProgressKey,
  resetConflictingProgress,
  hasExistingProgress,
  saveProgressToCloud,
  loadProgressFromCloud,
  deleteProgressFromCloud,
  CloudOperationResponse
} from "./cloudSync";
import { 
  migrateProgressData, 
  CURRENT_DATA_VERSION, 
  optimizeStorage,
  broadcastStorageUpdate,
  setupBroadcastChannel
} from "./storageUtils";
import { toast } from "@/hooks/use-toast";

/**
 * Interface for simulation progress data
 */
export interface SimulationProgressData {
  version?: string; // Version tracking for data migrations
  topicId: number;
  currentQuestionId?: number;
  currentQuestionIndex?: number;
  answers?: Record<string, { selected: string; isCorrect: boolean }>;
  score?: number;
  completed?: boolean;
  startTime?: string;
  userAnswers?: (number | null)[];
  remainingTime?: number;
  questionFlags?: boolean[];
  examMode?: boolean;
  showAnswersImmediately?: boolean;
  isTimerActive?: boolean;
  lastSaved?: string; // Timestamp for tracking the most recent save
  forceSync?: boolean; // Flag to force cloud sync
  answeredCount?: number; // Track answered questions count
  correctCount?: number; // Track correct answers count
  totalQuestions?: number; // Total questions in simulation
  timestamp?: string; // General timestamp
  hasBeenSeen?: boolean; // Flag to track if simulation has been viewed before
  [key: string]: any; // Allow for other properties
}

/**
 * Interface for response objects
 */
export interface StorageResponse<T = any> {
  success: boolean;
  data?: T | null;
  error?: string;
  warning?: string;
  message?: string;
}

// Constants for redundant storage
const GLOBAL_PROGRESS_KEY = 'simulation_progress'; 
const PERSISTENT_STORAGE_KEY = 'persistent_simulation_progress';
const SESSION_PROGRESS_KEY = 'session_simulation_progress'; // Added for session storage

// Setup broadcast channel for tab sync
let broadcastChannel: BroadcastChannel | null = null;

// Initialize tab synchronization
const initTabSync = () => {
  if (!broadcastChannel) {
    broadcastChannel = setupBroadcastChannel((key: string, data: any) => {
      if (!key || !data) return;
      
      try {
        // Update storage with data from other tabs
        localStorage.setItem(key, JSON.stringify(data));
        sessionStorage.setItem(key, JSON.stringify(data));
        console.log(`Updated storage from tab sync: ${key}`);
      } catch (err) {
        console.warn("Error syncing data between tabs:", err);
      }
    });
  }
};

// Initialize on module load
initTabSync();

/**
 * Save simulation progress to either local storage or cloud based on authentication status
 */
export const saveProgressUnified = async (
  id: number | string,
  progress: SimulationProgressData,
  isQuestionSet: boolean = false
): Promise<StorageResponse> => {
  try {
    // Check if we need to clean up storage first
    optimizeStorage();
    
    // Determine if user is authenticated
    const isAuthenticated = !!auth.currentUser;
    
    // Ensure version is set (for future migrations)
    const progressWithData = {
      ...progress,
      version: CURRENT_DATA_VERSION,
      lastSaved: new Date().toISOString(),
      // Don't always try to sync with cloud to minimize unnecessary errors
      forceSync: progress.forceSync === true 
    };
    
    // First, always save progress data to localStorage with proper key
    const storageKey = isQuestionSet
      ? getQuestionSetProgressKey(id)
      : getTopicProgressKey(id);

    try {
      // Make sure we're storing valid JSON
      const jsonData = JSON.stringify(progressWithData);
      
      // Check if JSON is valid before saving
      if (!jsonData || jsonData === "null" || jsonData === "undefined") {
        throw new Error("Invalid data for storage");
      }
      
      // Save to localStorage for persistence across browser sessions
      localStorage.setItem(storageKey, jsonData);
      
      // Save to sessionStorage for faster access within same tab session
      sessionStorage.setItem(storageKey, jsonData);
      sessionStorage.setItem(SESSION_PROGRESS_KEY, JSON.stringify({
        id,
        isQuestionSet,
        timestamp: new Date().toISOString()
      }));
      
      // Always save to global progress key for redundancy
      const globalData = {
        ...progressWithData,
        isQuestionSet,
        simulationId: id,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(GLOBAL_PROGRESS_KEY, JSON.stringify(globalData));
      
      // Save to a persistent key that won't get cleared by session storage
      localStorage.setItem(PERSISTENT_STORAGE_KEY, JSON.stringify(globalData));
      
      console.log(`Saved simulation progress to storage for ${isQuestionSet ? 'question set' : 'topic'} ${id}`);
      
      // Broadcast to other tabs
      broadcastStorageUpdate(storageKey, progressWithData);
      
    } catch (localError) {
      console.error("Error saving to storage:", localError);
      
      // Handle quota exceeded errors
      if (localError instanceof DOMException && 
          (localError.name === 'QuotaExceededError' || 
           localError.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        
        // Try to free up space and retry once
        const optimized = optimizeStorage();
        
        if (optimized) {
          try {
            localStorage.setItem(storageKey, JSON.stringify(progressWithData));
            console.log("Successfully saved after optimizing storage");
          } catch (retryError) {
            console.error("Still can't save after optimization:", retryError);
            // toast({
            //   title: "שגיאה",
            //   description: "לא ניתן לשמור התקדמות - זיכרון מלא",
            //   variant: "destructive",
            // });
            return { 
              success: false, 
              error: "Storage quota exceeded",
              warning: "Unable to save progress locally"
            };
          }
        }
      }
    }

    // If the user is authenticated and this is a forced sync or explicit save,
    // try to save to cloud with better error handling
    if (isAuthenticated && (progressWithData.forceSync || progress.forceSync)) {
      try {
        console.log(`Saving simulation progress to cloud for ${isQuestionSet ? 'question set' : 'topic'} ${id}`);
        
        // Check network connectivity first
        if (!navigator.onLine) {
          toast({
            title: "התראה",
            description: "אין חיבור לאינטרנט - השינויים נשמרו מקומית אך לא בענן",
            variant: "default", // Using "default" instead of "warning"
          });
          return {
            success: true,
            warning: "No internet connection, saved locally only"
          };
        }
        
        // Add a reasonable timeout
        const timeoutPromise = new Promise<CloudOperationResponse>((_, reject) => {
          setTimeout(() => reject({success: false, error: 'timeout', message: 'Connection timeout'}), 10000);
        });
        
        // Race between the actual save and the timeout
        const result = await Promise.race([
          saveProgressToCloud(progressWithData),
          timeoutPromise
        ]).catch(err => {
          // Ensure consistent error format
          if (err.error === 'timeout') {
            return {
              success: false, 
              error: 'timeout', 
              message: 'שמירה לענן נכשלה - תם הזמן המוקצב'
            } as CloudOperationResponse;
          }
          return {
            success: false, 
            error: err,
            message: 'שגיאה בשמירה לענן'
          } as CloudOperationResponse;
        });
        
        // Handle result safely with optional chaining
        const resultSuccess = result?.success || false;
        const resultMessage = result?.message;
        const resultError = result?.error;
        
        // Apply conditional logic for warnings
        let resultWarning: string | undefined = undefined;
        
        if (!resultSuccess) {
          resultWarning = resultMessage || 
            (resultError ? String(resultError) : "שגיאה לא ידועה בשמירה לענן");
        } else if (resultMessage) {
          resultWarning = resultMessage;
        }
        
        return {
          success: resultSuccess,
          error: resultError,
          warning: resultWarning
        };
      } catch (cloudError) {
        console.error("Error saving to cloud:", cloudError);
        
        // Don't show error toast for routine auto-saves to avoid annoying the user
        if (progress.forceSync) {
          toast({
            title: "התראה", 
            description: "שגיאה בשמירה לענן - אנא נסה שנית מאוחר יותר",
            variant: "default",
          });
        }
        
        return { 
          success: true, // Return true since we saved locally successfully
          error: cloudError instanceof Error ? cloudError.message : String(cloudError),
          warning: "Error during cloud save, saved locally only"
        };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error saving simulation progress:", error);
    // toast({
    //   title: "שגיאה",
    //   description: "שגיאה בשמירת ההתקדמות",
    //   variant: "destructive",
    // });
    
    return { 
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

/**
 * Load simulation progress from either local storage or cloud based on authentication status
 */
export const loadProgressUnified = async (
  id: number | string,
  isQuestionSet: boolean = false
): Promise<StorageResponse<SimulationProgressData>> => {
  try {
    // Determine if user is authenticated
    const isAuthenticated = !!auth.currentUser;

    // Initialize with empty data
    let progressData: SimulationProgressData | null = null;
    let progressError: string | undefined;
    
    // First try to get from storage with proper key
    const storageKey = isQuestionSet
      ? getQuestionSetProgressKey(id)
      : getTopicProgressKey(id);
    
    try {
      // Try sessionStorage first (fastest)
      const sessionProgressStr = sessionStorage.getItem(storageKey);
      
      if (sessionProgressStr) {
        const parsedData = JSON.parse(sessionProgressStr);
        // Migrate data to current version if needed
        progressData = migrateProgressData(parsedData) as SimulationProgressData;
        console.log(`Loaded simulation progress from sessionStorage key ${storageKey} for ${id}`);
      }
      
      // If not found in session, try localStorage
      if (!progressData) {
        const progressStr = localStorage.getItem(storageKey);
        
        if (progressStr) {
          const parsedData = JSON.parse(progressStr);
          // Migrate data to current version if needed
          progressData = migrateProgressData(parsedData) as SimulationProgressData;
          console.log(`Loaded simulation progress from localStorage key ${storageKey} for ${id}`);
          
          // Copy to sessionStorage for faster access next time
          sessionStorage.setItem(storageKey, JSON.stringify(progressData));
        } 
      }
      
      // If not found, try the global progress key
      if (!progressData) {
        const globalStr = localStorage.getItem(GLOBAL_PROGRESS_KEY);
        if (globalStr) {
          try {
            const globalData = JSON.parse(globalStr);
            const matchesId = String(globalData.simulationId) === String(id);
            const matchesType = globalData.isQuestionSet === isQuestionSet;
            
            if (matchesId && matchesType) {
              console.log(`Loaded simulation progress from global localStorage for ${id}`);
              // Migrate data to current version if needed
              progressData = migrateProgressData(globalData) as SimulationProgressData;
              
              // Copy to session and local storage with proper key
              sessionStorage.setItem(storageKey, JSON.stringify(progressData));
              localStorage.setItem(storageKey, JSON.stringify(progressData));
            }
          } catch (e) {
            console.error("Error parsing global progress", e);
          }
        }
      }
      
      // If still not found, try the persistent storage key
      if (!progressData) {
        const persistentStr = localStorage.getItem(PERSISTENT_STORAGE_KEY);
        if (persistentStr) {
          try {
            const persistentData = JSON.parse(persistentStr);
            const matchesId = String(persistentData.simulationId) === String(id);
            const matchesType = persistentData.isQuestionSet === isQuestionSet;
            
            if (matchesId && matchesType) {
              console.log(`Loaded simulation progress from persistent localStorage for ${id}`);
              // Migrate data to current version if needed
              progressData = migrateProgressData(persistentData) as SimulationProgressData;
              
              // Copy to session and local storage with proper key
              sessionStorage.setItem(storageKey, JSON.stringify(progressData));
              localStorage.setItem(storageKey, JSON.stringify(progressData));
            }
          } catch (e) {
            console.error("Error parsing persistent progress", e);
          }
        }
      }
    } catch (localError) {
      console.warn("Error loading from storage:", localError);
    }

    // If authenticated, try to load from cloud
    if (isAuthenticated) {
      try {
        console.log(`Attempting to load simulation progress from cloud for ${id}`);
        const cloudResult = await loadProgressFromCloud(id);
        
        if (cloudResult.data) {
          // If we have no local data, or cloud data is newer, use cloud data
          const cloudData = cloudResult.data;
          const cloudLastSaved = cloudData.lastSaved ? new Date(cloudData.lastSaved).getTime() : 0;
          const localLastSaved = progressData && progressData.lastSaved 
            ? new Date(progressData.lastSaved).getTime() 
            : 0;
          
          // Handle conflict detection - significant time difference
          const timeDiffMinutes = Math.abs(cloudLastSaved - localLastSaved) / (1000 * 60);
          
          if (!progressData || cloudLastSaved > localLastSaved) {
            console.log(`Loaded simulation progress from cloud for ${id} (newer than local)`);
            // Migrate data to current version if needed
            progressData = migrateProgressData(cloudData) as SimulationProgressData;
            
            // Save the cloud data to storage for future use
            localStorage.setItem(storageKey, JSON.stringify(progressData));
            sessionStorage.setItem(storageKey, JSON.stringify(progressData));
          } 
          // Detect conflicts - if both exist but with significant time difference
          else if (progressData && timeDiffMinutes > 10) {
            console.warn(`Detected potential conflict between local and cloud data (${timeDiffMinutes.toFixed(1)} minutes difference)`);
            
            // Use the newer version but keep backup
            const newerData = cloudLastSaved > localLastSaved ? cloudData : progressData;
            const conflictData = {
              ...newerData,
              _conflict: true,
              _conflictTimestamp: new Date().toISOString(),
              _localVersion: { ...progressData },
              _cloudVersion: { ...cloudData },
              version: CURRENT_DATA_VERSION
            };
            
            // Save the conflict info
            localStorage.setItem(`${storageKey}_conflict`, JSON.stringify(conflictData));
            
            toast({
              title: "קיים שוני בין המידע המקומי לענן",
              description: "נטענה הגרסה העדכנית ביותר",
              variant: "default",
            });
          }
        } else if (cloudResult.error) {
          progressError = cloudResult.error;
        }
      } catch (cloudError) {
        console.error("Error loading from cloud:", cloudError);
        progressError = cloudError instanceof Error ? cloudError.message : String(cloudError);
      }
    }
    
    // Return the data (from either source) or error
    if (progressData) {
      // Mark that we've got current progress in session
      sessionStorage.setItem(SESSION_PROGRESS_KEY, JSON.stringify({
        id, 
        isQuestionSet,
        timestamp: new Date().toISOString()
      }));
      
      return {
        success: true,
        data: progressData
      };
    } else {
      return {
        success: false,
        data: null,
        error: progressError
      };
    }
  } catch (error) {
    console.error("Error loading simulation progress:", error);
    return { 
      success: false,
      data: null,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

/**
 * Delete simulation progress from either local storage or cloud based on authentication status
 * @param id Topic or question set ID
 * @param isQuestionSet Whether this is a question set simulation
 * @returns Promise resolving to response with success status
 */
export const deleteProgressUnified = async (
  id: number | string,
  isQuestionSet: boolean = false
): Promise<StorageResponse> => {
  try {
    // Always delete from local storage regardless of authentication
    const storageKey = isQuestionSet
      ? getQuestionSetProgressKey(id)
      : getTopicProgressKey(id);

    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
    sessionStorage.removeItem(SESSION_PROGRESS_KEY);
    localStorage.removeItem(`${storageKey}_conflict`); // Also remove conflict data if any
    
    // Also check if we need to clear global storage
    const globalStr = localStorage.getItem(GLOBAL_PROGRESS_KEY);
    if (globalStr) {
      try {
        const globalData = JSON.parse(globalStr);
        const matchesId = String(globalData.simulationId) === String(id);
        const matchesType = globalData.isQuestionSet === isQuestionSet;
        
        if (matchesId && matchesType) {
          localStorage.removeItem(GLOBAL_PROGRESS_KEY);
          localStorage.removeItem(PERSISTENT_STORAGE_KEY);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    // Broadcast the deletion to other tabs
    if (broadcastChannel) {
      try {
        broadcastStorageUpdate(storageKey, null);
      } catch (err) {
        console.warn("Error broadcasting delete:", err);
      }
    }
    
    console.log(`Deleted simulation progress from storage for ${id}`);
    
    // If authenticated, also delete from cloud
    const isAuthenticated = !!auth.currentUser;
    if (isAuthenticated) {
      // Delete from cloud storage
      console.log(`Deleting simulation progress from cloud for ${id}`);
      const result = await deleteProgressFromCloud(id);
      
      return {
        success: result.success,
        error: result.error
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting simulation progress:", error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

/**
 * Check if simulation progress exists in either local storage or cloud based on authentication status
 * @param id Topic or question set ID
 * @param isQuestionSet Whether this is a question set simulation
 * @returns Promise resolving to response with success status and boolean result
 */
export const hasProgressUnified = async (
  id: number | string,
  isQuestionSet: boolean = false
): Promise<StorageResponse<boolean>> => {
  try {
    // First check local storage regardless of authentication
    const hasLocalProgress = hasExistingProgress(id, isQuestionSet);
    
    // If found locally, return immediately
    if (hasLocalProgress) {
      return {
        success: true,
        data: true
      };
    }
    
    // If authenticated, also check cloud
    const isAuthenticated = !!auth.currentUser;
    if (isAuthenticated) {
      // Check cloud storage
      console.log(`Checking simulation progress in cloud for ${id}`);
      const result = await loadProgressFromCloud(id);
      
      return {
        success: true,
        data: !!result.data
      };
    }
    
    // No progress found anywhere
    return {
      success: true,
      data: false
    };
  } catch (error) {
    console.error("Error checking simulation progress:", error);
    return { 
      success: false,
      data: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

/**
 * Reset any conflicting progress between topic and question set simulations
 * @returns Promise resolving to response with success status
 */
export const resetConflictingProgressUnified = async (): Promise<StorageResponse> => {
  try {
    resetConflictingProgress();
    console.log("Reset any conflicting progress between simulations");
    
    return { success: true };
  } catch (error) {
    console.error("Error resetting conflicting progress:", error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

/**
 * Get the current question count for a set
 */
export const getQuestionSetCount = (setNumber: number): number => {
  const storageKey = getQuestionSetProgressKey(setNumber);
  try {
    // Check sessionStorage first
    const sessionProgressStr = sessionStorage.getItem(storageKey);
    if (sessionProgressStr) {
      const progress = JSON.parse(sessionProgressStr);
      if (progress.totalQuestions) {
        return progress.totalQuestions;
      }
    }
    
    // Then check localStorage
    const progressStr = localStorage.getItem(storageKey);
    if (progressStr) {
      const progress = JSON.parse(progressStr);
      if (progress.totalQuestions) {
        return progress.totalQuestions;
      }
    }
  } catch (error) {
    console.error("Error getting question set count:", error);
  }
  
  // Default to 50 if not found
  return 50;
};

/**
 * Helper function to safely check and remove reset flag from URL and session storage
 * Used to ensure consistent reset behavior across component reloads
 */
export const checkAndClearResetFlag = (): boolean => {
  // Check for reset parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const resetParam = urlParams.get('reset');
  
  // Check for reset flag in session storage
  const sessionReset = window.sessionStorage.getItem('reset_simulation_progress') === 'true';
  
  // If either is set, consider it a reset
  const shouldReset = resetParam === '1' || sessionReset;
  
  if (shouldReset) {
    console.log("Reset flag detected - will clear existing progress");
    
    // Clear the session storage flag
    window.sessionStorage.removeItem('reset_simulation_progress');
    
    // Note: We don't remove the URL parameter as that's handled by the framework
  }
  
  return shouldReset;
};
