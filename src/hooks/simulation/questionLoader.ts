import { Question } from "@/data/types/questionTypes";
import { 
  getQuestionsByDifficultyAndType,
  getMixedDifficultyQuestions,
  getSentenceCompletionQuestions,
  getRestatementQuestions,
  getReadingComprehensionQuestions,
  getVocabularyQuestions
} from "@/services/questionsService";
import { getFullExamQuestions } from "@/services/fullExamService";

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

export const loadQuestions = async ({
  storyQuestions,
  effectiveType,
  difficulty,
  questionLimit,
  setNumber,
  startIndex,
  isFullExam = false
}: QuestionLoaderParams): Promise<Question[]> => {
  console.log("Loading questions with params:", { 
    effectiveType, 
    difficulty, 
    questionLimit, 
    setNumber, 
    startIndex, 
    isFullExam 
  });
  
  let questionsToUse: Question[] = [];
  
  // Handle full exam case - highest priority
  if (isFullExam) {
    console.log("Loading full exam questions (80 questions, mixed types)");
    try {
      questionsToUse = await getFullExamQuestions();
      console.log(`Loaded ${questionsToUse.length} questions for full exam`);
      return questionsToUse;
    } catch (error) {
      console.error("Error loading full exam questions:", error);
      return [];
    }
  }
  
  if (storyQuestions && storyQuestions.length > 0) {
    questionsToUse = [...storyQuestions];
    console.log(`Using ${questionsToUse.length} story questions`);
  } 
  // Handle quick practice with type but no difficulty - PRIORITIZE THIS CASE
  else if (effectiveType && questionLimit) {
    console.log(`[QUICK PRACTICE] Loading mixed difficulty questions for type: ${effectiveType}`);
    
    try {
      if (effectiveType === 'sentence-completion') {
        questionsToUse = await getSentenceCompletionQuestions();
        console.log(`[QUICK PRACTICE] Found ${questionsToUse.length} sentence completion questions`);
      } else if (effectiveType === 'restatement') {
        questionsToUse = await getRestatementQuestions();
        console.log(`[QUICK PRACTICE] Found ${questionsToUse.length} restatement questions`);
      } else if (effectiveType === 'vocabulary') {
        questionsToUse = await getVocabularyQuestions();
        console.log(`[QUICK PRACTICE] Found ${questionsToUse.length} vocabulary questions`);
      } else if (effectiveType === 'reading-comprehension') {
        questionsToUse = await getReadingComprehensionQuestions();
        console.log(`[QUICK PRACTICE] Found ${questionsToUse.length} reading comprehension questions`);
      }
      
      // Apply limit and shuffle
      const limit = parseInt(questionLimit, 10);
      if (!isNaN(limit) && limit > 0) {
        questionsToUse = shuffleArray(questionsToUse).slice(0, limit);
        console.log(`[QUICK PRACTICE] Limited and shuffled to ${limit} random questions from all difficulty levels`);
      }
    } catch (error) {
      console.error(`Error loading ${effectiveType} questions:`, error);
      questionsToUse = [];
    }
  }
  else if (effectiveType && difficulty) {
    console.log(`Loading questions for type: ${effectiveType}, difficulty: ${difficulty}`);
    
    try {
      questionsToUse = await getQuestionsByDifficultyAndType(difficulty, effectiveType);
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
    } catch (error) {
      console.error(`Error loading ${effectiveType} ${difficulty} questions:`, error);
      questionsToUse = [];
    }
  } else if (sessionStorage.getItem('is_difficulty_based') === 'true') {
    const difficultyLevel = sessionStorage.getItem('current_difficulty_level');
    const difficultyType = sessionStorage.getItem('current_difficulty_type');
    
    console.log(`Getting difficulty-based questions from sessionStorage: ${difficultyLevel}, ${difficultyType}`);
    
    if (difficultyLevel && difficultyType) {
      try {
        if (difficultyType === 'mixed') {
          questionsToUse = await getMixedDifficultyQuestions(difficultyLevel as 'easy' | 'medium' | 'hard');
        } else {
          questionsToUse = await getQuestionsByDifficultyAndType(difficultyLevel, difficultyType);
        }
        console.log(`Found ${questionsToUse.length} questions for ${difficultyLevel} ${difficultyType}`);
      } catch (error) {
        console.error(`Error loading difficulty-based questions:`, error);
        questionsToUse = [];
      }
    }
  }
  
  if (questionsToUse.length === 0) {
    console.warn("No questions found for simulation", { effectiveType, difficulty, isFullExam });
  }
  
  return questionsToUse;
};