
/**
 * אינדקס לשאלות מסווגות לפי סוג
 * מאפשר גישה מהירה לשאלות לפי קטגורית התוכן
 */

import { Question } from '../../types/questionTypes';
import { allQuestions } from '../index';

/**
 * מחזיר שאלות מסוג reading comprehension
 */
export const getReadingComprehensionQuestions = (): Question[] => {
  const questions = allQuestions.filter(q => q.type === 'reading-comprehension');
  console.log(`[getReadingComprehensionQuestions] Found ${questions.length} reading comprehension questions`);
  questions.forEach(q => {
    console.log(`Question ${q.id}: hasPassageText=${!!q.passageText}, hasPassageWithLines=${!!(q.passageWithLines && q.passageWithLines.length > 0)}`);
  });
  return questions;
};

/**
 * מחזיר שאלות מסוג sentence completion
 */
export const getSentenceCompletionQuestions = (): Question[] => {
  const questions = allQuestions.filter(q => q.type === 'sentence-completion');
  console.log(`[getSentenceCompletionQuestions] Found ${questions.length} sentence completion questions`);
  return questions;
};

/**
 * מחזיר שאלות מסוג restatement
 */
export const getRestatementQuestions = (): Question[] => {
  const questions = allQuestions.filter(q => q.type === 'restatement');
  console.log(`[getRestatementQuestions] Found ${questions.length} restatement questions`);
  return questions;
};

/**
 * מחזיר שאלות מסוג vocabulary
 */
export const getVocabularyQuestions = (): Question[] => {
  return allQuestions.filter(q => q.type === 'vocabulary');
};

/**
 * מחזיר שאלות מסוג grammar
 */
export const getGrammarQuestions = (): Question[] => {
  return allQuestions.filter(q => q.type === 'grammar');
};

/**
 * מחזיר רשימה של כל סוגי השאלות הזמינים
 */
export const getAvailableQuestionTypes = (): string[] => {
  const types = allQuestions.map(q => q.type).filter(Boolean);
  return [...new Set(types)];
};

/**
 * מחזיר סטטיסטיקות על חלוקת השאלות לפי סוג
 */
export const getQuestionTypeStats = (): Record<string, number> => {
  const stats: Record<string, number> = {};
  
  allQuestions.forEach(question => {
    if (question.type) {
      stats[question.type] = (stats[question.type] || 0) + 1;
    }
  });
  
  return stats;
};
