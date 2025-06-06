
import { Topic } from './types/topicTypes';
import { LucideIcon, BookOpen, Globe, Cpu } from 'lucide-react';

export const topicsData: Topic[] = [
  {
    id: 1,
    title: 'The Rise of the Gig Economy',
    description: 'שאלות הבנת נקרא על כלכלת הגיג',
    icon: BookOpen as LucideIcon,
    difficulty: 'medium',
    estimatedTime: 45,
    questionCount: 25,
    category: 'reading-comprehension',
    color: 'from-blue-500 to-purple-600',
    tags: ['reading', 'economics', 'modern-society'],
    isActive: true,
    hasPremiumContent: false,
    subject: 'economics'
  },
  {
    id: 2,
    title: 'Technology Reading',
    description: 'שאלות הבנת נקרא על התפתחות הטכנולוגיה',
    icon: Cpu as LucideIcon,
    difficulty: 'medium',
    estimatedTime: 45,
    questionCount: 25,
    category: 'reading-comprehension',
    color: 'from-purple-500 to-pink-600',
    tags: ['reading', 'technology', 'computing'],
    isActive: true,
    hasPremiumContent: false,
    subject: 'technology'
  },
  {
    id: 3,
    title: 'Environment Reading',
    description: 'שאלות הבנת נקרא על סביבה וקיימות',
    icon: Globe as LucideIcon,
    difficulty: 'medium',
    estimatedTime: 45,
    questionCount: 25,
    category: 'reading-comprehension',
    color: 'from-green-500 to-teal-600',
    tags: ['reading', 'environment', 'sustainability'],
    isActive: true,
    hasPremiumContent: false,
    subject: 'environment'
  }
];
