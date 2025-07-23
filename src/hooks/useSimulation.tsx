
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

  // Determine simulation mode automatically based on parameters
  const examMode = isFullExam || examParam === '1' || (!practiceParam && (simulationId === 'full' || effectiveType === 'mixed' || (!effectiveType && !difficulty)));
  const showAnswersImmediately = !examMode || practiceParam === '1';

  // Enhanced set parameter detection and validation
  const setParams = useMemo(() => {
    const set = setNumber ? parseInt(setNumber) : null;
    const start = startIndex ? parseInt(startIndex) : null;
    const isSetBased = !!(set && start !== null && effectiveType && difficulty);
    
    if (isSetBased && (isNaN(set) || isNaN(start) || start < 0)) {
      console.warn('⚠️ Invalid set parameters detected:', { setNumber, startIndex, set, start });
      return { isSetBased: false, setId: null, startIdx: null };
    }
    
    return {
      isSetBased,
      setId: set,
      startIdx: start,
      setType: effectiveType,
      setDifficulty: difficulty,
      questionsInSet: 10
    };
  }, [setNumber, startIndex, effectiveType, difficulty]);

  // Clear simulation type identification
  const simulationType = useMemo(() => {
    const baseType = {
      mode: examMode ? 'exam' : 'practice',
      isFullExam: isFullExam,
      isSetBased: setParams.isSetBased,
      hasTimeLimit: examMode,
      showAnswersImmediately: showAnswersImmediately
    };

    if (isFullExam) {
      return {
        ...baseType,
        displayName: 'בחינה מלאה',
        description: 'סימולציה מלאה של בחינת המיון',
        identifier: 'full_exam',
        category: 'exam'
      };
    } else if (setParams.isSetBased) {
      return {
        ...baseType,
        displayName: `סט תרגול - ${setParams.setType} (${setParams.setDifficulty})`,
        description: `סט של 10 שאלות ב${setParams.setType} ברמת ${setParams.setDifficulty}`,
        identifier: `set_${setParams.setType}_${setParams.setDifficulty}_${setParams.setId}`,
        category: 'set_practice',
        setInfo: {
          setId: setParams.setId,
          setType: setParams.setType,
          difficulty: setParams.setDifficulty,
          questionsCount: setParams.questionsInSet
        }
      };
    } else if (effectiveType && difficulty) {
      return {
        ...baseType,
        displayName: `תרגול ${effectiveType} - ${difficulty}`,
        description: `תרגול ממוקד ב${effectiveType} ברמת ${difficulty}`,
        identifier: `practice_${effectiveType}_${difficulty}`,
        category: 'topic_practice',
        topicInfo: {
          type: effectiveType,
          difficulty: difficulty
        }
      };
    } else if (simulationId === 'quick-practice') {
      return {
        ...baseType,
        displayName: 'תרגול מהיר',
        description: 'תרגול מהיר עם שאלות מעורבות',
        identifier: 'quick_practice',
        category: 'quick_practice'
      };
    } else {
      return {
        ...baseType,
        displayName: 'תרגול כללי',
        description: 'תרגול כללי עם שאלות מעורבות',
        identifier: simulationId || 'general_practice',
        category: 'general_practice'
      };
    }
  }, [examMode, isFullExam, setParams, showAnswersImmediately, effectiveType, difficulty, simulationId]);
  
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

  const { startTimer, stopTimer, resetTimer, initializeTimer, clearTimer } = useTimer(setState);

  // Enhanced network error handling with retry logic
  const saveWithRetry = useCallback(async (sessionData: any, maxRetries = 3) => {
    let lastError: any = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`💾 Save attempt ${attempt}/${maxRetries}`);
        const result = await saveSimulationSession(sessionData);
        
        if (result.success) {
          console.log(`✅ Save successful on attempt ${attempt}`);
          return result;
        } else {
          lastError = result.error;
          console.warn(`⚠️ Save failed attempt ${attempt}: ${result.error}`);
          
          // If it's the last attempt, return the failed result
          if (attempt === maxRetries) {
            return result;
          }
          
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      } catch (error) {
        lastError = error;
        console.error(`❌ Save error attempt ${attempt}:`, error);
        
        // If it's the last attempt, return a failed result
        if (attempt === maxRetries) {
          return { success: false, error: 'Max retries exceeded' };
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    
    return { success: false, error: lastError };
  }, []);

  // Network status detection
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Process offline queue when connection is restored
  const processOfflineQueue = useCallback(async () => {
    try {
      const offlineQueue = JSON.parse(localStorage.getItem('offline_save_queue') || '[]');
      if (offlineQueue.length === 0) return;
      
      console.log(`📤 Processing ${offlineQueue.length} offline saves`);
      
      let processed = 0;
      const newQueue = [];
      
      for (const item of offlineQueue) {
        try {
          if (item.type === 'simulation_session') {
            const result = await saveWithRetry(item.data, 2);
            if (result.success) {
              processed++;
              console.log('✅ Offline save processed successfully');
            } else {
              // Keep failed items in queue for later
              newQueue.push(item);
            }
          }
        } catch (error) {
          console.error('Error processing offline item:', error);
          newQueue.push(item);
        }
      }
      
      // Update queue with failed items
      localStorage.setItem('offline_save_queue', JSON.stringify(newQueue));
      
      if (processed > 0) {
        toast({
          title: "🔄 סינכרון הושלם",
          description: `${processed} התקדמויות סונכרנו עם השרת`,
          variant: "default",
        });
      }
      
    } catch (error) {
      console.error('Error processing offline queue:', error);
    }
  }, [saveWithRetry]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "🌐 חיבור לאינטרנט שוחזר",
        description: "ההתקדמות תיסכרן אוטומטית",
        variant: "default",
      });
      
      // Process offline queue
      setTimeout(() => processOfflineQueue(), 1000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "📶 אין חיבור לאינטרנט",
        description: "ההתקדמות תישמר מקומית עד החזרת החיבור",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Immediate save function for first answer
  const saveImmediately = useCallback(async () => {
    if (!state.progressLoaded || !activeSessionId) return;
    
    console.log('💾❗ [useSimulation] Executing immediate save for first answer');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const answers = Object.entries(state.userAnswers).map(([index, answer]) => ({
        questionIndex: parseInt(index),
        selectedAnswer: answer,
        isCorrect: answer === state.questions[parseInt(index)]?.correctAnswer,
        timeSpent: 60
      }));

      const sessionData = {
        id: activeSessionId,
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
          show_answers_immediately: showAnswersImmediately,
          set_number: setParams.setId?.toString() || null,
          start_index: setParams.startIdx?.toString() || null,
          type: effectiveType,
          difficulty: difficulty,
          is_set_based: setParams.isSetBased ? 'true' : 'false',
          set_id: setParams.setId?.toString() || null,
          set_type: setParams.setType || null,
          set_difficulty: setParams.setDifficulty || null,
          questions_in_set: setParams.isSetBased ? setParams.questionsInSet.toString() : null,
          simulation_id: simulationId,
          session_subtype: setParams.isSetBased ? 'set_practice' : 'regular_practice',
          simulation_type: simulationType.identifier,
          simulation_category: simulationType.category,
          simulation_display_name: simulationType.displayName,
          simulation_description: simulationType.description
        }
      };

      const result = await saveWithRetry(sessionData);
      if (result.success) {
        console.log('✅ Immediate save successful for first answer');
      }
    } catch (error) {
      console.error('❌ Immediate save failed:', error);
    }
  }, [state, activeSessionId, examMode, showAnswersImmediately, setParams, effectiveType, difficulty, simulationId, simulationType, saveWithRetry]);

  // Listen for first answer submission to trigger immediate save
  useEffect(() => {
    const handleFirstAnswerSubmitted = (event: CustomEvent) => {
      console.log('🎯 [useSimulation] First answer event received, triggering immediate save');
      // Small delay to ensure state is updated
      setTimeout(() => saveImmediately(), 100);
    };

    window.addEventListener('first_answer_submitted', handleFirstAnswerSubmitted as EventListener);
    return () => {
      window.removeEventListener('first_answer_submitted', handleFirstAnswerSubmitted as EventListener);
    };
  }, [saveImmediately]);

  // Create initial session when simulation starts (before any answers)
  useEffect(() => {  
    if (state.progressLoaded && state.questions.length > 0 && !activeSessionId && !state.simulationComplete) {
      const createInitialSession = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          console.log('🆕 Creating initial session for simulation start');

          const sessionData = {
            user_id: user.id,
            current_question_index: 0,
            answers: [],
            total_questions: state.totalQuestions,
            progress_percentage: 0,
            is_completed: false,
            session_type: examMode ? 'exam' : 'practice',
            correct_answers: 0,
            questions_answered: 0,
            time_spent: 0,
            metadata: {
              exam_mode: examMode,
              show_answers_immediately: showAnswersImmediately,
              set_number: setParams.setId?.toString() || null,
              start_index: setParams.startIdx?.toString() || null,
              type: effectiveType,
              difficulty: difficulty,
              is_set_based: setParams.isSetBased ? 'true' : 'false',
              set_id: setParams.setId?.toString() || null,
              set_type: setParams.setType || null,
              set_difficulty: setParams.setDifficulty || null,
              questions_in_set: setParams.isSetBased ? setParams.questionsInSet.toString() : null,
              simulation_id: simulationId,
              session_subtype: setParams.isSetBased ? 'set_practice' : 'regular_practice',
              simulation_type: simulationType.identifier,
              simulation_category: simulationType.category,
              simulation_display_name: simulationType.displayName,
              simulation_description: simulationType.description
            }
          };

          const result = await saveSimulationSession(sessionData);
          if (result.success && result.data) {
            setActiveSessionId(result.data.id);
            console.log('✅ Initial session created:', result.data.id);
          }
        } catch (error) {
          console.error('❌ Failed to create initial session:', error);
        }
      };

      createInitialSession();
    }
  }, [state.progressLoaded, state.questions.length, activeSessionId, state.simulationComplete, state.totalQuestions, examMode, showAnswersImmediately, setParams, effectiveType, difficulty, simulationId, simulationType]);

  // Auto-save live simulation session with localStorage synchronization
  useEffect(() => {
    if (state.progressLoaded && (state.answeredQuestionsCount > 0 || activeSessionId)) {
      const saveLiveSession = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            // If not authenticated, save only to localStorage as fallback
            if (!examMode && !isFullExam) {
              saveSimulationProgress(simulationId, state, setParams.setId?.toString() || null, setParams.setType, setParams.setDifficulty);
            }
            return;
          }

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
              show_answers_immediately: showAnswersImmediately,
              set_number: setParams.setId?.toString() || null,
              start_index: setParams.startIdx?.toString() || null,
              type: effectiveType,
              difficulty: difficulty,
              is_set_based: setParams.isSetBased ? 'true' : 'false',
              set_id: setParams.setId?.toString() || null,
              set_type: setParams.setType || null,
              set_difficulty: setParams.setDifficulty || null,
              questions_in_set: setParams.isSetBased ? setParams.questionsInSet.toString() : null,
              simulation_id: simulationId,
              session_subtype: setParams.isSetBased ? 'set_practice' : 'regular_practice',
              simulation_type: simulationType.identifier,
              simulation_category: simulationType.category,
              simulation_display_name: simulationType.displayName,
              simulation_description: simulationType.description
            }
          };

          // Primary save to database with retry logic
          const result = isOnline ? await saveWithRetry(sessionData) : { success: false, error: 'Offline' };
          if (result.success) {
            if (result.data && !activeSessionId) {
              setActiveSessionId(result.data.id);
            }
            
            // Successful database save - sync to localStorage as backup
            if (!examMode && !isFullExam) {
              saveSimulationProgress(simulationId, state, setParams.setId?.toString() || null, setParams.setType, setParams.setDifficulty);
            }
            
            console.log('✅ Session saved to database and synced to localStorage');
            
            // Show save success message occasionally (every 5th save)
            if (state.answeredQuestionsCount % 5 === 0) {
              toast({
                title: "✅ התקדמות נשמרה",
                description: `התקדמות שלך נשמרה אוטומטית (${state.answeredQuestionsCount}/${state.totalQuestions} שאלות)`,
                variant: "default",
              });
            }
          } else {
            console.warn('⚠️ Database save failed, falling back to localStorage only');
            // Database save failed - save to localStorage as fallback
            if (!examMode && !isFullExam) {
              saveSimulationProgress(simulationId, state, setParams.setId?.toString() || null, setParams.setType, setParams.setDifficulty);
            }
            
            // Store failed saves for retry when online
            if (!isOnline) {
              try {
                const offlineQueue = JSON.parse(localStorage.getItem('offline_save_queue') || '[]');
                offlineQueue.push({
                  timestamp: Date.now(),
                  data: sessionData,
                  type: 'simulation_session'
                });
                localStorage.setItem('offline_save_queue', JSON.stringify(offlineQueue));
                console.log('📥 Added to offline queue');
              } catch (error) {
                console.error('Failed to add to offline queue:', error);
              }
            }
            
            // Show appropriate error message
            const errorMessage = isOnline ? "שגיאה בשמירה לשרת" : "שמירה במצב לא מקוון";
            const errorDescription = isOnline ? 
              "נכשל שמירה לשרת לאחר מספר נסיונות. התקדמות נשמרה מקומית." :
              "התקדמות נשמרה מקומית. תסנכרן אוטומטית כשהחיבור יחזור.";
            
            toast({
              title: `⚠️ ${errorMessage}`,
              description: errorDescription,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Failed to save live session:', error);
          // On error, always try to save to localStorage as last resort
          if (!examMode && !isFullExam) {
            try {
              saveSimulationProgress(simulationId, state, setParams.setId?.toString() || null, setParams.setType, setParams.setDifficulty);
              console.log('💾 Fallback save to localStorage successful');
              
              // Show error message with localStorage fallback
              toast({
                title: "❌ שגיאה בשמירה",
                description: "התקדמות נשמרה מקומית כגיבוי. יש לבדוק החיבור לאינטרנט.",
                variant: "destructive",
              });
            } catch (localError) {
              console.error('Failed to save to localStorage fallback:', localError);
              
              // Show critical error if both saves fail
              toast({
                title: "⚠️ שגיאה קריטית",
                description: "לא ניתן לשמור את ההתקדמות. יש לסגור ולפתוח מחדש את הדפדפן.",
                variant: "destructive",
              });
            }
          }
        }
      };

      // For the first answer, save immediately to avoid race conditions
      if (state.answeredQuestionsCount === 1) {
        console.log('🎯 First answer detected - saving immediately');
        saveLiveSession();
      } else {
        // For subsequent answers, use the 1-second timeout
        const timeoutId = setTimeout(saveLiveSession, 1000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [state.answeredQuestionsCount, state.currentQuestionIndex, state.progressLoaded, state.simulationComplete, examMode, showAnswersImmediately, activeSessionId, setParams, effectiveType, difficulty, simulationId, isFullExam]);

  // Add comprehensive navigation and exit listeners to ensure saving
  useEffect(() => {
    const saveProgressOnExit = async () => {
      if (state.progressLoaded && state.answeredQuestionsCount > 0 && !state.simulationComplete) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const answers = Object.entries(state.userAnswers).map(([index, answer]) => ({
            questionIndex: parseInt(index),
            selectedAnswer: answer,
            isCorrect: answer === state.questions[parseInt(index)]?.correctAnswer,
            timeSpent: 60
          }));

          const sessionData = {
            id: activeSessionId || undefined,
            user_id: user.id,
            current_question_index: state.currentQuestionIndex,
            answers,
            total_questions: state.totalQuestions,
            progress_percentage: state.progressPercentage,
            is_completed: false,
            session_type: examMode ? 'exam' : 'practice',
            correct_answers: state.correctQuestionsCount,
            questions_answered: state.answeredQuestionsCount,
            time_spent: Math.round((Date.now() - (state.sessionStartTime || Date.now())) / 1000),
            metadata: {
              exam_mode: examMode,
              show_answers_immediately: showAnswersImmediately,
              set_number: setParams.setId?.toString() || null,
              start_index: setParams.startIdx?.toString() || null,
              type: effectiveType,
              difficulty: difficulty,
              is_set_based: setParams.isSetBased ? 'true' : 'false',
              set_id: setParams.setId?.toString() || null,
              set_type: setParams.setType || null,
              set_difficulty: setParams.setDifficulty || null,
              questions_in_set: setParams.isSetBased ? setParams.questionsInSet.toString() : null,
              simulation_id: simulationId,
              session_subtype: setParams.isSetBased ? 'set_practice' : 'regular_practice',
              simulation_type: simulationType.identifier,
              simulation_category: simulationType.category,
              simulation_display_name: simulationType.displayName,
              simulation_description: simulationType.description
            }
          };

          // Primary save attempt
          await saveSimulationSession(sessionData);
          
          // For training mode, also save to localStorage as backup
          if (!examMode && !isFullExam) {
            saveSimulationProgress(simulationId, state, setParams.setId?.toString() || null, setParams.setType, setParams.setDifficulty);
          }
          
          console.log('💾 Progress saved on navigation/exit');
        } catch (error) {
          console.error('Failed to save on navigation/exit:', error);
        }
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (state.progressLoaded && state.answeredQuestionsCount > 0 && !state.simulationComplete) {
        // Use sendBeacon for reliable saving on page unload
        try {
          const sessionData = {
            user_id: activeSessionId,
            current_question_index: state.currentQuestionIndex,
            answers: Object.entries(state.userAnswers).map(([index, answer]) => ({
              questionIndex: parseInt(index),
              selectedAnswer: answer,
              isCorrect: answer === state.questions[parseInt(index)]?.correctAnswer,
              timeSpent: 60
            })),
            total_questions: state.totalQuestions,
            progress_percentage: state.progressPercentage,
            is_completed: false,
            session_type: examMode ? 'exam' : 'practice',
            correct_answers: state.correctQuestionsCount,
            questions_answered: state.answeredQuestionsCount,
            time_spent: Math.round((Date.now() - (state.sessionStartTime || Date.now())) / 1000)
          };
          
          const blob = new Blob([JSON.stringify(sessionData)], { type: 'application/json' });
          navigator.sendBeacon('/api/save-session', blob);
        } catch (error) {
          console.error('Failed sendBeacon save:', error);
        }
        
        // Also try synchronous save
        saveProgressOnExit();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Page is becoming invisible, save progress
        saveProgressOnExit();
      }
    };

    const handlePageHide = () => {
      saveProgressOnExit();
    };

    // Add multiple event listeners for comprehensive coverage
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [state, activeSessionId, examMode, showAnswersImmediately, setParams, effectiveType, difficulty, simulationId, isFullExam]);

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

  // Recovery mechanism for lost progress
  const recoverLostProgress = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Look for recent incomplete sessions (within last 24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data: recentSessions, error } = await supabase
        .from('simulation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', false)
        .gt('updated_at', twentyFourHoursAgo)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error checking for recoverable sessions:', error);
        return null;
      }

      return recentSessions || [];
    } catch (error) {
      console.error('Error in recovery check:', error);
      return null;
    }
  }, []);

  // Load saved progress or active session
  useEffect(() => {
    if (!progressLoadedRef.current) {
      const loadProgress = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Try to load active session first with proper filtering
            const filters = setParams.isSetBased ? {
              isSetBased: true,
              setNumber: setParams.setId?.toString() || '',
              setType: setParams.setType || '',
              difficulty: setParams.setDifficulty || ''
            } : {
              isSetBased: false
            };
            
            const activeSessionResult = await loadActiveSimulationSession(user.id, filters);
            if (activeSessionResult.success && activeSessionResult.data) {
              const session = activeSessionResult.data;
              console.log('🔄 Restoring active session:', session.id, 'Set-based:', setParams.isSetBased);
              
              // Show restoration message
              toast({
                title: "🔄 התקדמות שוחזרה",
                description: `המשך מהמקום שעצרת (שאלה ${(session.current_question_index || 0) + 1}/${session.total_questions})`,
                variant: "default",
              });
              
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
            } else {
              // No active session found, check for recoverable sessions
              const recoverableSessions = await recoverLostProgress();
              if (recoverableSessions && recoverableSessions.length > 0) {
                console.log('🔍 Found recoverable sessions:', recoverableSessions.length);
                
                // Show recovery option
                toast({
                  title: "💾 התקדמות ניתנת לשחזור",
                  description: `נמצאו ${recoverableSessions.length} סימולציות שלא הושלמו. כנס להיסטוריה להמשיך.`,
                  variant: "default",
                });
              }
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
  }, [simulationId, examMode, showAnswersImmediately, isFullExam, setParams, effectiveType, difficulty]);

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
    simulationType,
    
    // Actions
    ...actions,
    handleRestartSimulation,
    saveProgress,
    resetProgress,
    scrollToQuestion,
    recoverLostProgress,
    
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
