import { Question } from "@/data/types/questionTypes";
import { 
  gigEconomyReadingQuestions, 
  technologyReadingQuestions, 
  environmentReadingQuestions,
  getAllQuestions as getAllQuestionsFromIndex
} from "@/data/questions/index";
import { vocabularyQuestions } from "@/data/questions/by-type/vocabularyQuestions";

<<<<<<< HEAD
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
=======
// Import sentence completion questions from the new files
import easyQuestions from "../../questions-for-lovable/sentence-completion/easy/sentence-completion-easy-2025-06-11";
import mediumQuestions from "../../questions-for-lovable/sentence-completion/medium/sentence-completion-medium-2025-06-11";
import hardQuestions from "../../questions-for-lovable/sentence-completion/hard/sentence-completion-hard-2025-06-11";

// Import restatement questions
import restatementEasy from "../../questions-for-lovable/restatement/easy/restatement-easy-2025-06-11";
import restatementMedium from "../../questions-for-lovable/restatement/medium/restatement-medium-2025-06-11";
import restatementHard from "../../questions-for-lovable/restatement/hard/restatement-hard-2025-06-11";

// Combine all sentence completion questions
const allSentenceCompletionQuestions: Question[] = [
  ...easyQuestions,
  ...mediumQuestions,
  ...hardQuestions
];

// Combine all restatement questions
const allRestatementQuestions: Question[] = [
  ...restatementEasy,
  ...restatementMedium,
  ...restatementHard
];

// Re-export functions from questions/index
export {
  refreshQuestionsFromStorage,
  initializeQuestions,
  getSimulationProgress,
  saveSimulationProgress,
  resetSimulation,
  onProgressChange,
  getProgressKey,
  type SimulationProgress
} from "@/services/questions";

/**
 * מחזיר את כל השאלות במערכת
 */
export const getAllQuestions = (): Question[] => {
  return getAllQuestionsFromIndex();
>>>>>>> 9eedf197065e347a111c3748ad9733e84f0d9b4a
};

/**
 * מחזיר שאלות לפי נושא מסוים
 */
export const getQuestionsByTopic = (topicId: number): Question[] => {
  const allQuestions = getAllQuestions();
  return allQuestions.filter(question => question.topicId === topicId);
};

/**
 * מחזיר שאלות לפי סט שאלות (לפי מספר סט)
 */
export const getQuestionsBySet = (setId: number): Question[] => {
  const allQuestions = getAllQuestions();
  // חישוב טווח השאלות בסט
  const startId = (setId - 1) * 50 + 1;
  const endId = setId * 50;
  
  // החזר שאלות שה-ID שלהן נמצא בטווח המתאים
  return allQuestions.filter(
    question => question.id >= startId && question.id <= endId
  );
};

/**
 * מחזיר שאלות קריאה לפי רמת קושי
 */
export const getEasyQuestions = (): Question[] => {
  return gigEconomyReadingQuestions.filter(q => q.difficulty === 'easy');
};

/**
 * מחזיר שאלות קריאה בינוניות
 */
export const getMediumQuestions = (): Question[] => {
  return technologyReadingQuestions.filter(q => q.difficulty === 'medium');
};

/**
 * מחזיר שאלות קשות
 */
export const getHardQuestions = (): Question[] => {
  return environmentReadingQuestions.filter(q => q.difficulty === 'hard');
};

/**
 * מחזיר שאלות קריאה מעורבות לפי רמת קושי
 */
export const getMixedDifficultyQuestions = (difficulty: 'easy' | 'medium' | 'hard'): Question[] => {
  let questions: Question[] = [];
  
  if (difficulty === 'easy') {
    questions = gigEconomyReadingQuestions.filter(q => q.difficulty === 'easy');
  } else if (difficulty === 'medium') {
    questions = technologyReadingQuestions.filter(q => q.difficulty === 'medium');
  } else if (difficulty === 'hard') {
    questions = environmentReadingQuestions.filter(q => q.difficulty === 'hard');
  }
  
  console.log(`Found ${questions.length} mixed difficulty questions for ${difficulty}`);
  return questions;
};

/**
 * מחזיר שאלות אוצר מילים
 */
export const getVocabularyQuestions = (): Question[] => {
  return vocabularyQuestions;
};

/**
 * מחזיר שאלות השלמת משפטים לפי רמת קושי
 */
export const getSentenceCompletionQuestions = (difficulty?: 'easy' | 'medium' | 'hard'): Question[] => {
  const questions = allSentenceCompletionQuestions.filter(q => q.type === 'sentence-completion');
  
  if (difficulty) {
    const filtered = questions.filter(q => q.difficulty === difficulty);
    console.log(`[getSentenceCompletionQuestions] Found ${filtered.length} ${difficulty} sentence completion questions`);
    return filtered;
  }
  
  console.log(`[getSentenceCompletionQuestions] Found ${questions.length} sentence completion questions`);
  return questions;
};

/**
 * מחזיר שאלות ניסוח מחדש לפי רמת קושי
 */
export const getRestatementQuestions = (difficulty?: 'easy' | 'medium' | 'hard'): Question[] => {
  const questions = allRestatementQuestions.filter(q => q.type === 'restatement');
  
  if (difficulty) {
    const filtered = questions.filter(q => q.difficulty === difficulty);
    console.log(`[getRestatementQuestions] Found ${filtered.length} ${difficulty} restatement questions`);
    return filtered;
  }
  
  console.log(`[getRestatementQuestions] Found ${questions.length} restatement questions`);
  return questions;
};

/**
 * מחזיר שאלות הבנת הנקרא
 */
export const getReadingComprehensionQuestions = (): Question[] => {
  const allQuestions = getAllQuestions();
  return allQuestions.filter(q => q.type === 'reading-comprehension');
};

/**
 * מחזיר שאלות לפי רמת קושי וסוג
 */
export const getQuestionsByDifficultyAndType = (difficulty: string, type: string): Question[] => {
  console.log(`[getQuestionsByDifficultyAndType] Getting questions for difficulty: ${difficulty}, type: ${type}`);
  
  let questions: Question[] = [];
  
  if (type === 'sentence-completion') {
    questions = getSentenceCompletionQuestions(difficulty as 'easy' | 'medium' | 'hard');
  } else if (type === 'restatement') {
    questions = getRestatementQuestions(difficulty as 'easy' | 'medium' | 'hard');
  } else if (type === 'vocabulary') {
    questions = getVocabularyQuestions().filter(q => q.difficulty === difficulty);
  }
  
  console.log(`[getQuestionsByDifficultyAndType] Found ${questions.length} questions for ${difficulty} ${type}`);
  return questions;
};

// ... keep existing code (other functions)
