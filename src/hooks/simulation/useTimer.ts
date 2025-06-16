
import { useRef, useCallback } from "react";

export const useTimer = (setState: React.Dispatch<React.SetStateAction<any>>) => {
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const initializeTimer = useCallback(() => {
    console.log("Initializing timer");
    
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    
    timerInterval.current = setInterval(() => {
      setState((prevState: any) => {
        if (!prevState.isTimerActive || prevState.remainingTime <= 0) {
          clearInterval(timerInterval.current!);
          return prevState;
        }
        
        return { ...prevState, remainingTime: prevState.remainingTime - 1 };
      });
    }, 1000);
  }, [setState]);

  const clearTimer = useCallback(() => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
  }, []);

  return { initializeTimer, clearTimer, timerInterval };
};
