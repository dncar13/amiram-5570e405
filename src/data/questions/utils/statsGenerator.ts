// src/data/questions/config/difficulty.ts
export interface DifficultyConfig {
  level: string;
  timeMultiplier: number;
  pointsMultiplier: number;
  description: string;
}

const difficultyConfigs: Record<string, DifficultyConfig> = {
  easy: {
    level: 'קל',
    timeMultiplier: 1.0,
    pointsMultiplier: 1.0,
    description: 'שאלות בסיסיות'
  },
  medium: {
    level: 'בינוני',
    timeMultiplier: 1.5,
    pointsMultiplier: 1.5,
    description: 'שאלות ברמה בינונית'
  },
  hard: {
    level: 'קשה',
    timeMultiplier: 2.0,
    pointsMultiplier: 2.0,
    description: 'שאלות מתקדמות'
  }
};

export function getDifficultyConfig(difficulty: string): DifficultyConfig | null {
  return difficultyConfigs[difficulty] || null;
}

export const difficulties = Object.keys(difficultyConfigs);

// ---

// src/data/questions/config/subjects.ts  
export interface SubjectConfig {
  name: string;
  description: string;
  category: string;
}

const subjectConfigs: Record<string, SubjectConfig> = {
  economics: {
    name: 'כלכלה',
    description: 'נושאים כלכליים ועסקיים',
    category: 'social-sciences'
  },
  science: {
    name: 'מדע',
    description: 'נושאים מדעיים וטכנולוגיים',
    category: 'sciences'
  },
  technology: {
    name: 'טכנולוגיה',
    description: 'נושאים טכנולוגיים',
    category: 'sciences'
  },
  environment: {
    name: 'סביבה',
    description: 'נושאים סביבתיים',
    category: 'sciences'
  }
};

export function getSubjectConfig(subject: string): SubjectConfig | null {
  return subjectConfigs[subject] || null;
}

export const subjects = Object.keys(subjectConfigs);

// ---

// src/data/questions/config/questionTypes.ts
export interface QuestionTypeConfig {
  name: string;
  description: string;
  estimatedTimeRange: {
    min: number;
    max: number;
  };
}

const questionTypeConfigs: Record<string, QuestionTypeConfig> = {
  'reading-comprehension': {
    name: 'הבנת הנקרא',
    description: 'שאלות על קטעי קריאה',
    estimatedTimeRange: { min: 3, max: 8 }
  },
  'sentence-completion': {
    name: 'השלמת משפטים',
    description: 'השלמת משפטים חסרים',
    estimatedTimeRange: { min: 1, max: 3 }
  },
  'vocabulary': {
    name: 'אוצר מילים',
    description: 'שאלות אוצר מילים',
    estimatedTimeRange: { min: 1, max: 2 }
  },
  'restatement': {
    name: 'ניסוח מחדש',
    description: 'ניסוח מחדש של משפטים',
    estimatedTimeRange: { min: 2, max: 4 }
  }
};

export function getQuestionTypeConfig(type: string): QuestionTypeConfig | null {
  return questionTypeConfigs[type] || null;
}

export const questionTypes = Object.keys(questionTypeConfigs);

// ---

// עדכון ל-enhancedQuestionTypes.ts - הוסף את השדות החסרים:
export interface QuestionMetadata {
  id: string;
  subject?: string;        // הוסף את זה
  difficulty: string;
  estimatedTime?: number;
  tags?: string[];
  author?: string;
  dateCreated?: string;
  lastModified?: string;
  validationStatus?: 'pending' | 'approved' | 'rejected';  // הוסף את זה
  topic?: string;
  wordCount?: number;
}