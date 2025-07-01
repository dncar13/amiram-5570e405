
export interface Topic {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  tags: string[];
  order: number;
  metadata?: Record<string, unknown>;
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
