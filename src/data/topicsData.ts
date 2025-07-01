
import { Topic } from './types/topicTypes';
import { BookOpen, Globe, Cpu } from 'lucide-react';

export const topicsData: Topic[] = [
  {
    id: 1,
    title: 'The Rise of the Gig Economy',
    description: 'שאלות הבנת נקרא על כלכלת הגיג',
    icon: 'book',
    difficulty: 'medium',
    timeEstimate: '45 דקות',
    totalQuestions: 25,
    targetQuestions: 25,
    targetCount: 25,
    completedPercentage: 0,
    categoryId: 1,
    estimatedTime: 45,
    tags: ['reading', 'economy'],
    order: 1,
    tips: ['קרא את הטקסט בעיון', 'שים לב למילות המפתח', 'חזור על החלקים הקשים'],
    subtopics: [],
    recommended: true
  },
  {
    id: 2,
    title: 'Technology Reading',
    description: 'שאלות הבנת נקרא על התפתחות הטכנולוגיה',
    icon: 'cpu',
    difficulty: 'medium',
    timeEstimate: '45 דקות',
    totalQuestions: 25,
    targetQuestions: 25,
    targetCount: 25,
    completedPercentage: 0,
    categoryId: 1,
    estimatedTime: 45,
    tags: ['reading', 'technology'],
    order: 2,
    tips: ['קרא את הטקסט בעיון', 'שים לב למילות המפתח', 'חזור על החלקים הקשים'],
    subtopics: [],
    recommended: true
  },
  {
    id: 3,
    title: 'Environment Reading',
    description: 'שאלות הבנת נקרא על סביבה וקיימות',
    icon: 'globe',
    difficulty: 'medium',
    timeEstimate: '45 דקות',
    totalQuestions: 25,
    targetQuestions: 25,
    targetCount: 25,
    completedPercentage: 0,
    categoryId: 1,
    estimatedTime: 45,
    tags: ['reading', 'environment'],
    order: 3,
    tips: ['קרא את הטקסט בעיון', 'שים לב למילות המפתח', 'חזור על החלקים הקשים'],
    subtopics: [],
    recommended: true
  }
];
