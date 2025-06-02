
import { Question } from "@/data/types/questionTypes";
import { allQuestions } from "@/data/questions";

/**
 * Get all questions from the system
 */
export const getAllQuestions = (): Question[] => {
  return allQuestions;
};

/**
 * Get questions by topic ID
 */
export const getQuestionsByTopic = (topicId: number): Question[] => {
  return allQuestions.filter(question => question.topicId === topicId);
};

/**
 * Get questions by question type
 */
export const getQuestionsByType = (type: string): Question[] => {
  return allQuestions.filter(question => 
    question.type === type || question.questionType === type
  );
};

/**
 * Get questions by difficulty level
 */
export const getQuestionsByDifficulty = (difficulty: string): Question[] => {
  return allQuestions.filter(question => question.difficulty === difficulty);
};

/**
 * Get questions by both type and difficulty
 */
export const getQuestionsByTypeAndDifficulty = (
  type: string, 
  difficulty: string
): Question[] => {
  return allQuestions.filter(question => 
    (question.type === type || question.questionType === type) && 
    question.difficulty === difficulty
  );
};

/**
 * Get a random set of questions
 */
export const getRandomQuestions = (count: number, filters?: {
  type?: string;
  difficulty?: string;
  topicId?: number;
}): Question[] => {
  let filteredQuestions = allQuestions;
  
  if (filters?.type) {
    filteredQuestions = filteredQuestions.filter(q => 
      q.type === filters.type || q.questionType === filters.type
    );
  }
  
  if (filters?.difficulty) {
    filteredQuestions = filteredQuestions.filter(q => 
      q.difficulty === filters.difficulty
    );
  }
  
  if (filters?.topicId) {
    filteredQuestions = filteredQuestions.filter(q => 
      q.topicId === filters.topicId
    );
  }
  
  // Shuffle and take the requested number
  const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

/**
 * Get question by ID
 */
export const getQuestionById = (id: number): Question | undefined => {
  return allQuestions.find(question => question.id === id);
};

/**
 * Force refresh questions from storage
 */
export const refreshQuestionsFromStorage = (): Question[] => {
  // Return all questions from the source
  return [...allQuestions];
};

/**
 * Update a question
 */
export const updateQuestion = (updatedQuestion: Question): boolean => {
  // For now, just return true since we're working with static data
  console.log("Question update requested:", updatedQuestion);
  return true;
};

/**
 * Get simulation progress
 */
export const getSimulationProgress = (topicId: number) => {
  const key = `simulation_progress_${topicId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
};

/**
 * Reset simulation
 */
export const resetSimulation = (topicId: number): void => {
  const key = `simulation_progress_${topicId}`;
  localStorage.removeItem(key);
};
