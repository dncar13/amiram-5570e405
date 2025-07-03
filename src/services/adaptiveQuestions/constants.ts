/**
 * Constants for Adaptive Question Delivery System
 */

import { DeliveryStrategy, SessionType, DifficultyLevel } from './types';

// =====================================================
// DELIVERY STRATEGIES
// =====================================================

export const DELIVERY_STRATEGIES: Record<DeliveryStrategy, {
  name: string;
  description: string;
  weightFactors: Record<string, number>;
}> = {
  unseen_priority: {
    name: 'Unseen Priority',
    description: 'Prioritizes questions not seen in the last 30 days',
    weightFactors: {
      unseenWeight: 10.0,
      recentWeight: 0.1,
      accuracyWeight: 1.0,
      randomness: 0.3
    }
  },
  random_weighted: {
    name: 'Weighted Random',
    description: 'Random selection with slight preference for unseen questions',
    weightFactors: {
      unseenWeight: 2.0,
      recentWeight: 0.5,
      accuracyWeight: 0.5,
      randomness: 5.0
    }
  },
  spaced_repetition: {
    name: 'Spaced Repetition',
    description: 'Optimizes review timing based on forgetting curve',
    weightFactors: {
      unseenWeight: 3.0,
      recentWeight: 2.0,
      accuracyWeight: 3.0,
      timeDecayWeight: 2.5,
      randomness: 0.5
    }
  },
  fallback_reshuffle: {
    name: 'Fallback Reshuffle',
    description: 'Used when all questions have been seen recently',
    weightFactors: {
      unseenWeight: 0.0,
      recentWeight: 1.0,
      accuracyWeight: 2.0,
      randomness: 8.0
    }
  },
  mistake_review: {
    name: 'Mistake Review',
    description: 'Focuses on previously incorrect answers',
    weightFactors: {
      unseenWeight: 1.0,
      recentWeight: 0.5,
      accuracyWeight: 10.0, // High weight for incorrect answers
      mistakeWeight: 15.0,
      randomness: 0.2
    }
  }
};

// =====================================================
// SESSION TYPES
// =====================================================

export const SESSION_TYPES: Record<SessionType, {
  name: string;
  description: string;
  defaultQuestionCount: number;
  estimatedMinutes: number;
  recommendedStrategy: DeliveryStrategy;
}> = {
  quick: {
    name: 'Quick Practice',
    description: 'Short practice session for busy schedules',
    defaultQuestionCount: 10,
    estimatedMinutes: 8,
    recommendedStrategy: 'unseen_priority'
  },
  full: {
    name: 'Full Simulation',
    description: 'Complete exam-like experience',
    defaultQuestionCount: 30,
    estimatedMinutes: 25,
    recommendedStrategy: 'random_weighted'
  },
  custom: {
    name: 'Custom Session',
    description: 'User-defined length and preferences',
    defaultQuestionCount: 20,
    estimatedMinutes: 15,
    recommendedStrategy: 'unseen_priority'
  },
  practice: {
    name: 'Unlimited Practice',
    description: 'Continue practicing until you choose to stop',
    defaultQuestionCount: 50,
    estimatedMinutes: 40,
    recommendedStrategy: 'spaced_repetition'
  },
  review_mistakes: {
    name: 'Review Mistakes',
    description: 'Focus on questions you got wrong previously',
    defaultQuestionCount: 15,
    estimatedMinutes: 15,
    recommendedStrategy: 'mistake_review'
  },
  unseen_only: {
    name: 'Unseen Questions',
    description: 'Only questions you haven\'t seen in 30 days',
    defaultQuestionCount: 25,
    estimatedMinutes: 20,
    recommendedStrategy: 'unseen_priority'
  }
};

// =====================================================
// DIFFICULTY LEVELS
// =====================================================

export const DIFFICULTY_LEVELS: Record<DifficultyLevel, {
  name: string;
  description: string;
  estimatedTimePerQuestion: number; // seconds
  passingScore: number; // percentage
}> = {
  easy: {
    name: 'Easy',
    description: 'Basic concepts and straightforward questions',
    estimatedTimePerQuestion: 45,
    passingScore: 70
  },
  medium: {
    name: 'Medium', 
    description: 'Intermediate concepts requiring more analysis',
    estimatedTimePerQuestion: 60,
    passingScore: 65
  },
  hard: {
    name: 'Hard',
    description: 'Advanced concepts and complex scenarios',
    estimatedTimePerQuestion: 75,
    passingScore: 60
  },
  mixed: {
    name: 'Mixed',
    description: 'Questions from all difficulty levels combined',
    estimatedTimePerQuestion: 60,
    passingScore: 65
  }
};

// =====================================================
// DEFAULT CONFIGURATIONS
// =====================================================

export const DEFAULT_SESSION_CONFIG = {
  questionLimit: 30,
  timeLimit: 1800, // 30 minutes in seconds
  showExplanationsImmediately: true,
  allowFlagging: true,
  allowNotes: true,
  autoAdvanceTime: 0, // seconds (0 = no auto-advance)
  shuffleOptions: true,
  deliveryStrategy: 'unseen_priority' as DeliveryStrategy
};

export const DEFAULT_USER_PREFERENCES = {
  // Core simulation preferences
  preferredDifficulty: 'medium' as DifficultyLevel,
  questionsPerSession: 10,
  deliveryStrategy: 'unseen_priority' as const,
  preferredQuestionGroup: 'mixed',
  
  // UI preferences
  showExplanations: true,
  enableSound: false,
  theme: 'system' as const,
  fontSize: 'medium' as const,
  
  // Notifications
  dailyReminderEnabled: false,
  achievementNotifications: true,
  
  // Analytics
  allowAnalytics: true
};

