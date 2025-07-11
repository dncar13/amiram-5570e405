
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
  const questionContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { type, difficulty, setId } = useParams<{ type: string; difficulty: string; setId: string }>();
  const [searchParams] = useSearchParams();
  const questionLimit = searchParams.get('limit');
  const setNumber = searchParams.get('set') || (setId ? setId.split('-').pop() : null);
  const startIndex = searchParams.get('start');
  
  // Check for explicit mode parameters
  const practiceParam = searchParams.get('practice');
  const examParam = searchParams.get('exam');
  
  // Get type from query params if not in URL path
  const typeFromQuery = searchParams.get('type');
  const effectiveType = type || typeFromQuery || (setId ? setId.split('-')[0] : null);
  const effectiveDifficulty = difficulty || (setId ? setId.split('-')[1] : null);

  // Check if this is a full exam simulation
  const isFullExam = simulationId === 'full' || window.location.pathname.includes('/simulation/full');
  
  // console.log("useSimulation params:", { 
  //   type, 
  //   difficulty, 
  //   typeFromQuery, 
  //   effectiveType, 
  //   questionLimit, 
  //   practiceParam, 
  //   examParam,
  //   isFullExam,
  //   simulationId 
  // });

  // Scroll to question - מיקום השאלה במרכז המסך כדי שהמשתמש יראה אותה ישר
  const scrollToQuestion = useCallback(() => {
    if (questionContainerRef.current) {
      questionContainerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // מרכז המסך במקום 'start'
        inline: 'nearest'
      });
    }
  }, []);

  // Determine simulation mode automatically based on parameters
  const examMode = isFullExam || examParam === '1' || (!practiceParam && (simulationId === 'full' || effectiveType === 'mixed' || (!effectiveType && !difficulty)));
  const showAnswersImmediately = !examMode || practiceParam === '1';

  const { startTimer, stopTimer, resetTimer, initializeTimer, clearTimer } = useTimer(setState);

  // Auto-save progress for training mode only (not for full exam)
  useEffect(() => {
    if (state.progressLoaded && !examMode && !isFullExam && state.answeredQuestionsCount > 0) {
      // console.log("Auto-saving training progress:", state.answeredQuestionsCount);
      saveSimulationProgress(simulationId, state, setNumber, type, difficulty);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.answeredQuestionsCount, state.currentQuestionIndex, state.progressLoaded, simulationId, examMode, setNumber, type, difficulty, isFullExam]);

  // Create simulation actions with correct parameters
  const actions = createSimulationActions(
    state, 
    setState, 
    clearTimer,
    scrollToQuestion
  );

  const handleRestartSimulation = useCallback(() => {
    // console.log("Restarting simulation - clearing state and reinitializing");
    
    clearTimer();
    
    // Get fresh questions for restart
    const questionsToUse = loadQuestions({
      storyQuestions,
      effectiveType,
      difficulty: effectiveDifficulty,
      questionLimit,
      setNumber,
      startIndex,
      isFullExam
    });
    
    // console.log(`Restart: Setting ${questionsToUse.length} questions for simulation`);
    
    setState({
      ...initialSimulationState,
      questions: questionsToUse,
      totalQuestions: questionsToUse.length,
      currentQuestion: questionsToUse.length > 0 ? questionsToUse[0] : null,
      isTimerActive: false,
      remainingTime: isFullExam ? 3600 : 1800,
      progressLoaded: true,
      examMode,
      showAnswersImmediately
    });
    
    if (examMode) {
      initializeTimer();
    }
  }, [initializeTimer, clearTimer, storyQuestions, effectiveType, effectiveDifficulty, questionLimit, setNumber, startIndex, examMode, showAnswersImmediately, isFullExam]);

  const saveProgress = useCallback(() => {
    // Only save progress in training mode and not for full exam
    if (!examMode && !isFullExam) {
      saveSimulationProgress(simulationId, state, setNumber, type, difficulty);
    }
  }, [simulationId, state, setNumber, type, difficulty, examMode, isFullExam]);

  const resetProgress = useCallback(() => {
    try {
      localStorage.removeItem(`simulation_progress_${simulationId}`);
      // console.log(`Simulation progress reset for ${simulationId}`);
      
      // Get the current questions again to avoid undefined state
      const questionsToUse = loadQuestions({
        storyQuestions,
        effectiveType,
      difficulty: effectiveDifficulty,
        questionLimit,
        setNumber,
        startIndex,
        isFullExam
      });
      
      setState(prevState => ({
        ...initialSimulationState,
        questions: questionsToUse,
        totalQuestions: questionsToUse.length,
        currentQuestion: questionsToUse.length > 0 ? questionsToUse[0] : null,
        remainingTime: isFullExam ? 3600 : 1800,
        progressLoaded: true,
        examMode,
        showAnswersImmediately
      }));
      
      toast({
        title: "איפוס סימולציה",
        description: "הנתונים אופסו והסימולציה מתחילה מחדש",
        variant: "default",
      });
    } catch (error) {
      console.error("Error resetting simulation progress:", error);
    }
  }, [simulationId, toast, storyQuestions, effectiveType, effectiveDifficulty, questionLimit, setNumber, startIndex, examMode, showAnswersImmediately, isFullExam]);

  // Initialize questions based on simulation type
  const initializeQuestions = useCallback(() => {
    // console.log("Initializing questions for simulation:", { 
    //   simulationId, 
    //   isQuestionSet, 
    //   type, 
    //   difficulty, 
    //   questionLimit, 
    //   setNumber, 
    //   startIndex, 
    //   typeFromQuery, 
    //   effectiveType,
    //   isFullExam 
    // });
    // console.log("Story questions available:", !!storyQuestions, "Count:", storyQuestions?.length || 0);
    
    const questionsToUse = loadQuestions({
      storyQuestions,
      effectiveType,
      difficulty: effectiveDifficulty,
      questionLimit,
      setNumber,
      startIndex,
      isFullExam
    });
    
    // console.log(`Loaded ${questionsToUse.length} questions for simulation`);
    
    if (questionsToUse.length > 0) {
      // console.log(`Setting ${questionsToUse.length} questions for simulation - first question:`, questionsToUse[0]);
      setState(prevState => ({
        ...prevState,
        questions: questionsToUse,
        totalQuestions: questionsToUse.length,
        currentQuestion: questionsToUse[0],
        remainingTime: isFullExam ? 3600 : 1800,
        progressLoaded: true,
        examMode,
        showAnswersImmediately
      }));
    } else {
      // console.error("No questions found for simulation", { type, difficulty, effectiveType, simulationId, storyQuestions: !!storyQuestions, isFullExam });
      setState(prevState => ({
        ...prevState,
        remainingTime: isFullExam ? 3600 : 1800,
        progressLoaded: true,
        examMode,
        showAnswersImmediately
      }));
    }
  }, [simulationId, isQuestionSet, storyQuestions, effectiveType, effectiveDifficulty, questionLimit, setNumber, startIndex, examMode, showAnswersImmediately, isFullExam, type, typeFromQuery]);

  // Initialize questions when dependencies change
  useEffect(() => {
    // console.log("useEffect for initializeQuestions triggered");
    initializeQuestions();
  }, [initializeQuestions]);

  // Load saved progress (only for training mode, not for full exam)
  useEffect(() => {
    if (!progressLoadedRef.current) {
      // Only load progress for training mode and not for full exam
      if (!examMode && !isFullExam) {
        const savedProgress = loadSimulationProgress(simulationId);
        
        if (savedProgress) {
          // console.log("Loading saved progress for simulation:", simulationId);
          setState(prevState => ({
            ...prevState,
            currentQuestionIndex: savedProgress.currentQuestionIndex || 0,
            userAnswers: savedProgress.userAnswers || {},
            questionFlags: savedProgress.questionFlags || {},
            remainingTime: savedProgress.remainingTime || (isFullExam ? 3600 : 1800),
            isTimerActive: savedProgress.isTimerActive !== undefined ? savedProgress.isTimerActive : false,
            answeredQuestionsCount: savedProgress.answeredQuestionsCount || 0,
            correctQuestionsCount: savedProgress.correctQuestionsCount || 0,
            progressPercentage: savedProgress.progressPercentage || 0,
            currentScorePercentage: savedProgress.currentScorePercentage || 0,
            progressLoaded: true,
            examMode,
            showAnswersImmediately
          }));
          
          progressLoadedRef.current = true;
          // console.log(`Simulation progress loaded for ${simulationId}`);
        } else {
          // console.log("No saved progress found, using initial state");
          setState(prevState => ({ 
            ...prevState, 
            remainingTime: isFullExam ? 3600 : 1800,
            progressLoaded: true, 
            examMode,
            showAnswersImmediately
          }));
          progressLoadedRef.current = true;
        }
      } else {
        // For exam mode or full exam, don't load progress
        // console.log("Exam mode or full exam - not loading saved progress");
        setState(prevState => ({ 
          ...prevState, 
          remainingTime: isFullExam ? 3600 : 1800,
          progressLoaded: true, 
          examMode,
          showAnswersImmediately
        }));
        progressLoadedRef.current = true;
      }
    }
  }, [simulationId, examMode, showAnswersImmediately, isFullExam]);

  // Update current question when index changes
  useEffect(() => {
    if (state.questions.length > 0 && state.currentQuestionIndex < state.questions.length) {
      const newCurrentQuestion = state.questions[state.currentQuestionIndex];
      if (newCurrentQuestion && newCurrentQuestion !== state.currentQuestion) {
        // console.log("Updating current question to index:", state.currentQuestionIndex, "Question:", newCurrentQuestion);
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

  const setSimulationComplete = (simulationComplete: boolean) => {
    setState(prevState => ({ ...prevState, simulationComplete }));
  };

  const navigateToQuestion = (questionIndex: number) => {
    if (questionIndex >= 0 && questionIndex < state.questions.length) {
      const newQuestion = state.questions[questionIndex];
      const hasAnswer = questionIndex in state.userAnswers;
      
      setState(prevState => ({
        ...prevState,
        currentQuestionIndex: questionIndex,
        currentQuestion: newQuestion,
        selectedAnswerIndex: hasAnswer ? prevState.userAnswers[questionIndex] : null,
        isAnswerSubmitted: hasAnswer,
        showExplanation: false
      }));
      
      scrollToQuestion();
    }
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
    scrollToQuestion,
    
    // Setters
    setQuestions,
    setTotalQuestions,
    setCurrentQuestion,
    setSelectedAnswerIndex,
    setIsTimerActive,
    setExamMode,
    setShowAnswersImmediately,
    setSimulationComplete,
    navigateToQuestion,
    
    // Ref for scrolling
    questionContainerRef
  };
};
