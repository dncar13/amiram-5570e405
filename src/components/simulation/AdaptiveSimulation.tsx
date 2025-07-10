/**
 * Adaptive Simulation Component
 * 
 * Integrates with the adaptive question delivery system to provide
 * personalized question selection and progress tracking.
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { QuestionDeliveryService } from '@/services/adaptiveQuestions/questionDeliveryService';
import { ProgressTrackingService } from '@/services/adaptiveQuestions/progressTrackingService';
import { SimulationService } from '@/services/adaptiveQuestions/simulationService';
import { UserPreferencesService } from '@/services/adaptiveQuestions/userPreferencesService';
import { Question } from '@/data/types/questionTypes';
import { 
  DifficultyLevel, 
  SessionType, 
  QuestionDeliveryResult,
  SimulationSessionResult 
} from '@/services/adaptiveQuestions/types';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, Target, TrendingUp, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import QuestionCard from './QuestionCard';
import NavigationPanel from './NavigationPanel';
import { RTLWrapper } from '@/components/ui/rtl-wrapper';
import { ReadingPassage } from './ReadingPassage';

// Helper function to group reading comprehension questions together
const groupReadingComprehensionQuestions = (questions: Question[], topicId: number): Question[] => {
  // Separate reading comprehension questions from others
  const readingQuestions = questions.filter(q => 
    q.type === 'reading-comprehension' && 
    (q.topicId === topicId || q.categoryId === topicId)
  );
  
  const otherQuestions = questions.filter(q => 
    q.type !== 'reading-comprehension' || 
    (q.topicId !== topicId && q.categoryId !== topicId)
  );

  // Group reading questions by passage/story
  const groupedReading: Question[][] = [];
  const processedQuestions = new Set<number>();

  readingQuestions.forEach(question => {
    if (processedQuestions.has(question.id)) return;

    // Find all questions that share the same passage
    const samePassageQuestions = readingQuestions.filter(q => 
      !processedQuestions.has(q.id) &&
      (
        (q.passage_text && question.passage_text && q.passage_text === question.passage_text) ||
        (q.passageText && question.passageText && q.passageText === question.passageText) ||
        (q.passage && question.passage && q.passage === question.passage) ||
        (q.passage_title && question.passage_title && q.passage_title === question.passage_title)
      )
    );

    if (samePassageQuestions.length > 0) {
      groupedReading.push(samePassageQuestions);
      samePassageQuestions.forEach(q => processedQuestions.add(q.id));
    } else {
      // Single question group
      groupedReading.push([question]);
      processedQuestions.add(question.id);
    }
  });

  // Interleave reading groups with other questions for better variety
  const result: Question[] = [];
  const maxGroups = Math.max(groupedReading.length, 1);
  const questionsPerGroup = Math.ceil(otherQuestions.length / maxGroups);

  let otherIndex = 0;
  groupedReading.forEach((group, groupIndex) => {
    // Add other questions before this reading group (except for first group)
    if (groupIndex > 0) {
      const questionsToAdd = otherQuestions.slice(otherIndex, otherIndex + questionsPerGroup);
      result.push(...questionsToAdd);
      otherIndex += questionsPerGroup;
    }

    // Add all questions from the reading group consecutively
    result.push(...group);
  });

  // Add any remaining other questions at the end
  if (otherIndex < otherQuestions.length) {
    result.push(...otherQuestions.slice(otherIndex));
  }

  console.log('[AdaptiveSimulation] Grouped questions:', {
    totalQuestions: questions.length,
    readingQuestions: readingQuestions.length,
    otherQuestions: otherQuestions.length,
    readingGroups: groupedReading.length,
    finalOrder: result.map(q => ({ id: q.id, type: q.type }))
  });

  return result;
};

// Hebrew error message mapping
const ERROR_MESSAGES = {
  'Failed to fetch question pool': 'לא ניתן לטעון את מאגר השאלות. אנא נסה שוב.',
  'Insufficient questions available': 'אין מספיק שאלות זמינות לרמת הקושי הנבחרת.',
  'User not authenticated': 'יש להתחבר למערכת כדי להמשיך.',
  'Session not found': 'הסשן לא נמצא. אנא התחל סימולציה חדשה.',
  'Question not found': 'השאלה לא נמצאה במערכת.',
  'Invalid answer': 'תשובה לא תקינה.',
  'Network error': 'בעיית רשת. אנא בדוק את החיבור לאינטרנט.',
  'Server error': 'שגיאת שרת. אנא נסה שוב מאוחר יותר.',
  'Session already complete': 'הסשן כבר הושלם.',
  'Database error': 'שגיאת מסד נתונים. אנא נסה שוב.',
  'Invalid session': 'סשן לא תקין. אנא התחל סימולציה חדשה.',
  'USER_NOT_FOUND': 'משתמש לא נמצא. אנא התחבר מחדש.',
  'INSUFFICIENT_QUESTIONS': 'אין מספיק שאלות זמינות לרמת הקושי הנבחרת.',
  'SESSION_ALREADY_COMPLETE': 'הסשן כבר הושלם.',
  'QUESTION_NOT_FOUND': 'השאלה לא נמצאה במערכת.',
  'INVALID_ANSWER': 'תשובה לא תקינה.',
  'INVALID_SESSION': 'סשן לא תקין. אנא התחל סימולציה חדשה.'
};

const getHebrewErrorMessage = (error: string): string => {
  // Check for exact matches first
  if (ERROR_MESSAGES[error as keyof typeof ERROR_MESSAGES]) {
    return ERROR_MESSAGES[error as keyof typeof ERROR_MESSAGES];
  }
  
  // Check for partial matches
  for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Default message for unknown errors
  return 'אירעה שגיאה לא צפויה. אנא נסה שוב או פנה לתמיכה.';
};

interface AdaptiveSimulationProps {
  initialDifficulty?: DifficultyLevel;
  sessionType?: SessionType;
  questionLimit?: number;
  questionGroup?: string[];
  topicId?: number; // Add topic filtering support
  onComplete?: (result: SimulationSessionResult) => void;
  onError?: (error: Error) => void;
  className?: string;
  enableTimer?: boolean;
  timePerQuestion?: number; // seconds per question
}

export const AdaptiveSimulation: React.FC<AdaptiveSimulationProps> = ({
  initialDifficulty = 'medium',
  sessionType = 'quick',
  questionLimit = 10,
  questionGroup,
  topicId,
  onComplete,
  onError,
  className = '',
  enableTimer = false,
  timePerQuestion = 90
}) => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<QuestionDeliveryResult | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [questionFlags, setQuestionFlags] = useState<Record<number, boolean>>({});
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [totalTimeLimit, setTotalTimeLimit] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Additional UI state
  const [showTimer, setShowTimer] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Initialize services
  const questionDeliveryService = useMemo(() => new QuestionDeliveryService(), []);
  const progressTrackingService = useMemo(() => new ProgressTrackingService(), []);
  const simulationService = useMemo(() => new SimulationService(), []);

  // Submit answer - MOVED BEFORE startTimer to fix initialization order
  const submitAnswer = useCallback(async (answerIndex?: number) => {
    const finalAnswerIndex = answerIndex !== undefined ? answerIndex : selectedAnswer;
    if (!currentQuestion || finalAnswerIndex === null || !sessionId || !currentUser?.id) return;


    // If answerIndex was provided, update selectedAnswer
    if (answerIndex !== undefined) {
      setSelectedAnswer(answerIndex);
    }

    setIsAnswerSubmitted(true);
    setIsLoading(true);

    try {
      const isCorrect = finalAnswerIndex === currentQuestion.correctAnswer;
      
      // Record the answer
      await progressTrackingService.recordAnswer({
        userId: currentUser.id,
        questionId: currentQuestion.id,
        selectedAnswer: finalAnswerIndex,
        isCorrect,
        timeSpent: 60, // TODO: Track actual time
        sessionId,
        difficulty: initialDifficulty
      });

      // Update userAnswers state for UI compatibility
      setUserAnswers(prev => ({
        ...prev,
        [questionIndex]: finalAnswerIndex
      }));
      
      if (isCorrect) {
        setScore(prev => prev + 1);
      }

      setAnsweredQuestions(prev => prev + 1);
      setShowExplanation(true);
      
      // Stop timer after submission
      if (enableTimer && isTimerActive) {
        stopTimer();
      }

    } catch (error) {
      const originalMessage = error instanceof Error ? error.message : 'שגיאה בשמירת התשובה';
      const hebrewMessage = getHebrewErrorMessage(originalMessage);
      toast({
        title: "שגיאה בשמירת התשובה",
        description: hebrewMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentQuestion, selectedAnswer, sessionId, currentUser?.id, progressTrackingService, initialDifficulty, questionIndex, enableTimer, isTimerActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer functions - NOW submitAnswer is available
  const startTimer = useCallback(() => {
    if (!enableTimer || timeRemaining === null) return;
    
    setIsTimerActive(true);
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          setIsTimerActive(false);
          // Auto-submit current answer or move to next question
          if (!isAnswerSubmitted) {
            submitAnswer();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [enableTimer, timeRemaining, isAnswerSubmitted, submitAnswer]);
  
  const stopTimer = useCallback(() => {
    setIsTimerActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  const resetTimer = useCallback(() => {
    stopTimer();
    setTimeRemaining(timePerQuestion);
  }, [stopTimer, timePerQuestion]);
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Initialize simulation
  const initializeSimulation = useCallback(async () => {
    if (!currentUser?.id) {
      setError('משתמש לא מחובר');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Start simulation session
      const sessionResult = await simulationService.startSession({
        userId: currentUser.id,
        difficulty: initialDifficulty,
        sessionType,
        questionLimit,
        questionGroup
      });

      setSessionId(sessionResult.sessionId);

      // Get personalized questions
      const questions = await questionDeliveryService.getPersonalizedQuestions({
        userId: currentUser.id,
        difficulty: initialDifficulty,
        sessionType,
        questionLimit,
        questionGroup,
        topicId, // Pass topic filtering
        sessionId: sessionResult.sessionId
      });

      if (!questions.questions || questions.questions.length === 0) {
        throw new Error('לא נמצאו שאלות מתאימות לפרמטרים שנבחרו');
      }

      // For mixed simulations with reading comprehension, ensure reading questions are grouped
      let processedQuestions = questions.questions;
      if (topicId && questionGroup && questionGroup.includes('reading-comprehension')) {
        processedQuestions = groupReadingComprehensionQuestions(questions.questions, topicId);
      }

      setDeliveryResult({
        ...questions,
        questions: processedQuestions
      });
      setCurrentQuestion(processedQuestions[0]);
      setTotalQuestions(processedQuestions.length);
      setQuestionIndex(0);
      setIsInitialized(true);
      setStartTime(new Date()); // Track simulation start time
      
      // Initialize timer if enabled
      if (enableTimer) {
        const totalTime = processedQuestions.length * timePerQuestion;
        setTotalTimeLimit(totalTime);
        setTimeRemaining(timePerQuestion);
        setShowTimer(true);
      }

      // Show delivery strategy info
      toast({
        title: "סימולציה מותאמת אישית",
        description: `נבחרה אסטרטגיית ${getStrategyDisplayName(questions.strategy)} עם ${questions.questions.length} שאלות`,
        duration: 3000,
      });

    } catch (error) {
      const originalMessage = error instanceof Error ? error.message : 'שגיאה בטעינת הסימולציה';
      const hebrewMessage = getHebrewErrorMessage(originalMessage);
      setError(hebrewMessage);
      onError?.(error instanceof Error ? error : new Error(originalMessage));
      toast({
        title: "שגיאה בטעינת הסימולציה",
        description: hebrewMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id, initialDifficulty, sessionType, questionLimit, questionGroup, simulationService, questionDeliveryService, onError, enableTimer, timePerQuestion]);

  // Move to next question
  const nextQuestion = useCallback(async () => {
    if (!deliveryResult || !sessionId || !currentUser?.id) return;

    const nextIndex = questionIndex + 1;
    
    if (nextIndex >= deliveryResult.questions.length) {
      // Finish simulation
      try {
        setSimulationComplete(true);
        stopTimer();
        
        const result = await simulationService.completeSession({
          userId: currentUser.id,
          sessionId,
          finalScore: score,
          totalQuestions: deliveryResult.questions.length,
          completedAt: new Date()
        });

        // Calculate actual time spent
        const endTime = new Date();
        const actualTimeSpent = startTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0;

        // Pass comprehensive data to the results page
        const enhancedResult = {
          ...result,
          questions: deliveryResult.questions,
          userAnswers: userAnswers,
          timeSpent: actualTimeSpent
        };

        onComplete?.(enhancedResult);
        
        toast({
          title: "סימולציה הושלמה!",
          description: `ציון: ${score}/${totalQuestions} (${Math.round((score / totalQuestions) * 100)}%)`,
          duration: 5000,
        });

      } catch (error) {
        const originalMessage = error instanceof Error ? error.message : 'שגיאה בסיום הסימולציה';
        const hebrewMessage = getHebrewErrorMessage(originalMessage);
        toast({
          title: "שגיאה בסיום הסימולציה",
          description: hebrewMessage,
          variant: "destructive",
          duration: 5000,
        });
      }
      return;
    }

    setQuestionIndex(nextIndex);
    const newQuestion = deliveryResult.questions[nextIndex];
    setCurrentQuestion(newQuestion);
    
    // Debug logging for reading comprehension questions
    if (newQuestion.type === 'reading-comprehension') {
      console.log('[AdaptiveSimulation] Loading reading comprehension question:', {
        questionId: newQuestion.id,
        hasPassageText: !!(newQuestion.passage_text || newQuestion.passageText),
        hasPassageTitle: !!(newQuestion.passage_title || newQuestion.passageTitle),
        passageTextLength: (newQuestion.passage_text || newQuestion.passageText || '').length,
        passageTitle: newQuestion.passage_title || newQuestion.passageTitle,
        hasPassageWithLines: !!(newQuestion.passageWithLines && newQuestion.passageWithLines.length > 0),
        questionText: newQuestion.text.substring(0, 100) + '...'
      });
    }
    
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setShowExplanation(false);
    
    // Reset timer for next question
    if (enableTimer) {
      resetTimer();
      startTimer();
    }
  }, [deliveryResult, questionIndex, sessionId, currentUser?.id, score, totalQuestions, simulationService, onComplete, enableTimer, resetTimer, startTimer, startTime, stopTimer, userAnswers]);

  // Initialize on mount
  useEffect(() => {
    if (!isInitialized) {
      initializeSimulation();
    }
  }, [initializeSimulation, isInitialized]);

  // PHASE 1 FIX: Start timer when question changes - THIS IS THE CRITICAL FIX
  useEffect(() => {
    if (enableTimer && currentQuestion && timeRemaining !== null && !isAnswerSubmitted) {
      startTimer();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestion, enableTimer, startTimer, timeRemaining, isAnswerSubmitted]);

  // Helper function to get strategy display name
  const getStrategyDisplayName = (strategy: string): string => {
    const strategyNames = {
      'unseen_priority': 'שאלות חדשות',
      'random_weighted': 'שאלות מותאמות',
      'spaced_repetition': 'חזרה מרווחת',
      'mistake_review': 'חזרה על טעויות',
      'fallback_reshuffle': 'ערבוב מחדש'
    };
    return strategyNames[strategy as keyof typeof strategyNames] || strategy;
  };

  // Loading state
  if (isLoading && !isInitialized) {
    return (
      <RTLWrapper>
        <div className="w-full max-w-none bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="relative w-12 h-12 mb-4">
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-t-blue-600 border-r-blue-600/50 border-b-blue-600/30 border-l-blue-600/10 rounded-full animate-spin"></div>
              </div>
              <p className="text-lg font-medium text-slate-300">מכין סימולציה מותאמת אישית...</p>
              <p className="text-sm text-slate-500 mt-2">מנתח את ההיסטוריה שלך ובוחר שאלות מתאימות</p>
            </div>
          </div>
        </div>
      </RTLWrapper>
    );
  }

  // Error state
  if (error) {
    return (
      <RTLWrapper>
        <div className="w-full max-w-none bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen px-4 py-8">
          <Card className="max-w-lg mx-auto border-red-500/50 bg-red-900/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-red-300 flex items-center justify-center gap-2">
                <AlertCircle className="h-6 w-6" />
                שגיאה בטעינת הסימולציה
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-red-200 bg-red-950/50 p-3 rounded-md border border-red-500/30">{error}</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button 
                  onClick={initializeSimulation} 
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-red-700/80 hover:bg-red-600/80 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  נסה שוב
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 border-slate-500 text-slate-200 hover:bg-slate-700/50"
                >
                  <RefreshCw className="h-4 w-4" />
                  רענן דף
                </Button>
              </div>
              <p className="text-xs text-slate-400">
                אם השגיאה נמשכת, אנא פנה לתמיכה הטכנית
              </p>
            </CardContent>
          </Card>
        </div>
      </RTLWrapper>
    );
  }

  // No questions state
  if (!currentQuestion || !deliveryResult) {
    return (
      <RTLWrapper>
        <div className="w-full max-w-none bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen px-4 py-8">
          <Card className="max-w-lg mx-auto bg-slate-800/60 border-slate-600/50">
            <CardHeader>
              <CardTitle className="text-center text-slate-200">אין שאלות זמינות</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-400 mb-4">לא נמצאו שאלות מתאימות לפרמטרים הנבחרים</p>
              <Button 
                onClick={initializeSimulation} 
                disabled={isLoading}
                className="bg-blue-700/80 hover:bg-blue-600/80 text-white"
              >
                נסה שוב
              </Button>
            </CardContent>
          </Card>
        </div>
      </RTLWrapper>
    );
  }

  // Convert to arrays for compatibility
  const userAnswersArray: (number | null)[] = Array.from({ length: totalQuestions }, (_, i) => userAnswers[i] ?? null);
  const questionFlagsArray: boolean[] = Array.from({ length: totalQuestions }, (_, i) => questionFlags[i] ?? false);

  // Handle navigation and flags
  const handleNavigateToQuestion = (index: number) => {
    if (deliveryResult?.questions[index]) {
      stopTimer(); // Stop current timer
      setQuestionIndex(index);
      const selectedQuestion = deliveryResult.questions[index];
      setCurrentQuestion(selectedQuestion);
      
      // Debug logging for reading comprehension questions
      if (selectedQuestion.type === 'reading-comprehension') {
        console.log('[AdaptiveSimulation] Navigating to reading comprehension question:', {
          questionId: selectedQuestion.id,
          hasPassageText: !!(selectedQuestion.passage_text || selectedQuestion.passageText),
          hasPassageTitle: !!(selectedQuestion.passage_title || selectedQuestion.passageTitle),
          passageTextLength: (selectedQuestion.passage_text || selectedQuestion.passageText || '').length,
          passageTitle: selectedQuestion.passage_title || selectedQuestion.passageTitle
        });
      }
      
      setSelectedAnswer(userAnswers[index] ?? null); // Restore previous answer if exists
      setIsAnswerSubmitted(userAnswers[index] !== undefined);
      setShowExplanation(false);
      
      // Restart timer if enabled and not already answered
      if (enableTimer && userAnswers[index] === undefined) {
        resetTimer();
        startTimer();
      }
    }
  };

  const handleToggleFlag = () => {
    setQuestionFlags(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }));
  };
  
  const handleResetQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setShowExplanation(false);
    
    // Reset timer for current question
    if (enableTimer) {
      resetTimer();
      startTimer();
    }
  };

  const handleResetProgress = () => {
    stopTimer();
    setUserAnswers({});
    setQuestionFlags({});
    setScore(0);
    setAnsweredQuestions(0);
    setQuestionIndex(0);
    setCurrentQuestion(deliveryResult?.questions[0] || null);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setShowExplanation(false);
    setSimulationComplete(false);
    
    // Restart timer if enabled
    if (enableTimer) {
      resetTimer();
      startTimer();
    }
  };

  return (
    <RTLWrapper>
      <div className="w-full max-w-none bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen px-2 sm:px-4">
        {/* Navigation Panel */}
        <div className="mb-4 sm:mb-8">
          <NavigationPanel
            currentQuestionIndex={questionIndex}
            totalQuestions={totalQuestions}
            userAnswers={userAnswersArray}
            questionsData={deliveryResult?.questions || []}
            questionFlags={questionFlagsArray}
            progressPercentage={(questionIndex / totalQuestions) * 100}
            currentScorePercentage={(score / Math.max(answeredQuestions, 1)) * 100}
            onNavigateToQuestion={handleNavigateToQuestion}
            onToggleQuestionFlag={handleToggleFlag}
            onResetProgress={handleResetProgress}
            simulationType="topic"
            examMode={sessionType === 'full'}
          />
        </div>

        {/* Main Content Area */}
        {currentQuestion?.type === 'reading-comprehension' ? (
          /* Two Column Layout for Reading Comprehension */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8" dir="ltr">
            {/* Left Column - Reading Passage (Story) */}
            <div className="lg:order-1">
              <div className="sticky top-4">
                <ReadingPassage
                  title={currentQuestion.passage_title || currentQuestion.passageTitle || ''}
                  passageText={currentQuestion.passage_text || currentQuestion.passageText || currentQuestion.passage || ''}
                  passageWithLines={currentQuestion.passageWithLines}
                  showLineNumbers={currentQuestion.lineNumbers}
                />
              </div>
            </div>

            {/* Right Column - Question Card */}
            <div className="lg:order-2" dir="rtl">
              <QuestionCard
                currentQuestion={currentQuestion}
                currentQuestionIndex={questionIndex}
                totalQuestions={totalQuestions}
                selectedAnswerIndex={selectedAnswer}
                isAnswerSubmitted={isAnswerSubmitted}
                showExplanation={showExplanation}
                isFlagged={questionFlags[questionIndex] || false}
                examMode={sessionType === 'full'}
                showAnswersImmediately={sessionType !== 'full'}
                answeredQuestionsCount={answeredQuestions}
                correctQuestionsCount={score}
                progressPercentage={(questionIndex / totalQuestions) * 100}
                onAnswerSelect={setSelectedAnswer}
                onSubmitAnswer={submitAnswer}
                onNextQuestion={nextQuestion}
                onPreviousQuestion={() => {
                  if (questionIndex > 0) {
                    handleNavigateToQuestion(questionIndex - 1);
                  }
                }}
                onToggleExplanation={() => setShowExplanation(!showExplanation)}
                onToggleQuestionFlag={handleToggleFlag}
                onFinishSimulation={() => {
                  nextQuestion();
                }}
                onResetQuestion={handleResetQuestion}
              />
            </div>
          </div>
        ) : (
          /* Single Column Layout for Other Question Types */
          <>
            <div className="max-w-none">
              <QuestionCard
                currentQuestion={currentQuestion}
                currentQuestionIndex={questionIndex}
                totalQuestions={totalQuestions}
                selectedAnswerIndex={selectedAnswer}
                isAnswerSubmitted={isAnswerSubmitted}
                showExplanation={showExplanation}
                isFlagged={questionFlags[questionIndex] || false}
                examMode={sessionType === 'full'}
                showAnswersImmediately={sessionType !== 'full'}
                answeredQuestionsCount={answeredQuestions}
                correctQuestionsCount={score}
                progressPercentage={(questionIndex / totalQuestions) * 100}
                onAnswerSelect={setSelectedAnswer}
                onSubmitAnswer={submitAnswer}
                onNextQuestion={nextQuestion}
                onPreviousQuestion={() => {
                  if (questionIndex > 0) {
                    handleNavigateToQuestion(questionIndex - 1);
                  }
                }}
                onToggleExplanation={() => setShowExplanation(!showExplanation)}
                onToggleQuestionFlag={handleToggleFlag}
                onFinishSimulation={() => {
                  nextQuestion();
                }}
                onResetQuestion={handleResetQuestion}
              />
            </div>
          </>
        )}
        
        {/* Timer Display */}
        {showTimer && timeRemaining !== null && (
          <div className="mt-4 p-4 bg-slate-800/60 rounded-lg border border-slate-600/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <span className="text-slate-300 font-medium">זמן נותר לשאלה:</span>
              </div>
              <div className={`text-2xl font-bold ${
                timeRemaining <= 10 ? 'text-red-400' : 
                timeRemaining <= 30 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
            </div>
            <div className="mt-2">
              <Progress 
                value={(timeRemaining / timePerQuestion) * 100} 
                className="h-2"
              />
            </div>
          </div>
        )}

        {/* Delivery Metadata (Debug Info) - Dark themed */}
        {deliveryResult?.metadata && (
          <div className="mt-6 p-4 bg-slate-800/60 rounded-lg border border-slate-600/50 text-sm backdrop-blur-sm">
            <details>
              <summary className="cursor-pointer font-medium text-slate-300 mb-2 hover:text-slate-200">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-400" />
                  <span>מידע על בחירת השאלות - {getStrategyDisplayName(deliveryResult.strategy)}</span>
                </div>
              </summary>
              <div className="space-y-1 text-slate-400 mt-3 mr-6">
                <p>מספר שאלות זמינות: <span className="text-slate-300">{deliveryResult.metadata.totalPoolSize}</span></p>
                <p>שאלות שלא נראו: <span className="text-slate-300">{deliveryResult.metadata.unseenPoolSize}</span></p>
                <p>זמן בחירה: <span className="text-slate-300">{deliveryResult.metadata.selectionTimeMs}ms</span></p>
                <p>גרסת אלגוריתם: <span className="text-slate-300">{deliveryResult.metadata.algorithmVersion}</span></p>
                <div className="flex items-center gap-4 text-sm pt-2">
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">{score}/{totalQuestions}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    <span className="text-slate-300">{Math.round((score / Math.max(answeredQuestions, 1)) * 100)}%</span>
                  </div>
                </div>
              </div>
            </details>
          </div>
        )}
      </div>
    </RTLWrapper>
  );
};

export default AdaptiveSimulation;
