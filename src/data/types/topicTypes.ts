
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
  targetCount: number; // Target number of questions (typically 50)
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  icon?: React.ReactNode | IconObject;
  questionIds: number[]; 
}

// Define Topic interface
export interface Topic {
  id: number;
  title: string;
  description: string;
  timeEstimate?: string;
  totalQuestions: number;
  targetQuestions?: number; // Target total questions for this topic
  targetCount?: number;
  completedPercentage?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  icon?: React.ReactNode | IconObject;
  categoryId?: number;
  tips?: string[];
  subtopics?: Subtopic[]; // Add subtopics array
  recommended?: boolean;
}

// Define Category interface
export interface Category {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode | IconObject;
  topicIds: number[];
}

// Note: No "TopicType" export here since it's not needed
