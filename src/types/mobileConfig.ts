
export interface MobileConfig {
  enableDebugLogging: boolean;
  retryDelay: number;
  maxRetries: number;
  timeoutDuration: number;
  enableOfflineMode: boolean;
  cacheExpiryTime: number;
  maxCacheSize: number;
  enableProgressSync: boolean;
  autoSaveInterval: number;
  enableCrashReporting: boolean;
  debugMode: boolean;
}
