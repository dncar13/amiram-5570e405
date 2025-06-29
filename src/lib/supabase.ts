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
    // Security: Enable session validation
    storageKey: 'amiram-auth-token',
    flowType: 'pkce', // Use PKCE for enhanced security
  },
  // Security: Configure global options
  global: {
    headers: {
      'X-Client-Info': 'amiram-academy',
    },
  },
  // Security: Configure database options
  db: {
    schema: 'public',
  },
  // Security: Configure realtime with auth
  realtime: {
    params: {
      eventsPerSecond: 10, // Rate limiting
    },
  },
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

// Enhanced auth refresh with better session handling
const triggerAuthRefresh = async () => {
  try {
    console.log("🔄 Triggering enhanced auth refresh...");
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error("❌ Error getting session:", error);
      return;
    }
    if (session) {
      console.log("✅ Session refreshed successfully, user:", session.user?.email);
      // Force auth state change event
      window.dispatchEvent(new CustomEvent('supabase:auth-refresh', { 
        detail: { session, user: session.user }
      }));
    }
  } catch (error) {
    console.error("❌ Error refreshing auth:", error);
  }
};

export const signInWithGoogle = async () => {
  try {
    console.log("🔗 Google Sign In - Starting process...");
    console.log("🔗 Current URL:", window.location.href);
    console.log("🔗 Origin:", window.location.origin);
    
    // Check if we're already in a redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code') || urlParams.get('access_token')) {
      console.log("🔗 Already in OAuth callback, waiting for processing...");
      return { user: null, error: null };
    }
    
    const redirectTo = `${window.location.origin}/login`;
    console.log("🔗 Redirect URL:", redirectTo);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    
    if (error) {
      console.error("❌ Google OAuth Error:", error);
      return { user: null, error: { message: getErrorMessage(error) } };
    }
    
    console.log("✅ Google OAuth initiated:", data);
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
      return { user: null, error: { message: getErrorMessage(error) } };
    }
    
    console.log("Login successful:", data.user?.email);
    return { user: data.user, error: null };
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
    return { user: data.user, error: null };
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

// Enhanced onAuthStateChanged with better Google Auth handling
export const onAuthStateChanged = (auth: any, callback: (user: User | null) => void) => {
  console.log("🎯 Setting up enhanced onAuthStateChanged listener...");
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("🔔 Auth state change event:", event);
    console.log("🔔 Session exists:", !!session);
    console.log("🔔 User exists:", !!session?.user);
    console.log("🔔 User email:", session?.user?.email || "null");
    console.log("🔔 User photo:", session?.user?.user_metadata?.avatar_url || "null");
    console.log("🔔 Full user metadata:", session?.user?.user_metadata);
    
    // Check URL for OAuth parameters
    const urlParams = new URLSearchParams(window.location.search);
    const hasOAuthParams = urlParams.get('code') || urlParams.get('access_token') || urlParams.get('error');
    
    if (hasOAuthParams) {
      console.log("🔗 OAuth parameters detected in URL:", {
        code: urlParams.get('code') ? 'present' : 'absent',
        access_token: urlParams.get('access_token') ? 'present' : 'absent',
        error: urlParams.get('error') || 'none'
      });
      
      if (urlParams.get('error')) {
        console.error("❌ OAuth error in URL:", urlParams.get('error'));
      }
    }
    
    const user = session?.user ? convertSupabaseUser(session.user) : null;
    
    // Clean URL after OAuth redirect
    if (event === 'SIGNED_IN' && hasOAuthParams) {
      console.log("✅ Google Auth successful, cleaning URL...");
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
    
    setTimeout(() => {
      console.log("🔄 Calling auth callback with user:", user?.email || "null");
      callback(user);
    }, 10);
  });
  
  // Enhanced custom refresh event handler
  const handleAuthRefresh = (event: any) => {
    console.log("🔄 Custom auth refresh triggered");
    const session = event.detail?.session;
    const user = session?.user ? convertSupabaseUser(session.user) : null;
    callback(user);
  };
  
  window.addEventListener('supabase:auth-refresh', handleAuthRefresh);
  
  return () => {
    console.log("🧹 Unsubscribing from auth state changes");
    subscription.unsubscribe();
    window.removeEventListener('supabase:auth-refresh', handleAuthRefresh);
  };
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
}
