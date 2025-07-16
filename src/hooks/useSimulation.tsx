
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
import { 
  saveSimulationSession, 
  loadActiveSimulationSession, 
  completeSimulationSession 
} from "@/services/simulationSessionService";
import { supabase } from "@/integrations/supabase/client";

export const useSimulation = (
  simulationId: string, 
  isQuestionSet: boolean = false,
  storyQuestions?: Question[]
) => {
  const [state, setState] = useState<SimulationState>(initialSimulationState);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const progressLoadedRef = useRef(false);
  const questionContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { type, difficulty } = useParams<{ type: string; difficulty: string }>();
  const [searchParams] = useSearchParams();
  const questionLimit = searchParams.get('limit');
  const setNumber = searchParams.get('set');
  const startIndex = searchParams.get('start');
  
  // Check for explicit mode parameters
  const practiceParam = searchParams.get('practice');
  const examParam = searchParams.get('exam');
  
  // Get type from query params if not in URL path
  const typeFromQuery = searchParams.get('type');
  const effectiveType = type || typeFromQuery;

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

  // Auto-save live simulation session
  useEffect(() => {
    if (state.progressLoaded && state.answeredQuestionsCount > 0) {
      const saveLiveSession = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const answers = Object.entries(state.userAnswers).map(([index, answer]) => ({
            questionIndex: parseInt(index),
            selectedAnswer: answer,
            isCorrect: answer === state.questions[parseInt(index)]?.correctAnswer,
            timeSpent: 60 // Default time spent per question
          }));

          const sessionData = {
            id: activeSessionId || undefined,
            user_id: user.id,
            current_question_index: state.currentQuestionIndex,
            answers,
            total_questions: state.totalQuestions,
            progress_percentage: state.progressPercentage,
            is_completed: state.simulationComplete,
            session_type: examMode ? 'exam' : 'practice',
            correct_answers: state.correctQuestionsCount,
            questions_answered: state.answeredQuestionsCount,
            time_spent: Math.round((Date.now() - (state.sessionStartTime || Date.now())) / 1000),
            metadata: {
              exam_mode: examMode,
              show_answers_immediately: showAnswersImmediately
            }
          };

          const result = await saveSimulationSession(sessionData);
          if (result.success && result.data && !activeSessionId) {
            setActiveSessionId(result.data.id);
          }
        } catch (error) {
          console.error('Failed to save live session:', error);
        }
      };

      // Save every 10 seconds or when answer is submitted
      const timeoutId = setTimeout(saveLiveSession, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [state.answeredQuestionsCount, state.currentQuestionIndex, state.progressLoaded, state.simulationComplete, examMode, showAnswersImmediately, activeSessionId]);

  // Create simulation actions with correct parameters
  const actions = createSimulationActions(
    state, 
    setState, 
    clearTimer,
    scrollToQuestion
  );

  const handleRestartSimulation = useCallback(async () => {
    console.log('🔄 [useSimulation] Starting comprehensive simulation restart');
    
    clearTimer();
    
    // Comprehensive cleanup for restart
    try {
      // 1. Clear localStorage progress
      const progressKeys = [
        `simulation_progress_${simulationId}`,
        `set_progress_${type}_${difficulty}_${setNumber}`,
        `topic_${simulationId}_progress`,
        `quick_practice_progress_${type}`,
        'simulation_progress' // Global fallback
      ];
      
      progressKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
          console.log(`🧹 Cleared localStorage key: ${key}`);
        } catch (error) {
          console.warn(`⚠️ Failed to clear localStorage key ${key}:`, error);
        }
      });
      
      // 2. Clear sessionStorage
      const sessionKeys = [
        'current_simulation_settings',
        'continue_simulation',
        'reset_simulation_progress',
        'is_difficulty_based',
        'current_difficulty_level',
        'current_difficulty_type'
      ];
      
      sessionKeys.forEach(key => {
        try {
          sessionStorage.removeItem(key);
          console.log(`🧹 Cleared sessionStorage key: ${key}`);
        } catch (error) {
          console.warn(`⚠️ Failed to clear sessionStorage key ${key}:`, error);
        }
      });
      
      // 3. Get fresh questions for restart
      const questionsToUse = await loadQuestions({
        storyQuestions,
        effectiveType,
        difficulty,
        questionLimit,
        setNumber,
        startIndex,
        isFullExam
      });
      
      console.log(`🔄 Restart: Setting ${questionsToUse.length} questions for simulation`);
      
      // 4. Reset state completely
      setState({
        ...initialSimulationState,
        questions: questionsToUse,
        totalQuestions: questionsToUse.length,
        currentQuestion: questionsToUse.length > 0 ? questionsToUse[0] : null,
        isTimerActive: false,
        remainingTime: isFullExam ? 3600 : 1800,
        progressLoaded: true,
        examMode,
        showAnswersImmediately,
        type: effectiveType,
        difficulty: difficulty,
        startTime: Date.now(),
        sessionStartTime: Date.now(),
        questionStartTime: Date.now()
      });
      
      // 5. Initialize timer if needed
      if (examMode) {
        initializeTimer();
      }
      
      console.log('✅ [useSimulation] Simulation restart completed successfully');
    } catch (error) {
      console.error('❌ [useSimulation] Error restarting simulation:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת השאלות. נסה שוב.",
        variant: "destructive",
      });
    }
  }, [initializeTimer, clearTimer, storyQuestions, effectiveType, difficulty, questionLimit, setNumber, startIndex, examMode, showAnswersImmediately, isFullExam, toast, simulationId, type]);

  const saveProgress = useCallback(() => {
    // Only save progress in training mode and not for full exam
    if (!examMode && !isFullExam) {
      saveSimulationProgress(simulationId, state, setNumber, type, difficulty);
    }
  }, [simulationId, state, setNumber, type, difficulty, examMode, isFullExam]);

  const resetProgress = useCallback(async () => {
    console.log('🔄 [useSimulation] Starting comprehensive progress reset');
    
    try {
      // 1. Clear comprehensive localStorage progress
      const progressKeys = [
        `simulation_progress_${simulationId}`,
        `set_progress_${type}_${difficulty}_${setNumber}`,
        `topic_${simulationId}_progress`,
        `questionset_${simulationId}_progress`,
        `quick_practice_progress_${type}`,
        'simulation_progress' // Global fallback
      ];
      
      progressKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
          console.log(`🧹 Cleared localStorage key: ${key}`);
        } catch (error) {
          console.warn(`⚠️ Failed to clear localStorage key ${key}:`, error);
        }
      });
      
      // 2. Clear sessionStorage
      const sessionKeys = [
        'current_simulation_settings',
        'continue_simulation',
        'reset_simulation_progress',
        'is_difficulty_based',
        'current_difficulty_level',
        'current_difficulty_type'
      ];
      
      sessionKeys.forEach(key => {
        try {
          sessionStorage.removeItem(key);
          console.log(`🧹 Cleared sessionStorage key: ${key}`);
        } catch (error) {
          console.warn(`⚠️ Failed to clear sessionStorage key ${key}:`, error);
        }
      });
      
      // 3. Get fresh questions to avoid undefined state
      const questionsToUse = await loadQuestions({
        storyQuestions,
        effectiveType,
        difficulty,
        questionLimit,
        setNumber,
        startIndex,
        isFullExam
      });
      
      console.log(`🔄 Reset: Setting ${questionsToUse.length} questions for simulation`);
      
      // 4. Reset state completely with fresh timestamps
      setState(prevState => ({
        ...initialSimulationState,
        questions: questionsToUse,
        totalQuestions: questionsToUse.length,
        currentQuestion: questionsToUse.length > 0 ? questionsToUse[0] : null,
        remainingTime: isFullExam ? 3600 : 1800,
        progressLoaded: true,
        examMode,
        showAnswersImmediately,
        type: effectiveType,
        difficulty: difficulty,
        startTime: Date.now(),
        sessionStartTime: Date.now(),
        questionStartTime: Date.now()
      }));
      
      console.log('✅ [useSimulation] Progress reset completed successfully');
      
      toast({
        title: "איפוס סימולציה",
        description: "הנתונים אופסו והסימולציה מתחילה מחדש",
        variant: "default",
      });
    } catch (error) {
      console.error('❌ [useSimulation] Error resetting simulation progress:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה באיפוס הסימולציה. נסה שוב.",
        variant: "destructive",
      });
    }
  }, [simulationId, toast, storyQuestions, effectiveType, difficulty, questionLimit, setNumber, startIndex, examMode, showAnswersImmediately, isFullExam, type]);

  // Initialize questions based on simulation type
  const initializeQuestions = useCallback(async () => {
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
    
    try {
      const questionsToUse = await loadQuestions({
        storyQuestions,
        effectiveType,
        difficulty,
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
          showAnswersImmediately,
          type: effectiveType,
          difficulty: difficulty
        }));
      } else {
        // console.error("No questions found for simulation", { type, difficulty, effectiveType, simulationId, storyQuestions: !!storyQuestions, isFullExam });
        setState(prevState => ({
          ...prevState,
          remainingTime: isFullExam ? 3600 : 1800,
          progressLoaded: true,
          examMode,
          showAnswersImmediately,
          type: effectiveType,
          difficulty: difficulty
        }));
      }
    } catch (error) {
      console.error("Error initializing questions:", error);
      setState(prevState => ({
        ...prevState,
        remainingTime: isFullExam ? 3600 : 1800,
        progressLoaded: true,
        examMode,
        showAnswersImmediately,
        type: effectiveType,
        difficulty: difficulty
      }));
    }
  }, [simulationId, isQuestionSet, storyQuestions, effectiveType, difficulty, questionLimit, setNumber, startIndex, examMode, showAnswersImmediately, isFullExam, type, typeFromQuery]);

  // Initialize questions when dependencies change
  useEffect(() => {
    // console.log("useEffect for initializeQuestions triggered");
    initializeQuestions();
  }, [initializeQuestions]);

  // Load saved progress or active session
  useEffect(() => {
    if (!progressLoadedRef.current) {
      const loadProgress = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Try to load active session first
            const activeSessionResult = await loadActiveSimulationSession(user.id);
            if (activeSessionResult.success && activeSessionResult.data) {
              const session = activeSessionResult.data;
              console.log('🔄 Restoring active session:', session.id);
              
              // Restore simulation state from session
              const userAnswers: Record<number, number> = {};
              const questionFlags: Record<number, boolean> = {};
              
              if (Array.isArray(session.answers)) {
                session.answers.forEach((answer: any) => {
                  userAnswers[answer.questionIndex] = answer.selectedAnswer;
                });
              }
              
              setState(prevState => ({
                ...prevState,
                currentQuestionIndex: session.current_question_index || 0,
                userAnswers,
                questionFlags,
                answeredQuestionsCount: session.questions_answered || 0,
                correctQuestionsCount: session.correct_answers || 0,
                progressPercentage: session.progress_percentage || 0,
                currentScorePercentage: session.questions_answered > 0 
                  ? (session.correct_answers / session.questions_answered) * 100 
                  : 0,
                progressLoaded: true,
                examMode,
                showAnswersImmediately,
                type: effectiveType,
                difficulty: difficulty
              }));
              
              setActiveSessionId(session.id);
              progressLoadedRef.current = true;
              return;
            }
          }
          
          // Fallback to localStorage for training mode
          if (!examMode && !isFullExam) {
            const savedProgress = loadSimulationProgress(simulationId);
            if (savedProgress) {
              console.log('📁 Loading localStorage progress for simulation:', simulationId);
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
                showAnswersImmediately,
                type: effectiveType,
                difficulty: difficulty
              }));
            } else {
              setState(prevState => ({ 
                ...prevState, 
                remainingTime: isFullExam ? 3600 : 1800,
                progressLoaded: true, 
                examMode,
                showAnswersImmediately,
                type: effectiveType,
                difficulty: difficulty
              }));
            }
          } else {
            setState(prevState => ({ 
              ...prevState, 
              remainingTime: isFullExam ? 3600 : 1800,
              progressLoaded: true, 
              examMode,
              showAnswersImmediately,
              type: effectiveType,
              difficulty: difficulty
            }));
          }
          
          progressLoadedRef.current = true;
        } catch (error) {
          console.error('Error loading progress:', error);
          setState(prevState => ({ 
            ...prevState, 
            remainingTime: isFullExam ? 3600 : 1800,
            progressLoaded: true, 
            examMode,
            showAnswersImmediately,
            type: effectiveType,
            difficulty: difficulty
          }));
          progressLoadedRef.current = true;
        }
      };
      
      loadProgress();
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
