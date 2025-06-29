import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { Session, AuthChangeEvent, User as SupabaseUser } from '@supabase/supabase-js';

// רשימת אימיילים של משתמשים שהם מנהלי מערכת
const ADMIN_EMAILS = [
  "admin@example.com",
  "dncar13@gmail.com",
  "buldir@gmail.com",
];

// רשימת אימיילים של משתמשים פרימיום
const PREMIUM_EMAILS = [
  "premium@example.com",
  "dncar13@gmail.com",
  "buldir@gmail.com",
  "dncar20@gmail.com",
];

// מבנה נתוני משתמש
interface UserData {
  firstName?: string;
  lastName?: string;
  premiumExpiration?: string | number;
}

// Enhanced auth state with proper typing
type AuthLoadingState = 'initial' | 'checking-session' | 'signing-in' | 'refreshing-token' | 'signing-out' | 'ready' | 'error';

interface AuthState {
  session: Session | null;
  loading: boolean;
  loadingState: AuthLoadingState;
  error: Error | null;
  initialized: boolean; // Add this to track initialization
}

interface AuthContextType {
  session: Session | null;
  currentUser: SupabaseUser | null;
  isLoading: boolean;
  loadingState: AuthLoadingState;
  isDevEnvironment: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  userData: UserData | null;
  error: Error | null;
  logout: () => Promise<void>;
  updatePremiumStatus: (status: boolean) => void;
  hasAccessToTopic: (topicId: number) => boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  currentUser: null,
  isLoading: true,
  loadingState: 'initial',
  isDevEnvironment: false,
  isAdmin: false,
  isPremium: false,
  userData: null,
  error: null,
  logout: async () => {},
  updatePremiumStatus: () => {},
  hasAccessToTopic: () => true,
  refreshSession: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    loading: true,
    loadingState: 'initial',
    error: null,
    initialized: false
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { toast } = useToast();
  const toastShownRef = useRef<Set<string>>(new Set()); // Prevent duplicate toasts
  
  const isDevEnvironment = window.location.hostname === 'localhost' || 
                           window.location.hostname.includes('lovableproject.com');

  const FREE_TOPIC_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Single toast manager with deduplication
  const showAuthToast = useCallback((type: string, message: string, description?: string) => {
    const toastKey = `${type}-${message}`;
    if (toastShownRef.current.has(toastKey)) return;
    
    toastShownRef.current.add(toastKey);
    setTimeout(() => toastShownRef.current.delete(toastKey), 5000);
    
    toast({
      title: message,
      description,
      variant: type === 'error' ? 'destructive' : 'default',
      duration: 4000,
    });
  }, [toast]);

