
// אינדקס מרכזי שמייבא את כל קבצי השאלות

import { Question } from '../types/questionTypes';
import { questions1to50 } from './questions1to50';
import { questions51to100 } from './questions51to100';
import { convertedQuestions } from './newQuestions';

// מערך המאגד את כל השאלות מכל הקבצים - מוסיף את השאלות החדשות
export const allQuestions: Question[] = [
  ...questions1to50,
  ...questions51to100,
  ...convertedQuestions
];

// פונקציות עזר לקבלת שאלות

/**
 * מחזיר את כל השאלות במערכת
 */
export const getAllQuestions = (): Question[] => {
  return allQuestions;
};

/**
 * מחזיר שאלות לפי נושא מסוים
 */
export const getQuestionsByTopic = (topicId: number): Question[] => {
  return allQuestions.filter(question => question.topicId === topicId);
};

/**
 * מחזיר שאלות לפי תת-נושא
 */
export const getQuestionsBySubtopic = (subtopicId: number): Question[] => {
  return allQuestions.filter(question => question.subtopicId === subtopicId);
};

/**
 * מחזיר שאלה לפי מזהה
 */
export const getQuestionById = (id: number): Question | undefined => {
  return allQuestions.find(question => question.id === id);
};

/**
 * מחזיר שאלות לפי סוג שאלה
 */
export const getQuestionsByType = (type: string): Question[] => {
  return allQuestions.filter(question => question.type === type);
};

/**
 * מחזיר שאלות לפי רמת קושי
 */
export const getQuestionsByDifficulty = (difficulty: string): Question[] => {
  return allQuestions.filter(question => question.difficulty === difficulty);
};

/**
 * מחזיר שאלות לפי סט שאלות (לפי מספר סט)
 */
export const getQuestionsBySet = (setId: number): Question[] => {
  // חישוב טווח השאלות בסט
  const startId = (setId - 1) * 50 + 1;
  const endId = setId * 50;
  
  // החזר שאלות שה-ID שלהן נמצא בטווח המתאים
  return allQuestions.filter(
    question => question.id >= startId && question.id <= endId
  );
};

/**
 * מחזיר את מספר השאלות בסט מסוים
 */
export const getQuestionSetCount = (setId: number): number => {
  return getQuestionsBySet(setId).length;
};

/**
 * מחזיר שאלות לפי קטע קריאה מסוים
 */
export const getQuestionsByPassage = (passageTitle: string): Question[] => {
  return allQuestions.filter(question => question.passageTitle === passageTitle);
};

/**
 * מחזיר את כל הקטעים הייחודיים במערכת
 */
export const getAllPassages = (): string[] => {
  const passages = allQuestions
    .filter(q => q.passageTitle)
    .map(q => q.passageTitle!)
    .filter((title, index, array) => array.indexOf(title) === index);
  return passages;
};

/**
 * מחזיר שאלות עם מספור שורות
 */
export const getQuestionsWithLineNumbers = (): Question[] => {
  return allQuestions.filter(question => question.lineNumbers === true);
};
