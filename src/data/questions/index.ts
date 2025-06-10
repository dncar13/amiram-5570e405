
import { Question } from "./types/questionTypes";
import { mediumQuestions } from "./reading-comprehension/medium";

console.log('[DEBUG] Loading questions from organized structure');
console.log('[DEBUG] Medium questions loaded:', mediumQuestions.length);

// Export all questions - using the organized structure with 25 questions per story
export const allQuestions: Question[] = [
  ...mediumQuestions
];

console.log('[DEBUG] Total questions exported:', allQuestions.length);

// Log question counts by passage title for debugging
const questionCounts: Record<string, number> = {};
allQuestions.forEach(q => {
  const title = q.passageTitle || 'Unknown';
  questionCounts[title] = (questionCounts[title] || 0) + 1;
});

console.log('[DEBUG] Questions by passage title:', questionCounts);
