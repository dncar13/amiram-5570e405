import { Question } from "./types/questionTypes";
// Import הקובץ JSON החדש של הפלאש קארד
import vocabFlashcardData from "./vocab-flashcard-120.json";

/**
 * סימולציה אוצר מילים - 120 שאלות תרגום מעברית לאנגלית
 * הקובץ נטען מקובץ JSON שנוצר מהמרה של קובץ MCQ מקורי
 */

// המרת הנתונים מ-JSON לפורמט של המערכת
export const vocabularySimulationQuestions: Question[] = vocabFlashcardData.questions.map((q, index) => ({
  id: `vocab_flashcard_${q.id || index + 1}`,
  type: 'vocabulary' as const,
  text: q.question,
  options: q.options, // זה כבר מערך של מחרוזות
  correctAnswer: q.correct, // השתמש ב-correct במקום correctAnswer
  explanation: q.explanation,
  difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
  topicId: 999, // מזהה ייחודי לסימולציה הזאת
  categoryId: 999,
  is_premium: false,
  ai_generated: false
}));

// מטא-דטה של הסימולציה
export const vocabularySimulationMetadata = {
  title: vocabFlashcardData.title,
  description: vocabFlashcardData.description,
  timeLimit: vocabFlashcardData.timeLimit,
  totalQuestions: vocabFlashcardData.totalQuestions,
  // חשב את התפלגות הקושי מהשאלות
  difficultyDistribution: {
    easy: vocabFlashcardData.questions.filter(q => q.difficulty === 'easy').length,
    medium: vocabFlashcardData.questions.filter(q => q.difficulty === 'medium').length,
    hard: vocabFlashcardData.questions.filter(q => q.difficulty === 'hard').length
  }
};

export default vocabularySimulationQuestions;
