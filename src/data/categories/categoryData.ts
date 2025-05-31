
import { Category } from '../types/topicTypes';
import { BookOpen, PenTool, RefreshCw, Zap, FileText } from 'lucide-react';

// Export the Category type for convenience
export type { Category } from '../types/topicTypes';

export const categoryData: Category[] = [
  {
    id: 1,
    title: "Reading Comprehension - Short Passages",
    description: "בחן את יכולת ההבנה והפירוש של קטעים קצרים באנגלית",
    icon: BookOpen,
    color: "bg-blue-500",
    topicIds: [1, 2]
  },
  {
    id: 2,
    title: "Reading Comprehension - Extended Passages",
    description: "קטעי קריאה מורכבים עם מספור שורות ושאלות מתקדמות",
    icon: FileText,
    color: "bg-indigo-500",
    topicIds: [9, 10]
  },
  {
    id: 3,
    title: "Sentence Completion",
    description: "השלמת משפטים - בחירת המילה הנכונה להשלמת המשפט",
    icon: PenTool,
    color: "bg-green-500",
    topicIds: [3, 4]
  },
  {
    id: 4,
    title: "Restatement",
    description: "ניסוח מחדש - זיהוי המשפט השקול במשמעותו",
    icon: RefreshCw,
    color: "bg-purple-500",
    topicIds: [5, 6]
  },
  {
    id: 5,
    title: "Comprehensive Test",
    description: "מבחן מקיף הכולל את כל סוגי השאלות באמירם",
    icon: Zap,
    color: "bg-orange-500",
    topicIds: [7, 8]
  }
];
