// Only modifying the loadProgress function in the useSimulation hook
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Question } from "@/data/types/questionTypes";
import { useAuth } from "@/context/AuthContext";
import { 
  getSimulationProgress, 
  saveSimulationProgress,
  resetSimulation,
  getProgressKey,
  SimulationProgress
} from "@/services/questions/progress";
import { refreshQuestionsFromStorage } from "@/services/questions/storage";
import { saveActivity } from "./useActivityHistory";
import { getTopicById } from "@/data/utils/topicUtils";
import { useSimulationSettings } from "@/context/SimulationSettingsContext";
import { ALL_QUESTIONS_AVAILABLE } from "@/utils/topicAccess";
import { 
  getTopicProgressKey,
  getQuestionSetProgressKey
} from "@/services/cloudSync";
import { 
  saveProgressUnified,
  loadProgressUnified,
  deleteProgressUnified,
  SimulationProgressData
} from "@/services/simulationStorage";

const DEFAULT_EXAM_TIME_MINUTES = 45;
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds between automatic saves
const MIN_SAVE_INTERVAL = 2000; // Minimum 2 seconds between saves to prevent spam

// Utility function to normalize arrays safely
const normalizeArray = <T,>(
  arr: T[] | undefined,
  len: number,
  filler: T | null | false = null
): T[] => {
  const base = Array(len).fill(filler) as T[];
  if (!arr) return base;
  for (let i = 0; i < Math.min(arr.length, len); i++) base[i] = arr[i];
  return base;
};

// Helper to normalize simulation IDs consistently
const normalizeId = (id: string | number | undefined, isQuestionSet: boolean): number => {
  if (!id) return 0;
  
  // For question sets, strip prefix if it exists
  if (isQuestionSet && typeof id === 'string' && id.startsWith('qs_')) {
    return Number(id.substring(3));
  }
  
  return Number(id);
};

const getQuestionsForSet = (setNumber: number): Question[] => {
  if (!setNumber || isNaN(setNumber) || setNumber < 1 || setNumber > 20) {
    console.error(`Invalid set number: ${setNumber}`);
    return [];
  }
  
  // Get all questions from storage
  const allQuestions = refreshQuestionsFromStorage();
  
  // Calculate the start and end indices based on set number
  // Each set should have 50 questions (1-50, 51-100, etc.)
  const startId = (setNumber - 1) * 50 + 1;
  const endId = setNumber * 50;
  
  // Filter questions by ID range
  const setQuestions = allQuestions.filter(q => {
    const id = typeof q.id === 'number' ? q.id : parseInt(String(q.id), 10);
    return id >= startId && id <= endId;
  });
  
  console.log(`Found ${setQuestions.length} questions for set ${setNumber} (ID range ${startId}-${endId})`);
  return setQuestions;
};

// Helper function to get questions by difficulty and type
const getQuestionsByDifficultyAndType = (difficulty: string, type: string): Question[] => {
  const allQuestions = refreshQuestionsFromStorage();
  console.log(`[getQuestionsByDifficultyAndType] Total questions available: ${allQuestions.length}`);
  
  if (type === 'mixed') {
    // For mixed practice, get all questions from the specified difficulty level
    const filteredQuestions = allQuestions.filter(q => q.difficulty === difficulty);
    console.log(`[getQuestionsByDifficultyAndType] Found ${filteredQuestions.length} ${difficulty} questions for mixed practice`);
    return filteredQuestions;
  } else {
    // For specific question types, filter by both difficulty and type
    const filteredQuestions = allQuestions.filter(q => 
      q.difficulty === difficulty && q.type === type
    );
    console.log(`[getQuestionsByDifficultyAndType] Found ${filteredQuestions.length} ${difficulty} ${type} questions`);
    return filteredQuestions;
  }
};

