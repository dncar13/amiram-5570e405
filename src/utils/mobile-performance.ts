// Mobile performance utilities for authentication
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth <= 768;
};

export const getMobileOptimizedConfig = () => {
  const isMobile = isMobileDevice();
  
  return {
    // Reduce retry attempts on mobile
    maxRetries: isMobile ? 2 : 3,
    maxOAuthRetries: isMobile ? 3 : 6,
    
    // Increase timeouts for mobile networks
    initialTimeout: isMobile ? 3000 : 2000,
    retryDelay: isMobile ? 1500 : 1000,
    
    // Reduce real-time frequency
    eventsPerSecond: isMobile ? 2 : 10,
    
    // Debounce delays
    inputDebounce: isMobile ? 500 : 300,
    sessionDebounce: isMobile ? 1000 : 500,
    
    // UI optimization
    enableHeavyAnimations: !isMobile,
    enableDebugLogging: !isMobile,
  };
};

// Debounce utility for mobile performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Cleanup utility for timeouts
export class TimeoutManager {
  private timeouts: Set<NodeJS.Timeout> = new Set();
  
  setTimeout(callback: () => void, delay: number): NodeJS.Timeout {
    const timeout = setTimeout(() => {
      this.timeouts.delete(timeout);
      callback();
    }, delay);
    
    this.timeouts.add(timeout);
    return timeout;
  }
  
  clearAll(): void {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
  }
  
  clear(timeout: NodeJS.Timeout): void {
    clearTimeout(timeout);
    this.timeouts.delete(timeout);
  }
}

// Mobile-specific error handling
export const handleMobileNetworkError = (error: Error): string => {
  const isMobile = isMobileDevice();
  
  if (!isMobile) return error.message;
  
  // Mobile-specific error messages
  if (error.message.includes('Network') || error.message.includes('fetch')) {
    return 'חיבור האינטרנט איטי. אנא נסו שוב.';
  }
  
  if (error.message.includes('timeout')) {
    return 'החיבור לשרת איטי. אנא המתינו או נסו שוב.';
  }
  
  return error.message;
};