
import { Question } from "@/data/types/questionTypes";
import { 
  gigEconomyReadingQuestions, 
  technologyReadingQuestions, 
  environmentReadingQuestions,
  getAllQuestions as getAllQuestionsFromIndex
} from "@/data/questions/index";
import { vocabularyQuestions } from "@/data/questions/by-type/vocabularyQuestions";

import { 
  sentenceCompletionQuestionsWithMetadata as sentenceCompletionQuestions 
} from "@/data/questions/by-type/sentenceCompletionQuestions";

import { 
  restatementQuestionsWithMetadata as restatementQuestions 
} from "@/data/questions/by-type/restatementQuestionsNew";

// Re-export functions from questions/index
export {
  refreshQuestionsFromStorage,
  initializeQuestions,
  getSimulationProgress,
  saveSimulationProgress,
  resetSimulation,
  onProgressChange,
  getProgressKey,
  type SimulationProgress
} from "@/services/questions";

/**
 * מחזיר את כל השאלות במערכת
 */
export const getAllQuestions = (): Question[] => {
  return getAllQuestionsFromIndex();
};

/**
 * מחזיר שאלות לפי נושא מסוים
 */
export const getQuestionsByTopic = (topicId: number): Question[] => {
  const allQuestions = getAllQuestions();
  return allQuestions.filter(question => question.topicId === topicId);
};

/**
 * מחזיר שאלות לפי סט שאלות (לפי מספר סט)
 */
export const getQuestionsBySet = (setId: number): Question[] => {
  const allQuestions = getAllQuestions();
  // חישוב טווח השאלות בסט
  const startId = (setId - 1) * 50 + 1;
  const endId = setId * 50;
  
  // החזר שאלות שה-ID שלהן נמצא בטווח המתאים
  return allQuestions.filter(
    question => question.id >= startId && question.id <= endId
  );
};

/**
 * מחזיר שאלות קריאה לפי רמת קושי
 */
export const getEasyQuestions = (): Question[] => {
  return gigEconomyReadingQuestions.filter(q => q.difficulty === 'easy');
};

/**
 * מחזיר שאלות קריאה בינוניות
 */
export const getMediumQuestions = (): Question[] => {
  return technologyReadingQuestions.filter(q => q.difficulty === 'medium');
};

/**
 * מחזיר שאלות קשות
 */
export const getHardQuestions = (): Question[] => {
  return environmentReadingQuestions.filter(q => q.difficulty === 'hard');
};

/**
 * מחזיר שאלות קריאה מעורבות לפי רמת קושי
 */
export const getMixedDifficultyQuestions = (difficulty: 'easy' | 'medium' | 'hard'): Question[] => {
  let questions: Question[] = [];
  
  if (difficulty === 'easy') {
    questions = gigEconomyReadingQuestions.filter(q => q.difficulty === 'easy');
  } else if (difficulty === 'medium') {
    questions = technologyReadingQuestions.filter(q => q.difficulty === 'medium');
  } else if (difficulty === 'hard') {
    questions = environmentReadingQuestions.filter(q => q.difficulty === 'hard');
  }
  
  console.log(`Found ${questions.length} mixed difficulty questions for ${difficulty}`);
  return questions;
};

/**
 * מחזיר שאלות אוצר מילים
 */
export const getVocabularyQuestions = (): Question[] => {
  return vocabularyQuestions;
};

/**
 * מחזיר שאלות השלמת משפטים לפי רמת קושי
 */
export const getSentenceCompletionQuestions = (difficulty?: 'easy' | 'medium' | 'hard'): Question[] => {
  const questions = sentenceCompletionQuestions.filter(q => q.type === 'sentence-completion');
  
  if (difficulty) {
    return questions.filter(q => q.difficulty === difficulty);
  }
  
  console.log(`[getSentenceCompletionQuestions] Found ${questions.length} sentence completion questions`);
  return questions;
};

/**
 * מחזיר שאלות ניסוח מחדש לפי רמת קושי
 */
export const getRestatementQuestions = (): Question[] => {
  const questions = restatementQuestions.filter(q => q.type === 'restatement');
  console.log(`[getRestatementQuestions] Found ${questions.length} restatement questions`);
  return questions;
};

/**
 * מחזיר שאלות הבנת הנקרא
 */
export const getReadingComprehensionQuestions = (): Question[] => {
  const allQuestions = getAllQuestions();
  return allQuestions.filter(q => q.type === 'reading-comprehension');
};

/**
 * מחזיר שאלות לפי רמת קושי וסוג
 */
export const getQuestionsByDifficultyAndType = (difficulty: string, type: string): Question[] => {
  console.log(`Getting questions for difficulty: ${difficulty}, type: ${type}`);
  
  let questions: Question[] = [];
  
  if (type === 'sentence-completion') {
    questions = getSentenceCompletionQuestions(difficulty as 'easy' | 'medium' | 'hard');
  } else if (type === 'restatement') {
    questions = getRestatementQuestions().filter(q => q.difficulty === difficulty);
  } else if (type === 'vocabulary') {
    questions = getVocabularyQuestions().filter(q => q.difficulty === difficulty);
  }
  
  console.log(`Found ${questions.length} questions for ${difficulty} ${type}`);
  return questions;
};
