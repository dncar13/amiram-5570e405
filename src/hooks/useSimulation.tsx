import { useState, useEffect, useCallback, useRef } from "react";
import { Question } from "@/data/types/questionTypes";
import { useToast } from "@/hooks/use-toast";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import { 
  SimulationState, 
  SimulationActions, 
  initialSimulationState 
} from "./simulation/types";
import { loadQuestions } from "./simulation/questionLoader";
import { useTimer } from "./simulation/useTimer";
import { 
  saveSimulationProgress, 
  loadSimulationProgress 
} from "./simulation/progressUtils";
import { createSimulationActions } from "./simulation/simulationActions";

export const useSimulation = (
  simulationId: string, 
  isQuestionSet: boolean = false,
  storyQuestions?: Question[]
) => {
  const [state, setState] = useState<SimulationState>(initialSimulationState);
  const progressLoadedRef = useRef(false);
  const { toast } = useToast();
  const { type, difficulty } = useParams<{ type: string; difficulty: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const questionLimit = searchParams.get('limit');
  const setNumber = searchParams.get('set');
  const startIndex = searchParams.get('start');
  
  // Check for explicit mode parameters
  const practiceParam = searchParams.get('practice');
  const examParam = searchParams.get('exam');
  
  // Get type from query params if not in URL path
  const typeFromQuery = searchParams.get('type');
  const effectiveType = type || typeFromQuery;

  // Check if this is a full exam
  const isFullExam = location.pathname.startsWith('/simulation/full');

  // Determine simulation mode based on URL path and parameters
  const determineSimulationMode = useCallback(() => {
    // Full exam always has exam mode enabled
    if (isFullExam) {
      console.log("Detected full exam mode from URL path");
      return { examMode: true, showAnswersImmediately: false };
    }
    
    // Explicit mode parameters take precedence
    if (practiceParam === '1') return { examMode: false, showAnswersImmediately: true };
    if (examParam === '1') return { examMode: true, showAnswersImmediately: false };
    
    // All other simulations are in practice mode
    console.log("Setting practice mode for simulation");
    return { examMode: false, showAnswersImmediately: true };
  }, [practiceParam, examParam, isFullExam]);

  console.log("useSimulation params:", { type, difficulty, typeFromQuery, effectiveType, questionLimit, practiceParam, examParam, pathname: location.pathname, isFullExam });

  const { initializeTimer, clearTimer } = useTimer(setState);

  // Auto-save progress for training mode only
  useEffect(() => {
    if (state.progressLoaded && !state.examMode && state.answeredQuestionsCount > 0) {
      console.log("Auto-saving training progress:", state.answeredQuestionsCount);
      saveSimulationProgress(simulationId, state, setNumber, type, difficulty);
    }
  }, [state.answeredQuestionsCount, state.currentQuestionIndex, simulationId, state.examMode, state.progressLoaded, setNumber, type, difficulty]);

  // Create simulation actions
  const actions = createSimulationActions(
    state, 
    setState, 
    clearTimer, 
    setNumber, 
    type, 
    difficulty
  );

  const handleRestartSimulation = useCallback(() => {
    console.log("Restarting simulation - clearing state and reinitializing");
    
    clearTimer();
    
    // Get fresh questions for restart
    const questionsToUse = loadQuestions({
      storyQuestions,
      effectiveType,
      difficulty,
      questionLimit,
      setNumber,
      startIndex,
      isFullExam
    });
    
    // Determine mode for restart
    const modeSettings = determineSimulationMode();
    
    console.log(`Restart: Setting ${questionsToUse.length} questions for simulation with mode:`, modeSettings);
    
    setState({
      ...initialSimulationState,
      questions: questionsToUse,
      totalQuestions: questionsToUse.length,
      currentQuestion: questionsToUse.length > 0 ? questionsToUse[0] : null,
      isTimerActive: false,
      remainingTime: 1800,
      progressLoaded: true,
      ...modeSettings
    });
    
    if (modeSettings.examMode) {
      initializeTimer();
    }
  }, [initializeTimer, clearTimer, storyQuestions, effectiveType, difficulty, questionLimit, setNumber, startIndex, isFullExam, determineSimulationMode]);

  const saveProgress = useCallback(() => {
    // Only save progress in training mode
    if (!state.examMode) {
      saveSimulationProgress(simulationId, state, setNumber, type, difficulty);
    }
  }, [simulationId, state, setNumber, type, difficulty]);

  const resetProgress = useCallback(() => {
    try {
      sessionStorage.removeItem(`simulation_progress_${simulationId}`);
      console.log(`Simulation progress reset for ${simulationId}`);
      
      // Get the current questions again to avoid undefined state
      const questionsToUse = loadQuestions({
        storyQuestions,
        effectiveType,
        difficulty,
        questionLimit,
        setNumber,
        startIndex,
        isFullExam
      });
      
      // Determine mode for reset
      const modeSettings = determineSimulationMode();
      
      setState(prevState => ({
        ...initialSimulationState,
        questions: questionsToUse,
        totalQuestions: questionsToUse.length,
        currentQuestion: questionsToUse.length > 0 ? questionsToUse[0] : null,
        progressLoaded: true,
        ...modeSettings
      }));
      
      toast({
        title: "איפוס סימולציה",
        description: "הנתונים אופסו והסימולציה מתחילה מחדש",
        variant: "default",
      });
    } catch (error) {
      console.error("Error resetting simulation progress:", error);
    }
  }, [simulationId, toast, storyQuestions, effectiveType, difficulty, questionLimit, setNumber, startIndex, isFullExam, determineSimulationMode]);

  // Initialize questions based on simulation type
  const initializeQuestions = useCallback(() => {
    console.log("Initializing questions for simulation:", { simulationId, isQuestionSet, type, difficulty, questionLimit, setNumber, startIndex, typeFromQuery, effectiveType, isFullExam });
    console.log("Story questions available:", !!storyQuestions, "Count:", storyQuestions?.length || 0);
    
    const questionsToUse = loadQuestions({
      storyQuestions,
      effectiveType,
      difficulty,
      questionLimit,
      setNumber,
      startIndex,
      isFullExam
    });
    
    // Determine simulation mode
    const modeSettings = determineSimulationMode();
    
    console.log(`Loaded ${questionsToUse.length} questions for simulation with mode:`, modeSettings);
    
    if (questionsToUse.length > 0) {
      console.log(`Setting ${questionsToUse.length} questions for simulation - first question:`, questionsToUse[0]);
      setState(prevState => ({
        ...prevState,
        questions: questionsToUse,
        totalQuestions: questionsToUse.length,
        currentQuestion: questionsToUse[0],
        progressLoaded: true,
        ...modeSettings
      }));
    } else {
      console.error("No questions found for simulation", { type, difficulty, effectiveType, simulationId, storyQuestions: !!storyQuestions, isFullExam });
      setState(prevState => ({
        ...prevState,
        progressLoaded: true,
        ...modeSettings
      }));
    }
  }, [simulationId, isQuestionSet, storyQuestions, effectiveType, difficulty, questionLimit, setNumber, startIndex, isFullExam, determineSimulationMode]);

  // Initialize questions when dependencies change
  useEffect(() => {
    console.log("useEffect for initializeQuestions triggered");
    initializeQuestions();
  }, [initializeQuestions]);

  // Load saved progress (only for training mode)
  useEffect(() => {
    if (!progressLoadedRef.current) {
      const modeSettings = determineSimulationMode();
      
      // Only load progress for training mode
      if (!modeSettings.examMode) {
        const savedProgress = loadSimulationProgress(simulationId);
        
        if (savedProgress) {
          console.log("Loading saved progress for simulation:", simulationId);
          setState(prevState => ({
            ...prevState,
            currentQuestionIndex: savedProgress.currentQuestionIndex || 0,
            userAnswers: savedProgress.userAnswers || {},
            questionFlags: savedProgress.questionFlags || {},
            remainingTime: savedProgress.remainingTime || 1800,
            isTimerActive: savedProgress.isTimerActive !== undefined ? savedProgress.isTimerActive : false,
            answeredQuestionsCount: savedProgress.answeredQuestionsCount || 0,
            correctQuestionsCount: savedProgress.correctQuestionsCount || 0,
            progressPercentage: savedProgress.progressPercentage || 0,
            currentScorePercentage: savedProgress.currentScorePercentage || 0,
            progressLoaded: true,
            ...modeSettings
          }));
          
          progressLoadedRef.current = true;
          console.log(`Simulation progress loaded for ${simulationId}`);
        } else {
          console.log("No saved progress found, using initial state");
          setState(prevState => ({ ...prevState, progressLoaded: true, ...modeSettings }));
          progressLoadedRef.current = true;
        }
      } else {
        // For exam mode, don't load progress
        console.log("Exam mode - not loading saved progress");
        setState(prevState => ({ ...prevState, progressLoaded: true, ...modeSettings }));
        progressLoadedRef.current = true;
      }
    }
  }, [simulationId, determineSimulationMode]);

  // Update current question when index changes
  useEffect(() => {
    if (state.questions.length > 0 && state.currentQuestionIndex < state.questions.length) {
      const newCurrentQuestion = state.questions[state.currentQuestionIndex];
      if (newCurrentQuestion && newCurrentQuestion !== state.currentQuestion) {
        console.log("Updating current question to index:", state.currentQuestionIndex, "Question:", newCurrentQuestion);
        setState(prevState => ({ 
          ...prevState, 
          currentQuestion: newCurrentQuestion 
        }));
      }
    }
  }, [state.currentQuestionIndex, state.questions, state.currentQuestion]);

  useEffect(() => {
    if (state.examMode) {
      initializeTimer();
    } else {
      clearTimer();
    }
    
    return () => clearTimer();
  }, [state.examMode, initializeTimer, clearTimer]);

  // Setter functions for external state management
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
    // State
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
    selectedAnswerIndex: state.selectedAnswerIndex,
    
    // Actions
    ...actions,
    handleRestartSimulation,
    saveProgress,
    resetProgress,
    
    // Setters
    setQuestions: (questions: Question[]) => {
      setState(prevState => ({ ...prevState, questions }));
    },
    setTotalQuestions: (totalQuestions: number) => {
      setState(prevState => ({ ...prevState, totalQuestions }));
    },
    setCurrentQuestion: (currentQuestion: Question) => {
      setState(prevState => ({ ...prevState, currentQuestion }));
    },
    setSelectedAnswerIndex: (selectedAnswerIndex: number | null) => {
      setState(prevState => ({ ...prevState, selectedAnswerIndex }));
    },
    setIsTimerActive: (isTimerActive: boolean) => {
      setState(prevState => ({ ...prevState, isTimerActive }));
    },
    setExamMode: (examMode: boolean) => {
      setState(prevState => ({ ...prevState, examMode }));
    },
    setShowAnswersImmediately: (showAnswersImmediately: boolean) => {
      setState(prevState => ({ ...prevState, showAnswersImmediately }));
    }
  };
};
