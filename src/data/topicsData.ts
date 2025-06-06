
import { Topic } from './types/topicTypes';
import { LucideIcon, BookOpen, Globe, Cpu } from 'lucide-react';

export const topicsData: Topic[] = [
  {
    id: 1,
    title: 'The Rise of the Gig Economy',
    description: 'שאלות הבנת נקרא על כלכלת הגיג',
    icon: BookOpen as LucideIcon,
    difficulty: 'intermediate',
    timeEstimate: '45 דקות',
    totalQuestions: 25,
    targetQuestions: 25,
    targetCount: 25,
    completedPercentage: 0,
    categoryId: 1,
    tips: ['קרא את הטקסט בעיון', 'שים לב למילות המפתח', 'חזור על החלקים הקשים'],
    subtopics: [],
    recommended: true
  },
  {
    id: 2,
    title: 'Technology Reading',
    description: 'שאלות הבנת נקרא על התפתחות הטכנולוגיה',
    icon: Cpu as LucideIcon,
    difficulty: 'intermediate',
    timeEstimate: '45 דקות',
    totalQuestions: 25,
    targetQuestions: 25,
    targetCount: 25,
    completedPercentage: 0,
    categoryId: 1,
    tips: ['קרא את הטקסט בעיון', 'שים לב למילות המפתח', 'חזור על החלקים הקשים'],
    subtopics: [],
    recommended: true
  },
  {
    id: 3,
    title: 'Environment Reading',
    description: 'שאלות הבנת נקרא על סביבה וקיימות',
    icon: Globe as LucideIcon,
    difficulty: 'intermediate',
    timeEstimate: '45 דקות',
    totalQuestions: 25,
    targetQuestions: 25,
    targetCount: 25,
    completedPercentage: 0,
    categoryId: 1,
    tips: ['קרא את הטקסט בעיון', 'שים לב למילות המפתח', 'חזור על החלקים הקשים'],
    subtopics: [],
    recommended: true
  }
];
