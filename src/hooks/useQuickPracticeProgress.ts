
import { useState, useEffect, useCallback } from 'react';
import { getQuickPracticeProgress, clearQuickPracticeProgress, ProgressData } from './simulation/progressUtils';

interface QuickPracticeProgress {
  completed: boolean;
  inProgress: boolean;
  score?: number;
  answeredQuestions: number;
  totalQuestions: number;
}

export const useQuickPracticeProgress = (type: string) => {
  const [progress, setProgress] = useState<QuickPracticeProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProgress = useCallback(() => {
    const savedProgress: ProgressData | null = getQuickPracticeProgress(type);
    if (savedProgress) {
      // Convert ProgressData to QuickPracticeProgress
      const quickProgress: QuickPracticeProgress = {
        completed: savedProgress.completed,
        inProgress: savedProgress.inProgress,
        score: savedProgress.score,
        answeredQuestions: savedProgress.answeredQuestions,
        totalQuestions: savedProgress.totalQuestions || savedProgress.answeredQuestions
      };
      setProgress(quickProgress);
    } else {
      setProgress(null);
    }
    setIsLoading(false);
  }, [type]);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  const clearProgress = useCallback(() => {
    clearQuickPracticeProgress(type);
    setProgress(null);
  }, [type]);

  const hasInProgressPractice = progress && progress.inProgress && !progress.completed;
  const hasCompletedPractice = progress && progress.completed;

  return {
    progress,
    isLoading,
    hasInProgressPractice,
    hasCompletedPractice,
    clearProgress,
    refreshProgress
  };
};
