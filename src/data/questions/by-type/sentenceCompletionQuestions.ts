
import { Question } from "../../types/questionTypes";
import easyQuestions from "../../../../questions-for-lovable/sentence-completion/easy/sentence-completion-easy-2025-06-11";
import mediumQuestions from "../../../../questions-for-lovable/sentence-completion/medium/sentence-completion-medium-2025-06-11";
import hardQuestions from "../../../../questions-for-lovable/sentence-completion/hard/sentence-completion-hard-2025-06-11";

/**
 * שאלות השלמת משפטים - מסוג Sentence Completion
 * מיובאות מהקבצים החדשים שנוצרו ב-2025-06-11
 */
export const sentenceCompletionQuestions: Question[] = [
  ...easyQuestions,
  ...mediumQuestions, 
  ...hardQuestions
];

// Add topicId and categoryId for compatibility
export const sentenceCompletionQuestionsWithMetadata: Question[] = sentenceCompletionQuestions.map(q => ({
  ...q,
  topicId: q.topicId || 1,
  categoryId: q.categoryId || 1
}));

console.log(`[Sentence Completion] Loaded ${sentenceCompletionQuestions.length} questions total`);
console.log(`[Sentence Completion] Easy: ${easyQuestions.length}, Medium: ${mediumQuestions.length}, Hard: ${hardQuestions.length}`);
