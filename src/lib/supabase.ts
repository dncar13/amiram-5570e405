import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = "https://llyunioulzfbgqvmeaxq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMTc0MTksImV4cCI6MjA2NTU5MzQxOX0.11tR97IIeYJez9h8-JqgolQTKh-pLpxT6eevHcV9z7I";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'amiram-auth-token',
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'amiram-academy',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper function to get user-friendly error messages
const getErrorMessage = (error: any): string => {
  console.log("Auth error details:", error);
  
  if (!error) return "אירעה שגיאה לא ידועה";
  
  const message = error.message || error.error_description || error.error || '';
  
  // Google OAuth specific errors
  if (message.includes('invalid_client') || message.includes('Unauthorized')) {
    return "בעיה בהגדרות Google OAuth. אנא בדקו שה-Client ID וה-Client Secret מוגדרים נכון ב-Supabase.";
  }
  
  if (message.includes('redirect_uri_mismatch')) {
    return "כתובת ההפניה לא תואמת להגדרות Google. אנא בדקו את הגדרות ה-Redirect URLs.";
  }
  
  if (message.includes('access_denied')) {
    return "הגישה נדחתה על ידי Google. אנא נסו שוב או בחרו חשבון אחר.";
  }

  // Common error mappings
  if (message.includes('Invalid login credentials')) {
    return "פרטי ההתחברות שגויים. אנא בדקו את האימייל והסיסמה.";
  }
  
  if (message.includes('Email not confirmed')) {
    return "יש לאשר את כתובת האימייל לפני ההתחברות. בדקו את תיבת הדואר שלכם.";
  }
  
  if (message.includes('Password cannot be longer than 72 characters')) {
    return "הסיסמה ארוכה מדי. השתמשו בסיסמה קצרה יותר.";
  }
  
  if (message.includes('over_email_send_rate_limit') || message.includes('For security purposes')) {
    return "נשלחו יותר מדי אימיילים. אנא המתינו כמה דקות ונסו שוב.";
  }
  
  if (message.includes('User already registered')) {
    return "משתמש כבר קיים עם כתובת האימייל הזו. נסו להתחבר.";
  }
  
  return message || "אירעה שגיאה במערכת. אנא נסו שוב.";
};

// Enhanced redirect URL logic
const getRedirectUrl = (): string => {
  const currentOrigin = window.location.origin;
  const currentPath = '/login';
  
  console.log("🔗 Determining redirect URL for origin:", currentOrigin);
  
  // Always use the current origin to prevent domain switching
  const redirectUrl = `${currentOrigin}${currentPath}`;
  
  console.log("🔗 Final redirect URL:", redirectUrl);
  return redirectUrl;
};

export const signInWithGoogle = async () => {
  try {
    console.log("🔗 Google Sign In - Starting process...");
    console.log("🔗 Current URL:", window.location.href);
    console.log("🔗 Origin:", window.location.origin);
    
    // Check if we're already in a redirect to avoid loops
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code') || urlParams.get('access_token')) {
      console.log("🔗 Already in OAuth callback, skipping new request...");
      return { user: null, error: null };
    }
    
    const redirectTo = getRedirectUrl();
    console.log("🔗 Using redirect URL:", redirectTo);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        },
        scopes: 'openid email profile'
      }
    });
    
    if (error) {
      console.error("❌ Google OAuth Error:", error);
      return { user: null, error: { message: getErrorMessage(error) } };
    }
    
    console.log("✅ Google OAuth initiated successfully:", data);
    return { user: null, error: null };
  } catch (error) {
    console.error("❌ Google sign in catch error:", error);
    return { user: null, error: { message: getErrorMessage(error) } };
  }
};

export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    console.log("Attempting email/password login for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Login error:", error);
      return { user: null, session: null, error: { message: getErrorMessage(error) } };
    }
    
    console.log("Login successful:", data.user?.email);
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error("Login catch error:", error);
    return { user: null, session: null, error: { message: getErrorMessage(error) } };
  }
};

export const registerWithEmailAndPassword = async (email: string, password: string) => {
  try {
    console.log("Attempting registration for:", email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) {
      console.error("Registration error:", error);
      return { user: null, session: null, error: { message: getErrorMessage(error) } };
    }
    
    console.log("Registration successful:", data.user?.email);
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error("Registration catch error:", error);
    return { user: null, session: null, error: { message: getErrorMessage(error) } };
  }
};

export const logoutUser = async () => {
  try {
    console.log("Attempting logout...");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      return { success: false, error: { message: getErrorMessage(error) } };
    }
    console.log("Logout successful");
    return { success: true, error: null };
  } catch (error) {
    console.error("Logout catch error:", error);
    return { success: false, error: { message: getErrorMessage(error) } };
  }
};

export const checkFirebaseConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    return !error;
  } catch {
    return false;
  }
};

export const resendConfirmationEmail = async (email: string) => {
  try {
    console.log("Attempting to resend confirmation email to:", email);
    const { data, error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      },
    });
    if (error) {
      console.error("Resend email error:", error);
      return { success: false, error: { message: getErrorMessage(error) } };
    }
    return { success: true, error: null };
  } catch (error) {
    console.error("Resend catch error:", error);
    return { success: false, error: { message: getErrorMessage(error) } };
  }
};

export const auth = supabase.auth;
export const db = supabase;
