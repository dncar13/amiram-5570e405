
import { Question } from "../../types/questionTypes";
import easyQuestions from "../../../../questions-for-lovable/restatement/easy/restatement-easy-2025-06-11";
import mediumQuestions from "../../../../questions-for-lovable/restatement/medium/restatement-medium-2025-06-11";
import hardQuestions from "../../../../questions-for-lovable/restatement/hard/restatement-hard-2025-06-11";

/**
 * שאלות ניסוח מחדש - מסוג Restatement
 * מיובאות מהקבצים החדשים שנוצרו ב-2025-06-11
 */
export const restatementQuestionsNew: Question[] = [
  ...easyQuestions,
  ...mediumQuestions,
  ...hardQuestions
];

// Add topicId and categoryId for compatibility
export const restatementQuestionsWithMetadata: Question[] = restatementQuestionsNew.map(q => ({
  ...q,
  topicId: q.topicId || 1,
  categoryId: q.categoryId || 1
}));

console.log(`[Restatement] Loaded ${restatementQuestionsNew.length} questions total`);
console.log(`[Restatement] Easy: ${easyQuestions.length}, Medium: ${mediumQuestions.length}, Hard: ${hardQuestions.length}`);
