/**
 * אינדקס לשאלות מסווגות לפי רמת קושי
 * מאפשר גישה מהירה לשאלות לפי רמת הקושי הנדרשת
 */

import { Question } from '../../types/questionTypes';
import { allQuestions } from '../index';

/**
 * מחזיר שאלות ברמת קושי קלה
 */
export const getEasyQuestions = (): Question[] => {
  return allQuestions.filter(q => q.difficulty === 'easy');
};

/**
 * מחזיר שאלות ברמת קושי בינונית
 */
export const getMediumQuestions = (): Question[] => {
  return allQuestions.filter(q => q.difficulty === 'medium');
};

/**
 * מחזיר שאלות ברמת קושי קשה
 */
export const getHardQuestions = (): Question[] => {
  return allQuestions.filter(q => q.difficulty === 'hard');
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

/**
 * מחזיר שאלות מעורבות מכל רמות הקושי
 * @param count מספר השאלות הכולל
 * @param distribution חלוקה יחסית [easy%, medium%, hard%] (סה"כ 100)
 */
export const getMixedDifficultyQuestions = (
  count: number, 
  distribution: [number, number, number] = [30, 50, 20]
): Question[] => {
  const [easyPercent, mediumPercent, hardPercent] = distribution;
  
  const easyCount = Math.floor((count * easyPercent) / 100);
  const mediumCount = Math.floor((count * mediumPercent) / 100);
  const hardCount = count - easyCount - mediumCount; // השאר
  
  const easyQuestions = getEasyQuestions().slice(0, easyCount);
  const mediumQuestions = getMediumQuestions().slice(0, mediumCount);
  const hardQuestions = getHardQuestions().slice(0, hardCount);
  
  // ערבוב השאלות
  const mixed = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
  return mixed.sort(() => Math.random() - 0.5);
};
