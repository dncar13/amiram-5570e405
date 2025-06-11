
import { Question } from "../../types/questionTypes";

// Import all sentence completion questions
import sentenceCompletionMedium from "../../../../questions-for-lovable/sentence-completion/medium/sentence-completion-medium-2025-06-11";
import sentenceCompletionHard from "../../../../questions-for-lovable/sentence-completion/hard/sentence-completion-hard-2025-06-11";

/**
 * שאלות השלמת משפטים מכל רמות הקושי
 */
export const sentenceCompletionQuestions: Question[] = [
  ...sentenceCompletionMedium,
  ...sentenceCompletionHard
];

console.log(`[sentenceCompletionQuestions] Loaded ${sentenceCompletionQuestions.length} sentence completion questions`);
