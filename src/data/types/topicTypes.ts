
import { LucideIcon } from 'lucide-react';
import React from 'react';

// Define IconObject interface for icon components
export interface IconObject {
  type: React.ElementType;
  props?: React.ComponentProps<any>;
}

// Define Subtopic interface
export interface Subtopic {
  id: number;
  title: string;
  name: string; 
  description: string;
  questionsCount: number;
  targetCount: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  icon?: React.ReactNode | IconObject;
  questionIds: number[]; 
}

export interface Category {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode | IconObject | LucideIcon;
  color: string;
  topicIds: number[];
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
