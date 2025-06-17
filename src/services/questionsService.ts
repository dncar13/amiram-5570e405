
import { Question } from "@/data/types/questionTypes";
import { allQuestions } from "@/data/questions";

console.log(`[questionsService] Service loaded. allQuestions.length: ${allQuestions?.length || 0}`);
console.log(`[questionsService] First few questions:`, allQuestions?.slice(0, 3));

export const getAllQuestions = (): Question[] => {
  console.log(`[getAllQuestions] Returning ${allQuestions.length} total questions`);
  console.log(`[getAllQuestions] Sample questions:`, allQuestions.slice(0, 2));
  return allQuestions;
};

export const getQuestionsByDifficultyAndType = (difficulty: string, type: string): Question[] => {
  console.log(`[getQuestionsByDifficultyAndType] Looking for ${difficulty} ${type} questions`);
  
  const filtered = allQuestions.filter(q => {
    const matchesDifficulty = q.difficulty === difficulty;
    const matchesType = q.type === type;
    return matchesDifficulty && matchesType;
  });
  
  console.log(`[getQuestionsByDifficultyAndType] Found ${filtered.length} questions for ${difficulty} ${type}`);
  return filtered;
};

export const getQuestionsByType = (type: string): Question[] => {
  console.log(`[getQuestionsByType] Looking for ${type} questions`);
  
  const filtered = allQuestions.filter(q => q.type === type);
  
  console.log(`[getQuestionsByType] Found ${filtered.length} questions for type ${type}`);
  return filtered;
};

export const getQuestionsByDifficulty = (difficulty: string): Question[] => {
  console.log(`[getQuestionsByDifficulty] Looking for ${difficulty} questions`);
  
  const filtered = allQuestions.filter(q => q.difficulty === difficulty);
  
  console.log(`[getQuestionsByDifficulty] Found ${filtered.length} questions for difficulty ${difficulty}`);
  return filtered;
};

export const getQuestionsByTopic = (topicId: number): Question[] => {
  console.log(`[getQuestionsByTopic] Looking for questions with topicId ${topicId}`);
  
  const filtered = allQuestions.filter(q => q.topicId === topicId);
  
  console.log(`[getQuestionsByTopic] Found ${filtered.length} questions for topic ${topicId}`);
  return filtered;
};

export const getQuestionsBySet = (setNumber: number): Question[] => {
  console.log(`[getQuestionsBySet] Looking for questions in set ${setNumber}`);
  
  const filtered = allQuestions.filter(q => q.setNumber === setNumber);
  
  console.log(`[getQuestionsBySet] Found ${filtered.length} questions for set ${setNumber}`);
  return filtered;
};

export const getQuestionsBySubtopic = (subtopicId: number): Question[] => {
  console.log(`[getQuestionsBySubtopic] Looking for questions with subtopicId ${subtopicId}`);
  
  const filtered = allQuestions.filter(q => q.subtopicId === subtopicId);
  
  console.log(`[getQuestionsBySubtopic] Found ${filtered.length} questions for subtopic ${subtopicId}`);
  return filtered;
};

export const getMixedDifficultyQuestions = (difficultyLevel: 'easy' | 'medium' | 'hard'): Question[] => {
  console.log(`[getMixedDifficultyQuestions] Looking for ${difficultyLevel} mixed questions`);
  
  const filtered = allQuestions.filter(q => q.difficulty === difficultyLevel);
  
  console.log(`[getMixedDifficultyQuestions] Found ${filtered.length} questions for ${difficultyLevel} difficulty`);
  return filtered;
};

export const getSentenceCompletionQuestions = (): Question[] => {
  console.log(`[getSentenceCompletionQuestions] Looking for sentence completion questions`);
  
  const filtered = allQuestions.filter(q => q.type === 'sentence-completion');
  
  console.log(`[getSentenceCompletionQuestions] Found ${filtered.length} sentence completion questions`);
  return filtered;
};

export const getRestatementQuestions = (): Question[] => {
  console.log(`[getRestatementQuestions] Looking for restatement questions`);
  
  const filtered = allQuestions.filter(q => q.type === 'restatement');
  
  console.log(`[getRestatementQuestions] Found ${filtered.length} restatement questions`);
  return filtered;
};

export const getVocabularyQuestions = (): Question[] => {
  console.log(`[getVocabularyQuestions] Looking for vocabulary questions`);
  
  const filtered = allQuestions.filter(q => q.type === 'vocabulary');
  
  console.log(`[getVocabularyQuestions] Found ${filtered.length} vocabulary questions`);
  return filtered;
};

export const getReadingComprehensionQuestions = (): Question[] => {
  console.log(`[getReadingComprehensionQuestions] Looking for reading comprehension questions`);
  
  const filtered = allQuestions.filter(q => q.type === 'reading-comprehension');
  
  console.log(`[getReadingComprehensionQuestions] Found ${filtered.length} reading comprehension questions`);
  return filtered;
};

// Add missing functions that are imported in other files
export const getEasyQuestions = (): Question[] => {
  return getMixedDifficultyQuestions('easy');
};

export const getMediumQuestions = (): Question[] => {
  return getMixedDifficultyQuestions('medium');
};

export const getHardQuestions = (): Question[] => {
  return getMixedDifficultyQuestions('hard');
};

export const refreshQuestionsFromStorage = (): Question[] => {
  console.log('[refreshQuestionsFromStorage] Refreshing questions from storage');
  // Return the current questions array
  return allQuestions;
};

// Add missing simulation-related functions
export const getSimulationProgress = (simulationId: string | number) => {
  const progressKey = `simulation_progress_${simulationId}`;
  const savedProgress = sessionStorage.getItem(progressKey);
  return savedProgress ? JSON.parse(savedProgress) : null;
};

export const resetSimulation = (simulationId: string | number) => {
  const progressKey = `simulation_progress_${simulationId}`;
  sessionStorage.removeItem(progressKey);
  console.log(`Reset simulation progress for ${simulationId}`);
};
