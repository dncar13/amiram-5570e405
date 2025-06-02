import { Question } from './types/questionTypes';
import { allQuestions } from './questions/index';

// ייצוא מחדש של סוג השאלה
export type { Question };

// השתמש ישירות ב-allQuestions מהמקור, ללא יצירת עותק נוסף
export const questionsData: Question[] = allQuestions;

// DEPRECATED: Use questionsService.ts functions instead
// The functions below are kept for backward compatibility only
// All new code should use the questionsService.ts module

/**
 * מחזיר שאלות לפי נושא מסוים
 */
export const getQuestionsByTopic = (topicId: number): Question[] => {
  return questionsData.filter(question => question.topicId === topicId);
};

/**
 * מחזיר שאלות לפי תת-נושא
 */
export const getQuestionsBySubtopic = (subtopicId: number): Question[] => {
  return questionsData.filter(question => question.subtopicId === subtopicId);
};

/**
 * מחזיר שאלות לפי כותרת קטע
 */
export const getQuestionsByPassage = (passageTitle: string): Question[] => {
  return questionsData.filter(question => question.passageTitle === passageTitle);
};

/**
 * מחזיר את כל הקטעים הייחודיים במערכת
 */
export const getAllPassages = (): string[] => {
  const passages = questionsData
    .filter(q => q.passageTitle)
    .map(q => q.passageTitle!)
    .filter((title, index, array) => array.indexOf(title) === index);
  return passages;
};

/**
 * מחזיר שאלות עם מספור שורות
 */
export const getQuestionsWithLineNumbers = (): Question[] => {
  return questionsData.filter(question => question.lineNumbers === true);
};

/**
 * מחזיר שאלות לפי סוג - שימוש בשדה 'type' המאוחד
 */
export const getQuestionsByType = (type: string): Question[] => {
  return questionsData.filter(question => question.type === type);
};

/**
 * מחזיר שאלות לפי רמת קושי
 */
export const getQuestionsByDifficulty = (difficulty: string): Question[] => {
  return questionsData.filter(question => question.difficulty === difficulty);
};
