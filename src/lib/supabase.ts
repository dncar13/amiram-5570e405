
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

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) {
      return { user: null, error };
    }
    
    return { user: data.user ? convertSupabaseUser(data.user) : null, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return { user: null, error };
    }
    
    return { user: data.user ? convertSupabaseUser(data.user) : null, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

export const registerWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) {
      return { user: null, error };
    }
    
    return { user: data.user ? convertSupabaseUser(data.user) : null, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error };
    }
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error };
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
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user ? convertSupabaseUser(session.user) : null;
    callback(user);
  });
  
  return () => subscription.unsubscribe();
};
