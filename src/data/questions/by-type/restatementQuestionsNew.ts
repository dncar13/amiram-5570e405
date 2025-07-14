
import { Question } from "../../types/questionTypes";
import easyQuestions from "../../../../questions-for-lovable/restatement/easy/restatement-easy-2025-06-11";

/**
 * שאלות ניסוח מחדש - מסוג Restatement
 * כרגע רק שאלות קלות זמינות
 */
export const restatementQuestionsNew: Question[] = [
  ...easyQuestions,
  // TODO: Add medium and hard questions when available
];

// Add topicId and categoryId for compatibility
export const restatementQuestionsWithMetadata: Question[] = restatementQuestionsNew.map(q => ({
  ...q,
  topicId: q.topicId || 1,
  categoryId: q.categoryId || 1
}));

console.log(`[Restatement] Loaded ${restatementQuestionsNew.length} questions total`);
console.log(`[Restatement] Easy: ${easyQuestions.length}, Medium: 0, Hard: 0`);
