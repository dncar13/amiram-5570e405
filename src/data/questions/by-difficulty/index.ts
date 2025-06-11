
/**
 * אינדקס לשאלות מסווגות לפי רמת קושי
 * מאפשר גישה מהירה לשאלות לפי עוצמת הקושי
 */

import { Question } from '../../types/questionTypes';
import { allQuestions } from '../index';

/**
 * מחזיר שאלות קלות
 */
export const getEasyQuestions = (): Question[] => {
  const questions = allQuestions.filter(q => q.difficulty === 'easy');
  console.log(`[getEasyQuestions] Found ${questions.length} easy questions`);
  return questions;
};

/**
 * מחזיר שאלות בינוניות
 */
export const getMediumQuestions = (): Question[] => {
  const questions = allQuestions.filter(q => q.difficulty === 'medium');
  console.log(`[getMediumQuestions] Found ${questions.length} medium questions`);
  return questions;
};

/**
 * מחזיר שאלות קשות
 */
export const getHardQuestions = (): Question[] => {
  const questions = allQuestions.filter(q => q.difficulty === 'hard');
  console.log(`[getHardQuestions] Found ${questions.length} hard questions`);
  return questions;
};

/**
 * מחזיר שאלות מעורבות לפי רמת קושי
 */
export const getMixedDifficultyQuestions = (difficulty: 'easy' | 'medium' | 'hard'): Question[] => {
  const questions = allQuestions.filter(q => q.difficulty === difficulty);
  console.log(`[getMixedDifficultyQuestions] Found ${questions.length} ${difficulty} questions`);
  return questions;
};

/**
 * מחזיר רשימה של כל רמות הקושי הזמינות
 */
export const getAvailableDifficulties = (): string[] => {
  const difficulties = allQuestions.map(q => q.difficulty).filter(Boolean);
  return [...new Set(difficulties)];
};

/**
 * מחזיר סטטיסטיקות על חלוקת השאלות לפי רמת קושי
 */
export const getDifficultyStats = (): Record<string, number> => {
  const stats: Record<string, number> = {};
  
  allQuestions.forEach(question => {
    if (question.difficulty) {
      stats[question.difficulty] = (stats[question.difficulty] || 0) + 1;
    }
  });
  
  return stats;
};
