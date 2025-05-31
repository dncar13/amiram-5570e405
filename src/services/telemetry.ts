interface PerformanceMetric {
  operation: 'save' | 'load' | 'delete' | 'optimize';
  durationMs: number;
  success: boolean;
  storageSize?: number;
  errorMessage?: string;
  timestamp: string;
}

const MAX_METRICS = 50;
const METRICS_KEY = 'simulation_performance_metrics';

export const recordPerformanceMetric = (metric: Omit<PerformanceMetric, 'timestamp'>) => {
  try {
    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: new Date().toISOString()
    };
    
    let metrics: PerformanceMetric[] = [];
    const storedMetrics = localStorage.getItem(METRICS_KEY);
    
    if (storedMetrics) {
      metrics = JSON.parse(storedMetrics);
    }
    
    metrics.unshift(fullMetric);
    
    // Keep only the latest metrics
    if (metrics.length > MAX_METRICS) {
      metrics = metrics.slice(0, MAX_METRICS);
    }
    
    localStorage.setItem(METRICS_KEY, JSON.stringify(metrics));
    
    // Only log errors and long operations to console
    if (!metric.success || metric.durationMs > 1000) {
      console.warn('Performance issue detected:', fullMetric);
    }
  } catch (err) {
    // Ignore errors in telemetry itself
    console.warn('Error recording metrics:', err);
  }
};

export const getPerformanceMetrics = (): PerformanceMetric[] => {
  try {
    const storedMetrics = localStorage.getItem(METRICS_KEY);
    if (storedMetrics) {
      return JSON.parse(storedMetrics);
    }
  } catch (err) {
    console.warn('Error retrieving metrics:', err);
  }
  
  return [];
};

export const measureOperation = async <T>(
  operation: 'save' | 'load' | 'delete' | 'optimize',
  func: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  let success = false;
  let errorMessage: string | undefined;
  
  try {
    const result = await func();
    success = true;
    return result;
  } catch (err) {
    success = false;
    errorMessage = err instanceof Error ? err.message : String(err);
    throw err;
  } finally {
    const endTime = performance.now();
    const durationMs = Math.round(endTime - startTime);
    
    recordPerformanceMetric({
      operation,
      durationMs,
      success,
      errorMessage,
      storageSize: getTotalStorageSize()
    });
  }
};

// Helper to calculate total localStorage size
const getTotalStorageSize = (): number => {
  try {
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        totalSize += (key.length + value.length) * 2; // 2 bytes per character
      }
    }
    return totalSize;
  } catch {
    return 0;
  }
};
