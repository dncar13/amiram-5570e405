
import { Question } from "@/data/types/questionTypes";
import { 
  getSentenceCompletionQuestions,
  getRestatementQuestions
} from "@/services/questionsService";
import { getReadingComprehensionQuestions } from "@/data/questions/by-type/index";
import { FULL_EXAM_SETTINGS } from "@/config/fullExamConfig";

/**
 * Utility function to shuffle array and pick N unique items
 */
const shuffleAndPick = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

/**
 * Creates a full exam question set with proper distribution
 * Returns exactly 80 questions: 27 sentence completion, 26 restatement, 27 reading comprehension
 */
export const getFullExamQuestions = (): Question[] => {
  console.log("Creating full exam question set...");
  
  // Get all available questions by type
  const sentenceCompletionQuestions = getSentenceCompletionQuestions();
  const restatementQuestions = getRestatementQuestions();
  const readingComprehensionQuestions = getReadingComprehensionQuestions();
  
  console.log("Available questions:", {
    sentenceCompletion: sentenceCompletionQuestions.length,
    restatement: restatementQuestions.length,
    readingComprehension: readingComprehensionQuestions.length
  });
  
  // Validate we have enough questions
  const { questionDistribution } = FULL_EXAM_SETTINGS;
  
  if (sentenceCompletionQuestions.length < questionDistribution.sentenceCompletion) {
    console.warn(`Not enough sentence completion questions. Need ${questionDistribution.sentenceCompletion}, have ${sentenceCompletionQuestions.length}`);
  }
  
  if (restatementQuestions.length < questionDistribution.restatement) {
    console.warn(`Not enough restatement questions. Need ${questionDistribution.restatement}, have ${restatementQuestions.length}`);
  }
  
  if (readingComprehensionQuestions.length < questionDistribution.readingComprehension) {
    console.warn(`Not enough reading comprehension questions. Need ${questionDistribution.readingComprehension}, have ${readingComprehensionQuestions.length}`);
  }
  
  // Select random questions for each type
  const selectedSentenceCompletion = shuffleAndPick(sentenceCompletionQuestions, questionDistribution.sentenceCompletion);
  const selectedRestatement = shuffleAndPick(restatementQuestions, questionDistribution.restatement);
  const selectedReadingComprehension = shuffleAndPick(readingComprehensionQuestions, questionDistribution.readingComprehension);
  
  // Combine all questions and shuffle the final order
  const allSelectedQuestions = [
    ...selectedSentenceCompletion,
    ...selectedRestatement,
    ...selectedReadingComprehension
  ];
  
  // Final shuffle to mix question types throughout the exam
  const finalQuestions = shuffleAndPick(allSelectedQuestions, FULL_EXAM_SETTINGS.total);
  
  console.log(`Full exam created with ${finalQuestions.length} questions`);
  console.log("Question distribution in final exam:", {
    sentenceCompletion: finalQuestions.filter(q => q.type === 'sentence-completion').length,
    restatement: finalQuestions.filter(q => q.type === 'restatement').length,
    readingComprehension: finalQuestions.filter(q => q.type === 'reading-comprehension').length
  });
  
  // Ensure no duplicate questions
  const uniqueQuestions = finalQuestions.filter((question, index, self) => 
    index === self.findIndex(q => q.id === question.id)
  );
  
  if (uniqueQuestions.length !== finalQuestions.length) {
    console.warn("Duplicate questions detected and removed");
  }
  
  return uniqueQuestions;
};

/**
 * Validates that the exam has the correct structure
 */
export const validateFullExam = (questions: Question[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (questions.length !== FULL_EXAM_SETTINGS.total) {
    errors.push(`Expected ${FULL_EXAM_SETTINGS.total} questions, got ${questions.length}`);
  }
  
  const typeCounts = {
    'sentence-completion': questions.filter(q => q.type === 'sentence-completion').length,
    'restatement': questions.filter(q => q.type === 'restatement').length,
    'reading-comprehension': questions.filter(q => q.type === 'reading-comprehension').length
  };
  
  const { questionDistribution } = FULL_EXAM_SETTINGS;
  
  if (typeCounts['sentence-completion'] !== questionDistribution.sentenceCompletion) {
    errors.push(`Expected ${questionDistribution.sentenceCompletion} sentence completion questions, got ${typeCounts['sentence-completion']}`);
  }
  
  if (typeCounts['restatement'] !== questionDistribution.restatement) {
    errors.push(`Expected ${questionDistribution.restatement} restatement questions, got ${typeCounts['restatement']}`);
  }
  
  if (typeCounts['reading-comprehension'] !== questionDistribution.readingComprehension) {
    errors.push(`Expected ${questionDistribution.readingComprehension} reading comprehension questions, got ${typeCounts['reading-comprehension']}`);
  }
  
  // Check for duplicates
  const uniqueIds = new Set(questions.map(q => q.id));
  if (uniqueIds.size !== questions.length) {
    errors.push("Duplicate questions detected");
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