export const useSimulation = (
  simulationId: string | undefined,
  isQuestionSet: boolean = false,
  externalQuestions?: Question[]
) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isContinue = searchParams.get('continue') === 'true' || window.sessionStorage.getItem('continue_simulation') === 'true';
  const { currentUser, isPremium } = useAuth();
  const progressWasSaved = useRef(false);
  const isSaving = useRef(false); // Mutex to prevent concurrent saves
  const lastSaveTime = useRef(0); // Track last save time for throttling
  const shouldSaveProgress = useRef(false); // Flag for pending save
  const periodicSaveInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Use the context to access the current settings
  const { settings } = useSimulationSettings();
  
  // Clean up the continue flag after using it
  useEffect(() => {
    if (window.sessionStorage.getItem('continue_simulation') === 'true') {
      console.log('useSimulation - clearing continue_simulation flag');
      window.sessionStorage.removeItem('continue_simulation');
    }
  }, []);
  
  // Define state variables first before using them
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [questionFlags, setQuestionFlags] = useState<boolean[]>([]);
  
  // Initialize with context values instead of local storage values
  const [examMode, setExamMode] = useState(settings.examMode);
  const [timerDuration, setTimerDuration] = useState(settings.timerMinutes * 60);
  const [remainingTime, setRemainingTime] = useState(settings.timerMinutes * 60);
  const [isTimerActive, setIsTimerActive] = useState(settings.timerEnabled);
  const [showAnswersImmediately, setShowAnswersImmediately] = useState(settings.showAnswersImmediately);
  
  const [settingsInitialized, setSettingsInitialized] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [progressLoadAttempted, setProgressLoadAttempted] = useState(false);
    // Load questions into separate state - replaces the old simulationQuestions useMemo
  useEffect(() => {
    if (!simulationId) {
      setQuestions([]);
      return;
    }
    
    // Handle difficulty-based simulations (IDs are prefixed with 'difficulty_')
    if (simulationId.startsWith('difficulty_')) {
      const parts = simulationId.split('_');
      if (parts.length === 3) {
        const level = parts[1];
        const type = parts[2];
        
        const difficultyQuestions = getQuestionsByDifficultyAndType(level, type);
        console.log(`Loading ${difficultyQuestions.length} questions for difficulty: ${level}, type: ${type}`);
        setQuestions(difficultyQuestions);
        return;
      }
    }
    
    // Handle story-based simulations (IDs are prefixed with 'story_')
    if (simulationId.startsWith('story_')) {
      // Use external questions for story simulations
      console.log(`Loading ${externalQuestions?.length || 0} external questions for story simulation`);
      setQuestions(externalQuestions || []);
      return;
    }

    // Handle question sets (IDs are prefixed with 'qs_')
    if (isQuestionSet) {
      // Strip prefix if it exists
      const rawSetId = simulationId.startsWith('qs_') 
        ? simulationId.substring(3) 
        : simulationId;
      
      const setIdNumber = parseInt(rawSetId, 10);
      if (isNaN(setIdNumber)) {
        console.error(`Invalid question set ID: ${rawSetId}`);
        setQuestions([]);
        return;
      }
      
      // Use local function to get questions by ID range rather than topic
      const questionsForSet = getQuestionsForSet(setIdNumber);
      console.log(`Loading ${questionsForSet.length} questions for question set ${setIdNumber}`);
      setQuestions(questionsForSet);
      return;
    }
    
    // Handle regular topic simulations
    const topicId = parseInt(simulationId, 10);
    if (isNaN(topicId)) {
      setQuestions([]);
      return;
    }
    
    const allQuestionsFromStorage = refreshQuestionsFromStorage();
    
    // Show all questions only for comprehensive exams (topic 22)
    if (topicId === 22) {
      console.log(`Loading all ${allQuestionsFromStorage.length} questions for comprehensive exam`);
      setQuestions([...allQuestionsFromStorage]);
      return;
    }
    
    // Normal topic - filter by topicId
    const filteredQuestions = allQuestionsFromStorage.filter(q => q.topicId === topicId);
    
    console.log(`Loaded ${filteredQuestions.length} questions for topic ${topicId} from useSimulation`);
      setQuestions(filteredQuestions.length > 0 ? filteredQuestions : []);
  }, [simulationId, isQuestionSet, externalQuestions]);
  
  // FIX #5: Update arrays when questions length changes
  useEffect(() => {
    setUserAnswers(prevAnswers => normalizeArray(prevAnswers, questions.length));
    setQuestionFlags(prevFlags => normalizeArray(prevFlags, questions.length, false));
  }, [questions.length]);
  
  // Define answeredQuestionsCount and correctQuestionsCount first, as they're used in other functions
  const answeredQuestionsCount = useMemo(() => 
    userAnswers.filter(answer => answer !== null).length, 
  [userAnswers]);
  
  const correctQuestionsCount = useMemo(() => 
    userAnswers.reduce((count, answer, index) => {
      if (answer !== null && index < questions.length && answer === questions[index].correctAnswer) {
        return count + 1;
      }
      return count;
    }, 0), 
  [userAnswers, questions]);
  
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  
  const progressPercentage = useMemo(() => 
    totalQuestions > 0 ? Math.round((answeredQuestionsCount / totalQuestions) * 100) : 0, 
  [answeredQuestionsCount, totalQuestions]);
  
  const currentScorePercentage = useMemo(() => 
    answeredQuestionsCount > 0 
      ? Math.round((correctQuestionsCount / answeredQuestionsCount) * 100) 
      : 0, 
  [correctQuestionsCount, answeredQuestionsCount]);
  
  // Improved saveProgress function with throttling
  const saveProgress = useCallback(async (forceImmediate: boolean = false) => {
    // Skip if another save is in progress
    if (isSaving.current) {
      shouldSaveProgress.current = true; // Mark for later save
      return;
    }
    
    // Skip if nothing to save
    if (questions.length === 0 || !simulationId) {
      return;
    }
    
    const now = Date.now();
    const timeSinceLastSave = now - lastSaveTime.current;
    
    // Skip if saved too recently and not forced
    if (!forceImmediate && timeSinceLastSave < MIN_SAVE_INTERVAL) {
      shouldSaveProgress.current = true; // Mark for later save
      return;
    }
    
    // Set saving flag to prevent concurrent saves
    isSaving.current = true;
    lastSaveTime.current = now;
    shouldSaveProgress.current = false;
      try {
      // Check for story simulations first
      if (simulationId.startsWith('story_')) {
        return; // Don't try to save for story simulations
      }
      
      // Normalize ID for consistent storage
      const numericId = normalizeId(simulationId, isQuestionSet);
      
      if (isNaN(numericId) || numericId === 0) {
        console.error("Invalid simulation ID", simulationId);
        isSaving.current = false;
        return;
      }
      
      // Create simulation progress object
      const progressData: SimulationProgressData = {
        version: "1.0.0", // Add version for future migrations
        topicId: numericId,
        currentQuestionIndex,
        answeredCount: userAnswers.filter(a => a !== null).length,
        correctCount: correctQuestionsCount,
        totalQuestions: questions.length,
        timestamp: new Date().toISOString(),
        userAnswers,
        remainingTime,
        questionFlags,
        examMode,
        showAnswersImmediately,
        isTimerActive,
        // New property to handle first load properly
        hasBeenSeen: true
      };
      
      const result = await saveProgressUnified(numericId, progressData, isQuestionSet);
      
      if (result.success) {
        progressWasSaved.current = true;
        console.log("Progress saved successfully via unified storage:", {
          simulationType: isQuestionSet ? 'question set' : 'topic',
          currentQuestion: currentQuestionIndex + 1,
          answeredQuestions: userAnswers.filter(a => a !== null).length,
          correctAnswers: correctQuestionsCount,
          id: numericId
        });
      } else if (result.error) {
        console.warn("Warning saving progress:", result.error);
        
        // Show toast only for serious errors
        if (result.error.includes("quota") || result.error.includes("storage")) {
          // toast({
          //   title: "שגיאה",
          //   description: "שגיאה בשמירת ההתקדמות - ייתכן שהזיכרון מלא",
          //   variant: "destructive",
          // });
        }
      }
        // If there's a warning, show it as a toast
      if (result.warning && !result.warning.includes("cloud")) {
        // toast({
        //   title: "התראה",
        //   description: result.warning,
        //   variant: "default",
        // });
      }
    } catch (error) {
      console.error("Error in saveProgress:", error);
    } finally {
      // Release mutex
      isSaving.current = false;
      
      // If another save was requested during this one, schedule it
      if (shouldSaveProgress.current) {
        setTimeout(() => {
          saveProgress();
        }, MIN_SAVE_INTERVAL);
      }
    }
  }, [
    simulationId,
    currentQuestionIndex,
    userAnswers,
    correctQuestionsCount,
    remainingTime,
    questionFlags,
    examMode,
    showAnswersImmediately,
    isTimerActive,
    questions.length,
    isQuestionSet
  ]);

  // Initial save when component loads
  useEffect(() => {
    if (questions.length > 0 && !simulationComplete && progressLoaded) {
      console.log("Initial save progress triggered");
      setTimeout(() => saveProgress(true), 100);
    }
  }, [questions.length, simulationComplete, saveProgress, progressLoaded]);
  
  // Setup periodic auto-save
  const startAutoSave = useCallback(() => {
    // Clear any existing interval
    if (periodicSaveInterval.current) {
      clearInterval(periodicSaveInterval.current);
    }
    
    // Start new auto-save interval
    if (questions.length > 0 && progressLoaded && !simulationComplete) {
      console.log("Setting up auto-save interval");
      
      periodicSaveInterval.current = setInterval(() => {
        console.log("Auto-save triggered by interval");
        saveProgress(false);
      }, AUTO_SAVE_INTERVAL);
      
      return () => {
        if (periodicSaveInterval.current) {
          clearInterval(periodicSaveInterval.current);
          periodicSaveInterval.current = null;
        }
        // Save one last time when clearing the interval
        saveProgress(true);
      };
    }
    
    return () => {};
  }, [questions.length, progressLoaded, simulationComplete, saveProgress]);
  
  // Start auto-save when ready
  useEffect(() => {
    if (questions.length > 0 && progressLoaded && !simulationComplete) {
      const cleanup = startAutoSave();
      return cleanup;
    }
  }, [questions.length, progressLoaded, simulationComplete, startAutoSave]);

  // Fixed loadProgress function to correctly use async/await
  const loadProgress = useCallback(async () => {
    if (!simulationId || !questions.length) {
      console.log("Skip loading: No questions or simulation id");
      return false;
    }
    
    // Make sure to consistently check and remove reset flag
    if (window.sessionStorage.getItem('reset_simulation_progress') === 'true') {
      console.log("Skipping progress load due to reset flag");
      window.sessionStorage.removeItem('reset_simulation_progress');
      return false;    }
    
    // Check for story simulations first
    if (simulationId.startsWith('story_')) {
      return false; // Don't try to load for story simulations
    }
    
    // Normalize ID for consistent storage
    const numericId = normalizeId(simulationId, isQuestionSet);
    
    if (isNaN(numericId) || numericId === 0) {
      console.error("Invalid simulation ID for loading", simulationId);
      return false;
    }
    
    try {
      console.log(`Loading progress for ${isQuestionSet ? 'question set' : 'topic'} ${numericId} via unified storage`);
      const { success, data, error } = await loadProgressUnified(numericId, isQuestionSet);
      
      if (!success || !data) {
        if (error) console.warn("Warning loading progress:", error);
        return false;
      }
      
      // Safety check for out-of-bounds question index
      const safeQuestionIndex = Math.min(data.currentQuestionIndex || 0, questions.length - 1);
      setCurrentQuestionIndex(safeQuestionIndex);
      
      // Use normalizeArray to safely handle array resizing
      setUserAnswers(normalizeArray(data.userAnswers, questions.length));
      setQuestionFlags(normalizeArray(data.questionFlags, questions.length, false));
      
      if (data.remainingTime !== undefined) {
        setRemainingTime(data.remainingTime);
      }
      
      if (data.examMode !== undefined) setExamMode(data.examMode);
      if (data.showAnswersImmediately !== undefined) setShowAnswersImmediately(data.showAnswersImmediately);
      if (data.isTimerActive !== undefined) setIsTimerActive(data.isTimerActive);
      
      const currentAnswer = data.userAnswers ? data.userAnswers[safeQuestionIndex] : null;
      setSelectedAnswerIndex(currentAnswer);
      
      // NEW: Don't automatically show the answer as submitted on first load
      // Only set isAnswerSubmitted to true if this is a continue session or
      // the current question has been answered
      const isContinueSession = isContinue || data.hasBeenSeen === true;
      const isCurrentQuestionAnswered = currentAnswer !== null;
      
      setIsAnswerSubmitted(isCurrentQuestionAnswered && isContinueSession);
      
      // Only show explanation if this is a continue session and conditions are met
      const shouldShowExplanation = isCurrentQuestionAnswered && isContinueSession && 
        (!data.examMode || (data.examMode && data.showAnswersImmediately));
        
      setShowExplanation(shouldShowExplanation);
      
      console.log("Progress successfully loaded via unified storage:", {
        currentQuestion: safeQuestionIndex + 1, 
        totalAnswered: data.userAnswers ? data.userAnswers.filter(a => a !== null).length : 0,
        isCurrentQuestionAnswered: currentAnswer !== null,
        isContinueSession,
        willShowAnswer: isCurrentQuestionAnswered && isContinueSession,
        willShowExplanation: shouldShowExplanation,
        timerSettings: {
          isTimerActive: data.isTimerActive,
          remainingTime: data.remainingTime
        }
      });
      
      return true;
    } catch (error) {
      console.error("Error in loadProgress:", error);
      // toast({
      //   title: "שגיאה",
      //   description: "שגיאה בטעינת ההתקדמות",
      //   variant: "destructive",
      // });
      return false;
    }
  }, [simulationId, questions.length, isQuestionSet, isContinue]);

  // Save on unload/navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("Page is being unloaded, saving progress and history...");
      // Don't use await here since beforeunload needs to be synchronous
      saveProgress();
      
      if (currentUser && simulationId && answeredQuestionsCount > 0) {
        // For topics, we should save activity for analytics
        if (!isQuestionSet) {
          const topicId = Number(simulationId);
          const topic = getTopicById(topicId);
          if (topic) {
            const partialScore = currentScorePercentage;
            const currentDate = new Date().toISOString();
            console.log(`Saving partial activity with score ${partialScore}% and ${correctQuestionsCount} correct answers`);
            
            saveActivity({
              date: currentDate,
              topic: topic.title,
              questionId: 'partial',
              status: partialScore >= 60 ? 'correct' : 'wrong',
              time: '0',
              score: partialScore,
              correctAnswers: correctQuestionsCount,
              totalAnswered: answeredQuestionsCount
            });
          }
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      handleBeforeUnload(); 
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveProgress, currentUser, simulationId, answeredQuestionsCount, currentScorePercentage, correctQuestionsCount, isQuestionSet]);
  
  // Extract complex expressions into memoized variables for dependency arrays
  const serializedUserAnswers = useMemo(() => JSON.stringify(userAnswers), [userAnswers]);
  const serializedQuestionFlags = useMemo(() => JSON.stringify(questionFlags), [questionFlags]);

  // Auto-save on state changes - with longer debounce time
  useEffect(() => {
    if (progressLoaded && questions.length > 0) {
      // FIX #6: Increase debounce to 1000ms to prevent concurrent saves
      const timeoutId = setTimeout(() => {
        console.log("Saving progress due to state change");
        saveProgress();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [
    currentQuestionIndex, 
    serializedUserAnswers,
    simulationComplete, 
    score, 
    serializedQuestionFlags,
    examMode, 
    showAnswersImmediately, 
    saveProgress,
    questions.length,
    progressLoaded
  ]);
  
  // Critical: Improved loading with proper initialization sequence
  useEffect(() => {
    if (questions.length > 0 && !progressLoaded && !progressLoadAttempted && simulationId) {
      setProgressLoadAttempted(true);
      
      const shouldReset = window.sessionStorage.getItem('reset_simulation_progress') === 'true';
      
      if (shouldReset) {
        console.log("Detected reset flag - Starting fresh simulation");
        // Make sure to clear reset flag
        window.sessionStorage.removeItem('reset_simulation_progress');
        
        // Reset that specific simulation
        const numericId = normalizeId(simulationId, isQuestionSet);
        if (!isNaN(numericId)) {
          deleteProgressUnified(numericId, isQuestionSet)
            .then(result => {
              console.log(`Reset progress result:`, result);
            })
            .catch(err => {
              console.error("Error resetting progress:", err);
            });
        }
        
        setCurrentQuestionIndex(0);
        setUserAnswers(Array(questions.length).fill(null));
        setSelectedAnswerIndex(null);
        setIsAnswerSubmitted(false);
        setShowExplanation(false);
        setSimulationComplete(false);
        setScore(0);
        setQuestionFlags(Array(questions.length).fill(false));
        
        // Use settings from context when resetting
        setExamMode(settings.examMode);
        setShowAnswersImmediately(settings.showAnswersImmediately);
        setIsTimerActive(settings.timerEnabled);
        setRemainingTime(settings.timerMinutes * 60);
        
        // Set progressLoaded only after state has been fully initialized
        setProgressLoaded(true);
        return;
      }
      
      // Always attempt to load progress, not just for continue requests
      console.log(`Attempting to load saved progress for ${isQuestionSet ? 'question set' : 'topic'} ${simulationId}...`);
      
      loadProgress()
        .then(loaded => {
          if (loaded) {
            console.log("Loaded existing progress successfully");
            toast({
              title: "סימולציה נטענה",
              description: "ממשיך מהמקום שבו עצרת בפעם האחרונה",
              variant: "default",
            });
          } else {
            console.log("No saved progress found, starting new simulation");
            
            // Use settings from context for new simulations
            setExamMode(settings.examMode);
            setShowAnswersImmediately(settings.showAnswersImmediately);
            setIsTimerActive(settings.timerEnabled);
            setRemainingTime(settings.timerMinutes * 60);
          }
        })
        .finally(() => {
          // Set progressLoaded only after Promise is fully complete
          setProgressLoaded(true);
        });
    }
  }, [loadProgress, questions.length, progressLoaded, progressLoadAttempted, simulationId, settings, isQuestionSet]);
  
  const handleAnswerSelect = (index: number) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswerIndex(index);
    }
  };
  
  const handleSubmitAnswer = () => {
    if (selectedAnswerIndex === null || currentQuestionIndex >= questions.length) return;
    
    const isCorrect = selectedAnswerIndex === currentQuestion.correctAnswer;
    
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = selectedAnswerIndex;
    setUserAnswers(newUserAnswers);
    
    setIsAnswerSubmitted(true);
    
    setShowExplanation(!examMode || (examMode && showAnswersImmediately));
    
    // Only save activity for topics, not for question sets
    if (currentUser && simulationId && !isQuestionSet) {
      const topicId = Number(simulationId);
      const topic = getTopicById(topicId);
      if (topic && currentQuestion) {
        const currentDate = new Date().toISOString();
        
        saveActivity({
          date: currentDate,
          topic: topic.title,
          questionId: String(currentQuestionIndex + 1),
          status: isCorrect ? "correct" : "wrong",
          time: "1",
          isCorrect: isCorrect
        });
      }
    }
    
    // Save immediately after submitting an answer
    saveProgress();
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswerIndex(userAnswers[currentQuestionIndex + 1]);
      setIsAnswerSubmitted(userAnswers[currentQuestionIndex + 1] !== null);
      
      const shouldShowExplanation = userAnswers[currentQuestionIndex + 1] !== null && 
        (!examMode || (examMode && showAnswersImmediately));
      
      setShowExplanation(shouldShowExplanation);
      
      // Save progress after navigation
      setTimeout(saveProgress, 100);
    } else {
      calculateFinalScore();
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswerIndex(userAnswers[currentQuestionIndex - 1]);
      setIsAnswerSubmitted(userAnswers[currentQuestionIndex - 1] !== null);
      
      const shouldShowExplanation = userAnswers[currentQuestionIndex - 1] !== null && 
        (!examMode || (examMode && showAnswersImmediately));
      
      setShowExplanation(shouldShowExplanation);
      
      // Save progress after navigation
      setTimeout(saveProgress, 100);
    }
  };
  
  const handleToggleExplanation = () => {
    setShowExplanation(prev => !prev);
  };
  
  const navigateToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      setSelectedAnswerIndex(userAnswers[index]);
      setIsAnswerSubmitted(userAnswers[index] !== null);
      
      const shouldShowExplanation = userAnswers[index] !== null && 
        (!examMode || (examMode && showAnswersImmediately));
      
      setShowExplanation(shouldShowExplanation);
      
      // Save progress after navigation
      setTimeout(saveProgress, 100);
    }
  };
  
  const toggleQuestionFlag = (index?: number) => {
    const questionIndex = index !== undefined ? index : currentQuestionIndex;
    
    if (questionIndex >= 0 && questionIndex < questionFlags.length) {
      const newFlags = [...questionFlags];
      newFlags[questionIndex] = !newFlags[questionIndex];
      setQuestionFlags(newFlags);
      
      // Save after flag toggle
      setTimeout(saveProgress, 100);
    }
  };
  
  const handleRestartSimulation = () => {
    // FIX #2: Normalize ID for consistent operations
    const numericId = normalizeId(simulationId, isQuestionSet);
    if (!isNaN(numericId)) {
      deleteProgressUnified(numericId, isQuestionSet)
        .then(() => {
          console.log(`Reset progress for ${isQuestionSet ? 'question set' : 'topic'} ${numericId}`);
        })
        .catch(err => {
          console.error("Error resetting progress:", err);
        });
    }
    
    setCurrentQuestionIndex(0);
    setUserAnswers(Array(questions.length).fill(null));
    setSelectedAnswerIndex(null);
    setIsAnswerSubmitted(false);
    setShowExplanation(false);
    setSimulationComplete(false);
    setScore(0);
    setQuestionFlags(Array(questions.length).fill(false));
    
    // Re-apply current settings on restart
    setExamMode(settings.examMode);
    setShowAnswersImmediately(settings.showAnswersImmediately);
    setIsTimerActive(settings.timerEnabled);
    setRemainingTime(settings.timerMinutes * 60);
  };  const handleBackToTopics = () => {
    // This function is now a placeholder - actual navigation is handled in parent component
    console.log("handleBackToTopics called in useSimulation");
  };
  
  const resetProgress = () => {
    if (confirm('האם אתה בטוח שברצונך לאפס את כל ההתקדמות?')) {
      // FIX #2: Normalize ID for consistent operations
      const numericId = normalizeId(simulationId, isQuestionSet);
      if (!isNaN(numericId)) {
        deleteProgressUnified(numericId, isQuestionSet)
          .then(() => {
            handleRestartSimulation();
            
            toast({
              title: "התקדמות אופסה",
              description: "כל ההתקדמות בסימולציה אופסה בהצלחה",
              variant: "default",
            });
          })
          .catch(err => {
            console.error("Error resetting progress:", err);
            // toast({
            //   title: "שגיאה באיפוס התקדמות",
            //   description: "אירעה שגיאה בעת איפוס ההתקדמות",
            //   variant: "destructive",
            // });
          });
      }
    }
  };
  
  // Add the missing calculateFinalScore function
  const calculateFinalScore = () => {
    const answeredCount = userAnswers.filter(answer => answer !== null).length;
    if (answeredCount === 0) return 0;
    
    const correctCount = userAnswers.reduce((count, answer, index) => {
      if (answer !== null && index < questions.length && answer === questions[index].correctAnswer) {
        return count + 1;
      }
      return count;
    }, 0);
    
    const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
    setScore(calculatedScore);
    setSimulationComplete(true);
    
    // Save final score and completion status
    if (currentUser && simulationId && !isQuestionSet) {
      const topicId = Number(simulationId);
      const topic = getTopicById(topicId);
      if (topic) {
        const currentDate = new Date().toISOString();
        console.log(`Saving final activity with score ${calculatedScore}% and ${correctQuestionsCount} correct answers`);
        
        saveActivity({
          date: currentDate,
          topic: topic.title,
          questionId: 'completed',
          status: calculatedScore >= 60 ? 'correct' : 'wrong',
          time: '0',
          score: calculatedScore,
          correctAnswers: correctQuestionsCount,
          totalAnswered: answeredQuestionsCount,
          isCompleted: true
        });
      }
    }
    
    return calculatedScore;
  };
    // Return all values and functions needed by components
  // IMPORTANT: Make sure to include progressLoaded in the returned object
  return {
    questions,
    currentQuestionIndex,
    totalQuestions,
    remainingTime,
    isTimerActive,
    currentQuestion,
    selectedAnswerIndex,
    isAnswerSubmitted,
    showExplanation,
    simulationComplete,
    setSimulationComplete,
    score,
    userAnswers,
    questionFlags,
    examMode,
    showAnswersImmediately,
    
    answeredQuestionsCount,
    correctQuestionsCount,
    progressPercentage,
    currentScorePercentage,
    progressLoaded, // Added this to be accessible from Simulation.tsx
    
    handleAnswerSelect,
    handleSubmitAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    handleToggleExplanation,
    handleRestartSimulation,
    handleBackToTopics,
    
    navigateToQuestion,
    toggleQuestionFlag,
    resetProgress,
    
    saveProgress,
    loadProgress,
    startAutoSave, // New function for external use
    
    setIsTimerActive,
    setShowAnswersImmediately,
    setExamMode,
    setTimerDuration, // Use the existing function instead of setCustomTimerDuration
    
    calculateFinalScore
  };
};
