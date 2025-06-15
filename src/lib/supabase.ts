
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = "https://llyunioulzfbgqvmeaxq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseXVuaW91bHpmYmdxdm1lYXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMTc0MTksImV4cCI6MjA2NTU5MzQxOX0.11tR97IIeYJez9h8-JqgolQTKh-pLpxT6eevHcV9z7I";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Supabase User interface that matches the Firebase user structure
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  metadata?: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

// Convert Supabase user to Firebase-like user structure
const convertSupabaseUser = (supabaseUser: any): User | null => {
  if (!supabaseUser) return null;
  
  return {
    uid: supabaseUser.id,
    email: supabaseUser.email,
    displayName: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
    photoURL: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null,
    metadata: {
      creationTime: supabaseUser.created_at,
      lastSignInTime: supabaseUser.last_sign_in_at,
    },
  };
};

// Helper function to get user-friendly error messages
const getErrorMessage = (error: any): string => {
  console.log("Auth error details:", error);
  
  if (!error) return "אירעה שגיאה לא ידועה";
  
  const message = error.message || error.error_description || error.error || '';
  
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

export const signInWithGoogle = async () => {
  try {
    console.log("Attempting Google sign in...");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) {
      console.error("Google sign in error:", error);
      return { user: null, error: { message: getErrorMessage(error) } };
    }
    
    // OAuth redirects don't return user immediately, they redirect to provider
    return { user: null, error: null };
  } catch (error) {
    console.error("Google sign in catch error:", error);
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
      return { user: null, error: { message: getErrorMessage(error) } };
    }
    
    console.log("Login successful:", data.user?.email);
    return { user: data.user ? convertSupabaseUser(data.user) : null, error: null };
  } catch (error) {
    console.error("Login catch error:", error);
    return { user: null, error: { message: getErrorMessage(error) } };
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
      return { user: null, error: { message: getErrorMessage(error) } };
    }
    
    console.log("Registration successful:", data.user?.email);
    return { user: data.user ? convertSupabaseUser(data.user) : null, error: null };
  } catch (error) {
    console.error("Registration catch error:", error);
    return { user: null, error: { message: getErrorMessage(error) } };
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

export const auth = supabase.auth;
export const db = supabase;

// Supabase onAuthStateChanged equivalent
export const onAuthStateChanged = (auth: any, callback: (user: User | null) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("Auth state change event:", event);
    console.log("Session:", session ? "exists" : "null");
    console.log("User:", session?.user ? session.user.email : "null");
    
    const user = session?.user ? convertSupabaseUser(session.user) : null;
    callback(user);
  });
  
  return () => subscription.unsubscribe();
};
