import { Question } from "@/data/types/questionTypes";
import { allQuestions } from "@/data/questions";

export const getAllQuestions = (): Question[] => {
  console.log(`[getAllQuestions] Returning ${allQuestions.length} total questions`);
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

export const getMixedDifficultyQuestions = (maxDifficulty: 'easy' | 'medium' | 'hard'): Question[] => {
  console.log(`[getMixedDifficultyQuestions] Getting mixed questions up to ${maxDifficulty} difficulty`);
  
  const difficultyOrder = ['easy', 'medium', 'hard'];
  const maxIndex = difficultyOrder.indexOf(maxDifficulty);
  const allowedDifficulties = difficultyOrder.slice(0, maxIndex + 1);
  
  const filtered = allQuestions.filter(q => allowedDifficulties.includes(q.difficulty));
  
  console.log(`[getMixedDifficultyQuestions] Found ${filtered.length} questions for difficulties up to ${maxDifficulty}`);
  return filtered;
};

export const getSentenceCompletionQuestions = (): Question[] => {
  return getQuestionsByType('sentence-completion');
};

export const getRestatementQuestions = (): Question[] => {
  return getQuestionsByType('restatement');
};

export const getVocabularyQuestions = (): Question[] => {
  return getQuestionsByType('vocabulary');
};

export const getReadingComprehensionQuestions = (): Question[] => {
  return getQuestionsByType('reading-comprehension');
};

export const getEasyQuestions = (): Question[] => {
  return getQuestionsByDifficulty('easy');
};

export const getMediumQuestions = (): Question[] => {
  return getQuestionsByDifficulty('medium');
};

export const getHardQuestions = (): Question[] => {
  return getQuestionsByDifficulty('hard');
};

export const shuffleQuestions = (questions: Question[]): Question[] => {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
