import { Question } from "@/data/types/questionTypes";
import { getQuestions, saveQuestions, initializeQuestions, refreshQuestionsFromStorage, reloadQuestionsFromSource } from "./questions/storage";

// Import organized question functions
import { 
  getReadingComprehensionQuestions,
  getRestatementQuestions,
  getSentenceCompletionQuestions,
  getVocabularyQuestions,
  getGrammarQuestions,
  getAvailableQuestionTypes,
  getQuestionTypeStats
} from "@/data/questions/by-type";

import {
  getEasyQuestions,
  getMediumQuestions,
  getHardQuestions,
  getAvailableDifficulties,
  getDifficultyStats,
  getMixedDifficultyQuestions
} from "@/data/questions/by-difficulty";

// Main API for questions service - ensures consistent access to questions data

/**
 * Get all questions from the system
 */
export const getAllQuestions = (): Question[] => {
  const questions = getQuestions();
  console.log('[DEBUG] getAllQuestions called, returning:', questions.length, 'questions');
  
  // Debug: show reading comprehension questions specifically
  const readingQuestions = questions.filter(q => q.type === 'reading-comprehension');
  console.log('[DEBUG] Reading comprehension questions:', readingQuestions.length);
  readingQuestions.forEach(q => {
    console.log(`[DEBUG] RC Question ${q.id}: "${q.passageTitle}" - hasPassageText: ${!!q.passageText}`);
  });
  
  // Debug: show sentence completion questions
  const sentenceCompletionQuestions = questions.filter(q => q.type === 'sentence-completion');
  console.log('[DEBUG] Sentence completion questions:', sentenceCompletionQuestions.length);
  
  // Debug: show restatement questions
  const restatementQuestions = questions.filter(q => q.type === 'restatement');
  console.log('[DEBUG] Restatement questions:', restatementQuestions.length);
  
  return questions;
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
 * Update a question
 */
export const updateQuestion = (updatedQuestion: Question): void => {
  const allQuestions = getQuestions();
  const index = allQuestions.findIndex(q => q.id === updatedQuestion.id);
  
  if (index !== -1) {
    allQuestions[index] = updatedQuestion;
    saveQuestions(allQuestions, true);
    console.log(`Updated question ${updatedQuestion.id}`);
  } else {
    console.error(`Question with id ${updatedQuestion.id} not found`);
  }
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

/**
 * Reset simulation - alias for resetSimulationProgress
 */
export const resetSimulation = resetSimulationProgress;

/**
 * Validate that a question has all required fields
 */
export const validateQuestion = (question: Question): boolean => {
  if (!question) return false;
  
  // Check required fields
  if (!question.id || !question.text || !question.type) return false;
  
  // Check options array
  if (!question.options || !Array.isArray(question.options) || question.options.length === 0) return false;
  
  // Check correctAnswer
  if (typeof question.correctAnswer !== 'number' || 
      question.correctAnswer < 0 || 
      question.correctAnswer >= question.options.length) return false;
  
  // Check that all options are non-empty strings
  if (question.options.some(option => !option || typeof option !== 'string')) return false;
  
  return true;
};

/**
 * Validate all questions and return report
 */
export const validateAllQuestions = (): { valid: number; invalid: Question[]; total: number } => {
  const allQuestions = getAllQuestions();
  const invalid: Question[] = [];
  let valid = 0;
  
  allQuestions.forEach(question => {
    if (validateQuestion(question)) {
      valid++;
    } else {
      invalid.push(question);
    }
  });
  
  return {
    valid,
    invalid,
    total: allQuestions.length
  };
};

// Export organized question access functions including new ones
export {
  getReadingComprehensionQuestions,
  getRestatementQuestions,
  getSentenceCompletionQuestions,
  getVocabularyQuestions,
  getGrammarQuestions,
  getAvailableQuestionTypes,
  getQuestionTypeStats,
  getEasyQuestions,
  getMediumQuestions,
  getHardQuestions,
  getAvailableDifficulties,
  getDifficultyStats,
  getMixedDifficultyQuestions
};
