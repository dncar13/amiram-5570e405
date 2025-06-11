
import { Question } from '../../types/questionTypes';

// Import sentence completion questions from the questions-for-lovable directory
import mediumQuestions from '../../../questions-for-lovable/sentence-completion/medium/sentence-completion-medium-2025-06-11';
import hardQuestions from '../../../questions-for-lovable/sentence-completion/hard/sentence-completion-hard-2025-06-11';

// Combine all sentence completion questions
export const sentenceCompletionQuestions: Question[] = [
  ...mediumQuestions,
  ...hardQuestions
];

console.log(`[SentenceCompletion] Loaded ${sentenceCompletionQuestions.length} sentence completion questions`);
console.log(`[SentenceCompletion] Medium: ${mediumQuestions.length}, Hard: ${hardQuestions.length}`);
