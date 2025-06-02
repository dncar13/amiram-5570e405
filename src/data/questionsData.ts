
import { Question } from './types/questionTypes';
import { allQuestions } from './questions/index';

// ייצוא מחדש של סוג השאלה
export type { Question };

// השתמש ישירות ב-allQuestions מהמקור, ללא יצירת עותק נוסף
export const questionsData: Question[] = allQuestions;

/**
 * מחזיר שאלות לפי נושא מסוים
 */
export const getQuestionsByTopic = (topicId: number): Question[] => {
  console.log(`Looking for questions with topicId: ${topicId}`);
  console.log(`Available questions: ${questionsData.length}`);
  
  const filtered = questionsData.filter(question => {
    console.log(`Question ${question.id}: topicId=${question.topicId}, type=${question.type}`);
    return question.topicId === topicId;
  });
  
  console.log(`Found ${filtered.length} questions for topic ${topicId}`);
  return filtered;
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
  console.log(`Looking for questions with type: ${type}`);
  console.log(`Available questions: ${questionsData.length}`);
  
  const filtered = questionsData.filter(question => {
    console.log(`Question ${question.id}: type=${question.type}`);
    return question.type === type;
  });
  
  console.log(`Found ${filtered.length} questions for type ${type}`);
  return filtered;
};

/**
 * מחזיר שאלות לפי רמת קושי
 */
export const getQuestionsByDifficulty = (difficulty: string): Question[] => {
  return questionsData.filter(question => question.difficulty === difficulty);
};
