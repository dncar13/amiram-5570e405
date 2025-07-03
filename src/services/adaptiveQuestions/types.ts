
/**
 * TypeScript type definitions for Adaptive Question Delivery System
 */

import { Question } from '@/data/types/questionTypes';

// =====================================================
// CORE TYPES
// =====================================================

export interface QuestionDeliveryOptions {
  userId: string;
  difficulty: DifficultyLevel;
  sessionType: SessionType;
  questionLimit: number;
  topicFilter?: string[];
  excludeQuestionIds?: number[];
  forceReshuffle?: boolean;
  deliveryStrategy?: DeliveryStrategy;
}

export interface UserProgress {
  userId: string;
  difficulty: DifficultyLevel;
  totalQuestionsAvailable: number;
  questionsSeen: number;
  questionsCorrect: number;
  questionsIncorrect: number;
  questionsFlagged: number;
  averageAccuracy: number;
  averageTimePerQuestion: number;
  totalPracticeTime: number;
  currentStreakDays: number;
  longestStreakDays: number;
  lastPracticeDate: Date | null;
  firstQuestionDate: Date | null;
  lastResetDate: Date | null;
  updatedAt: Date;
}

export interface SimulationSession {
  id: string;
  userId: string;
  sessionType: SessionType;
  difficulty: DifficultyLevel | 'mixed';
  topicFilter?: string[];
  questionLimit: number;
  questionsAttempted: number;
  questionsCorrect: number;
  totalTimeSeconds: number;
  scorePercentage: number;
  status: SessionStatus;
  startedAt: Date;
  completedAt?: Date;
  questionIds: number[];
  userAgent?: string;
}

export interface QuestionInteraction {
  id: string;
  userId: string;
  questionId: number;
  answerSelected?: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  simulationSessionId?: string;
  simulationType: SessionType;
  difficulty: DifficultyLevel;
  flagged: boolean;
  notes?: string;
  lastSeenAt: Date;
  createdAt: Date;
}

export interface ProgressSummary {
  difficulty: DifficultyLevel;
  progress: UserProgress;
  recentActivity: {
    questionsThisWeek: number;
    averageAccuracyThisWeek: number;
    practiceTimeThisWeek: number;
    streakDays: number;
  };
  recommendations: {
    suggestedSessionType: SessionType;
    focusAreas: string[];
    nextMilestone: string;
  };
}

export interface DeliveryResult {
  questions: Question[];
  strategy: DeliveryStrategy;
  metadata: {
    totalPoolSize: number;
    unseenPoolSize: number;
    algorithmVersion: string;
    selectionTimeMs: number;
    weightFactors: Record<string, number>;
  };
}

export interface UserPreferences {
  userId: string;
  
  // Core simulation preferences
  preferredDifficulty: DifficultyLevel;
  questionsPerSession: number;
  deliveryStrategy: DeliveryStrategy;
  preferredQuestionGroup?: string;
  
  // UI preferences
  showExplanations: boolean;
  enableSound: boolean;
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  
  // Notifications
  dailyReminderEnabled: boolean;
  achievementNotifications: boolean;
  
  // Analytics
  allowAnalytics: boolean;
}

// Add missing types
export interface QuestionDeliveryResult {
  questions: Question[];
  strategy: DeliveryStrategy;
  metadata: {
    totalPoolSize: number;
    unseenPoolSize: number;
    algorithmVersion: string;
    selectionTimeMs: number;
    weightFactors: Record<string, number>;
  };
}

export interface SimulationSessionResult {
  sessionId: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeSpent: number;
  completedAt: Date;
}

export interface QuestionAnswer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
  answeredAt: Date;
  sessionId: string;
  difficulty: DifficultyLevel;
}

export interface UserAnalytics {
  overall: {
    accuracy: number;
    totalQuestions: number;
    currentStreak: number;
    averageTime: number;
  };
  byDifficulty?: {
    [key: string]: {
      accuracy: number;
    };
  };
}

// =====================================================
// ENUMS AND CONSTANTS
// =====================================================

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type SessionType = 
  | 'quick'           // 10-15 questions
  | 'full'            // 30+ questions  
  | 'custom'          // User-defined length
  | 'practice'        // Unlimited practice
  | 'review_mistakes' // Focus on previously incorrect
  | 'unseen_only';    // Only questions not seen in 30 days

export type SessionStatus = 'in_progress' | 'completed' | 'abandoned';

export type DeliveryStrategy = 
  | 'unseen_priority'    // Prioritize unseen questions
  | 'random_weighted'    // Weighted random selection
  | 'spaced_repetition'  // Focus on review timing
  | 'fallback_reshuffle' // When all questions seen
  | 'mistake_review';    // Focus on incorrect answers

// =====================================================
// API REQUEST/RESPONSE TYPES
// =====================================================

export interface StartSimulationRequest {
  sessionType: SessionType;
  difficulty?: DifficultyLevel;
  questionLimit?: number;
  topicFilter?: string[];
  customPreferences?: Partial<UserPreferences>;
}

export interface StartSimulationResponse {
  sessionId: string;
  questions: Question[];
  sessionConfig: {
    sessionType: SessionType;
    difficulty: DifficultyLevel | 'mixed';
    totalQuestions: number;
    estimatedTimeMinutes: number;
  };
  deliveryMetadata: DeliveryResult['metadata'];
}

export interface SubmitAnswerRequest {
  sessionId: string;
  questionId: number;
  answerSelected: number;
  timeSpentSeconds: number;
  flagged?: boolean;
  notes?: string;
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
  correctAnswer: number;
  explanation: string;
  progress: {
    questionsAnswered: number;
    questionsRemaining: number;
    currentAccuracy: number;
  };
  nextAction: 'continue' | 'complete' | 'review';
}

export interface GetProgressRequest {
  difficulty?: DifficultyLevel;
  includeHistory?: boolean;
  timeRange?: 'week' | 'month' | 'all';
}

export interface GetProgressResponse {
  summaries: ProgressSummary[];
  overallStats: {
    totalQuestionsAnswered: number;
    overallAccuracy: number;
    totalPracticeTime: number;
    currentStreak: number;
    achievements: string[];
  };
  history?: QuestionInteraction[];
}

// =====================================================
// DATABASE OPERATION TYPES
// =====================================================

export interface DatabaseQuestionHistory {
  id: string;
  user_id: string;
  question_id: number;
  answer_selected?: number;
  is_correct: boolean;
  time_spent_seconds: number;
  simulation_session_id?: string;
  simulation_type: string;
  difficulty: string;
  flagged: boolean;
  notes?: string;
  last_seen_at: string;
  created_at: string;
}

export interface DatabaseProgressSummary {
  id: string;
  user_id: string;
  difficulty: string;
  total_questions_available: number;
  questions_seen: number;
  questions_correct: number;
  questions_incorrect: number;
  questions_flagged: number;
  average_accuracy: number;
  average_time_per_question: number;
  total_practice_time: number;
  current_streak_days: number;
  longest_streak_days: number;
  last_practice_date?: string;
  first_question_date?: string;
  last_reset_date?: string;
  updated_at: string;
  created_at: string;
}

export interface DatabaseSimulationSession {
  id: string;
  user_id: string;
  session_type: string;
  difficulty?: string;
  topic_filter?: string[];
  question_limit: number;
  questions_attempted: number;
  questions_correct: number;
  total_time_seconds: number;
  score_percentage: number;
  status: string;
  started_at: string;
  completed_at?: string;
  questions_ids: number[];
  user_agent?: string;
  created_at: string;
}
