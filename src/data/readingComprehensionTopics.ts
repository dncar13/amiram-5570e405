/**
 * Reading Comprehension Topic Configuration
 * Maps topic IDs to their names and metadata for the reading comprehension section
 */

import { Brain, Microscope, Users, TrendingUp, Cpu, Leaf, Clock, Heart, GraduationCap, Shuffle } from 'lucide-react';

export interface ReadingTopic {
  id: number;
  name: string;
  nameHebrew: string;
  description: string;
  descriptionHebrew: string;
  icon: any;
  color: string;
  questionCount?: number;
}

export const READING_COMPREHENSION_TOPICS: ReadingTopic[] = [
  {
    id: 1,
    name: 'Philosophy',
    nameHebrew: 'פילוסופיה',
    description: 'Philosophical concepts, ethics, and critical thinking',
    descriptionHebrew: 'מושגים פילוסופיים, אתיקה וחשיבה ביקורתית',
    icon: Brain,
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    id: 2,
    name: 'Science',
    nameHebrew: 'מדע',
    description: 'Scientific discoveries, research, and innovations',
    descriptionHebrew: 'תגליות מדעיות, מחקרים וחידושים',
    icon: Microscope,
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    id: 3,
    name: 'Society',
    nameHebrew: 'חברה',
    description: 'Social issues, culture, and human behavior',
    descriptionHebrew: 'נושאים חברתיים, תרבות והתנהגות אנושית',
    icon: Users,
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    id: 4,
    name: 'Economy',
    nameHebrew: 'כלכלה',
    description: 'Economic concepts, business, and finance',
    descriptionHebrew: 'מושגים כלכליים, עסקים ופיננסים',
    icon: TrendingUp,
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    id: 5,
    name: 'Technology',
    nameHebrew: 'טכנולוגיה',
    description: 'Technological advances and digital transformation',
    descriptionHebrew: 'התקדמות טכנולוגית וטרנספורמציה דיגיטלית',
    icon: Cpu,
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  {
    id: 6,
    name: 'Environment',
    nameHebrew: 'סביבה',
    description: 'Environmental issues, climate, and sustainability',
    descriptionHebrew: 'נושאי סביבה, אקלים וקיימות',
    icon: Leaf,
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    id: 7,
    name: 'History',
    nameHebrew: 'היסטוריה',
    description: 'Historical events, figures, and civilizations',
    descriptionHebrew: 'אירועים היסטוריים, דמויות וציביליזציות',
    icon: Clock,
    color: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  {
    id: 8,
    name: 'Psychology',
    nameHebrew: 'פסיכולוגיה',
    description: 'Human psychology, behavior, and mental health',
    descriptionHebrew: 'פסיכולוגיה אנושית, התנהגות ובריאות נפשית',
    icon: Heart,
    color: 'bg-pink-100 text-pink-800 border-pink-200'
  },
  {
    id: 9,
    name: 'Education',
    nameHebrew: 'חינוך',
    description: 'Educational methods, learning, and pedagogy',
    descriptionHebrew: 'שיטות חינוך, למידה ופדגוגיה',
    icon: GraduationCap,
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200'
  }
];

// Special topic for mixed content
export const MIXED_TOPIC: ReadingTopic = {
  id: 0,
  name: 'Mixed',
  nameHebrew: 'מעורב',
  description: 'A mix of all topics for varied practice',
  descriptionHebrew: 'שילוב של כל הנושאים לתרגול מגוון',
  icon: Shuffle,
  color: 'bg-gray-100 text-gray-800 border-gray-200'
};

export function getReadingTopicById(id: number): ReadingTopic | undefined {
  if (id === 0) return MIXED_TOPIC;
  return READING_COMPREHENSION_TOPICS.find(topic => topic.id === id);
}

export function getReadingTopicName(id: number, hebrew: boolean = true): string {
  const topic = getReadingTopicById(id);
  return topic ? (hebrew ? topic.nameHebrew : topic.name) : 'לא ידוע';
}

export function getAllReadingTopicsWithMixed(): ReadingTopic[] {
  return [MIXED_TOPIC, ...READING_COMPREHENSION_TOPICS];
}