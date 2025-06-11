
import { Question } from "../../types/questionTypes";

// Import restatement questions from the questions-for-lovable folder
import restatementEasy from "../../../../questions-for-lovable/restatement/easy/restatement-easy-2025-06-11";
import restatementMedium from "../../../../questions-for-lovable/restatement/medium/restatement-medium-2025-06-11";
import restatementHard from "../../../../questions-for-lovable/restatement/hard/restatement-hard-2025-06-11";

/**
 * שאלות ניסוח מחדש מכל רמות הקושי
 */
export const restatementQuestionsNew: Question[] = [
  ...restatementEasy,
  ...restatementMedium,
  ...restatementHard
];

console.log(`[restatementQuestionsNew] Loaded ${restatementQuestionsNew.length} restatement questions`);
