
/**
 * אינדקס לשאלות מסווגות לפי סוג
 * מאפשר גישה מהירה לשאלות לפי קטגורית התוכן
 * עודכן להכיל רק את 3 קבצי השאלות הפעילים
 */

import { Question } from '../../types/questionTypes';
import { allQuestions } from '../index';

/**
 * מחזיר שאלות מסוג reading comprehension
 * כולל רק שאלות מ-3 הקבצים הפעילים
 */
export const getReadingComprehensionQuestions = (): Question[] => {
  const questions = allQuestions.filter(q => q.type === 'reading-comprehension');
  
  console.log(`[getReadingComprehensionQuestions] Found ${questions.length} reading comprehension questions`);
  questions.forEach(q => {
    console.log(`Question ${q.id}: hasPassageText=${!!q.passageText}, hasPassageWithLines=${!!(q.passageWithLines && q.passageWithLines.length > 0)}, hasPassageTitle=${!!q.passageTitle}`);
  });
  
  return questions;
};

/**
 * מחזיר שאלות מסוג restatement
 */
export const getRestatementQuestions = (): Question[] => {
  return allQuestions.filter(q => q.type === 'restatement');
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
