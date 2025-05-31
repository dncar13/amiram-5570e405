
// Storage utility functions for optimizing and managing local storage

import { toast } from "@/hooks/use-toast";

// Current version of storage data structure
export const CURRENT_DATA_VERSION = "1.0.0";

/**
 * Setup broadcast channel for tab synchronization
 */
export const setupBroadcastChannel = (
  onMessage: (key: string, data: any) => void
) => {
  try {
    const channel = new BroadcastChannel("simulation_storage_sync");
    
    channel.addEventListener("message", (event) => {
      try {
        const { key, data } = event.data;
        if (key) {
          onMessage(key, data);
        }
      } catch (err) {
        console.warn("Error processing broadcast message:", err);
      }
    });
    
    return channel;
  } catch (error) {
    // Browser might not support BroadcastChannel
    console.warn("BroadcastChannel not supported:", error);
    return null;
  }
};

/**
 * Broadcast storage update to other tabs
 */
export const broadcastStorageUpdate = (key: string, data: any) => {
  try {
    const channel = new BroadcastChannel("simulation_storage_sync");
    channel.postMessage({ key, data });
    setTimeout(() => channel.close(), 100); // Close after sending to avoid memory leaks
  } catch (error) {
    // Browser might not support BroadcastChannel
    console.warn("Error broadcasting update:", error);
  }
};

/**
 * Check if URL contains a reset parameter
 * Used to determine if we should reset the simulation progress
 * Only checks once per page load to prevent repeated resets on refresh
 */
export const hasResetParameter = (): boolean => {
  try {
    // Check if we've already processed this reset parameter
    if (sessionStorage.getItem('reset_parameter_processed') === 'true') {
      return false;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const hasReset = urlParams.get('reset') === '1';
    
    // If reset parameter is found, mark it as processed to prevent
    // repeated resets on page refresh
    if (hasReset) {
      sessionStorage.setItem('reset_parameter_processed', 'true');
      console.log("Reset parameter found and marked as processed");
    }
    
    return hasReset;
  } catch (error) {
    console.warn("Error checking reset parameter:", error);
    return false;
  }
};

/**
 * Migrate data structure to current version if needed
 * @param data The data object to migrate
 * @returns Migrated data object
 */
export const migrateProgressData = (data: any) => {
  if (!data) return data;
  
  // Clone to avoid mutation
  const migratedData = { ...data };
  
  // Add version if not present
  if (!migratedData.version) {
    migratedData.version = CURRENT_DATA_VERSION;
  }
  
  // Legacy structure migrations
  if (migratedData.currentIndex !== undefined && migratedData.currentQuestionIndex === undefined) {
    migratedData.currentQuestionIndex = migratedData.currentIndex;
    delete migratedData.currentIndex;
  }
  
  // Ensure we have the basic required fields
  if (migratedData.totalQuestions === undefined && Array.isArray(migratedData.userAnswers)) {
    migratedData.totalQuestions = migratedData.userAnswers.length;
  }
  
  // Add timestamp if not present
  if (!migratedData.timestamp) {
    migratedData.timestamp = new Date().toISOString();
  }
  
  // Add hasBeenSeen flag to distinguish first load
  if (migratedData.hasBeenSeen === undefined) {
    migratedData.hasBeenSeen = true;
  }
  
  return migratedData;
};

/**
 * Optimize storage by removing old or duplicate data
 * @returns true if optimization was successful, false if not
 */
export const optimizeStorage = (): boolean => {
  try {
    // Find old progress data (older than 30 days)
    const keysToRemove: string[] = [];
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    // Look for simulation progress keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (!key) continue;
      
      // Skip non-simulation keys
      if (!key.includes('progress') && !key.includes('simulation')) {
        continue;
      }
      
      try {
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        
        // Check timestamp (if available)
        if (data.timestamp) {
          const timestamp = new Date(data.timestamp).getTime();
          if (timestamp < thirtyDaysAgo) {
            keysToRemove.push(key);
            continue;
          }
        }
        
        // Check last saved time
        if (data.lastSaved) {
          const lastSaved = new Date(data.lastSaved).getTime();
          if (lastSaved < thirtyDaysAgo) {
            keysToRemove.push(key);
          }
        }
      } catch (parseError) {
        // If we can't parse it, it might be corrupted
        console.warn(`Removing corrupted storage item: ${key}`);
        keysToRemove.push(key);
      }
    }
    
    // Remove old data
    let freedSpace = 0;
    for (const key of keysToRemove) {
      try {
        const size = (localStorage.getItem(key) || "").length;
        localStorage.removeItem(key);
        freedSpace += size;
      } catch (error) {
        console.warn(`Error removing item ${key}:`, error);
      }
    }
    
    if (keysToRemove.length > 0) {
      console.log(`Cleaned up ${keysToRemove.length} old storage items, freeing ~${Math.round(freedSpace / 1024)}KB`);
    }
    
    return keysToRemove.length > 0;
  } catch (error) {
    console.error("Error optimizing storage:", error);
    return false;
  }
};

