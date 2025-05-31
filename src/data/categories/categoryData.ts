
import { Category } from '../types/topicTypes';
import { BookOpen, Brain, MessageSquare, Zap } from 'lucide-react';

export const categoryData: Category[] = [
  {
    id: 1,
    title: "Reading Comprehension",
    description: "בחן את יכולת ההבנה והפירוש של טקסטים באנגלית",
    icon: BookOpen,
    color: "bg-blue-500",
    topicIds: [1, 2]
  },
  {
    id: 2,
    title: "Grammar",
    description: "דקדוק אנגלי - זמנים, מבנה משפט וכללי לשון",
    icon: Brain,
    color: "bg-green-500",
    topicIds: [3, 4, 5]
  },
  {
    id: 3,
    title: "Vocabulary",
    description: "אוצר מילים ומשמעויות במגוון הקשרים",
    icon: MessageSquare,
    color: "bg-purple-500",
    topicIds: [6, 7, 8]
  },
  {
    id: 4,
    title: "Comprehensive Test",
    description: "מבחן מקיף הכולל את כל נושאי האמירם",
    icon: Zap,
    color: "bg-orange-500",
    topicIds: [9, 10]
  }
];
