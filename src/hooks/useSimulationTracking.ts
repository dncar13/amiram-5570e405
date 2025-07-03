/**
 * Simulation Tracking Hook
 * 
 * Manages state and tracking for adaptive simulations.
 * Provides real-time analytics and progress monitoring.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProgressTrackingService } from '@/services/adaptiveQuestions/progressTrackingService';
import { AnalyticsService } from '@/services/adaptiveQuestions/analyticsService';
import { 
  UserProgress, 
  QuestionAnswer, 
  DifficultyLevel,
  SessionType,
  UserAnalytics 
} from '@/services/adaptiveQuestions/types';

export interface UseSimulationTrackingOptions {
  sessionId?: string;
  difficulty?: DifficultyLevel;
  sessionType?: SessionType;
  autoSave?: boolean;
  analyticsInterval?: number; // milliseconds
}

export interface SimulationMetrics {
  accuracy: number;
  averageTime: number;
  streak: number;
  questionsAnswered: number;
  questionsCorrect: number;
  progress: UserProgress | null;
  analytics: UserAnalytics | null;
  isLoading: boolean;
  error: string | null;
}

export const useSimulationTracking = (options: UseSimulationTrackingOptions = {}) => {
  const { currentUser } = useAuth();
  const {
    sessionId,
    difficulty = 'medium',
    sessionType = 'quick',
    autoSave = true,
    analyticsInterval = 5000
  } = options;

  // Services
  const progressService = useRef(new ProgressTrackingService());
  const analyticsService = useRef(new AnalyticsService());

  // State
  const [metrics, setMetrics] = useState<SimulationMetrics>({
    accuracy: 0,
    averageTime: 0,
    streak: 0,
    questionsAnswered: 0,
    questionsCorrect: 0,
    progress: null,
    analytics: null,
    isLoading: false,
    error: null
  });

  // Tracking data
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [sessionStartTime] = useState<Date>(new Date());
  const questionStartTime = useRef<Date>(new Date());
  const analyticsTimer = useRef<NodeJS.Timeout>();

  // Initialize tracking
  const initializeTracking = useCallback(async () => {
    if (!currentUser?.id) return;

    setMetrics(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Load existing progress
      const progress = await progressService.current.getUserProgress(currentUser.id, difficulty);
      
      // Load analytics
      const analytics = await analyticsService.current.getUserAnalytics(currentUser.id);

      setMetrics(prev => ({
        ...prev,
        progress,
        analytics,
        accuracy: progress?.accuracy || 0,
        streak: progress?.currentStreak || 0,
        isLoading: false
      }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'שגיאה בטעינת הנתונים';
      setMetrics(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
    }
  }, [currentUser?.id, difficulty]);

  // Record answer
  const recordAnswer = useCallback(async (
    questionId: number,
    selectedAnswer: number,
    correctAnswer: number,
    timeSpent?: number
  ) => {
    if (!currentUser?.id) return;

    const isCorrect = selectedAnswer === correctAnswer;
    const endTime = new Date();
    const actualTimeSpent = timeSpent || Math.round((endTime.getTime() - questionStartTime.current.getTime()) / 1000);

    const answerData: QuestionAnswer = {
      questionId,
      selectedAnswer,
      isCorrect,
      timeSpent: actualTimeSpent,
      answeredAt: endTime,
      sessionId: sessionId || 'unknown',
      difficulty
    };

    // Add to local tracking
    setAnswers(prev => [...prev, answerData]);

    // Update metrics immediately
    setMetrics(prev => {
      const newQuestionsAnswered = prev.questionsAnswered + 1;
      const newQuestionsCorrect = prev.questionsCorrect + (isCorrect ? 1 : 0);
      const newAccuracy = newQuestionsAnswered > 0 ? (newQuestionsCorrect / newQuestionsAnswered) * 100 : 0;
      
      // Calculate average time
      const allAnswers = [...answers, answerData];
      const totalTime = allAnswers.reduce((sum, a) => sum + a.timeSpent, 0);
      const newAverageTime = allAnswers.length > 0 ? totalTime / allAnswers.length : 0;

      // Update streak
      const newStreak = isCorrect ? prev.streak + 1 : 0;

      return {
        ...prev,
        questionsAnswered: newQuestionsAnswered,
        questionsCorrect: newQuestionsCorrect,
        accuracy: newAccuracy,
        averageTime: newAverageTime,
        streak: newStreak
      };
    });

    // Auto-save to backend
    if (autoSave) {
      try {
        await progressService.current.recordAnswer({
          userId: currentUser.id,
          questionId,
          selectedAnswer,
          isCorrect,
          timeSpent: actualTimeSpent,
          sessionId: sessionId || 'unknown',
          difficulty
        });
      } catch (error) {
        console.error('Failed to save answer:', error);
        setMetrics(prev => ({
          ...prev,
          error: 'שגיאה בשמירת התשובה'
        }));
      }
    }

    // Reset question timer for next question
    questionStartTime.current = new Date();
  }, [currentUser?.id, sessionId, difficulty, autoSave, answers]);

  // Start new question timer
  const startQuestionTimer = useCallback(() => {
    questionStartTime.current = new Date();
  }, []);

  // Get current session analytics
  const getSessionAnalytics = useCallback(() => {
    const sessionDuration = Math.round((new Date().getTime() - sessionStartTime.getTime()) / 1000);
    
    return {
      sessionDuration,
      questionsAnswered: answers.length,
      questionsCorrect: answers.filter(a => a.isCorrect).length,
      accuracy: answers.length > 0 ? (answers.filter(a => a.isCorrect).length / answers.length) * 100 : 0,
      averageTimePerQuestion: answers.length > 0 ? answers.reduce((sum, a) => sum + a.timeSpent, 0) / answers.length : 0,
      answers: answers.slice() // Copy for safety
    };
  }, [answers, sessionStartTime]);

  // Update analytics periodically
  useEffect(() => {
    if (analyticsInterval > 0 && currentUser?.id) {
      analyticsTimer.current = setInterval(async () => {
        try {
          const analytics = await analyticsService.current.getUserAnalytics(currentUser.id);
          setMetrics(prev => ({
            ...prev,
            analytics
          }));
        } catch (error) {
          console.error('Failed to update analytics:', error);
        }
      }, analyticsInterval);

      return () => {
        if (analyticsTimer.current) {
          clearInterval(analyticsTimer.current);
        }
      };
    }
  }, [analyticsInterval, currentUser?.id]);

  // Initialize on mount
  useEffect(() => {
    initializeTracking();
  }, [initializeTracking]);

  // Generate recommendations based on current performance
  const getRecommendations = useCallback(() => {
    const sessionAnalytics = getSessionAnalytics();
    const recommendations: string[] = [];

    if (sessionAnalytics.accuracy < 60) {
      recommendations.push('שקול להתמקד בשאלות קלות יותר לחיזוק הבסיס');
    }

    if (sessionAnalytics.averageTimePerQuestion > 90) {
      recommendations.push('נסה לענות מהר יותר - המטרה היא פחות מ-90 שניות לשאלה');
    }

    if (metrics.streak >= 5) {
      recommendations.push('מעולה! אתה במגמת הצלחה - המשך כך');
    }

    if (sessionAnalytics.questionsAnswered >= 10 && sessionAnalytics.accuracy > 80) {
      recommendations.push('ביצועים מצוינים! שקול לעבור לרמת קושי גבוהה יותר');
    }

    return recommendations;
  }, [getSessionAnalytics, metrics.streak]);

  return {
    // Metrics and state
    metrics,
    answers,
    
    // Actions
    recordAnswer,
    startQuestionTimer,
    initializeTracking,
    
    // Analytics
    getSessionAnalytics,
    getRecommendations,
    
    // Computed values
    isTracking: !!currentUser?.id,
    sessionDuration: Math.round((new Date().getTime() - sessionStartTime.getTime()) / 1000)
  };
};

export default useSimulationTracking;