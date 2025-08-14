export type Difficulty = 'easy' | 'medium' | 'hard';
export type Mode = 'free' | 'premium';

export const QUESTION_TYPES = {
  comprehension: ['listening_comprehension'],
  continuation: ['listening_continuation'],
  wordFormation: ['vocabulary', 'sentence-completion'],
  grammarContext: ['grammar_in_context'],
} as const;

export const DEFAULTS: { level: Difficulty; mode: Mode } = {
  level: 'easy',
  mode: 'free',
};
