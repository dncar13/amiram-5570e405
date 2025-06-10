
export type QuestionType = 'reading-comprehension' | 'sentence-completion' | 'restatement' | 'vocabulary';

export interface QuestionTypeConfig {
  id: QuestionType;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  estimatedTimeRange: {
    min: number;
    max: number;
  };
  subtypes?: string[];
}

export const questionTypes: Record<QuestionType, QuestionTypeConfig> = {
  'reading-comprehension': {
    id: 'reading-comprehension',
    title: 'הבנת הנקרא',
    titleEn: 'Reading Comprehension',
    description: 'שאלות הבנת הנקרא עם קטעי קריאה',
    icon: 'BookOpenCheck',
    estimatedTimeRange: { min: 5, max: 15 },
    subtypes: ['main-idea', 'details', 'inference', 'vocabulary-context', 'author-intent', 'text-structure']
  },
  'sentence-completion': {
    id: 'sentence-completion',
    title: 'השלמת משפטים',
    titleEn: 'Sentence Completion',
    description: 'שאלות השלמת משפטים ומילים חסרות',
    icon: 'BookOpen',
    estimatedTimeRange: { min: 1, max: 3 },
    subtypes: ['grammar-focus', 'vocabulary-focus', 'context-clues']
  },
  'restatement': {
    id: 'restatement',
    title: 'ניסוח מחדש',
    titleEn: 'Restatement',
    description: 'שאלות ניסוח מחדש והבעת רעיונות',
    icon: 'RotateCcw',
    estimatedTimeRange: { min: 2, max: 4 },
    subtypes: ['paraphrase', 'synonym', 'restructure']
  },
  'vocabulary': {
    id: 'vocabulary',
    title: 'אוצר מילים',
    titleEn: 'Vocabulary',
    description: 'שאלות אוצר מילים ומשמעות מילים',
    icon: 'Languages',
    estimatedTimeRange: { min: 1, max: 2 },
    subtypes: ['synonyms', 'antonyms', 'word-meaning', 'context-meaning']
  }
};
