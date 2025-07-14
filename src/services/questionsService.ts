import { Question } from "@/data/types/questionTypes";
import { 
  getQuestionsFromDB, 
  getQuestionsByType as dbGetQuestionsByType,
  getVocabularyQuestions as dbGetVocabularyQuestions,
  getReadingQuestions as dbGetReadingQuestions,
  getRestatementQuestions as dbGetRestatementQuestions,
  getSentenceCompletionQuestions as dbGetSentenceCompletionQuestions,
  getSimulationQuestions,
  clearQuestionsCache
} from "./supabaseQuestionsService";

console.log(`[questionsService] Service loaded. Using Supabase backend.`);

export const getAllQuestions = async (): Promise<Question[]> => {
  console.log(`[getAllQuestions] Fetching all questions from database`);
  try {
    const response = await getQuestionsFromDB({ limit: 1000 }); // Get large batch
    console.log(`[getAllQuestions] Returning ${response.questions.length} total questions`);
    console.log(`[getAllQuestions] Sample questions:`, response.questions.slice(0, 2));
    return response.questions;
  } catch (error) {
    console.error(`[getAllQuestions] Error:`, error);
    return [];
  }
};

export const getQuestionsByDifficultyAndType = async (difficulty: string, type: string): Promise<Question[]> => {
  console.log(`[getQuestionsByDifficultyAndType] Looking for ${difficulty} ${type} questions`);
  
  try {
    const response = await getQuestionsFromDB({ difficulty, type, limit: 500 });
    console.log(`[getQuestionsByDifficultyAndType] Found ${response.questions.length} questions for ${difficulty} ${type}`);
    return response.questions;
  } catch (error) {
    console.error(`[getQuestionsByDifficultyAndType] Error:`, error);
    return [];
  }
};

export const getQuestionsByType = async (type: string): Promise<Question[]> => {
  console.log(`[getQuestionsByType] Looking for ${type} questions`);
  
  try {
    const questions = await dbGetQuestionsByType(type);
    console.log(`[getQuestionsByType] Found ${questions.length} questions for type ${type}`);
    return questions;
  } catch (error) {
    console.error(`[getQuestionsByType] Error:`, error);
    return [];
  }
};

export const getQuestionsByDifficulty = async (difficulty: string): Promise<Question[]> => {
  console.log(`[getQuestionsByDifficulty] Looking for ${difficulty} questions`);
  
  try {
    const response = await getQuestionsFromDB({ difficulty, limit: 500 });
    console.log(`[getQuestionsByDifficulty] Found ${response.questions.length} questions for difficulty ${difficulty}`);
    return response.questions;
  } catch (error) {
    console.error(`[getQuestionsByDifficulty] Error:`, error);
    return [];
  }
};

export const getQuestionsByTopic = async (topicId: number): Promise<Question[]> => {
  console.log(`[getQuestionsByTopic] Looking for questions with topicId ${topicId}`);
  
  try {
    const response = await getQuestionsFromDB({ topicId, limit: 500 });
    console.log(`[getQuestionsByTopic] Found ${response.questions.length} questions for topic ${topicId}`);
    return response.questions;
  } catch (error) {
    console.error(`[getQuestionsByTopic] Error:`, error);
    return [];
  }
};

export const getQuestionsBySet = async (setId: string): Promise<Question[]> => {
  console.log(`[getQuestionsBySet] Looking for questions in set ${setId}`);
  
  try {
    const response = await getQuestionsFromDB({ setId, limit: 500 });
    console.log(`[getQuestionsBySet] Found ${response.questions.length} questions for set ${setId}`);
    return response.questions;
  } catch (error) {
    console.error(`[getQuestionsBySet] Error:`, error);
    return [];
  }
};

