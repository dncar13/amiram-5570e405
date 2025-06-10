
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  id: DifficultyLevel;
  title: string;
  titleEn: string;
  description: string;
  scoreRange: {
    min: number;
    max: number;
  };
  characteristics: string[];
  color: string;
  bgColor: string;
}

export const difficultyLevels: Record<DifficultyLevel, DifficultyConfig> = {
  'easy': {
    id: 'easy',
    title: 'קל',
    titleEn: 'Easy',
    description: 'שאלות בסיסיות עם מידע מפורש',
    scoreRange: { min: 0, max: 500 },
    characteristics: [
      'מידע מפורש בטקסט',
      'אוצר מילים בסיסי',
      'מבנה משפט פשוט',
      'רעיונות ברורים'
    ],
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  'medium': {
    id: 'medium',
    title: 'בינוני',
    titleEn: 'Medium',
    description: 'שאלות הדורשות הסקה והבנה מעמיקה',
    scoreRange: { min: 500, max: 650 },
    characteristics: [
      'דורש הסקה מהטקסט',
      'אוצר מילים מתקדם',
      'מבנה משפט מורכב',
      'קשרים בין רעיונות'
    ],
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  'hard': {
    id: 'hard',
    title: 'קשה',
    titleEn: 'Hard',
    description: 'שאלות מורכבות הדורשות ניתוח מעמיק',
    scoreRange: { min: 650, max: 800 },
    characteristics: [
      'ניתוח ביקורתי',
      'אוצר מילים אקדמי',
      'מבנה טקסט מורכב',
      'רעיונות מופשטים'
    ],
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  }
};
