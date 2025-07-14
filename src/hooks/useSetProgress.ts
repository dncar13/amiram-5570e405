/**
 * Hook for managing set progress state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SetProgressService, SetProgressSummary, SetProgress, SetMetadata } from '@/services/setProgressService';

export interface UseSetProgressReturn {
  // Single set progress
  setProgress: SetProgress | null;
  isLoading: boolean;
  error: string | null;
  
  // Set progress operations
  saveProgress: (
    setData: SetMetadata,
    progressData: {
      current_question_index: number;
      questions_answered: number;
      correct_answers: number;
      time_spent: number;
      is_completed?: boolean;
    }
  ) => Promise<boolean>;
  
  completeSet: (
    setId: number,
    setType: string,
    setDifficulty: string,
    finalData: {
      correct_answers: number;
      total_questions: number;
      time_spent: number;
    }
  ) => Promise<boolean>;
  
  resetProgress: (
    setId: number,
    setType: string,
    setDifficulty: string
  ) => Promise<boolean>;
  
  refreshProgress: () => Promise<void>;
}

export interface UseSetProgressSummaryReturn {
  // Multiple sets progress summary
  progressSummary: Record<number, SetProgressSummary>;
  isLoading: boolean;
  error: string | null;
  
  // Operations
  refreshSummary: () => Promise<void>;
  getSetStatus: (setId: number) => 'not_started' | 'in_progress' | 'completed';
  getSetProgress: (setId: number) => number;
  canResumeSet: (setId: number) => boolean;
}

/**
 * Hook for managing single set progress
 */
export const useSetProgress = (
  setId: number,
  setType: string,
  setDifficulty: string
): UseSetProgressReturn => {
  const { currentUser } = useAuth();
  const [setProgress, setSetProgress] = useState<SetProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadProgress = useCallback(async () => {
    if (!currentUser) {
      setSetProgress(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const progress = await SetProgressService.getSetProgress(
        currentUser.id,
        setId,
        setType,
        setDifficulty
      );
      setSetProgress(progress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, setId, setType, setDifficulty]);
  
  const saveProgress = useCallback(async (
    setData: SetMetadata,
    progressData: {
      current_question_index: number;
      questions_answered: number;
      correct_answers: number;
      time_spent: number;
      is_completed?: boolean;
    }
  ): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      const result = await SetProgressService.saveSetProgress(
        currentUser.id,
        setData,
        progressData
      );
      
      if (result.success) {
        // Refresh progress after save
        await loadProgress();
        return true;
      } else {
        setError(result.error || 'Failed to save progress');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save progress');
      return false;
    }
  }, [currentUser, loadProgress]);
  
  const completeSet = useCallback(async (
    setId: number,
    setType: string,
    setDifficulty: string,
    finalData: {
      correct_answers: number;
      total_questions: number;
      time_spent: number;
    }
  ): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      const result = await SetProgressService.completeSet(
        currentUser.id,
        setId,
        setType,
        setDifficulty,
        finalData
      );
      
      if (result.success) {
        await loadProgress();
        return true;
      } else {
        setError(result.error || 'Failed to complete set');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete set');
      return false;
    }
  }, [currentUser, loadProgress]);
  
  const resetProgress = useCallback(async (
    setId: number,
    setType: string,
    setDifficulty: string
  ): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      const result = await SetProgressService.resetSetProgress(
        currentUser.id,
        setId,
        setType,
        setDifficulty
      );
      
      if (result.success) {
        await loadProgress();
        return true;
      } else {
        setError(result.error || 'Failed to reset progress');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset progress');
      return false;
    }
  }, [currentUser, loadProgress]);
  
  const refreshProgress = useCallback(async () => {
    await loadProgress();
  }, [loadProgress]);
  
  // Load progress on mount and when dependencies change
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);
  
  return {
    setProgress,
    isLoading,
    error,
    saveProgress,
    completeSet,
    resetProgress,
    refreshProgress
  };
};

/**
 * Hook for managing multiple sets progress summary
 */
export const useSetProgressSummary = (
  setType: string,
  setDifficulty: string
): UseSetProgressSummaryReturn => {
  const { currentUser } = useAuth();
  const [progressSummary, setProgressSummary] = useState<Record<number, SetProgressSummary>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadSummary = useCallback(async () => {
    if (!currentUser) {
      setProgressSummary({});
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const summary = await SetProgressService.getSetProgressSummary(
        currentUser.id,
        setType,
        setDifficulty
      );
      setProgressSummary(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress summary');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, setType, setDifficulty]);
  
  const refreshSummary = useCallback(async () => {
    await loadSummary();
  }, [loadSummary]);
  
  const getSetStatus = useCallback((setId: number): 'not_started' | 'in_progress' | 'completed' => {
    const progress = progressSummary[setId];
    return progress?.status || 'not_started';
  }, [progressSummary]);
  
  const getSetProgress = useCallback((setId: number): number => {
    const progress = progressSummary[setId];
    return progress?.progress_percentage || 0;
  }, [progressSummary]);
  
  const canResumeSet = useCallback((setId: number): boolean => {
    const progress = progressSummary[setId];
    return progress?.can_resume || false;
  }, [progressSummary]);
  
  // Load summary on mount and when dependencies change
  useEffect(() => {
    loadSummary();
  }, [loadSummary]);
  
  return {
    progressSummary,
    isLoading,
    error,
    refreshSummary,
    getSetStatus,
    getSetProgress,
    canResumeSet
  };
};

export default useSetProgress;