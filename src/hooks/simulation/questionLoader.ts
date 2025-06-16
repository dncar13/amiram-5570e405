
import { Question } from "@/data/types/questionTypes";
import { 
  getQuestionsByDifficultyAndType,
  getMixedDifficultyQuestions,
  getSentenceCompletionQuestions,
  getRestatementQuestions,
  getAllQuestions
} from "@/services/questionsService";

// Helper function to shuffle array
export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface QuestionLoaderParams {
  storyQuestions?: Question[];
  effectiveType?: string | null;
  difficulty?: string;
  questionLimit?: string | null;
  setNumber?: string | null;
  startIndex?: string | null;
  isFullExam?: boolean;
}

export const loadQuestions = ({
  storyQuestions,
  effectiveType,
  difficulty,
  questionLimit,
  setNumber,
  startIndex,
  isFullExam = false
}: QuestionLoaderParams): Question[] => {
  console.log("Loading questions with params:", { effectiveType, difficulty, questionLimit, setNumber, startIndex, isFullExam });
  
  let questionsToUse: Question[] = [];
  
  // Handle full exam - 80 mixed questions from all types and difficulties
  if (isFullExam) {
    console.log("[FULL EXAM] Loading 80 mixed questions for full exam");
    const allQuestions = getAllQuestions();
    console.log(`[FULL EXAM] Total questions available: ${allQuestions.length}`);
    
    if (allQuestions.length === 0) {
      console.error("[FULL EXAM] No questions found in the system!");
      return [];
    }
    
    questionsToUse = shuffleArray(allQuestions).slice(0, 80);
    console.log(`[FULL EXAM] Selected ${questionsToUse.length} questions from ${allQuestions.length} total questions`);
    return questionsToUse;
  }
  
  if (storyQuestions && storyQuestions.length > 0) {
    questionsToUse = [...storyQuestions];
    console.log(`Using ${questionsToUse.length} story questions`);
  } 
  // Handle type + difficulty + limit (specific difficulty practice)
  else if (effectiveType && difficulty && questionLimit) {
    console.log(`[SPECIFIC PRACTICE] Loading ${difficulty} ${effectiveType} questions with limit ${questionLimit}`);
    questionsToUse = getQuestionsByDifficultyAndType(difficulty, effectiveType);
    console.log(`[SPECIFIC PRACTICE] Found ${questionsToUse.length} ${difficulty} ${effectiveType} questions`);
    
    const limit = parseInt(questionLimit, 10);
    if (!isNaN(limit) && limit > 0) {
      questionsToUse = shuffleArray(questionsToUse).slice(0, limit);
      console.log(`[SPECIFIC PRACTICE] Limited and shuffled to ${limit} questions`);
    }
  }
  // Handle quick practice with type but no difficulty - mixed difficulty
  else if (effectiveType && questionLimit && !difficulty) {
    console.log(`[QUICK PRACTICE] Loading mixed difficulty questions for type: ${effectiveType}`);
    
    if (effectiveType === 'sentence-completion') {
      questionsToUse = getSentenceCompletionQuestions();
      console.log(`[QUICK PRACTICE] Found ${questionsToUse.length} sentence completion questions`);
    } else if (effectiveType === 'restatement') {
      questionsToUse = getRestatementQuestions();
      console.log(`[QUICK PRACTICE] Found ${questionsToUse.length} restatement questions`);
    }
    
    // Apply limit and shuffle
    const limit = parseInt(questionLimit, 10);
    if (!isNaN(limit) && limit > 0) {
      questionsToUse = shuffleArray(questionsToUse).slice(0, limit);
      console.log(`[QUICK PRACTICE] Limited and shuffled to ${limit} random questions from all difficulty levels`);
    }
  }
  else if (effectiveType && difficulty) {
    console.log(`Loading questions for type: ${effectiveType}, difficulty: ${difficulty}`);
    questionsToUse = getQuestionsByDifficultyAndType(difficulty, effectiveType);
    console.log(`Found ${questionsToUse.length} questions for ${difficulty} ${effectiveType}`);
    
    // Handle set-based question selection
    if (setNumber && startIndex) {
      const setNum = parseInt(setNumber, 10);
      const start = parseInt(startIndex, 10);
      const questionsPerSet = 10;
      
      if (!isNaN(setNum) && !isNaN(start)) {
        // Get specific 10 questions for this set
        questionsToUse = questionsToUse.slice(start, start + questionsPerSet);
        console.log(`Set ${setNum}: Using questions ${start + 1}-${start + questionsToUse.length}`);
      }
    }
    // Apply general limit if specified in URL (for quick practice)
    else if (questionLimit) {
      const limit = parseInt(questionLimit, 10);
      if (!isNaN(limit) && limit > 0) {
        questionsToUse = shuffleArray(questionsToUse).slice(0, limit);
        console.log(`Limited questions to ${limit} random questions`);
      }
    }
  } else if (sessionStorage.getItem('is_difficulty_based') === 'true') {
    const difficultyLevel = sessionStorage.getItem('current_difficulty_level');
    const difficultyType = sessionStorage.getItem('current_difficulty_type');
    
    console.log(`Getting difficulty-based questions from sessionStorage: ${difficultyLevel}, ${difficultyType}`);
    
    if (difficultyLevel && difficultyType) {
      if (difficultyType === 'mixed') {
        questionsToUse = getMixedDifficultyQuestions(difficultyLevel as 'easy' | 'medium' | 'hard');
      } else {
        questionsToUse = getQuestionsByDifficultyAndType(difficultyLevel, difficultyType);
      }
      console.log(`Found ${questionsToUse.length} questions for ${difficultyLevel} ${difficultyType}`);
    }
  }
  
  if (questionsToUse.length === 0) {
    console.warn("No questions found for simulation", { effectiveType, difficulty, isFullExam });
  }
  
  return questionsToUse;
};
