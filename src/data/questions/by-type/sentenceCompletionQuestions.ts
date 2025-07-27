
import { Question } from "../../types/questionTypes";
// Note: Original sentence completion files were deleted due to type errors
// TODO: Regenerate sentence completion questions with string IDs

/**
 * שאלות השלמת משפטים - מסוג Sentence Completion
 * כרגע ריק עד שיתווספו שאלות חדשות
 */
export const sentenceCompletionQuestions: Question[] = [
  // TODO: Add questions when available
];

// Add topicId and categoryId for compatibility
export const sentenceCompletionQuestionsWithMetadata: Question[] = sentenceCompletionQuestions.map(q => ({
  ...q,
  topicId: q.topicId || 1,
  categoryId: q.categoryId || 1
}));

console.log(`[Sentence Completion] Loaded ${sentenceCompletionQuestions.length} questions total`);
console.log(`[Sentence Completion] Easy: 0, Medium: 0, Hard: 0`);
