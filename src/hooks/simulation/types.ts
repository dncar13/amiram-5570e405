
import { Question } from "@/data/types/questionTypes";

export interface SimulationState {
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  questions: Question[];
  userAnswers: Record<number, number | null>;
  questionFlags: Record<number, boolean>;
  simulationComplete: boolean;
  score: number;
  totalQuestions: number;
  remainingTime: number;
  isTimerActive: boolean;
  isAnswerSubmitted: boolean;
  showExplanation: boolean;
  progressLoaded: boolean;
  examMode: boolean;
  showAnswersImmediately: boolean;
  answeredQuestionsCount: number;
  correctQuestionsCount: number;
  progressPercentage: number;
  currentScorePercentage: number;
  selectedAnswerIndex: number | null;
}

export interface SimulationActions {
  handleAnswerSelect: (answerIndex: number) => void;
  handleSubmitAnswer: () => void;
  handleNextQuestion: () => void;
  handlePreviousQuestion: () => void;
  handleToggleExplanation: () => void;
  toggleQuestionFlag: (questionIndex: number) => void;
  navigateToQuestion: (questionIndex: number) => void;
  handleRestartSimulation: () => void;
  saveProgress: () => void;
  resetProgress: () => void;
  setSimulationComplete: (complete: boolean) => void;
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
  remainingTime: 1800, // 30 minutes in seconds
  isTimerActive: false,
  isAnswerSubmitted: false,
  showExplanation: false,
  progressLoaded: false,
  examMode: false,
  showAnswersImmediately: false,
  answeredQuestionsCount: 0,
  correctQuestionsCount: 0,
  progressPercentage: 0,
  currentScorePercentage: 0,
  selectedAnswerIndex: null,
};
