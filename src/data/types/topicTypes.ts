
import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface Topic {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  icon: string | React.ReactNode | IconObject | LucideIcon;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  tags: string[];
  order: number;
  metadata?: Record<string, unknown>;
  
  // Additional properties used throughout the app
  timeEstimate?: string | number;
  totalQuestions?: number;
  targetQuestions?: number;
  targetCount?: number;
  completedPercentage?: number;
  tips?: string[];
  subtopics?: Subtopic[];
  recommended?: boolean;
}

export interface IconObject {
  type: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  props?: Record<string, unknown>;
}

export interface Subtopic {
  id: number;
  title?: string;
  name?: string;
  description: string;
  topicId: number;
  icon?: string | React.ReactNode | IconObject | LucideIcon;
  targetCount: number;
  questionIds?: number[];
  order?: number;
}

export interface TopicCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  topics: Topic[];
  order: number;
  metadata?: Record<string, unknown>;
}

export interface Category {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode | IconObject | string | LucideIcon;
  color: string;
  topicIds: number[];
}

export interface TopicProgress {
  topicId: number;
  completedQuestions: number;
  totalQuestions: number;
  correctAnswers: number;
  lastAccessedAt: string;
  timeSpent: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TopicStatistics {
  topicId: number;
  averageScore: number;
  totalAttempts: number;
  bestScore: number;
  timeSpent: number;
  lastAttempt: string;
  trend: 'improving' | 'stable' | 'declining';
}

export interface TopicFilter {
  categories: number[];
  difficulties: ('easy' | 'medium' | 'hard')[];
  tags: string[];
  progress: 'all' | 'completed' | 'in-progress' | 'not-started';
}

export interface TopicSearchResult {
  topic: Topic;
  relevanceScore: number;
  matchedFields: string[];
}
