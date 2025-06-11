
// אינדקס מרכזי שמייבא את כל קבצי השאלות
// מבנה חדש: ארגון לפי סוגי שאלות

import { Question } from '../types/questionTypes';
import { gigEconomyReadingQuestions } from './by-type/gigEconomyReadingQuestions';
import { technologyReadingQuestions } from './by-type/mediumTechnologyReadingQuestions';
import { environmentReadingQuestions } from './by-type/mediumEnvironmentReadingQuestions';
import { sentenceCompletionQuestionsWithMetadata } from './by-type/sentenceCompletionQuestions';
import { restatementQuestionsWithMetadata } from './by-type/restatementQuestionsNew';
import { vocabularyQuestions } from './by-type/vocabularyQuestions';

// Export individual question collections for use in questionsService
export { gigEconomyReadingQuestions };
export { technologyReadingQuestions };
export { environmentReadingQuestions };

// מערך המאגד את כל השאלות - כולל השאלות החדשות שלך
export const allQuestions: Question[] = [
  ...gigEconomyReadingQuestions,
  ...technologyReadingQuestions,
  ...environmentReadingQuestions,
  ...sentenceCompletionQuestionsWithMetadata,
  ...restatementQuestionsWithMetadata,
  ...vocabularyQuestions,
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

// הרץ בדיקה לכמות השאלות שנטענו
console.log(`[Questions] Total questions loaded: ${allQuestions.length}`);
console.log(`[Questions] Gig Economy questions loaded: ${gigEconomyReadingQuestions.length}`);
console.log(`[Questions] Technology questions loaded: ${technologyReadingQuestions.length}`);
console.log(`[Questions] Environment questions loaded: ${environmentReadingQuestions.length}`);
console.log(`[Questions] Sentence Completion questions loaded: ${sentenceCompletionQuestionsWithMetadata.length}`);
console.log(`[Questions] Restatement questions loaded: ${restatementQuestionsWithMetadata.length}`);
console.log(`[Questions] Vocabulary questions loaded: ${vocabularyQuestions.length}`);

// בדיקת שאלות הבנת הנקרא עם קטעים
const readingQuestionsWithPassages = allQuestions.filter(q => 
  q.type === 'reading-comprehension' && (q.passageText || q.passageWithLines)
);
console.log(`[Questions] Reading comprehension questions with passages: ${readingQuestionsWithPassages.length}`);

// בדיקת שאלות sentence completion
const sentenceCompletionCount = allQuestions.filter(q => q.type === 'sentence-completion').length;
console.log(`[Questions] Sentence completion questions: ${sentenceCompletionCount}`);

// בדיקת שאלות restatement
const restatementCount = allQuestions.filter(q => q.type === 'restatement').length;
console.log(`[Questions] Restatement questions: ${restatementCount}`);
