import { Question } from "@/data/types/questionTypes";
import { allQuestions } from "@/data/questions";

// Constants
const QUESTIONS_STORAGE_KEY = 'savedQuestions';
const SAVE_THROTTLE_MS = 1000; // 1 second throttle for writes

// In-memory cache
let cachedQuestions: Question[] = [];
let lastSaveTimestamp = 0;
let saveTimeout: ReturnType<typeof setTimeout> | null = null;
let isInitialized = false;

/**
 * Initialize questions from storage or defaults
 */
export const initializeQuestions = (): Question[] => {
  if (isInitialized) {
    return cachedQuestions;
  }

  try {
    // Always start with the source questions to ensure consistency
    cachedQuestions = [...allQuestions];
    
    // Force save to localStorage to ensure the new questions are persisted
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(cachedQuestions));
    console.log("Loaded and saved updated questions:", cachedQuestions.length);
    
    // Debug: Log breakdown by type
    const sentenceCompletionCount = cachedQuestions.filter(q => q.type === 'sentence-completion').length;
    const restatementCount = cachedQuestions.filter(q => q.type === 'restatement').length;
    const readingComprehensionCount = cachedQuestions.filter(q => q.type === 'reading-comprehension').length;
    
    console.log(`[Storage Init] Sentence completion: ${sentenceCompletionCount}`);
    console.log(`[Storage Init] Restatement: ${restatementCount}`);
    console.log(`[Storage Init] Reading comprehension: ${readingComprehensionCount}`);
    console.log(`[Storage Init] Total questions: ${cachedQuestions.length}`);
    
  } catch (error) {
    console.error("Error initializing questions:", error);
    cachedQuestions = [...allQuestions];
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(cachedQuestions));
    console.log("Using default questions due to error and saving them:", allQuestions.length);
  }
  
  isInitialized = true;
  return cachedQuestions;
};

/**
 * Get questions from cache or storage
 */
export const getQuestions = (): Question[] => {
  if (!isInitialized) {
    return initializeQuestions();
  }
  return [...cachedQuestions];
};

/**
 * Save questions to storage with throttling
 */
export const saveQuestions = (questions: Question[], immediate = false): void => {
  // Update in-memory cache immediately
  cachedQuestions = [...questions];
  
  // Clear any pending save
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }

  const now = Date.now();
  const timeSinceLastSave = now - lastSaveTimestamp;

  // If immediate or time since last save > throttle time, save immediately
  if (immediate || timeSinceLastSave >= SAVE_THROTTLE_MS) {
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
    lastSaveTimestamp = now;
    console.log(`Saved ${questions.length} questions to localStorage (immediate: ${immediate})`);
  } else {
    // Otherwise, throttle the save
    const delay = SAVE_THROTTLE_MS - timeSinceLastSave;
    saveTimeout = setTimeout(() => {
      localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(cachedQuestions));
      lastSaveTimestamp = Date.now();
      saveTimeout = null;
      console.log(`Saved ${cachedQuestions.length} questions to localStorage (throttled)`);
    }, delay);
  }
};

/**
 * Force refresh questions from storage - always reload from source
 */
export const refreshQuestionsFromStorage = (): Question[] => {
  try {
    // Always reload from the source files to get the latest questions
    cachedQuestions = [...allQuestions];
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(cachedQuestions));
    console.log("Force refreshed questions from source files:", allQuestions.length);
    
    // Debug: Log breakdown by type
    const sentenceCompletionCount = cachedQuestions.filter(q => q.type === 'sentence-completion').length;
    const restatementCount = cachedQuestions.filter(q => q.type === 'restatement').length;
    const readingComprehensionCount = cachedQuestions.filter(q => q.type === 'reading-comprehension').length;
    
    console.log(`[Storage Refresh] Sentence completion: ${sentenceCompletionCount}`);
    console.log(`[Storage Refresh] Restatement: ${restatementCount}`);
    console.log(`[Storage Refresh] Reading comprehension: ${readingComprehensionCount}`);
    
  } catch (error) {
    console.error("Error force refreshing questions:", error);
    cachedQuestions = [...allQuestions];
    console.log("Error occurred, reloading questions from source files:", allQuestions.length);
  }
  
  isInitialized = true;
  return [...cachedQuestions];
};

/**
 * Reset all cached questions and reload from source files
 */
export const reloadQuestionsFromSource = (): Question[] => {
  // Clear the localStorage entry to force a fresh load from source
  localStorage.removeItem(QUESTIONS_STORAGE_KEY);
  console.log("Cleared questions from localStorage, will reload from source");
  
  // Reset initialization flag
  isInitialized = false;
  
  // Re-initialize questions from source files
  cachedQuestions = [...allQuestions];
  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(cachedQuestions));
  console.log("Reloaded questions from source files:", allQuestions.length);
  
  isInitialized = true;
  return [...cachedQuestions];
};

// Initialize questions on module load
initializeQuestions();
