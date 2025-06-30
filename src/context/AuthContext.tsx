
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { Session, AuthChangeEvent, User as SupabaseUser } from '@supabase/supabase-js';

const ADMIN_EMAILS = [
  "admin@example.com",
  "dncar13@gmail.com",
  "buldir@gmail.com",
];

const PREMIUM_EMAILS = [
  "premium@example.com",
  "dncar13@gmail.com",
  "buldir@gmail.com",
  "dncar20@gmail.com",
];

interface UserData {
  firstName?: string;
  lastName?: string;
  premiumExpiration?: string | number;
}

type AuthLoadingState = 'initial' | 'checking-session' | 'signing-in' | 'refreshing-token' | 'signing-out' | 'ready' | 'error';

interface AuthState {
  session: Session | null;
  loading: boolean;
  loadingState: AuthLoadingState;
  error: Error | null;
  initialized: boolean;
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
  const toastShownRef = useRef<Set<string>>(new Set());
  const sessionRetryCount = useRef(0);
  const maxRetries = 3;
  
  const isDevEnvironment = window.location.hostname === 'localhost' || 
                           window.location.hostname.includes('lovableproject.com');

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
  
  const resetUserStates = useCallback(() => {
    setIsAdmin(false);
    setIsPremium(false);
    setUserData(null);
    localStorage.removeItem("isPremiumUser");
    sessionRetryCount.current = 0;
  }, []);

