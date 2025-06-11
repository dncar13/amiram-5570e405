import { useState, useEffect, useCallback, useRef } from "react";
import { Question } from "@/data/types/questionTypes";
import { saveActivity } from "@/hooks/useActivityHistory";
import { useToast } from "@/hooks/use-toast";
import { 
  getEasyQuestions, 
  getMediumQuestions, 
  getHardQuestions, 
  getMixedDifficultyQuestions,
  getRestatementQuestions,
  getQuestionsByDifficultyAndType
} from "@/services/questionsService";

interface SimulationState {
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
}

interface SimulationActions {
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

const initialSimulationState: SimulationState = {
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
};

export const useSimulation = (
  simulationId: string, 
  isQuestionSet: boolean = false,
  storyQuestions?: Question[]
) => {
  const [state, setState] = useState<SimulationState>(initialSimulationState);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const progressLoadedRef = useRef(false);
  const { toast } = useToast();

  const initializeTimer = useCallback(() => {
    console.log("Initializing timer");
    
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    
    timerInterval.current = setInterval(() => {
      setState(prevState => {
        if (!prevState.isTimerActive || prevState.remainingTime <= 0) {
          clearInterval(timerInterval.current!);
          return prevState;
        }
        
        return { ...prevState, remainingTime: prevState.remainingTime - 1 };
      });
    }, 1000);
  }, []);

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    setState(prevState => ({ ...prevState, selectedAnswerIndex: answerIndex }));
  }, []);

  const handleSubmitAnswer = useCallback(() => {
    setState(prevState => {
      if (prevState.isAnswerSubmitted || prevState.currentQuestion === null) {
        return prevState;
      }
      
      const isCorrect = prevState.selectedAnswerIndex === prevState.currentQuestion.correctAnswer;
      const questionId = prevState.currentQuestion.id;
      
      // Save activity record
      saveActivity({
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        topic: 'General',
        questionId: String(questionId),
        status: isCorrect ? 'correct' : 'wrong',
        isCorrect: isCorrect,
        isCompleted: false
      });
      
      const updatedUserAnswers = { ...prevState.userAnswers, [prevState.currentQuestionIndex]: prevState.selectedAnswerIndex };
      const newScore = isCorrect ? prevState.score + 1 : prevState.score;
      const newCorrectQuestionsCount = isCorrect ? prevState.correctQuestionsCount + 1 : prevState.correctQuestionsCount;
      const newAnsweredQuestionsCount = prevState.answeredQuestionsCount + 1;
      const newProgressPercentage = Math.round((newAnsweredQuestionsCount / prevState.totalQuestions) * 100);
      const newCurrentScorePercentage = Math.round((newScore / prevState.totalQuestions) * 100);
      
      return {
        ...prevState,
        userAnswers: updatedUserAnswers,
        score: newScore,
        isAnswerSubmitted: true,
        showExplanation: true,
        correctQuestionsCount: newCorrectQuestionsCount,
        answeredQuestionsCount: newAnsweredQuestionsCount,
        progressPercentage: newProgressPercentage,
        currentScorePercentage: newCurrentScorePercentage
      };
    });
  }, []);

  const handleNextQuestion = useCallback(() => {
    setState(prevState => {
      if (prevState.currentQuestionIndex < prevState.totalQuestions - 1) {
        return {
          ...prevState,
          currentQuestionIndex: prevState.currentQuestionIndex + 1,
          currentQuestion: prevState.questions[prevState.currentQuestionIndex + 1],
          isAnswerSubmitted: false,
          showExplanation: false,
          selectedAnswerIndex: null
        };
      } else {
        // End of simulation
        clearInterval(timerInterval.current!);
        
        // Save activity record for completion
        saveActivity({
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          topic: 'General',
          questionId: 'N/A',
          status: 'completed',
          score: prevState.score,
          correctAnswers: prevState.correctQuestionsCount,
          totalAnswered: prevState.totalQuestions,
          isCompleted: true
        });
        
        return { ...prevState, isTimerActive: false, simulationComplete: true };
      }
    });
  }, []);

  const handlePreviousQuestion = useCallback(() => {
    setState(prevState => {
      if (prevState.currentQuestionIndex > 0) {
        return {
          ...prevState,
          currentQuestionIndex: prevState.currentQuestionIndex - 1,
          currentQuestion: prevState.questions[prevState.currentQuestionIndex - 1],
          isAnswerSubmitted: false,
          showExplanation: false,
          selectedAnswerIndex: null
        };
      }
      return prevState;
    });
  }, []);

  const handleToggleExplanation = useCallback(() => {
    setState(prevState => ({ ...prevState, showExplanation: !prevState.showExplanation }));
  }, []);

  const toggleQuestionFlag = useCallback((questionIndex: number) => {
    setState(prevState => {
      const questionId = prevState.questions[questionIndex].id;
      const newFlags = { ...prevState.questionFlags, [questionId]: !prevState.questionFlags[questionId] };
      return { ...prevState, questionFlags: newFlags };
    });
  }, []);

  const navigateToQuestion = useCallback((questionIndex: number) => {
    setState(prevState => ({
      ...prevState,
      currentQuestionIndex: questionIndex,
      currentQuestion: prevState.questions[questionIndex],
      isAnswerSubmitted: false,
      showExplanation: false,
      selectedAnswerIndex: null
    }));
  }, []);

  const handleRestartSimulation = useCallback(() => {
    console.log("Restarting simulation");
    
    clearInterval(timerInterval.current!);
    
    setState(prevState => ({
      ...initialSimulationState,
      questions: prevState.questions,
      totalQuestions: prevState.totalQuestions,
      isTimerActive: prevState.examMode,
      remainingTime: 1800
    }));
    
    initializeTimer();
  }, [initializeTimer]);

  const saveProgress = useCallback(() => {
    try {
      const progress = {
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
        currentScorePercentage: state.currentScorePercentage
      };
      
      sessionStorage.setItem(`simulation_progress_${simulationId}`, JSON.stringify(progress));
      console.log(`Simulation progress saved for ${simulationId}`);
    } catch (error) {
      console.error("Error saving simulation progress:", error);
    }
  }, [simulationId, state]);

  const resetProgress = useCallback(() => {
    try {
      sessionStorage.removeItem(`simulation_progress_${simulationId}`);
      console.log(`Simulation progress reset for ${simulationId}`);
      
      setState(prevState => ({
        ...initialSimulationState,
        questions: prevState.questions,
        totalQuestions: prevState.totalQuestions,
        examMode: prevState.examMode,
        showAnswersImmediately: prevState.showAnswersImmediately
      }));
      
      toast({
        title: "איפוס סימולציה",
        description: "הנתונים אופסו והסימולציה מתחילה מחדש",
        variant: "default",
      });
    } catch (error) {
      console.error("Error resetting simulation progress:", error);
    }
  }, [simulationId, toast]);

  const setSimulationComplete = useCallback((complete: boolean) => {
    setState(prevState => ({ ...prevState, simulationComplete: complete }));
  }, []);

  // Initialize questions based on simulation type
  const initializeQuestions = useCallback(() => {
    console.log("Initializing questions for simulation:", { simulationId, isQuestionSet });
    
    let questionsToUse: Question[] = [];
    
    if (storyQuestions && storyQuestions.length > 0) {
      questionsToUse = [...storyQuestions];
      console.log(`Using ${questionsToUse.length} story questions`);
    } else if (sessionStorage.getItem('is_difficulty_based') === 'true') {
      const difficultyLevel = sessionStorage.getItem('current_difficulty_level');
      const difficultyType = sessionStorage.getItem('current_difficulty_type');
      
      console.log(`Getting difficulty-based questions: ${difficultyLevel}, ${difficultyType}`);
      
      if (difficultyLevel && difficultyType) {
        if (difficultyType === 'mixed') {
          questionsToUse = getMixedDifficultyQuestions(difficultyLevel as 'easy' | 'medium' | 'hard');
        } else {
          questionsToUse = getQuestionsByDifficultyAndType(difficultyLevel, difficultyType);
        }
      }
    }
    
    if (questionsToUse.length > 0) {
      console.log(`Setting ${questionsToUse.length} questions for simulation`);
      setQuestions(questionsToUse);
      setTotalQuestions(questionsToUse.length);
      
      if (questionsToUse.length > 0) {
        setCurrentQuestion(questionsToUse[0]);
      }
    }
  }, [simulationId, isQuestionSet, storyQuestions]);

  useEffect(() => {
    initializeQuestions();
  }, [initializeQuestions]);

  useEffect(() => {
    const savedProgress = sessionStorage.getItem(`simulation_progress_${simulationId}`);
    
    if (savedProgress && !progressLoadedRef.current) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        
        setState(prevState => ({
          ...prevState,
          currentQuestionIndex: parsedProgress.currentQuestionIndex || 0,
          userAnswers: parsedProgress.userAnswers || {},
          questionFlags: parsedProgress.questionFlags || {},
          remainingTime: parsedProgress.remainingTime || 1800,
          isTimerActive: parsedProgress.isTimerActive !== undefined ? parsedProgress.isTimerActive : false,
          examMode: parsedProgress.examMode !== undefined ? parsedProgress.examMode : false,
          showAnswersImmediately: parsedProgress.showAnswersImmediately !== undefined ? parsedProgress.showAnswersImmediately : false,
          answeredQuestionsCount: parsedProgress.answeredQuestionsCount || 0,
          correctQuestionsCount: parsedProgress.correctQuestionsCount || 0,
          progressPercentage: parsedProgress.progressPercentage || 0,
          currentScorePercentage: parsedProgress.currentScorePercentage || 0,
          progressLoaded: true
        }));
        
        progressLoadedRef.current = true;
        console.log(`Simulation progress loaded for ${simulationId}`);
      } catch (error) {
        console.error("Error loading simulation progress:", error);
      }
    } else {
      setState(prevState => ({ ...prevState, progressLoaded: true }));
    }
  }, [simulationId]);

  useEffect(() => {
    if (state.examMode) {
      initializeTimer();
    } else {
      clearInterval(timerInterval.current!);
    }
    
    return () => clearInterval(timerInterval.current!);
  }, [state.examMode, initializeTimer]);

  const setQuestions = (questions: Question[]) => {
    setState(prevState => ({ ...prevState, questions }));
  };

  const setTotalQuestions = (totalQuestions: number) => {
    setState(prevState => ({ ...prevState, totalQuestions }));
  };

  const setCurrentQuestion = (currentQuestion: Question) => {
    setState(prevState => ({ ...prevState, currentQuestion }));
  };

  const setSelectedAnswerIndex = (selectedAnswerIndex: number | null) => {
    setState(prevState => ({ ...prevState, selectedAnswerIndex }));
  };

  const setIsTimerActive = (isTimerActive: boolean) => {
    setState(prevState => ({ ...prevState, isTimerActive }));
  };

  const setExamMode = (examMode: boolean) => {
    setState(prevState => ({ ...prevState, examMode }));
  };

  const setShowAnswersImmediately = (showAnswersImmediately: boolean) => {
    setState(prevState => ({ ...prevState, showAnswersImmediately }));
  };

  return {
    currentQuestionIndex: state.currentQuestionIndex,
    currentQuestion: state.currentQuestion,
    questions: state.questions,
    userAnswers: state.userAnswers,
    questionFlags: state.questionFlags,
    simulationComplete: state.simulationComplete,
    score: state.score,
    totalQuestions: state.totalQuestions,
    remainingTime: state.remainingTime,
    isTimerActive: state.isTimerActive,
    isAnswerSubmitted: state.isAnswerSubmitted,
    showExplanation: state.showExplanation,
    progressLoaded: state.progressLoaded,
    examMode: state.examMode,
    showAnswersImmediately: state.showAnswersImmediately,
    answeredQuestionsCount: state.answeredQuestionsCount,
    correctQuestionsCount: state.correctQuestionsCount,
    progressPercentage: state.progressPercentage,
    currentScorePercentage: state.currentScorePercentage,
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
    setSimulationComplete,
    setQuestions,
    setTotalQuestions,
    setCurrentQuestion,
    setSelectedAnswerIndex,
    setIsTimerActive,
    setExamMode,
    setShowAnswersImmediately
  };
};
