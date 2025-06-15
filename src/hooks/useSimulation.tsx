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

  // Save progress whenever state changes (for quick practice)
  useEffect(() => {
    if (state.progressLoaded && questionLimit && effectiveType && state.answeredQuestionsCount > 0) {
      console.log("Auto-saving quick practice progress:", state.answeredQuestionsCount);
      saveSimulationProgress(simulationId, state, setNumber, type, difficulty);
    }
  }, [state.answeredQuestionsCount, state.currentQuestionIndex, simulationId, questionLimit, effectiveType, state.progressLoaded, setNumber, type, difficulty]);

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
      startIndex
    });
    
    console.log(`Restart: Setting ${questionsToUse.length} questions for simulation`);
    
    setState({
      ...initialSimulationState,
      questions: questionsToUse,
      totalQuestions: questionsToUse.length,
      currentQuestion: questionsToUse.length > 0 ? questionsToUse[0] : null,
      isTimerActive: false,
      remainingTime: 1800,
      progressLoaded: true
    });
    
    initializeTimer();
  }, [initializeTimer, clearTimer, storyQuestions, effectiveType, difficulty, questionLimit, setNumber, startIndex]);

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
    console.log("Story questions available:", !!storyQuestions, "Count:", storyQuestions?.length || 0);
    
    const questionsToUse = loadQuestions({
      storyQuestions,
      effectiveType,
      difficulty,
      questionLimit,
      setNumber,
      startIndex
    });
    
    console.log(`Loaded ${questionsToUse.length} questions for simulation`);
    
    if (questionsToUse.length > 0) {
      console.log(`Setting ${questionsToUse.length} questions for simulation - first question:`, questionsToUse[0]);
      setState(prevState => ({
        ...prevState,
        questions: questionsToUse,
        totalQuestions: questionsToUse.length,
        currentQuestion: questionsToUse[0],
        progressLoaded: true
      }));
    } else {
      console.error("No questions found for simulation", { type, difficulty, effectiveType, simulationId, storyQuestions: !!storyQuestions });
      setState(prevState => ({
        ...prevState,
        progressLoaded: true
      }));
    }
  }, [simulationId, isQuestionSet, storyQuestions, effectiveType, difficulty, questionLimit, setNumber, startIndex]);

  // Initialize questions when storyQuestions or other dependencies change
  useEffect(() => {
    console.log("useEffect for initializeQuestions triggered");
    initializeQuestions();
  }, [initializeQuestions]);

  // Load saved progress
  useEffect(() => {
    if (!progressLoadedRef.current) {
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
        console.log("No saved progress found, using initial state");
        setState(prevState => ({ ...prevState, progressLoaded: true }));
        progressLoadedRef.current = true;
      }
    }
  }, [simulationId]);

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
    setQuestions,
    setTotalQuestions,
    setCurrentQuestion,
    setSelectedAnswerIndex,
    setIsTimerActive,
    setExamMode,
    setShowAnswersImmediately
  };
};