  const extractUsernameFromEmail = (email?: string | null) => {
    if (!email) return "משתמש";
    const username = email.split('@')[0];
    return username
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const hasAccessToTopic = (topicId: number): boolean => {
    return true;
  };

  const updatePremiumStatus = (status: boolean) => {
    console.log("Updating premium status:", status);
    if (status) {
      localStorage.setItem("isPremiumUser", "true");
    } else {
      localStorage.removeItem("isPremiumUser");
    }
    setIsPremium(status);
    
    if (authState.session?.user) {
      setUserData(prevData => ({
        ...prevData,
        premiumExpiration: status ? 
          new Date().setMonth(new Date().getMonth() + 1) : undefined
      }));
    }
  };

  // Update user-related states based on session user
  const updateUserRelatedStates = useCallback((user: SupabaseUser) => {
    console.log("✅ Updating user states for:", user.email);
    
    const isUserAdmin = ADMIN_EMAILS.includes(user.email || "");
    setIsAdmin(isUserAdmin);
    
    const premiumStatusFromStorage = localStorage.getItem("isPremiumUser") === "true";
    const isPremiumByEmail = PREMIUM_EMAILS.includes(user.email || "");
    const isPremiumUser = premiumStatusFromStorage || isPremiumByEmail;
    setIsPremium(isPremiumUser);
    
    const displayName = user.user_metadata?.full_name || user.user_metadata?.name || extractUsernameFromEmail(user.email);
    const newUserData = {
      firstName: displayName,
      lastName: '',
      premiumExpiration: isPremiumUser ? 
        new Date().setMonth(new Date().getMonth() + 1) : undefined
    };
    setUserData(newUserData);
  }, []);
  
  // Reset user states on logout
  const resetUserStates = useCallback(() => {
    setIsAdmin(false);
    setIsPremium(false);
    setUserData(null);
    localStorage.removeItem("isPremiumUser");
  }, []);

  // Simplified auth state handler - NO DUPLICATES
  const handleAuthChange = useCallback(async (event: AuthChangeEvent, session: Session | null) => {
    console.log('🔔 Auth event:', event, 'Session:', !!session);

    switch (event) {
      case 'SIGNED_IN':
        setAuthState({ 
          session, 
          loading: false, 
          loadingState: 'ready', 
          error: null,
          initialized: true 
        });
        if (session?.user) {
          updateUserRelatedStates(session.user);
          const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email;
          showAuthToast('success', 'התחברת בהצלחה! 🎉', `ברוך הבא ${name}`);
        }
        break;

      case 'SIGNED_OUT':
        setAuthState({ 
          session: null, 
          loading: false, 
          loadingState: 'ready', 
          error: null,
          initialized: true 
        });
        resetUserStates();
        showAuthToast('info', 'התנתקת בהצלחה', 'נתראה בקרוב!');
        break;

      case 'TOKEN_REFRESHED':
        setAuthState(prev => ({ ...prev, session, loading: false, loadingState: 'ready' }));
        if (session?.user) {
          updateUserRelatedStates(session.user);
        }
        break;

      case 'USER_UPDATED':
        setAuthState(prev => ({ ...prev, session, loading: false, loadingState: 'ready' }));
        if (session?.user) {
          updateUserRelatedStates(session.user);
        }
        break;

      case 'PASSWORD_RECOVERY':
        console.log('🔑 Password recovery event');
        break;
        
      default:
        console.log('🔄 Unknown auth event:', event);
    }
  }, [showAuthToast, updateUserRelatedStates, resetUserStates]);

  // Initialize auth ONCE
  useEffect(() => {
    let mounted = true;
    console.log("🔧 Initializing auth system...");

    const initializeAuth = async () => {
      try {
        setAuthState(prev => ({ ...prev, loading: true, loadingState: 'checking-session' }));
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error("❌ Auth initialization error:", error);
          setAuthState({
            session: null,
            loading: false,
            loadingState: 'error',
            error,
            initialized: true
          });
          return;
        }

        if (session?.user) {
          console.log("✅ Found existing session for:", session.user.email);
          setAuthState({
            session,
            loading: false,
            loadingState: 'ready',
            error: null,
            initialized: true
          });
          updateUserRelatedStates(session.user);
        } else {
          console.log("❌ No existing session found");
          setAuthState({
            session: null,
            loading: false,
            loadingState: 'ready',
            error: null,
            initialized: true
          });
        }
      } catch (error) {
        console.error('❌ Auth initialization catch error:', error);
        if (mounted) {
          setAuthState({
            session: null,
            loading: false,
            loadingState: 'error',
            error: error as Error,
            initialized: true
          });
        }
      }
    };

    initializeAuth();

    // Set up listener ONCE
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted && authState.initialized) { // Only handle events after initialization
        handleAuthChange(event, session);
      }
    });

    return () => {
      console.log("🧹 Cleaning up auth listener");
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthChange, updateUserRelatedStates]); // Dependencies needed for the listener

  // Refresh session manually
  const refreshSession = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, loadingState: 'refreshing-token' }));
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("❌ Error refreshing session:", error);
        setAuthState(prev => ({ ...prev, loading: false, loadingState: 'error', error }));
        return;
      }
      
      setAuthState(prev => ({ ...prev, session, loading: false, loadingState: 'ready', error: null }));
      
      if (session?.user) {
        updateUserRelatedStates(session.user);
        console.log("✅ Session refreshed for:", session.user.email);
      } else {
        resetUserStates();
        console.log("❌ No active session found");
      }
    } catch (error) {
      console.error("❌ Error in refreshSession:", error);
      setAuthState(prev => ({ ...prev, loading: false, loadingState: 'error', error: error as Error }));
    }
  }, [updateUserRelatedStates, resetUserStates]);

  const logout = useCallback(async () => {
    try {
      console.log("🚪 Initiating logout...");
      setAuthState(prev => ({ ...prev, loading: true, loadingState: 'signing-out' }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("❌ Logout error:", error);
        showAuthToast('error', 'שגיאה בהתנתקות', error.message);
        setAuthState(prev => ({ ...prev, loading: false, loadingState: 'error', error }));
        return;
      }
      
      // States will be reset by the auth state change listener
      console.log("✅ Logout successful");
      
      // Small delay to ensure toast is visible before redirect
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
      
    } catch (error) {
      console.error("❌ Logout catch error:", error);
      setAuthState(prev => ({ ...prev, loading: false, loadingState: 'error', error: error as Error }));
      resetUserStates();
      
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    }
  }, [showAuthToast, resetUserStates]);

  // Debug effect to track state changes in development
  useEffect(() => {
    if (isDevEnvironment) {
      console.log("🔍 Auth state update:");
      console.log("  - session:", !!authState.session);
      console.log("  - user:", authState.session?.user?.email || "null");
      console.log("  - loading:", authState.loading);
      console.log("  - loadingState:", authState.loadingState);
      console.log("  - initialized:", authState.initialized);
      console.log("  - isAdmin:", isAdmin);
      console.log("  - isPremium:", isPremium);
    }
  }, [authState, isAdmin, isPremium, isDevEnvironment]);

  const value = {
    session: authState.session,
    currentUser: authState.session?.user || null,
    isLoading: authState.loading,
    loadingState: authState.loadingState,
    isDevEnvironment,
    isAdmin,
    isPremium,
    userData,
    error: authState.error,
    logout,
    updatePremiumStatus,
    hasAccessToTopic,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};