
import { SimulationState, SimulationActions } from './types';
import { SimulationStateData } from '@/types/common';
import { saveSimulationProgress } from './progressUtils';

export const createSimulationActions = (
  state: SimulationState,
  setState: (updater: (prevState: SimulationState) => SimulationState) => void,
  simulationId: string
): SimulationActions => {
  
  const handleAnswerSelect = (answerIndex: number) => {
    setState(prevState => ({
      ...prevState,
      selectedAnswerIndex: answerIndex,
      isAnswerSubmitted: false
    }));
  };

  const handleSubmitAnswer = () => {
    setState(prevState => {
      if (prevState.selectedAnswerIndex === null || prevState.isAnswerSubmitted) {
        return prevState;
      }

      const currentQuestion = prevState.currentQuestion;
      if (!currentQuestion) return prevState;

      const isCorrect = prevState.selectedAnswerIndex === currentQuestion.correctAnswer;
      const wasAlreadyAnswered = prevState.currentQuestionIndex in prevState.userAnswers;

      const newState = {
        ...prevState,
        userAnswers: {
          ...prevState.userAnswers,
          [prevState.currentQuestionIndex]: prevState.selectedAnswerIndex
        },
        isAnswerSubmitted: true,
        showExplanation: prevState.showAnswersImmediately,
        answeredQuestionsCount: wasAlreadyAnswered 
          ? prevState.answeredQuestionsCount 
          : prevState.answeredQuestionsCount + 1,
        correctQuestionsCount: wasAlreadyAnswered
          ? (isCorrect ? prevState.correctQuestionsCount + (prevState.userAnswers[prevState.currentQuestionIndex] === currentQuestion.correctAnswer ? 0 : 1) 
                      : prevState.correctQuestionsCount - (prevState.userAnswers[prevState.currentQuestionIndex] === currentQuestion.correctAnswer ? 1 : 0))
          : (isCorrect ? prevState.correctQuestionsCount + 1 : prevState.correctQuestionsCount)
      };

      // Calculate progress
      newState.progressPercentage = (newState.answeredQuestionsCount / newState.totalQuestions) * 100;
      newState.currentScorePercentage = newState.answeredQuestionsCount > 0 
        ? (newState.correctQuestionsCount / newState.answeredQuestionsCount) * 100 
        : 0;

      return newState;
    });
  };

  const handleNextQuestion = () => {
    setState(prevState => {
      if (prevState.currentQuestionIndex >= prevState.questions.length - 1) {
        return {
          ...prevState,
          simulationComplete: true,
          score: prevState.correctQuestionsCount
        };
      }

      const nextIndex = prevState.currentQuestionIndex + 1;
      const nextQuestion = prevState.questions[nextIndex];
      const hasAnswer = nextIndex in prevState.userAnswers;

      return {
        ...prevState,
        currentQuestionIndex: nextIndex,
        currentQuestion: nextQuestion,
        selectedAnswerIndex: hasAnswer ? prevState.userAnswers[nextIndex] : null,
        isAnswerSubmitted: hasAnswer,
        showExplanation: false
      };
    });
  };

  const handlePreviousQuestion = () => {
    setState(prevState => {
      if (prevState.currentQuestionIndex <= 0) return prevState;

      const prevIndex = prevState.currentQuestionIndex - 1;
      const prevQuestion = prevState.questions[prevIndex];
      const hasAnswer = prevIndex in prevState.userAnswers;

      return {
        ...prevState,
        currentQuestionIndex: prevIndex,
        currentQuestion: prevQuestion,
        selectedAnswerIndex: hasAnswer ? prevState.userAnswers[prevIndex] : null,
        isAnswerSubmitted: hasAnswer,
        showExplanation: false
      };
    });
  };

  const handleToggleExplanation = () => {
    setState(prevState => ({
      ...prevState,
      showExplanation: !prevState.showExplanation
    }));
  };

  const toggleQuestionFlag = (questionIndex: number) => {
    setState(prevState => ({
      ...prevState,
      questionFlags: {
        ...prevState.questionFlags,
        [questionIndex]: !prevState.questionFlags[questionIndex]
      }
    }));
  };

  const navigateToQuestion = (questionIndex: number) => {
    setState(prevState => {
      if (questionIndex < 0 || questionIndex >= prevState.questions.length) {
        return prevState;
      }

      const question = prevState.questions[questionIndex];
      const hasAnswer = questionIndex in prevState.userAnswers;

      return {
        ...prevState,
        currentQuestionIndex: questionIndex,
        currentQuestion: question,
        selectedAnswerIndex: hasAnswer ? prevState.userAnswers[questionIndex] : null,
        isAnswerSubmitted: hasAnswer,
        showExplanation: false
      };
    });
  };

  const handleRestartSimulation = () => {
    setState(prevState => ({
      ...prevState,
      currentQuestionIndex: 0,
      currentQuestion: prevState.questions[0] || null,
      userAnswers: {},
      questionFlags: {},
      simulationComplete: false,
      score: 0,
      isAnswerSubmitted: false,
      showExplanation: false,
      answeredQuestionsCount: 0,
      correctQuestionsCount: 0,
      progressPercentage: 0,
      currentScorePercentage: 0,
      selectedAnswerIndex: null
    }));
  };

  const saveProgress = () => {
    const stateData: SimulationStateData = {
      currentQuestionIndex: state.currentQuestionIndex,
      userAnswers: state.userAnswers,
      questionFlags: state.questionFlags,
      remainingTime: state.remainingTime,
      isTimerActive: state.isTimerActive,
      examMode: state.examMode,
      showAnswersImmediately: state.showAnswersImmediately,
      answeredQuestionsCount: state.answeredQuestionsCount,
      correctQuestionsCount: state.correctQuestionsCount,
      progressPercentage: state.progressPercentage,
      currentScorePercentage: state.currentScorePercentage,
      selectedAnswerIndex: state.selectedAnswerIndex
    };

    saveSimulationProgress(simulationId, stateData);
  };

  const resetProgress = () => {
    localStorage.removeItem(`simulation_progress_${simulationId}`);
  };

  const setSimulationComplete = (complete: boolean) => {
    setState(prevState => ({
      ...prevState,
      simulationComplete: complete,
      score: complete ? prevState.correctQuestionsCount : prevState.score
    }));
  };

  return {
    handleAnswerSelect,
    handleSubmitAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    handleToggleExplanation,
    toggleQuestionFlag,
    navigateToQuestion,
    handleRestartSimulation,
    saveProgress,
    resetProgress,
    setSimulationComplete
  };
};
