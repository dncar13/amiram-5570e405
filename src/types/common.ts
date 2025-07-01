
// Common type definitions to replace 'any' types throughout the application

export type StorageData = Record<string, unknown>;

export interface SimulationStateData {
  currentQuestionIndex: number;
  userAnswers: Record<number, number | null>;
  questionFlags: Record<number, boolean>;
  remainingTime: number;
  isTimerActive: boolean;
  examMode: boolean;
  showAnswersImmediately: boolean;
  answeredQuestionsCount: number;
  correctQuestionsCount: number;
  progressPercentage: number;
  currentScorePercentage: number;
  selectedAnswerIndex?: number | null;
}

export interface AuthCallbackFunction {
  (user: unknown): void;
}

export interface QuestionSetData {
  id: string;
  title: string;
  questions: unknown[];
  metadata?: Record<string, unknown>;
}

export interface FilterFunction<T = unknown> {
  (item: T): boolean;
}

export interface GenericEventHandler {
  (event: Event): void;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface ProgressData {
  completed: boolean;
  inProgress: boolean;
  score?: number;
  answeredQuestions: number;
  totalQuestions?: number;
}

export interface TimerConfig {
  duration: number;
  onTick: (remainingTime: number) => void;
  onComplete: () => void;
}

export interface MobilePerformanceConfig {
  maxRetries: number;
  maxOAuthRetries: number;
  initialTimeout: number;
  retryDelay: number;
  eventsPerSecond: number;
  inputDebounce: number;
  sessionDebounce: number;
  enableHeavyAnimations: boolean;
  enableDebugLogging: boolean;
}