/**
 * Clean up old progress data to prevent conflicts
 */
export const cleanupOldProgress = () => {
  try {
    // Check for old-style progress keys
    const oldKey = 'simulation_progress';
    const oldProgressStr = localStorage.getItem(oldKey);
    
    if (oldProgressStr) {
      try {
        // Try to migrate old progress to new format
        const oldProgress = JSON.parse(oldProgressStr);
        
        if (oldProgress && oldProgress.topicId) {
          // Determine the right key based on data
          const newKey = `topic_progress_${oldProgress.topicId}`;
          
          // Only save if new key doesn't exist already
          if (!localStorage.getItem(newKey)) {
            localStorage.setItem(newKey, JSON.stringify({
              ...oldProgress,
              migratedFrom: 'legacy',
              timestamp: new Date().toISOString(),
              hasBeenSeen: true
            }));
            console.log(`Migrated legacy progress for topic ${oldProgress.topicId} to ${newKey}`);
          }
        }
        
        // Remove old key after migration
        localStorage.removeItem(oldKey);
        console.log("Removed legacy progress key after migration");
      } catch (error) {
        // Just remove corrupted data
        localStorage.removeItem(oldKey);
        console.warn("Removed corrupted legacy progress");
      }
    }
  } catch (error) {
    console.error("Error during old progress cleanup:", error);
  }
};

/**
 * Check if user made intentional reset request via URL or session storage
 * Checks only once per session to prevent repeated resets
 */
export const checkForResetRequest = (): boolean => {
  // Check if we've already processed a reset this session
  if (sessionStorage.getItem('reset_parameter_processed') === 'true') {
    return false;
  }
  
  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const urlReset = urlParams.get('reset') === '1';
  
  // Check session storage
  const sessionReset = window.sessionStorage.getItem('reset_simulation_progress') === 'true';
  
  // If either is true, mark as processed
  if (urlReset || sessionReset) {
    console.log("Reset requested - marking as processed");
    sessionStorage.setItem('reset_parameter_processed', 'true');
    
    if (sessionReset) {
      // Clean up the session storage flag
      window.sessionStorage.removeItem('reset_simulation_progress');
    }
    
    return true;
  }
  
  return false;
};

/**
 * Remove the reset parameter from the URL without page reload
 */
export const removeResetParameterFromUrl = () => {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('reset');
    
    // Update URL without reloading the page
    window.history.replaceState({}, document.title, url.toString());
  } catch (error) {
    console.warn("Error removing reset parameter from URL:", error);
  }
};

/**
 * Auto-saves simulation progress to localStorage and cloud
 * Sets up a timer to periodically save progress
 */
export const setupAutoSave = (
  saveFunction: () => void,
  intervalMs: number = 30000 // Default 30 seconds
): () => void => {
  // Create interval for auto-saving
  const intervalId = setInterval(() => {
    console.log("Auto-saving simulation progress...");
    saveFunction();
  }, intervalMs);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
  };
};

