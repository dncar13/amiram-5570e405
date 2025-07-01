
import { useEffect, useRef, useCallback } from 'react';
import { TimerConfig } from '@/types/common';

export const useTimer = (config: TimerConfig) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentTimeRef = useRef(config.duration);

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
  }, [config]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback((newDuration?: number) => {
    stopTimer();
    currentTimeRef.current = newDuration ?? config.duration;
    config.onTick(currentTimeRef.current);
  }, [config, stopTimer]);

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
    currentTime: currentTimeRef.current
  };
};
