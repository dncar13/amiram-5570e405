import { useState, useEffect, useCallback, useMemo } from "react";
import { Question } from "@/data/types/questionTypes";
import { 
  getSimulationProgress, 
  saveSimulationProgress, 
  resetSimulation 
} from "@/services/questionsService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Constants
const EXAM_TIME_MINUTES = 60;
const EXAM_TIME_MS = EXAM_TIME_MINUTES * 60 * 1000;

// Types
interface SimulationHook {
  // Current state
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  totalQuestions: number;
  questions: Question[];
  userAnswers: Record<number, number>;
  questionFlags: Record<number, boolean>;
  selectedAnswerIndex: number | null;
  isAnswerSubmitted: boolean;
  showExplanation: boolean;
  simulationComplete: boolean;
  progressLoaded: boolean;
  
  // Timer state
  remainingTime: number;
  isTimerActive: boolean;
  
  // Stats
  score: number;
  answeredQuestionsCount: number;
  correctQuestionsCount: number;
  progressPercentage: number;
  currentScorePercentage: number;
  
  // Settings
  examMode: boolean;
  showAnswersImmediately: boolean;
  
  // Actions
  handleAnswerSelect: (index: number) => void;
  handleSubmitAnswer: () => void;
  handleNextQuestion: () => void;
  handlePreviousQuestion: () => void;
  handleToggleExplanation: () => void;
  navigateToQuestion: (index: number) => void;
  toggleQuestionFlag: (index: number) => void;
  handleRestartSimulation: () => void;
  resetProgress: () => void;
  saveProgress: () => void;
  setSimulationComplete: (complete: boolean) => void;
}

