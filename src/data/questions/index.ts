
// אינדקס מרכזי שמייבא את כל קבצי השאלות

import { Question } from '../types/questionTypes';
import { questions1to50 } from './questions1to50';
import { questions51to100 } from './questions51to100';
import { questions101to150 } from './questions101to150';
import { questions151to200 } from './questions151to200';
import { questions201to250 } from './questions201to250';
import { questions251to300 } from './questions251to300';
import { questions301to350 } from './questions301to350';
import { questions351to400 } from './questions351to400';
import { questions401to450 } from './questions401to450';
import { questions451to500 } from './questions451to500';
import { questions501to550 } from './questions501to550';
import { questions551to600 } from './questions551to600';
import { questions601to650 } from './questions601to650';
import { questions651to700 } from './questions651to700';
import { questions701to750 } from './questions701to750';
import { questions751to800 } from './questions751to800';
import { questions801to850 } from './questions801to850';
import { questions851to900 } from './questions851to900';
import { questions901to950 } from './questions901to950';
import { questions951to1000 } from './questions951to1000';

// מערך המאגד את כל השאלות מכל הקבצים
export const allQuestions: Question[] = [
  ...questions1to50,
  ...questions51to100,
  ...questions101to150,
  ...questions151to200,
  ...questions201to250,
  ...questions251to300,
  ...questions301to350,
  ...questions351to400,
  ...questions401to450,
  ...questions451to500,
  ...questions501to550,
  ...questions551to600,
  ...questions601to650,
  ...questions651to700,
  ...questions701to750,
  ...questions751to800,
  ...questions801to850,
  ...questions851to900,
  ...questions901to950,
  ...questions951to1000
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
