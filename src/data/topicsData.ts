
import { Topic } from './types/topicTypes';

export const topicsData: Topic[] = [
  {
    id: 1,
    title: "Reading Comprehension - Level 1",
    description: "טקסטים קצרים עם שאלות הבנה בסיסיות",
    categoryId: 1,
    difficulty: "beginner",
    estimatedTime: 25,
    questionCount: 15,
    tags: ["reading", "comprehension", "basic"]
  },
  {
    id: 2,
    title: "Reading Comprehension - Level 2",
    description: "טקסטים מתקדמים עם שאלות הבנה מורכבות",
    categoryId: 1,
    difficulty: "advanced",
    estimatedTime: 35,
    questionCount: 20,
    tags: ["reading", "comprehension", "advanced"]
  },
  {
    id: 3,
    title: "Sentence Completion - Basic",
    description: "השלמת משפטים ברמה בסיסית",
    categoryId: 2,
    difficulty: "beginner",
    estimatedTime: 20,
    questionCount: 25,
    tags: ["vocabulary", "grammar", "basic"]
  },
  {
    id: 4,
    title: "Sentence Completion - Advanced",
    description: "השלמת משפטים ברמה מתקדמת",
    categoryId: 2,
    difficulty: "advanced",
    estimatedTime: 30,
    questionCount: 25,
    tags: ["vocabulary", "grammar", "advanced"]
  },
  {
    id: 5,
    title: "Restatement - Basic",
    description: "ניסוח מחדש ברמה בסיסית",
    categoryId: 3,
    difficulty: "beginner",
    estimatedTime: 20,
    questionCount: 20,
    tags: ["paraphrasing", "meaning", "basic"]
  },
  {
    id: 6,
    title: "Restatement - Advanced",
    description: "ניסוח מחדש ברמה מתקדמת",
    categoryId: 3,
    difficulty: "advanced",
    estimatedTime: 30,
    questionCount: 20,
    tags: ["paraphrasing", "meaning", "advanced"]
  },
  {
    id: 7,
    title: "AMIRAM Practice Test 1",
    description: "מבחן תרגול מלא הכולל את כל סוגי השאלות",
    categoryId: 4,
    difficulty: "intermediate",
    estimatedTime: 60,
    questionCount: 50,
    tags: ["comprehensive", "practice", "exam"]
  },
  {
    id: 8,
    title: "AMIRAM Practice Test 2",
    description: "מבחן תרגול מלא נוסף",
    categoryId: 4,
    difficulty: "intermediate",
    estimatedTime: 60,
    questionCount: 50,
    tags: ["comprehensive", "practice", "exam"]
  }
];

// Export the getTopicById function
export const getTopicById = (id: number): Topic | undefined => {
  return topicsData.find(topic => topic.id === id);
};
