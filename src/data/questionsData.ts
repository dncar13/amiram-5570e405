
import { Question } from './types/questionTypes';
import { allQuestions } from './questions/index';

// Re-export the Question type (using 'export type' for TypeScript isolatedModules)
export type { Question };

export const getQuestionsByTopic = (topicId: number): Question[] => {
  return questionsData.filter(question => question.topicId === topicId);
};

// New function to get questions by subtopic ID
export const getQuestionsBySubtopic = (subtopicId: number): Question[] => {
  return questionsData.filter(question => question.subtopicId === subtopicId);
};

/**
 * Returns questions by passage title
 */
export const getQuestionsByPassage = (passageTitle: string): Question[] => {
  return questionsData.filter(question => question.passageTitle === passageTitle);
};

/**
 * Returns all unique passages in the system
 */
export const getAllPassages = (): string[] => {
  const passages = questionsData
    .filter(q => q.passageTitle)
    .map(q => q.passageTitle!)
    .filter((title, index, array) => array.indexOf(title) === index);
  return passages;
};

/**
 * Returns questions with line numbers
 */
export const getQuestionsWithLineNumbers = (): Question[] => {
  return questionsData.filter(question => question.lineNumbers === true);
};

/**
 * Returns questions by type
 */
export const getQuestionsByType = (type: string): Question[] => {
  return questionsData.filter(question => 
    question.type === type || question.questionType === type
  );
};

/**
 * Returns questions by difficulty
 */
export const getQuestionsByDifficulty = (difficulty: string): Question[] => {
  return questionsData.filter(question => question.difficulty === difficulty);
};

// Include all questions from the updated index
export const questionsData: Question[] = allQuestions;
