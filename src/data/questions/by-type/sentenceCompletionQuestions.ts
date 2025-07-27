
import { Question } from "../../types/questionTypes";
// Note: Original sentence completion files were deleted due to type errors
// TODO: Regenerate sentence completion questions with string IDs

/**
 * שאלות השלמת משפטים - מסוג Sentence Completion
 * כרגע ריק עד שיתווספו שאלות חדשות
 */
export const sentenceCompletionQuestions: Question[] = [
  {
    "type": "sentence-completion",
    "text": "Despite his extensive preparation, John found the interview considerably more challenging than he had _____.",
    "options": [
      "anticipated",
      "prepared",
      "experienced", 
      "studied"
    ],
    "correctAnswer": 0,
    "explanation": "התשובה הנכונה היא 'anticipated' - למרות הכנתו הרחבה, ג'ון מצא שהראיון מאתגר יותר ממה שצפה.",
    "difficulty": "easy",
    "id": "sc_001",
    "categoryId": 1,
    "topicId": 1
  }
];

// Add topicId and categoryId for compatibility
export const sentenceCompletionQuestionsWithMetadata: Question[] = sentenceCompletionQuestions.map(q => ({
  ...q,
  topicId: q.topicId || 1,
  categoryId: q.categoryId || 1
}));

console.log(`[Sentence Completion] Loaded ${sentenceCompletionQuestions.length} questions total`);
console.log(`[Sentence Completion] Easy: 0, Medium: 0, Hard: 0`);
