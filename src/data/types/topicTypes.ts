
import { LucideIcon } from 'lucide-react';

export interface Category {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export interface Topic {
  id: number;
  title: string;
  description: string;
  timeEstimate: string;
  totalQuestions: number;
  targetQuestions: number;
  targetCount: number;
  completedPercentage: number;
  difficulty: "beginner" | "intermediate" | "advanced" | "mixed";
  icon: LucideIcon;
  categoryId: number;
  tips: string[];
  subtopics: any[];
  recommended: boolean;
}
