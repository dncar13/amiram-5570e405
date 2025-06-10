
/**
 * אינדקס לשאלות מסווגות לפי סוג
 * מאפשר גישה מהירה לשאלות לפי קטגורית התוכן
 */

import { Question } from '../../types/questionTypes';
import { allQuestions } from '../index';
import { mediumQuestions } from "../reading-comprehension/medium";

// Reading Comprehension Questions
export const getReadingComprehensionQuestions = () => {
  console.log('[DEBUG] Loading reading comprehension questions from organized structure');
  return mediumQuestions;
};

/**
 * מחזיר שאלות מסוג restatement
 */
export const getRestatementQuestions = () => {
  return [];
};

/**
 * מחזיר שאלות מסוג vocabulary
 */
export const getVocabularyQuestions = () => {
  return [];
};

/**
 * מחזיר שאלות מסוג grammar
 */
export const getGrammarQuestions = () => {
  return [];
};

/**
 * מחזיר רשימה של כל סוגי השאלות הזמינים
 */
export const getAvailableQuestionTypes = () => {
  return ['reading-comprehension', 'restatement', 'vocabulary', 'grammar'];
};

/**
 * מחזיר סטטיסטיקות על חלוקת השאלות לפי סוג
 */
export const getQuestionTypeStats = () => {
  const readingQuestions = getReadingComprehensionQuestions();
  
  return {
    'reading-comprehension': readingQuestions.length,
    'restatement': 0,
    'vocabulary': 0,
    'grammar': 0
  };
};
