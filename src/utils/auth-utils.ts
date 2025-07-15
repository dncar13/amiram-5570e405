
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('כתובת אימייל נדרשת');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('כתובת אימייל לא תקינה');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('סיסמה נדרשת');
  } else {
    if (password.length < 8) {
      errors.push('הסיסמה חייבת להכיל לפחות 8 תווים');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('הסיסמה חייבת להכיל לפחות אות קטנה אחת');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('הסיסמה חייבת להכיל לפחות אות גדולה אחת');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('הסיסמה חייבת להכיל לפחות ספרה אחת');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!confirmPassword) {
    errors.push('אישור סיסמה נדרש');
  } else if (password !== confirmPassword) {
    errors.push('הסיסמאות אינן תואמות');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const signUp = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    
    if (!emailValidation.isValid || !passwordValidation.isValid) {
      return {
        success: false,
        error: [...emailValidation.errors, ...passwordValidation.errors].join(', ')
      };
    }
    
    // Use localhost for development, production URL for production
    const isDevelopment = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const redirectUrl = isDevelopment ? `http://localhost:8080/` : `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    if (error) {
      return {
        success: false,
        error: getAuthErrorMessage(error.message)
      };
    }
    
    return {
      success: true,
      user: data.user || undefined,
      message: 'חשבון נוצר בהצלחה! בדוק את האימייל שלך לאישור'
    };
  } catch (error) {
    return {
      success: false,
      error: 'אירעה שגיאה בעת יצירת החשבון'
    };
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const emailValidation = validateEmail(email);
    
    if (!emailValidation.isValid) {
      return {
        success: false,
        error: emailValidation.errors.join(', ')
      };
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return {
        success: false,
        error: getAuthErrorMessage(error.message)
      };
    }
    
    return {
      success: true,
      user: data.user,
      message: 'התחברת בהצלחה!'
    };
  } catch (error) {
    return {
      success: false,
      error: 'אירעה שגיאה בעת ההתחברות'
    };
  }
};

export const signOut = async (): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return {
        success: false,
        error: 'אירעה שגיאה בעת ההתנתקות'
      };
    }
    
    return {
      success: true,
      message: 'התנתקת בהצלחה!'
    };
  } catch (error) {
    return {
      success: false,
      error: 'אירעה שגיאה בעת ההתנתקות'
    };
  }
};

export const resetPassword = async (email: string): Promise<AuthResponse> => {
  try {
    const emailValidation = validateEmail(email);
    
    if (!emailValidation.isValid) {
      return {
        success: false,
        error: emailValidation.errors.join(', ')
      };
    }
    
    const redirectUrl = `${window.location.origin}/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    
    if (error) {
      return {
        success: false,
        error: getAuthErrorMessage(error.message)
      };
    }
    
    return {
      success: true,
      message: 'נשלח אימייל לאיפוס סיסמה'
    };
  } catch (error) {
    return {
      success: false,
      error: 'אירעה שגיאה בעת שליחת אימייל איפוס הסיסמה'
    };
  }
};

const getAuthErrorMessage = (errorMessage: string): string => {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'פרטי התחברות שגויים',
    'Email not confirmed': 'האימייל לא אושר',
    'User already registered': 'משתמש כבר רשום',
    'Password should be at least 6 characters': 'הסיסמה חייבת להכיל לפחות 6 תווים',
    'Unable to validate email address': 'לא ניתן לאמת כתובת אימייל',
    'Signup is disabled': 'הרשמה מושבתת כרגע',
    'Email address is invalid': 'כתובת אימייל לא תקינה',
    'Password is too weak': 'הסיסמה חלשה מדי'
  };
  
  return errorMap[errorMessage] || 'אירעה שגיאה לא ידועה';
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const updateUserProfile = async (updates: Record<string, unknown>): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.updateUser(updates);
    
    if (error) {
      return {
        success: false,
        error: 'אירעה שגיאה בעת עדכון הפרופיל'
      };
    }
    
    return {
      success: true,
      user: data.user,
      message: 'הפרופיל עודכן בהצלחה'
    };
  } catch (error) {
    return {
      success: false,
      error: 'אירעה שגיאה בעת עדכון הפרופיל'
    };
  }
};
