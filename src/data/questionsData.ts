
import { Question } from './types/questionTypes';
import { questions1to50 } from './questions/questions1to50';

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

// Only include the 10 new AMIRAM questions
export const questionsData: Question[] = [
  ...questions1to50
];
