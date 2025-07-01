
import { useEffect, useRef, useCallback, useMemo } from 'react';
import { TimerConfig } from '@/types/common';
import { SimulationState } from './types';

interface TimerHookReturn {
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: (newDuration?: number) => void;
  currentTime: number;
  initializeTimer: () => void;
  clearTimer: () => void;
}

export const useTimer = (
  setState: React.Dispatch<React.SetStateAction<SimulationState>>
): TimerHookReturn => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentTimeRef = useRef(1800); // 30 minutes default

  const onTick = useCallback((remainingTime: number) => {
    setState(prevState => ({
      ...prevState,
      remainingTime
    }));
  }, [setState]);

  const onComplete = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      simulationComplete: true,
      isTimerActive: false,
      score: prevState.correctQuestionsCount
    }));
  }, [setState]);

  const config: TimerConfig = useMemo(() => ({
    duration: currentTimeRef.current,
    onTick,
    onComplete
  }), [onTick, onComplete]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      currentTimeRef.current -= 1;
      config.onTick(currentTimeRef.current);
      
      if (currentTimeRef.current <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        config.onComplete();
      }
    }, 1000);

    setState(prevState => ({
      ...prevState,
      isTimerActive: true
    }));
  }, [config, setState]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState(prevState => ({
      ...prevState,
      isTimerActive: false
    }));
  }, [setState]);

  const resetTimer = useCallback((newDuration?: number) => {
    stopTimer();
    currentTimeRef.current = newDuration ?? 1800;
    config.onTick(currentTimeRef.current);
  }, [config, stopTimer]);

  const initializeTimer = useCallback(() => {
    currentTimeRef.current = 1800;
    setState(prevState => ({
      ...prevState,
      remainingTime: currentTimeRef.current,
      isTimerActive: false
    }));
  }, [setState]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState(prevState => ({
      ...prevState,
      isTimerActive: false
    }));
  }, [setState]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    startTimer,
    stopTimer,
    resetTimer,
    currentTime: currentTimeRef.current,
    initializeTimer,
    clearTimer
  };
};
