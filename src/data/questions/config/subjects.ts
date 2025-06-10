
export type GeneralSubject = 'economics' | 'science' | 'technology' | 'environment' | 'society' | 'history' | 'literature' | 'philosophy';

export interface SubjectConfig {
  id: GeneralSubject;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  color: string;
  topics: string[];
}

export const subjects: Record<GeneralSubject, SubjectConfig> = {
  'economics': {
    id: 'economics',
    title: 'כלכלה',
    titleEn: 'Economics',
    description: 'נושאים כלכליים ותעסוקה',
    icon: 'TrendingUp',
    color: 'text-blue-600',
    topics: ['gig-economy', 'market-trends', 'employment', 'business', 'finance']
  },
  'science': {
    id: 'science',
    title: 'מדע',
    titleEn: 'Science',
    description: 'מדעי הטבע והחיים',
    icon: 'Microscope',
    color: 'text-purple-600',
    topics: ['biology', 'chemistry', 'physics', 'research', 'innovation']
  },
  'technology': {
    id: 'technology',
    title: 'טכנולוגיה',
    titleEn: 'Technology',
    description: 'טכנולוגיה ובינה מלאכותית',
    icon: 'Cpu',
    color: 'text-indigo-600',
    topics: ['artificial-intelligence', 'computing', 'innovation', 'digital-transformation']
  },
  'environment': {
    id: 'environment',
    title: 'סביבה',
    titleEn: 'Environment',
    description: 'שינויי אקלים וסביבה',
    icon: 'Leaf',
    color: 'text-green-600',
    topics: ['climate-change', 'sustainability', 'conservation', 'renewable-energy']
  },
  'society': {
    id: 'society',
    title: 'חברה',
    titleEn: 'Society',
    description: 'נושאים חברתיים ותרבותיים',
    icon: 'Users',
    color: 'text-orange-600',
    topics: ['education', 'social-issues', 'culture', 'demographics']
  },
  'history': {
    id: 'history',
    title: 'היסטוריה',
    titleEn: 'History',
    description: 'אירועים היסטוריים וציוני דרך',
    icon: 'BookOpen',
    color: 'text-amber-600',
    topics: ['ancient-history', 'modern-history', 'historical-figures', 'cultural-history']
  },
  'literature': {
    id: 'literature',
    title: 'ספרות',
    titleEn: 'Literature',
    description: 'ספרות ויצירות אמנות',
    icon: 'PenTool',
    color: 'text-pink-600',
    topics: ['classic-literature', 'modern-literature', 'poetry', 'literary-analysis']
  },
  'philosophy': {
    id: 'philosophy',
    title: 'פילוסופיה',
    titleEn: 'Philosophy',
    description: 'רעיונות פילוסופיים ומחשבה',
    icon: 'Brain',
    color: 'text-gray-600',
    topics: ['ethics', 'logic', 'metaphysics', 'philosophy-of-mind']
  }
};
