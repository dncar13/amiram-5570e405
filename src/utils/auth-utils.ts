import { AuthError } from '@supabase/supabase-js';

// Retry mechanism for auth operations
export const retryAuth = async <T>(
  fn: () => Promise<T>, 
  retries: number = 3,
  backoff: number = 1000
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      
      const delay = backoff * Math.pow(2, i);
      console.log(`🔄 Retry attempt ${i + 1} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
};

// Enhanced error message mapping
export const getLocalizedErrorMessage = (error: AuthError | Error): string => {
  console.log("🚨 Auth error details:", error);
  
  if (!error) return "אירעה שגיאה לא ידועה";
  
  const message = error.message || '';
  
  // Common error mappings
  const errorMappings: Record<string, string> = {
    'Invalid login credentials': "פרטי ההתחברות שגויים. אנא בדקו את האימייל והסיסמה.",
    'Email not confirmed': "יש לאשר את כתובת האימייל לפני ההתחברות. בדקו את תיבת הדואר שלכם.",
    'Password cannot be longer than 72 characters': "הסיסמה ארוכה מדי. השתמשו בסיסמה קצרה יותר.",
    'over_email_send_rate_limit': "נשלחו יותר מדי אימיילים. אנא המתינו כמה דקות ונסו שוב.",
    'For security purposes': "נשלחו יותר מדי אימיילים. אנא המתינו כמה דקות ונסו שוב.",
    'User already registered': "משתמש כבר קיים עם כתובת האימייל הזו. נסו להתחבר.",
    'Signup requires a valid password': "נדרשת סיסמה תקינה להרשמה.",
    'Unable to validate email address': "כתובת האימייל אינה תקינה.",
    'Password should be at least 6 characters': "הסיסמה חייבת להכיל לפחות 6 תווים.",
    'Network request failed': "שגיאת רשת. בדקו את החיבור לאינטרנט ונסו שוב.",
    'Too many requests': "יותר מדי בקשות. אנא המתינו כמה דקות ונסו שוב.",
  };
  
  // Find matching error message
  for (const [key, value] of Object.entries(errorMappings)) {
    if (message.includes(key)) {
      return value;
    }
  }
  
  return message || "אירעה שגיאה במערכת. אנא נסו שוב.";
};

// Auth performance monitoring
export const authPerformanceMonitor = {
  startTimer: (operation: string) => {
    performance.mark(`auth-${operation}-start`);
  },
  
  endTimer: (operation: string) => {
    performance.mark(`auth-${operation}-end`);
    performance.measure(
      `auth-${operation}`,
      `auth-${operation}-start`,
      `auth-${operation}-end`
    );
    
    const measure = performance.getEntriesByName(`auth-${operation}`)[0];
    console.log(`🕒 Auth ${operation} took ${measure.duration}ms`);
    
    // Log slow operations
    if (measure.duration > 3000) {
      console.warn(`⚠️ Slow auth operation: ${operation} took ${measure.duration}ms`);
    }
    
    return measure.duration;
  },
};

// Session persistence utilities
export const sessionManager = {
  persist: (sessionData: any) => {
    try {
      // Primary storage
      localStorage.setItem('supabase.auth.token', JSON.stringify(sessionData));
      
      // Backup in session storage
      sessionStorage.setItem('auth_backup', JSON.stringify({
        timestamp: Date.now(),
        data: sessionData
      }));
      
      console.log('✅ Session persisted successfully');
    } catch (error) {
      console.error('❌ Failed to persist session:', error);
    }
  },
  
  recover: (): any | null => {
    try {
      // Try primary storage first
      const stored = localStorage.getItem('supabase.auth.token');
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Fallback to backup
      const backup = sessionStorage.getItem('auth_backup');
      if (backup) {
        const parsed = JSON.parse(backup);
        // Check if backup is not too old (1 hour)
        if (Date.now() - parsed.timestamp < 3600000) {
          return parsed.data;
        }
      }
    } catch (error) {
      console.error('❌ Failed to recover session:', error);
    }
    return null;
  },
  
  clear: () => {
    try {
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('auth_backup');
      console.log('✅ Session data cleared');
    } catch (error) {
      console.error('❌ Failed to clear session:', error);
    }
  }
};

// Debug tools for development
if (import.meta.env.DEV) {
  (window as any).__AUTH_DEBUG__ = {
    retryAuth,
    getLocalizedErrorMessage,
    authPerformanceMonitor,
    sessionManager,
    clearAllStorage: () => {
      localStorage.clear();
      sessionStorage.clear();
      console.log('🧹 All storage cleared');
    },
    simulateNetworkError: () => {
      throw new Error('Network request failed');
    },
    simulateRateLimit: () => {
      throw new Error('Too many requests');
    }
  };
  
  console.log('🔧 Auth debug tools available at window.__AUTH_DEBUG__');
}