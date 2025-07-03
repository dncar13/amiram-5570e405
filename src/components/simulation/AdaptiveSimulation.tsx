/**
 * Adaptive Simulation Component
 * 
 * Integrates with the adaptive question delivery system to provide
 * personalized question selection and progress tracking.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  onComplete?: (result: SimulationSessionResult) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export const AdaptiveSimulation: React.FC<AdaptiveSimulationProps> = ({
  initialDifficulty = 'medium',
  sessionType = 'quick',
  questionLimit = 10,
  questionGroup,
  onComplete,
  onError,
  className = ''
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

  // Initialize services
  const questionDeliveryService = useMemo(() => new QuestionDeliveryService(), []);
  const progressTrackingService = useMemo(() => new ProgressTrackingService(), []);
  const simulationService = useMemo(() => new SimulationService(), []);

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
        sessionId: sessionResult.sessionId
      });

      if (!questions.questions || questions.questions.length === 0) {
        throw new Error('לא נמצאו שאלות מתאימות לפרמטרים שנבחרו');
      }

      setDeliveryResult(questions);
      setCurrentQuestion(questions.questions[0]);
      setTotalQuestions(questions.questions.length);
      setQuestionIndex(0);
      setIsInitialized(true);

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
  }, [currentUser?.id, initialDifficulty, sessionType, questionLimit, simulationService, questionDeliveryService, onError]);

  // Submit answer
  const submitAnswer = useCallback(async () => {
    if (!currentQuestion || selectedAnswer === null || !sessionId || !currentUser?.id) return;

    setIsAnswerSubmitted(true);
    setIsLoading(true);

    try {
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
      
      // Record the answer
      await progressTrackingService.recordAnswer({
        userId: currentUser.id,
        questionId: currentQuestion.id,
        selectedAnswer,
        isCorrect,
        timeSpent: 60, // TODO: Track actual time
        sessionId,
        difficulty: initialDifficulty
      });

      if (isCorrect) {
        setScore(prev => prev + 1);
      }

      setAnsweredQuestions(prev => prev + 1);
      setShowExplanation(true);

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
  }, [currentQuestion, selectedAnswer, sessionId, currentUser?.id, progressTrackingService, initialDifficulty]);

  // Move to next question
  const nextQuestion = useCallback(async () => {
    if (!deliveryResult || !sessionId || !currentUser?.id) return;

    const nextIndex = questionIndex + 1;
    
    if (nextIndex >= deliveryResult.questions.length) {
      // Finish simulation
      try {
        const result = await simulationService.completeSession({
          userId: currentUser.id,
          sessionId,
          finalScore: score,
          totalQuestions: deliveryResult.questions.length,
          completedAt: new Date()
        });

        onComplete?.(result);
        
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
    setCurrentQuestion(deliveryResult.questions[nextIndex]);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setShowExplanation(false);
  }, [deliveryResult, questionIndex, sessionId, currentUser?.id, score, totalQuestions, simulationService, onComplete]);

  // Initialize on mount
  useEffect(() => {
    if (!isInitialized) {
      initializeSimulation();
    }
  }, [initializeSimulation, isInitialized]);

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg font-medium text-slate-700">מכין סימולציה מותאמת אישית...</p>
          <p className="text-sm text-slate-500 mt-2">מנתח את ההיסטוריה שלך ובוחר שאלות מתאימות</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="max-w-lg mx-auto border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-center text-red-600 flex items-center justify-center gap-2">
            <AlertCircle className="h-6 w-6" />
            שגיאה בטעינת הסימולציה
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-slate-700 bg-white p-3 rounded-md border">{error}</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button 
              onClick={initializeSimulation} 
              disabled={isLoading}
              className="flex items-center gap-2"
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
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              רענן דף
            </Button>
          </div>
          <p className="text-xs text-slate-500">
            אם השגיאה נמשכת, אנא פנה לתמיכה הטכנית
          </p>
        </CardContent>
      </Card>
    );
  }

  // No questions state
  if (!currentQuestion || !deliveryResult) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-center">אין שאלות זמינות</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-slate-600 mb-4">לא נמצאו שאלות מתאימות לפרמטרים הנבחרים</p>
          <Button onClick={initializeSimulation} disabled={isLoading}>
            נסה שוב
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-4 ${className}`}>
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span className="font-medium">סימולציה מותאמת אישית</span>
            <Badge variant="outline">{getStrategyDisplayName(deliveryResult.strategy)}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>{score}/{totalQuestions}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>{Math.round((score / Math.max(answeredQuestions, 1)) * 100)}%</span>
            </div>
          </div>
        </div>
        
        <Progress 
          value={(questionIndex / totalQuestions) * 100} 
          className="h-2 mb-2"
        />
        
        <div className="flex justify-between text-sm text-slate-600">
          <span>שאלה {questionIndex + 1} מתוך {totalQuestions}</span>
          <span>נענו: {answeredQuestions} שאלות</span>
        </div>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQuestion.text}
          </CardTitle>
          {currentQuestion.passageText && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border">
              <h4 className="font-medium text-slate-700 mb-2">
                {currentQuestion.passageTitle || 'קטע לקריאה:'}
              </h4>
              <div className="text-slate-600 whitespace-pre-wrap text-left" dir="ltr">
                {currentQuestion.passageText}
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {/* Question Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !isAnswerSubmitted && setSelectedAnswer(index)}
                disabled={isAnswerSubmitted}
                className={`w-full p-4 text-right rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? isAnswerSubmitted
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-blue-500 bg-blue-50'
                    : isAnswerSubmitted && index === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-slate-800">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">הסבר:</h4>
              <p className="text-blue-800">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              onClick={nextQuestion}
              disabled={!isAnswerSubmitted || isLoading}
              className="flex items-center gap-2"
            >
              {questionIndex + 1 >= totalQuestions ? 'סיים סימולציה' : 'שאלה הבאה'}
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </Button>
            
            <Button
              onClick={submitAnswer}
              disabled={selectedAnswer === null || isAnswerSubmitted || isLoading}
              variant="outline"
            >
              {isAnswerSubmitted ? 'נשלח' : 'שלח תשובה'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Metadata (Debug Info) */}
      {deliveryResult.metadata && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg text-sm">
          <details>
            <summary className="cursor-pointer font-medium text-slate-700 mb-2">
              מידע על בחירת השאלות
            </summary>
            <div className="space-y-1 text-slate-600">
              <p>מספר שאלות זמינות: {deliveryResult.metadata.totalPoolSize}</p>
              <p>שאלות שלא נראו: {deliveryResult.metadata.unseenPoolSize}</p>
              <p>זמן בחירה: {deliveryResult.metadata.selectionTimeMs}ms</p>
              <p>גרסת אלגוריתם: {deliveryResult.metadata.algorithmVersion}</p>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default AdaptiveSimulation;
