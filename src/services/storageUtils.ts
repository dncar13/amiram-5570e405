// Storage utility functions for managing browser storage
import { SimulationProgress } from "./simulationStorage";

/**
 * Storage optimization utilities
 */
export const optimizeStorage = (): void => {
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && shouldCleanUpKey(key)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing key ${key}:`, error);
      }
    });
    
    console.log(`Cleaned up ${keysToRemove.length} storage items`);
  } catch (error) {
    console.error("Error optimizing storage:", error);
  }
};

const shouldCleanUpKey = (key: string): boolean => {
  // Clean up old or invalid keys
  if (key.startsWith('temp_') || key.startsWith('cache_')) {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const data = JSON.parse(item);
        if (data.timestamp && Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
          return true; // Remove items older than 24 hours
        }
      }
    } catch {
      return true; // Remove invalid JSON
    }
  }
  return false;
};

export const cleanupOldProgress = (): void => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 days ago
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('progress_')) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const data = JSON.parse(item) as Record<string, unknown>;
            if (data.lastSaved && new Date(data.lastSaved as string) < cutoffDate) {
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          console.error(`Error processing key ${key}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error cleaning up old progress:", error);
  }
};

export const getStorageSize = (): { used: number; available: number } => {
  try {
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const item = localStorage.getItem(key);
        if (item) {
          used += key.length + item.length;
        }
      }
    }
    
    // Estimate available space (most browsers limit to ~5-10MB)
    const estimated = 5 * 1024 * 1024; // 5MB estimate
    
    return {
      used,
      available: Math.max(0, estimated - used)
    };
  } catch (error) {
    console.error("Error calculating storage size:", error);
    return { used: 0, available: 0 };
  }
};

export const checkForResetRequest = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('reset') && urlParams.get('reset') === 'true';
};

export const removeResetParameterFromUrl = (): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete('reset');
  window.history.replaceState({}, document.title, url.toString());
};

export const setupAutoSave = (saveFunction: () => void, interval: number = 30000): (() => void) => {
  const autoSaveInterval = setInterval(saveFunction, interval);
  
  return () => {
    clearInterval(autoSaveInterval);
  };
};

export const createStorageKey = (prefix: string, identifier: string | number): string => {
  return `${prefix}_${identifier}`;
};

export const parseStorageData = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item) as T;
    }
    return fallback;
  } catch (error) {
    console.error(`Error parsing storage data for key ${key}:`, error);
    return fallback;
  }
};

export const setStorageData = (key: string, data: unknown): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error setting storage data for key ${key}:`, error);
    return false;
  }
};
