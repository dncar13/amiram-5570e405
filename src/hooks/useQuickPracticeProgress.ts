
import { useState, useEffect, useCallback } from 'react';
import { getQuickPracticeProgress, clearQuickPracticeProgress } from './simulation/progressUtils';

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
    const savedProgress = getQuickPracticeProgress(type);
    setProgress(savedProgress);
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
