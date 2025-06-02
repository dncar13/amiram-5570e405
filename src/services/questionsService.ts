
import { Question } from "@/data/types/questionTypes";
import { getQuestions, saveQuestions, initializeQuestions, refreshQuestionsFromStorage, reloadQuestionsFromSource } from "./questions/storage";

// Main API for questions service - ensures consistent access to questions data

/**
 * Get all questions from the system
 */
export const getAllQuestions = (): Question[] => {
  return getQuestions();
};

/**
 * Get questions filtered by topic ID
 */
export const getQuestionsByTopic = (topicId: number): Question[] => {
  const allQuestions = getQuestions();
  return allQuestions.filter(question => question.topicId === topicId);
};

/**
 * Get questions by subtopic ID
 */
export const getQuestionsBySubtopic = (subtopicId: number): Question[] => {
  const allQuestions = getQuestions();
  return allQuestions.filter(question => question.subtopicId === subtopicId);
};

/**
 * Get a specific question by ID
 */
export const getQuestionById = (id: number): Question | undefined => {
  const allQuestions = getQuestions();
  return allQuestions.find(question => question.id === id);
};

/**
 * Get questions by type
 */
export const getQuestionsByType = (type: string): Question[] => {
  const allQuestions = getQuestions();
  return allQuestions.filter(question => question.type === type);
};

/**
 * Get questions by difficulty
 */
export const getQuestionsByDifficulty = (difficulty: string): Question[] => {
  const allQuestions = getQuestions();
  return allQuestions.filter(question => question.difficulty === difficulty);
};

/**
 * Get questions by question set (50 questions per set)
 */
export const getQuestionsBySet = (setId: number): Question[] => {
  const startId = (setId - 1) * 50 + 1;
  const endId = setId * 50;
  
  const allQuestions = getQuestions();
  return allQuestions.filter(question => question.id >= startId && question.id <= endId);
};

/**
 * Save questions to storage
 */
export const saveQuestionsToStorage = (questions: Question[]): void => {
  saveQuestions(questions, true);
};

/**
 * Initialize questions system
 */
export const initQuestions = (): Question[] => {
  return initializeQuestions();
};

/**
 * Refresh questions from storage
 */
export { refreshQuestionsFromStorage };

/**
 * Reload questions from source files
 */
export { reloadQuestionsFromSource };

// Simulation Progress Functions
export interface SimulationProgress {
  currentQuestionIndex: number;
  totalQuestions: number;
  userAnswers: Record<number, number>;
  questionFlags: Record<number, boolean>;
  score: number;
  timeStarted: number;
  lastUpdated: number;
}

/**
 * Get simulation progress for a topic
 */
export const getSimulationProgress = (topicId: number): SimulationProgress | null => {
  try {
    const progressKey = `topic_${topicId}_progress`;
    const saved = localStorage.getItem(progressKey);
    
    if (saved) {
      const progress = JSON.parse(saved);
      console.log(`Loaded simulation progress for topic ${topicId}:`, progress);
      return progress;
    }
    
    return null;
  } catch (error) {
    console.error(`Error loading simulation progress for topic ${topicId}:`, error);
    return null;
  }
};

/**
 * Save simulation progress for a topic
 */
export const saveSimulationProgress = (topicId: number, progress: SimulationProgress): void => {
  try {
    const progressKey = `topic_${topicId}_progress`;
    progress.lastUpdated = Date.now();
    localStorage.setItem(progressKey, JSON.stringify(progress));
    console.log(`Saved simulation progress for topic ${topicId}:`, progress);
  } catch (error) {
    console.error(`Error saving simulation progress for topic ${topicId}:`, error);
  }
};

/**
 * Reset simulation progress for a topic
 */
export const resetSimulationProgress = (topicId: number): void => {
  try {
    const progressKey = `topic_${topicId}_progress`;
    localStorage.removeItem(progressKey);
    console.log(`Reset simulation progress for topic ${topicId}`);
  } catch (error) {
    console.error(`Error resetting simulation progress for topic ${topicId}:`, error);
  }
};
