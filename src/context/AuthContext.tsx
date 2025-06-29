import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
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
    error: null
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { toast } = useToast();
  
  const isDevEnvironment = window.location.hostname === 'localhost' || 
                           window.location.hostname.includes('lovableproject.com');

  const FREE_TOPIC_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Toast management for auth events
  const authToastManager = {
    success: (user: SupabaseUser) => {
      const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
      toast({
        title: "התחברת בהצלחה! 🎉",
        description: `ברוך הבא ${name}`,
        duration: 4000,
      });
    },
    error: (error: Error) => {
      toast({
        variant: "destructive",
        title: "שגיאה בהתחברות",
        description: error.message,
        duration: 5000,
      });
    },
    signOut: () => {
      toast({
        title: "התנתקת בהצלחה",
        description: "נתראה בקרוב!",
        duration: 3000,
      });
    },
    sessionRefreshed: () => {
      toast({
        title: "נתוני ההתחברות עודכנו",
        description: "המשך ללמוד בבטחה",
        duration: 2000,
      });
    }
  };

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

  // Unified auth state handler with proper session management
  const handleAuthChange = useCallback(async (event: AuthChangeEvent, session: Session | null) => {
    console.log('🔔 Auth event:', event, 'Session:', !!session);
    
    try {
      switch (event) {
        case 'SIGNED_IN':
          setAuthState({ session, loading: false, loadingState: 'ready', error: null });
          if (session?.user) {
            updateUserRelatedStates(session.user);
            authToastManager.success(session.user);
          }
          break;
          
        case 'SIGNED_OUT':
          setAuthState({ session: null, loading: false, loadingState: 'ready', error: null });
          resetUserStates();
          authToastManager.signOut();
          break;
          
        case 'TOKEN_REFRESHED':
          setAuthState({ session, loading: false, loadingState: 'ready', error: null });
          if (session?.user) {
            updateUserRelatedStates(session.user);
            console.log('🔄 Token refreshed successfully');
          }
          break;
          
        case 'USER_UPDATED':
          setAuthState({ session, loading: false, loadingState: 'ready', error: null });
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
    } catch (error) {
      console.error('❌ Error handling auth change:', error);
      setAuthState(prev => ({ ...prev, error: error as Error, loading: false, loadingState: 'error' }));
    }
  }, [toast]);
  
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

  // Refresh session manually
  const refreshSession = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, loadingState: 'checking-session' }));
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("❌ Error refreshing session:", error);
        setAuthState({ session: null, loading: false, loadingState: 'error', error });
        resetUserStates();
        return;
      }
      
      setAuthState({ session, loading: false, loadingState: 'ready', error: null });
      
      if (session?.user) {
        updateUserRelatedStates(session.user);
        console.log("✅ Session refreshed for:", session.user.email);
      } else {
        resetUserStates();
        console.log("❌ No active session found");
      }
    } catch (error) {
      console.error("❌ Error in refreshSession:", error);
      setAuthState({ session: null, loading: false, loadingState: 'error', error: error as Error });
      resetUserStates();
    }
  }, [updateUserRelatedStates, resetUserStates]);

  // Main auth effect with unified session handling
  useEffect(() => {
    console.log("🔧 Setting up unified auth listener...");
    
    let isMounted = true;
    
    // Initial session check
    const initializeAuth = async () => {
      if (!isMounted) return;
      
      try {
        setAuthState(prev => ({ ...prev, loading: true, loadingState: 'checking-session' }));
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (error) {
          console.error("❌ Initial session check error:", error);
          setAuthState({ session: null, loading: false, loadingState: 'error', error });
          return;
        }
        
        if (session?.user) {
          console.log("✅ Found existing session for:", session.user.email);
          setAuthState({ session, loading: false, loadingState: 'ready', error: null });
          updateUserRelatedStates(session.user);
        } else {
          console.log("❌ No existing session found");
          setAuthState({ session: null, loading: false, loadingState: 'ready', error: null });
        }
      } catch (error) {
        console.error("❌ Error initializing auth:", error);
        if (isMounted) {
          setAuthState({ session: null, loading: false, loadingState: 'error', error: error as Error });
        }
      }
    };
    
    initializeAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        handleAuthChange(event, session);
      }
    });

    return () => {
      console.log("🧹 Cleaning up auth listener");
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthChange, updateUserRelatedStates]);

  // Debug effect to track state changes
  useEffect(() => {
    console.log("🔍 Auth state update:");
    console.log("  - session:", !!authState.session);
    console.log("  - user:", authState.session?.user?.email || "null");
    console.log("  - loading:", authState.loading);
    console.log("  - loadingState:", authState.loadingState);
    console.log("  - isAdmin:", isAdmin);
    console.log("  - isPremium:", isPremium);
  }, [authState, isAdmin, isPremium]);

  const logout = useCallback(async () => {
    try {
      console.log("🚪 Initiating logout...");
      setAuthState(prev => ({ ...prev, loading: true, loadingState: 'signing-out' }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("❌ Logout error:", error);
        authToastManager.error(error);
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
      setAuthState({ session: null, loading: false, loadingState: 'error', error: error as Error });
      resetUserStates();
      
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    }
  }, [authToastManager, resetUserStates]);

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
