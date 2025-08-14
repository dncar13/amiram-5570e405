// Question shuffling utility to prevent answer pattern gaming
import { Question } from "@/data/types/questionTypes";

/**
 * Simple Linear Congruential Generator for deterministic randomness
 * Using constants from Numerical Recipes
 */
class SeededRNG {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % Math.pow(2, 32);
    return this.seed / Math.pow(2, 32);
  }
}

/**
 * Shuffles question options while preserving correct answer mapping
 * Uses Fisher-Yates shuffle with deterministic seed for consistency
 */
export function shuffleQuestionOptions(question: Question, userId?: string): Question {
  // Don't shuffle if less than 2 options
  if (!question.options || question.options.length < 2) {
    return question;
  }

  // Create deterministic seed from question ID and optional user ID
  const seedString = `${question.id}${userId || 'anonymous'}`;
  let seed = 0;
  for (let i = 0; i < seedString.length; i++) {
    seed = ((seed << 5) - seed + seedString.charCodeAt(i)) & 0xffffffff;
  }
  seed = Math.abs(seed);

  const rng = new SeededRNG(seed);
  
  // Create array of options with their original indices
  const optionsWithIndex = question.options.map((text, index) => ({
    text,
    originalIndex: index
  }));

  // Fisher-Yates shuffle
  for (let i = optionsWithIndex.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
  }

  // Find new position of correct answer
  const newCorrectAnswer = optionsWithIndex.findIndex(
    option => option.originalIndex === question.correctAnswer
  );

  return {
    ...question,
    options: optionsWithIndex.map(option => option.text),
    correctAnswer: newCorrectAnswer
  } as Question & { 
    _isShuffled?: boolean; 
    _originalCorrectAnswer?: number;
  };
}

/**
 * Batch shuffle multiple questions
 */
export function shuffleQuestions(questions: Question[], userId?: string): Question[] {
  return questions.map(question => shuffleQuestionOptions(question, userId));
}

/**
 * Get deterministic shuffle seed for debugging
 */
export function getShuffleSeed(questionId: string, userId?: string): number {
  const seedString = `${questionId}${userId || 'anonymous'}`;
  let seed = 0;
  for (let i = 0; i < seedString.length; i++) {
    seed = ((seed << 5) - seed + seedString.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(seed);
}