  // Enhanced session recovery mechanism
  const attemptSessionRecovery = useCallback(async () => {
    if (sessionRetryCount.current >= maxRetries) {
      console.log("🔄 Max session recovery attempts reached");
      return null;
    }

    sessionRetryCount.current++;
    console.log(`🔄 Attempting session recovery (attempt ${sessionRetryCount.current}/${maxRetries})`);

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("❌ Session recovery error:", error);
        return null;
      }

      if (session?.user) {
        console.log("✅ Session recovered successfully:", session.user.email);
        return session;
      }

      console.log("❌ No session found during recovery");
      return null;
    } catch (error) {
      console.error("❌ Session recovery failed:", error);
      return null;
    }
  }, []);

  const handleAuthChange = useCallback(async (event: AuthChangeEvent, session: Session | null) => {
    console.log('🔔 Auth event:', event, 'Session:', !!session);

    switch (event) {
      case 'SIGNED_IN':
        console.log("🎉 User signed in successfully");
        console.log("🔍 Session details:", { 
          user: session?.user?.email, 
          provider: session?.user?.app_metadata?.provider,
          confirmed: session?.user?.email_confirmed_at ? 'yes' : 'no'
        });
        
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
          const provider = session.user.app_metadata?.provider;
          
          // Show appropriate success message based on provider
          if (provider === 'google') {
            showAuthToast('success', 'התחברת בהצלחה עם Google! 🎉', `ברוך הבא ${name}`);
          } else {
            showAuthToast('success', 'התחברת בהצלחה! 🎉', `ברוך הבא ${name}`);
          }
          
          sessionRetryCount.current = 0; // Reset retry count on successful login
        }
        break;

      case 'SIGNED_OUT':
        console.log("👋 User signed out");
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
        console.log("🔄 Token refreshed");
        setAuthState(prev => ({ ...prev, session, loading: false, loadingState: 'ready' }));
        if (session?.user) {
          updateUserRelatedStates(session.user);
        }
        break;

      case 'USER_UPDATED':
        console.log("👤 User updated");
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
        
        // For unknown events, try session recovery if we don't have a session
        if (!session && !authState.session) {
          console.log("🔍 No session in unknown event, attempting recovery...");
          setTimeout(async () => {
            const recoveredSession = await attemptSessionRecovery();
            if (recoveredSession) {
              setAuthState({
                session: recoveredSession,
                loading: false,
                loadingState: 'ready',
                error: null,
                initialized: true
              });
              updateUserRelatedStates(recoveredSession.user);
            }
          }, 1000);
        }
    }
  }, [showAuthToast, updateUserRelatedStates, resetUserStates, attemptSessionRecovery, authState.session]);

  useEffect(() => {
    let mounted = true;
    console.log("🔧 Initializing enhanced auth system...");

    // Enhanced OAuth callback detection
    const urlParams = new URLSearchParams(window.location.search);
    const hasOAuthCode = urlParams.get('code');
    const hasOAuthError = urlParams.get('error');
    const isOAuthCallback = hasOAuthCode || hasOAuthError;

    console.log("🔍 OAuth callback detection:", { 
      hasOAuthCode: !!hasOAuthCode, 
      hasOAuthError: !!hasOAuthError, 
      isOAuthCallback,
      url: window.location.href 
    });

    const initializeAuth = async () => {
      try {
        setAuthState(prev => ({ ...prev, loading: true, loadingState: 'checking-session' }));
        
        // For OAuth callbacks, wait longer before checking session
        if (isOAuthCallback && hasOAuthCode) {
          console.log("🔗 OAuth callback detected - giving Supabase time to process...");
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error("❌ Auth initialization error:", error);
          
          // Try recovery before giving up
          const recoveredSession = await attemptSessionRecovery();
          if (recoveredSession && mounted) {
            setAuthState({
              session: recoveredSession,
              loading: false,
              loadingState: 'ready',
              error: null,
              initialized: true
            });
            updateUserRelatedStates(recoveredSession.user);
            return;
          }
          
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
          
          // Enhanced recovery for OAuth callbacks
          if (isOAuthCallback && hasOAuthCode) {
            console.log("🔗 No session found in OAuth callback - attempting extended recovery...");
            
            // Try multiple times with increasing delays for OAuth
            let recoveryAttempts = 0;
            const maxOAuthRetries = 6;
            
            const attemptOAuthRecovery = async () => {
              recoveryAttempts++;
              console.log(`🔄 OAuth recovery attempt ${recoveryAttempts}/${maxOAuthRetries}`);
              
              const recoveredSession = await attemptSessionRecovery();
              if (recoveredSession && mounted) {
                console.log("✅ OAuth session recovered successfully!");
                setAuthState({
                  session: recoveredSession,
                  loading: false,
                  loadingState: 'ready',
                  error: null,
                  initialized: true
                });
                updateUserRelatedStates(recoveredSession.user);
                return true;
              }
              
              if (recoveryAttempts < maxOAuthRetries && mounted) {
                setTimeout(attemptOAuthRecovery, 1000 + (recoveryAttempts * 500));
              } else if (mounted) {
                console.log("❌ Failed to recover OAuth session after all attempts");
                setAuthState({
                  session: null,
                  loading: false,
                  loadingState: 'ready',
                  error: null,
                  initialized: true
                });
              }
              return false;
            };
            
            setTimeout(attemptOAuthRecovery, 1000);
          } else {
            // Standard recovery for non-OAuth cases
            setTimeout(async () => {
              if (!mounted) return;
              
              const recoveredSession = await attemptSessionRecovery();
              if (recoveredSession && mounted) {
                setAuthState({
                  session: recoveredSession,
                  loading: false,
                  loadingState: 'ready',
                  error: null,
                  initialized: true
                });
                updateUserRelatedStates(recoveredSession.user);
              } else if (mounted) {
                setAuthState({
                  session: null,
                  loading: false,
                  loadingState: 'ready',
                  error: null,
                  initialized: true
                });
              }
            }, 1500);
          }
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      console.log("🧹 Cleaning up auth listener");
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthChange, updateUserRelatedStates, attemptSessionRecovery]);

  const refreshSession = useCallback(async () => {
    try {
      console.log("🔄 Manual session refresh initiated");
      setAuthState(prev => ({ ...prev, loading: true, loadingState: 'refreshing-token' }));
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("❌ Error refreshing session:", error);
        
        // Try recovery
        const recoveredSession = await attemptSessionRecovery();
        if (recoveredSession) {
          setAuthState({
            session: recoveredSession,
            loading: false,
            loadingState: 'ready',
            error: null,
            initialized: true
          });
          updateUserRelatedStates(recoveredSession.user);
          return;
        }
        
        setAuthState(prev => ({ ...prev, loading: false, loadingState: 'error', error }));
        return;
      }
      
      setAuthState(prev => ({ ...prev, session, loading: false, loadingState: 'ready', error: null }));
      
      if (session?.user) {
        updateUserRelatedStates(session.user);
        console.log("✅ Session refreshed for:", session.user.email);
      } else {
        resetUserStates();
        console.log("❌ No active session found after refresh");
      }
    } catch (error) {
      console.error("❌ Error in refreshSession:", error);
      setAuthState(prev => ({ ...prev, loading: false, loadingState: 'error', error: error as Error }));
    }
  }, [updateUserRelatedStates, resetUserStates, attemptSessionRecovery]);

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
      
      console.log("✅ Logout successful - state will be updated by auth listener");
      
    } catch (error) {
      console.error("❌ Logout catch error:", error);
      setAuthState(prev => ({ ...prev, loading: false, loadingState: 'error', error: error as Error }));
      resetUserStates();
    }
  }, [showAuthToast, resetUserStates]);

  useEffect(() => {
    if (isDevEnvironment) {
      console.log("🔍 Enhanced Auth state update:");
      console.log("  - session:", !!authState.session);
      console.log("  - user:", authState.session?.user?.email || "null");
      console.log("  - loading:", authState.loading);
      console.log("  - loadingState:", authState.loadingState);
      console.log("  - initialized:", authState.initialized);
      console.log("  - isAdmin:", isAdmin);
      console.log("  - isPremium:", isPremium);
      console.log("  - retryCount:", sessionRetryCount.current);
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