// =====================================================
// ALGORITHM PARAMETERS
// =====================================================

export const ALGORITHM_CONFIG = {
  // Recency threshold for considering questions "unseen"
  UNSEEN_THRESHOLD_DAYS: 30,
  
  // Minimum pool size before using fallback strategy
  MIN_UNSEEN_POOL_SIZE: 5,
  
  // Maximum weight for any single factor
  MAX_WEIGHT_FACTOR: 15.0,
  
  // Time decay factor for spaced repetition (days)
  TIME_DECAY_FACTOR: 0.1,
  
  // Accuracy threshold for considering questions "difficult"
  DIFFICULTY_ACCURACY_THRESHOLD: 0.6,
  
  // Maximum time allowed for question selection (ms)
  MAX_SELECTION_TIME_MS: 500,
  
  // Minimum randomness to prevent predictable patterns
  MIN_RANDOMNESS_FACTOR: 0.1,
  
  // Progress milestones for achievements
  PROGRESS_MILESTONES: [25, 50, 75, 100, 150, 200, 250, 300],
  
  // Streak milestones for achievements
  STREAK_MILESTONES: [3, 7, 14, 30, 60, 100],
  
  // Accuracy milestones for achievements
  ACCURACY_MILESTONES: [60, 70, 80, 90, 95]
};

// =====================================================
// ERROR MESSAGES
// =====================================================

export const ERROR_MESSAGES = {
  INSUFFICIENT_QUESTIONS: 'Not enough questions available for the requested difficulty level',
  INVALID_SESSION: 'Invalid or expired simulation session',
  USER_NOT_FOUND: 'User not found or not authenticated',
  QUESTION_NOT_FOUND: 'Question not found in the database',
  INVALID_DIFFICULTY: 'Invalid difficulty level specified',
  INVALID_SESSION_TYPE: 'Invalid session type specified',
  DATABASE_ERROR: 'Database operation failed',
  ALGORITHM_TIMEOUT: 'Question selection algorithm timeout',
  INVALID_ANSWER: 'Invalid answer selection',
  SESSION_ALREADY_COMPLETE: 'Session has already been completed',
  UNAUTHORIZED_ACCESS: 'Unauthorized access to user data'
};

// =====================================================
// SUCCESS MESSAGES
// =====================================================

export const SUCCESS_MESSAGES = {
  SESSION_STARTED: 'Simulation session started successfully',
  ANSWER_SUBMITTED: 'Answer submitted successfully',
  SESSION_COMPLETED: 'Simulation session completed',
  PROGRESS_UPDATED: 'Progress updated successfully',
  PREFERENCES_SAVED: 'User preferences saved successfully',
  PROGRESS_RESET: 'Progress reset successfully'
};

// =====================================================
// ACHIEVEMENT DEFINITIONS
// =====================================================

export const ACHIEVEMENTS = {
  FIRST_QUESTION: {
    id: 'first_question',
    name: 'Getting Started',
    description: 'Answered your first question',
    icon: '🎯'
  },
  QUESTIONS_25: {
    id: 'questions_25',
    name: 'Quarter Century',
    description: 'Answered 25 questions',
    icon: '🏅'
  },
  QUESTIONS_100: {
    id: 'questions_100',
    name: 'Centurion',
    description: 'Answered 100 questions',
    icon: '💯'
  },
  QUESTIONS_300: {
    id: 'questions_300',
    name: 'Master',
    description: 'Answered all 300 questions in a difficulty',
    icon: '👑'
  },
  STREAK_7: {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Practiced for 7 days in a row',
    icon: '🔥'
  },
  STREAK_30: {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Practiced for 30 days in a row',
    icon: '🏆'
  },
  ACCURACY_90: {
    id: 'accuracy_90',
    name: 'Precision Expert',
    description: 'Achieved 90% accuracy in a session',
    icon: '🎯'
  },
  PERFECT_SESSION: {
    id: 'perfect_session',
    name: 'Perfection',
    description: 'Got every question right in a session',
    icon: '⭐'
  }
};

// =====================================================
// CACHE KEYS
// =====================================================

export const CACHE_KEYS = {
  USER_PROGRESS: (userId: string, difficulty: DifficultyLevel) => 
    `user_progress:${userId}:${difficulty}`,
  
  USER_PREFERENCES: (userId: string) => 
    `user_preferences:${userId}`,
  
  QUESTION_POOL: (difficulty: DifficultyLevel) => 
    `question_pool:${difficulty}`,
  
  UNSEEN_QUESTIONS: (userId: string, difficulty: DifficultyLevel) => 
    `unseen_questions:${userId}:${difficulty}`,
  
  SESSION_DATA: (sessionId: string) => 
    `session:${sessionId}`,
  
  DASHBOARD_STATS: (userId: string) => 
    `dashboard_stats:${userId}`
};

// =====================================================
// CACHE EXPIRATION TIMES (seconds)
// =====================================================

export const CACHE_TTL = {
  USER_PROGRESS: 300,        // 5 minutes
  USER_PREFERENCES: 3600,    // 1 hour  
  QUESTION_POOL: 86400,      // 24 hours
  UNSEEN_QUESTIONS: 1800,    // 30 minutes
  SESSION_DATA: 7200,        // 2 hours
  DASHBOARD_STATS: 600       // 10 minutes
};