export const useSimulation = (
  simulationId: string,
  isQuestionSet: boolean = false,
  providedQuestions?: Question[]
): SimulationHook => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Core state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [questionFlags, setQuestionFlags] = useState<Record<number, boolean>>({});
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [progressLoaded, setProgressLoaded] = useState(false);
  
  // Timer state
  const [remainingTime, setRemainingTime] = useState(EXAM_TIME_MS);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [lastTimerUpdate, setLastTimerUpdate] = useState(Date.now());
  
  // Settings
  const [examMode, setExamMode] = useState(false);
  const [showAnswersImmediately, setShowAnswersImmediately] = useState(true);
  
  // Current question
  const currentQuestion = useMemo(() => {
    if (questions.length === 0 || currentQuestionIndex >= questions.length) {
      return null;
    }
    return questions[currentQuestionIndex];
  }, [questions, currentQuestionIndex]);
  
  // Stats calculations
  const answeredQuestionsCount = useMemo(() => {
    return Object.keys(userAnswers).length;
  }, [userAnswers]);
  
  const correctQuestionsCount = useMemo(() => {
    return Object.entries(userAnswers).reduce((count, [questionIndex, answerIndex]) => {
      const question = questions[parseInt(questionIndex)];
      if (question && question.correctAnswer === answerIndex) {
        return count + 1;
      }
      return count;
    }, 0);
  }, [userAnswers, questions]);
  
  const score = useMemo(() => {
    if (questions.length === 0) return 0;
    return Math.round((correctQuestionsCount / questions.length) * 100);
  }, [correctQuestionsCount, questions.length]);
  
  const progressPercentage = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return Math.round((answeredQuestionsCount / totalQuestions) * 100);
  }, [answeredQuestionsCount, totalQuestions]);
  
  const currentScorePercentage = useMemo(() => {
    if (answeredQuestionsCount === 0) return 0;
    return Math.round((correctQuestionsCount / answeredQuestionsCount) * 100);
  }, [correctQuestionsCount, answeredQuestionsCount]);
  
  // Initialize simulation
  useEffect(() => {
    console.log("useSimulation - initializing with parameters:", { simulationId, isQuestionSet, providedQuestions });
    
    // If we have provided questions (like story questions), use them
    if (providedQuestions && providedQuestions.length > 0) {
      console.log("useSimulation - using provided questions:", providedQuestions.length);
      setQuestions(providedQuestions);
      setTotalQuestions(providedQuestions.length);
      setProgressLoaded(true);
      return;
    }
    
    // Check if this is a difficulty-based simulation
    const difficultyLevel = sessionStorage.getItem('current_difficulty_level');
    const difficultyType = sessionStorage.getItem('current_difficulty_type');
    
    if (difficultyLevel && difficultyType) {
      console.log(`useSimulation - loading questions for difficulty: ${difficultyLevel}, type: ${difficultyType}`);
      
      // Import the function here to avoid circular dependencies
      import("@/services/questionsService").then(({ getQuestionsByDifficultyAndType }) => {
        const difficultyQuestions = getQuestionsByDifficultyAndType(difficultyLevel, difficultyType);
        console.log(`useSimulation - loaded ${difficultyQuestions.length} questions for ${difficultyLevel} ${difficultyType}`);
        
        if (difficultyQuestions.length === 0) {
          console.error(`useSimulation - No questions found for difficulty: ${difficultyLevel}, type: ${difficultyType}`);
          // Try to get all questions of this type regardless of difficulty as fallback
          import("@/services/questionsService").then(({ getQuestionsByType }) => {
            const typeQuestions = getQuestionsByType(difficultyType);
            console.log(`useSimulation - fallback: found ${typeQuestions.length} questions of type ${difficultyType}`);
            setQuestions(typeQuestions);
            setTotalQuestions(typeQuestions.length);
            setProgressLoaded(true);
          });
        } else {
          setQuestions(difficultyQuestions);
          setTotalQuestions(difficultyQuestions.length);
          setProgressLoaded(true);
        }
      });
      return;
    }
    
    // If no simulation ID, we can't load progress
    if (!simulationId) {
      console.log("useSimulation - no simulationId provided, can't load progress");
      setProgressLoaded(true);
      return;
    }
    
    // Check for reset parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const resetParam = urlParams.get('reset');
    
    if (resetParam === 'true') {
      console.log("useSimulation - reset parameter detected, resetting simulation");
      resetSimulation(Number(simulationId));
      
      // Remove the reset parameter from URL
      urlParams.delete('reset');
      const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
    
    // Try to load existing progress
    const continueFlag = sessionStorage.getItem('continue_simulation') === 'true';
    const progress = getSimulationProgress(Number(simulationId));
    
    if (progress && (continueFlag || urlParams.get('continue') === 'true')) {
      console.log("useSimulation - loading existing progress:", progress);
      
      // Load questions first
      import("@/services/questionsService").then(({ getAllQuestions }) => {
        const allQuestions = getAllQuestions();
        
        // If we're doing a question set, filter by set ID
        let filteredQuestions = allQuestions;
        if (isQuestionSet) {
          const setId = Number(simulationId.replace('qs_', ''));
          import("@/services/questionsService").then(({ getQuestionsBySet }) => {
            filteredQuestions = getQuestionsBySet(setId);
            console.log(`useSimulation - loaded ${filteredQuestions.length} questions for set ${setId}`);
            
            // Now restore progress
            setQuestions(filteredQuestions);
            setTotalQuestions(filteredQuestions.length);
            setCurrentQuestionIndex(progress.currentQuestionIndex);
            setUserAnswers(progress.userAnswers || {});
            setQuestionFlags(progress.questionFlags || {});
            setProgressLoaded(true);
          });
        } else {
          // For topic simulations
          import("@/services/questionsService").then(({ getQuestionsByTopic }) => {
            filteredQuestions = getQuestionsByTopic(Number(simulationId));
            console.log(`useSimulation - loaded ${filteredQuestions.length} questions for topic ${simulationId}`);
            
            // Now restore progress
            setQuestions(filteredQuestions);
            setTotalQuestions(filteredQuestions.length);
            setCurrentQuestionIndex(progress.currentQuestionIndex);
            setUserAnswers(progress.userAnswers || {});
            setQuestionFlags(progress.questionFlags || {});
            setProgressLoaded(true);
          });
        }
      });
    } else {
      // No existing progress or not continuing, start fresh
      console.log("useSimulation - no existing progress or not continuing, starting fresh");
      
      // Load questions based on simulation type
      if (isQuestionSet) {
        const setId = Number(simulationId.replace('qs_', ''));
        import("@/services/questionsService").then(({ getQuestionsBySet }) => {
          const setQuestions = getQuestionsBySet(setId);
          console.log(`useSimulation - loaded ${setQuestions.length} questions for set ${setId}`);
          setQuestions(setQuestions);
          setTotalQuestions(setQuestions.length);
          setProgressLoaded(true);
        });
      } else {
        // For topic simulations
        import("@/services/questionsService").then(({ getQuestionsByTopic }) => {
          const topicQuestions = getQuestionsByTopic(Number(simulationId));
          console.log(`useSimulation - loaded ${topicQuestions.length} questions for topic ${simulationId}`);
          setQuestions(topicQuestions);
          setTotalQuestions(topicQuestions.length);
          setProgressLoaded(true);
        });
      }
    }
  }, [simulationId, isQuestionSet, providedQuestions]);
  
  // Timer effect
  useEffect(() => {
    if (!examMode || !isTimerActive) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTimerUpdate;
      setLastTimerUpdate(now);
      
      setRemainingTime(prev => {
        const newTime = Math.max(0, prev - elapsed);
        if (newTime === 0) {
          // Time's up!
          setIsTimerActive(false);
          setSimulationComplete(true);
          toast({
            title: "הזמן נגמר!",
            description: "זמן המבחן הסתיים. הציון שלך מחושב על סמך התשובות שהספקת לענות.",
            variant: "destructive",
          });
        }
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [examMode, isTimerActive, lastTimerUpdate, toast]);
  
  // Handle answer selection
  const handleAnswerSelect = useCallback((index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswerIndex(index);
  }, [isAnswerSubmitted]);
  
  // Handle answer submission
  const handleSubmitAnswer = useCallback(() => {
    if (selectedAnswerIndex === null || isAnswerSubmitted) return;
    
    // Record the answer
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: selectedAnswerIndex
    }));
    
    setIsAnswerSubmitted(true);
    
    // If we're showing answers immediately, check if it's correct
    if (showAnswersImmediately && currentQuestion) {
      const isCorrect = selectedAnswerIndex === currentQuestion.correctAnswer;
      
      toast({
        title: isCorrect ? "תשובה נכונה!" : "תשובה שגויה",
        description: isCorrect 
          ? "כל הכבוד! התשובה שלך נכונה." 
          : `התשובה הנכונה היא: ${currentQuestion.options[currentQuestion.correctAnswer]}`,
        variant: isCorrect ? "default" : "destructive",
      });
    }
  }, [selectedAnswerIndex, isAnswerSubmitted, currentQuestionIndex, showAnswersImmediately, currentQuestion, toast]);
  
  // Handle moving to next question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex >= questions.length - 1) {
      // End of simulation
      setSimulationComplete(true);
      return;
    }
    
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswerIndex(userAnswers[currentQuestionIndex + 1] ?? null);
    setIsAnswerSubmitted(userAnswers[currentQuestionIndex + 1] !== undefined);
    setShowExplanation(false);
  }, [currentQuestionIndex, questions.length, userAnswers]);
  
  // Handle moving to previous question
  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex <= 0) return;
    
    setCurrentQuestionIndex(prev => prev - 1);
    setSelectedAnswerIndex(userAnswers[currentQuestionIndex - 1] ?? null);
    setIsAnswerSubmitted(userAnswers[currentQuestionIndex - 1] !== undefined);
    setShowExplanation(false);
  }, [currentQuestionIndex, userAnswers]);
  
  // Toggle explanation visibility
  const handleToggleExplanation = useCallback(() => {
    setShowExplanation(prev => !prev);
  }, []);
  
  // Navigate to a specific question
  const navigateToQuestion = useCallback((index: number) => {
    if (index < 0 || index >= questions.length) return;
    
    setCurrentQuestionIndex(index);
    setSelectedAnswerIndex(userAnswers[index] ?? null);
    setIsAnswerSubmitted(userAnswers[index] !== undefined);
    setShowExplanation(false);
  }, [questions.length, userAnswers]);
  
  // Toggle question flag
  const toggleQuestionFlag = useCallback((index: number) => {
    setQuestionFlags(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }, []);
  
  // Restart simulation
  const handleRestartSimulation = useCallback(() => {
    // Confirm restart
    if (window.confirm("האם אתה בטוח שברצונך להתחיל מחדש? כל ההתקדמות תאבד.")) {
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setQuestionFlags({});
      setSelectedAnswerIndex(null);
      setIsAnswerSubmitted(false);
      setShowExplanation(false);
      setSimulationComplete(false);
      
      // Reset timer if in exam mode
      if (examMode) {
        setRemainingTime(EXAM_TIME_MS);
        setIsTimerActive(true);
        setLastTimerUpdate(Date.now());
      }
      
      // Save the reset progress
      if (simulationId) {
        resetSimulation(Number(simulationId));
      }
      
      toast({
        title: "הסימולציה אופסה",
        description: "הסימולציה התחילה מחדש. בהצלחה!",
        variant: "default",
      });
    }
  }, [examMode, simulationId, toast]);
  
  // Reset progress
  const resetProgress = useCallback(() => {
    if (simulationId) {
      resetSimulation(Number(simulationId));
      
      // Reload the page with reset parameter
      navigate(`${window.location.pathname}?reset=true`);
    }
  }, [simulationId, navigate]);
  
  // Save progress
  const saveProgress = useCallback(() => {
    if (!simulationId || questions.length === 0) return;
    
    const progress = {
      currentQuestionIndex,
      totalQuestions: questions.length,
      userAnswers,
      questionFlags,
      score,
      timeStarted: Date.now() - (EXAM_TIME_MS - remainingTime),
      lastUpdated: Date.now()
    };
    
    saveSimulationProgress(Number(simulationId), progress);
  }, [simulationId, currentQuestionIndex, questions.length, userAnswers, questionFlags, score, remainingTime]);
  
  // Save progress when unmounting
  useEffect(() => {
    return () => {
      if (progressLoaded && questions.length > 0) {
        saveProgress();
      }
    };
  }, [progressLoaded, questions.length, saveProgress]);
  
  return {
    // Current state
    currentQuestionIndex,
    currentQuestion,
    totalQuestions,
    questions,
    userAnswers,
    questionFlags,
    selectedAnswerIndex,
    isAnswerSubmitted,
    showExplanation,
    simulationComplete,
    progressLoaded,
    
    // Timer state
    remainingTime,
    isTimerActive,
    
    // Stats
    score,
    answeredQuestionsCount,
    correctQuestionsCount,
    progressPercentage,
    currentScorePercentage,
    
    // Settings
    examMode,
    showAnswersImmediately,
    
    // Actions
    handleAnswerSelect,
    handleSubmitAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    handleToggleExplanation,
    navigateToQuestion,
    toggleQuestionFlag,
    handleRestartSimulation,
    resetProgress,
    saveProgress,
    setSimulationComplete
  };
};
