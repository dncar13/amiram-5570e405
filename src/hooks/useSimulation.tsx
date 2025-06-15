
import { useState, useEffect, useCallback, useRef } from "react";
import { Question } from "@/data/types/questionTypes";
import { useToast } from "@/hooks/use-toast";
import { useParams, useSearchParams } from "react-router-dom";
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
  const questionLimit = searchParams.get('limit');
  const setNumber = searchParams.get('set');
  const startIndex = searchParams.get('start');
  
  // Get type from query params if not in URL path
  const typeFromQuery = searchParams.get('type');
  const effectiveType = type || typeFromQuery;

  console.log("useSimulation params:", { type, difficulty, typeFromQuery, effectiveType, questionLimit });

  const { initializeTimer, clearTimer } = useTimer(setState);

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
    console.log("Restarting simulation");
    
    clearTimer();
    
    setState(prevState => ({
      ...initialSimulationState,
      questions: prevState.questions,
      totalQuestions: prevState.totalQuestions,
      isTimerActive: prevState.examMode,
      remainingTime: 1800
    }));
    
    initializeTimer();
  }, [initializeTimer, clearTimer]);

  const saveProgress = useCallback(() => {
    saveSimulationProgress(simulationId, state, setNumber, type, difficulty);
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
        startIndex
      });
      
      setState(prevState => ({
        ...initialSimulationState,
        questions: questionsToUse,
        totalQuestions: questionsToUse.length,
        currentQuestion: questionsToUse.length > 0 ? questionsToUse[0] : null,
        examMode: prevState.examMode,
        showAnswersImmediately: prevState.showAnswersImmediately,
        progressLoaded: true
      }));
      
      toast({
        title: "איפוס סימולציה",
        description: "הנתונים אופסו והסימולציה מתחילה מחדש",
        variant: "default",
      });
    } catch (error) {
      console.error("Error resetting simulation progress:", error);
    }
  }, [simulationId, toast, storyQuestions, effectiveType, difficulty, questionLimit, setNumber, startIndex]);

  // Initialize questions based on simulation type
  const initializeQuestions = useCallback(() => {
    console.log("Initializing questions for simulation:", { simulationId, isQuestionSet, type, difficulty, questionLimit, setNumber, startIndex, typeFromQuery, effectiveType });
    
    const questionsToUse = loadQuestions({
      storyQuestions,
      effectiveType,
      difficulty,
      questionLimit,
      setNumber,
      startIndex
    });
    
    if (questionsToUse.length > 0) {
      console.log(`Setting ${questionsToUse.length} questions for simulation`);
      setState(prevState => ({
        ...prevState,
        questions: questionsToUse,
        totalQuestions: questionsToUse.length,
        currentQuestion: questionsToUse[0]
      }));
    } else {
      console.warn("No questions found for simulation", { type, difficulty, effectiveType, simulationId });
    }
  }, [simulationId, isQuestionSet, storyQuestions, effectiveType, difficulty, questionLimit, setNumber, startIndex]);

  useEffect(() => {
    initializeQuestions();
  }, [initializeQuestions]);

  useEffect(() => {
    const savedProgress = loadSimulationProgress(simulationId);
    
    if (savedProgress && !progressLoadedRef.current) {
      setState(prevState => ({
        ...prevState,
        currentQuestionIndex: savedProgress.currentQuestionIndex || 0,
        userAnswers: savedProgress.userAnswers || {},
        questionFlags: savedProgress.questionFlags || {},
        remainingTime: savedProgress.remainingTime || 1800,
        isTimerActive: savedProgress.isTimerActive !== undefined ? savedProgress.isTimerActive : false,
        examMode: savedProgress.examMode !== undefined ? savedProgress.examMode : false,
        showAnswersImmediately: savedProgress.showAnswersImmediately !== undefined ? savedProgress.showAnswersImmediately : false,
        answeredQuestionsCount: savedProgress.answeredQuestionsCount || 0,
        correctQuestionsCount: savedProgress.correctQuestionsCount || 0,
        progressPercentage: savedProgress.progressPercentage || 0,
        currentScorePercentage: savedProgress.currentScorePercentage || 0,
        progressLoaded: true
      }));
      
      progressLoadedRef.current = true;
      console.log(`Simulation progress loaded for ${simulationId}`);
    } else {
      setState(prevState => ({ ...prevState, progressLoaded: true }));
    }
  }, [simulationId]);

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
    setQuestions,
    setTotalQuestions,
    setCurrentQuestion,
    setSelectedAnswerIndex,
    setIsTimerActive,
    setExamMode,
    setShowAnswersImmediately
  };
};
