
import { Question } from "@/data/types/questionTypes";

export interface SimulationState {
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  questions: Question[];
  userAnswers: Record<number, number>;
  questionFlags: Record<number, boolean>;
  simulationComplete: boolean;
  score: number;
  totalQuestions: number;
  remainingTime: number;
  isTimerActive: boolean;
  selectedAnswerIndex: number | null;
  isAnswerSubmitted: boolean;
  showExplanation: boolean;
  progressLoaded: boolean;
  examMode: boolean;
  showAnswersImmediately: boolean;
  answeredQuestionsCount: number;
  correctQuestionsCount: number;
  progressPercentage: number;
  currentScorePercentage: number;
  questionStartTime?: number;
  sessionStartTime?: number;
}

export interface SimulationActions {
  handleAnswerSelect: (answerIndex: number) => void;
  handleSubmitAnswer: () => void;
  handleNextQuestion: () => void;
  handlePreviousQuestion: () => void;
  handleToggleExplanation: () => void;
  toggleQuestionFlag: () => void;
  handleCompleteSimulation: () => void;
  handleStartTimer: () => void;
  handleStopTimer: () => void;
  handleResetTimer: (newDuration?: number) => void;
}

export const initialSimulationState: SimulationState = {
  currentQuestionIndex: 0,
  currentQuestion: null,
  questions: [],
  userAnswers: {},
  questionFlags: {},
  simulationComplete: false,
  score: 0,
  totalQuestions: 0,
  remainingTime: 1800,
  isTimerActive: false,
  selectedAnswerIndex: null,
  isAnswerSubmitted: false,
  showExplanation: false,
  progressLoaded: false,
  examMode: false,
  showAnswersImmediately: true,
  answeredQuestionsCount: 0,
  correctQuestionsCount: 0,
  progressPercentage: 0,
  currentScorePercentage: 0,
  questionStartTime: Date.now(),
  sessionStartTime: Date.now(),
};