export const getQuestionsBySubtopic = async (subtopicId: number): Promise<Question[]> => {
  console.log(`[getQuestionsBySubtopic] Looking for questions with subtopicId ${subtopicId}`);
  
  try {
    // Note: This might need to be implemented in the DB service if subtopic filtering is needed
    const allQuestions = await getAllQuestions();
    const filtered = allQuestions.filter(q => q.subtopicId === subtopicId);
    console.log(`[getQuestionsBySubtopic] Found ${filtered.length} questions for subtopic ${subtopicId}`);
    return filtered;
  } catch (error) {
    console.error(`[getQuestionsBySubtopic] Error:`, error);
    return [];
  }
};

export const getMixedDifficultyQuestions = async (difficultyLevel: 'easy' | 'medium' | 'hard'): Promise<Question[]> => {
  console.log(`[getMixedDifficultyQuestions] Looking for ${difficultyLevel} mixed questions`);
  
  try {
    const response = await getQuestionsFromDB({ difficulty: difficultyLevel, limit: 500 });
    console.log(`[getMixedDifficultyQuestions] Found ${response.questions.length} questions for ${difficultyLevel} difficulty`);
    return response.questions;
  } catch (error) {
    console.error(`[getMixedDifficultyQuestions] Error:`, error);
    return [];
  }
};

export const getSentenceCompletionQuestions = async (): Promise<Question[]> => {
  console.log(`[getSentenceCompletionQuestions] Looking for sentence completion questions`);
  
  try {
    const questions = await dbGetSentenceCompletionQuestions();
    console.log(`[getSentenceCompletionQuestions] Found ${questions.length} sentence completion questions`);
    return questions;
  } catch (error) {
    console.error(`[getSentenceCompletionQuestions] Error:`, error);
    return [];
  }
};

export const getRestatementQuestions = async (): Promise<Question[]> => {
  console.log(`[getRestatementQuestions] Looking for restatement questions`);
  
  try {
    const questions = await dbGetRestatementQuestions();
    console.log(`[getRestatementQuestions] Found ${questions.length} restatement questions`);
    return questions;
  } catch (error) {
    console.error(`[getRestatementQuestions] Error:`, error);
    return [];
  }
};

export const getVocabularyQuestions = async (): Promise<Question[]> => {
  console.log(`[getVocabularyQuestions] Looking for vocabulary questions`);
  
  try {
    const questions = await dbGetVocabularyQuestions();
    console.log(`[getVocabularyQuestions] Found ${questions.length} vocabulary questions`);
    return questions;
  } catch (error) {
    console.error(`[getVocabularyQuestions] Error:`, error);
    return [];
  }
};

export const getReadingComprehensionQuestions = async (): Promise<Question[]> => {
  console.log(`[getReadingComprehensionQuestions] Looking for reading comprehension questions`);
  
  try {
    const questions = await dbGetReadingQuestions();
    console.log(`[getReadingComprehensionQuestions] Found ${questions.length} reading comprehension questions`);
    return questions;
  } catch (error) {
    console.error(`[getReadingComprehensionQuestions] Error:`, error);
    return [];
  }
};

// Add missing functions that are imported in other files
export const getEasyQuestions = async (): Promise<Question[]> => {
  return getMixedDifficultyQuestions('easy');
};

export const getMediumQuestions = async (): Promise<Question[]> => {
  return getMixedDifficultyQuestions('medium');
};

export const getHardQuestions = async (): Promise<Question[]> => {
  return getMixedDifficultyQuestions('hard');
};

export const refreshQuestionsFromStorage = async (): Promise<Question[]> => {
  console.log('[refreshQuestionsFromStorage] Clearing cache and refreshing questions');
  clearQuestionsCache();
  return getAllQuestions();
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

// Add new simulation questions function for better performance
export const getQuestionsForSimulation = async (count: number = 50): Promise<Question[]> => {
  console.log(`[getQuestionsForSimulation] Fetching ${count} questions for simulation`);
  
  try {
    const questions = await getSimulationQuestions(count);
    console.log(`[getQuestionsForSimulation] Found ${questions.length} simulation questions`);
    return questions;
  } catch (error) {
    console.error(`[getQuestionsForSimulation] Error:`, error);
    return [];
  }
};