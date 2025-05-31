
import { Question } from './types/questionTypes';
import { questions1to50 } from './questions/questions1to50';
import { questions51to100 } from './questions/questions51to100';

// Re-export the Question type (using 'export type' for TypeScript isolatedModules)
export type { Question };

export const getQuestionsByTopic = (topicId: number): Question[] => {
  return questionsData.filter(question => question.topicId === topicId);
};

// New function to get questions by subtopic ID
export const getQuestionsBySubtopic = (subtopicId: number): Question[] => {
  // For now, assuming subtopicId might be stored in a future field
  // This will need to be updated when subtopic information is added to questions
  // Currently we'll return an empty array since subtopics aren't yet implemented in the questions data
  return [];
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

// Include both the original 10 questions and the new extended reading questions
export const questionsData: Question[] = [
  ...questions1to50,
  ...questions51to100
];
