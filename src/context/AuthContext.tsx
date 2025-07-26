import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Session, AuthChangeEvent, User as SupabaseUser } from '@supabase/supabase-js';
import { SupabaseAuthService, UserProfile, UserSubscription } from "@/services/supabaseAuth";
import { ADMIN_EMAILS, PREMIUM_EMAILS } from "@/constants/auth";

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
  updatePremiumStatus: (status: boolean) => Promise<void>;
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
  updatePremiumStatus: async () => {},
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
  const sessionRetryCount = useRef(0);
  const processingSignIn = useRef(false); // Prevent duplicate SIGNED_IN handling
  const toastShownRef = useRef<Set<string>>(new Set());
  
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
      duration: type === 'error' ? 6000 : 4000,
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

  const updatePremiumStatus = async (status: boolean) => {
    console.log("🔄 Updating premium status to:", status);
    
    // If canceling premium (status = false), update database first
    if (!status && authState.session?.user) {
      try {
        console.log("🚫 Canceling subscription in database...");
        const result = await SupabaseAuthService.cancelSubscription(authState.session.user.id);
        if (result.error) {
          console.error('❌ Error cancelling subscription in database:', result.error);
          throw result.error;
        }
        console.log("✅ Subscription cancelled successfully in database:", result);
        
        // Force clear localStorage immediately after successful DB update
        localStorage.removeItem("isPremiumUser");
        setIsPremium(false);
        
        // Force update user data to reflect cancellation
        setUserData(prevData => ({
          ...prevData,
          premiumExpiration: undefined
        }));
        
        console.log("🔄 Premium cancellation completed - all states updated");
        return; // Don't continue with normal flow
        
      } catch (error) {
        console.error('❌ Error canceling subscription in database:', error);
        throw error; // Don't continue if database update fails
      }
    }
    
    // Normal premium activation flow
    if (status) {
      localStorage.setItem("isPremiumUser", "true");
      setIsPremium(true);
      
      if (authState.session?.user) {
        setUserData(prevData => ({
          ...prevData,
          premiumExpiration: new Date().setMonth(new Date().getMonth() + 1)
        }));
        
        console.log("🔄 Refreshing user states from server...");
        // Refresh user states from server to ensure consistency
        await updateUserRelatedStates(authState.session.user);
      }
    }
  };

  const updateUserRelatedStates = useCallback(async (user: SupabaseUser) => {
    console.log("✅ Updating user states for:", user.email);
    
    const isUserAdmin = ADMIN_EMAILS.includes(user.email || "");
    setIsAdmin(isUserAdmin);
    
    // Check database for active premium subscription
    try {
      console.log("🔍 Checking database for premium status...");
      const hasDbPremium = await SupabaseAuthService.hasActivePremium(user.id);
      const subscription = await SupabaseAuthService.getUserSubscription(user.id);
      
      console.log("📊 Premium status check results:", {
        hasDbPremium,
        subscription: subscription ? { 
          status: subscription.status, 
          end_date: subscription.end_date 
        } : null,
        userEmail: user.email,
        isInPremiumEmails: PREMIUM_EMAILS.includes(user.email || "")
      });
      
      // Database subscription status ALWAYS takes precedence over email list
      const isPremiumByEmail = PREMIUM_EMAILS.includes(user.email || "") && subscription === null && !hasDbPremium;
      const isPremiumUser = hasDbPremium;  // ONLY use database status
      
      console.log("🎯 Final premium determination:", {
        isPremiumByEmail,
        isPremiumUser,
        reason: hasDbPremium ? "Database subscription" : isPremiumByEmail ? "Email list" : "No premium"
      });
      
      setIsPremium(isPremiumUser);
      
      const displayName = user.user_metadata?.full_name || user.user_metadata?.name || extractUsernameFromEmail(user.email);
      const newUserData = {
        firstName: displayName,
        lastName: '',
        premiumExpiration: subscription?.end_date || (isPremiumUser ? 
          new Date().setMonth(new Date().getMonth() + 1) : undefined)
      };
      setUserData(newUserData);
      
      // Update localStorage for backwards compatibility
      if (isPremiumUser) {
        localStorage.setItem("isPremiumUser", "true");
      } else {
        localStorage.removeItem("isPremiumUser");
      }
    } catch (error) {
      console.error('❌ Error checking premium status:', error);
      // Fallback to old logic if database check fails
      const premiumStatusFromStorage = localStorage.getItem("isPremiumUser") === "true";
      const isPremiumByEmail = PREMIUM_EMAILS.includes(user.email || "");
      const isPremiumUser = premiumStatusFromStorage || isPremiumByEmail;
      
      console.log("🔄 Fallback premium determination:", {
        premiumStatusFromStorage,
        isPremiumByEmail,
        isPremiumUser
      });
      
      setIsPremium(isPremiumUser);
      
      const displayName = user.user_metadata?.full_name || user.user_metadata?.name || extractUsernameFromEmail(user.email);
      const newUserData = {
        firstName: displayName,
        lastName: '',
        premiumExpiration: isPremiumUser ? 
          new Date().setMonth(new Date().getMonth() + 1) : undefined
      };
      setUserData(newUserData);
    }
  }, []);
  
  const resetUserStates = useCallback(() => {
    setIsAdmin(false);
    setIsPremium(false);
    setUserData(null);
    localStorage.removeItem("isPremiumUser");
    sessionRetryCount.current = 0;
    processingSignIn.current = false;
  }, []);

  // CRITICAL: Handle auth state changes with deadlock prevention
  const handleAuthChange = useCallback((event: AuthChangeEvent, session: Session | null) => {
    console.log('🔔 Auth event:', event, 'Session exists:', !!session);

    switch (event) {
      case 'SIGNED_IN':
        // Prevent duplicate SIGNED_IN events for the same session
        if (processingSignIn.current || 
            (authState.session?.user?.id === session?.user?.id && authState.initialized)) {
          console.log('🔄 Duplicate SIGNED_IN event ignored');
          return;
        }
        
        processingSignIn.current = true;
        console.log("🎉 User signed in successfully");
        
        // Only synchronous state updates here
        setAuthState(prev => ({
          ...prev,
          session, 
          loading: false, 
          loadingState: 'ready', 
          error: null,
          initialized: true 
        }));
        
        if (session?.user) {
          const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email;
          const provider = session.user.app_metadata?.provider;
          
          // Show appropriate success message
          if (provider === 'google') {
            showAuthToast('success', 'התחברת בהצלחה עם Google! 🎉', `ברוך הבא ${name}`);
          } else {
            showAuthToast('success', 'התחברת בהצלחה! 🎉', `ברוך הבא ${name}`);
          }
          
          sessionRetryCount.current = 0;
          
          // Defer Supabase calls with setTimeout to prevent deadlock
          setTimeout(() => {
            updateUserRelatedStates(session.user);
            processingSignIn.current = false;
          }, 0);
        } else {
          processingSignIn.current = false;
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
          // Defer Supabase calls
          setTimeout(() => {
            updateUserRelatedStates(session.user);
          }, 0);
        }
        break;

      case 'USER_UPDATED':
        console.log("👤 User updated");
        setAuthState(prev => ({ ...prev, session, loading: false, loadingState: 'ready' }));
        if (session?.user) {
          // Defer Supabase calls
          setTimeout(() => {
            updateUserRelatedStates(session.user);
          }, 0);
        }
        break;

      case 'PASSWORD_RECOVERY':
        console.log('🔑 Password recovery event');
        break;
        
      default:
        console.log('🔄 Unknown auth event:', event);
    }
  }, [authState.session, authState.initialized, showAuthToast, updateUserRelatedStates, resetUserStates]);

  // CRITICAL: Proper initialization order
  useEffect(() => {
    let mounted = true;
    console.log("🔧 Initializing auth system...");

    const initializeAuth = async () => {
      try {
        setAuthState(prev => ({ ...prev, loading: true, loadingState: 'checking-session' }));
        
        // OAuth callback detection
        const urlParams = new URLSearchParams(window.location.search);
        const hasOAuthCode = urlParams.get('code');
        const isOAuthCallback = !!hasOAuthCode;
        
        console.log("🔍 OAuth callback detection:", { 
          hasOAuthCode: !!hasOAuthCode, 
          isOAuthCallback,
          url: window.location.href 
        });

        // For OAuth callbacks, wait for Supabase to process
        if (isOAuthCallback) {
          console.log("🔗 OAuth callback detected - waiting for processing...");
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Check for existing session
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
          // Defer user state updates
          setTimeout(() => {
            updateUserRelatedStates(session.user);
          }, 0);
        } else {
          console.log("❌ No existing session found");
          
          // For OAuth callbacks without session, retry a few times
          if (isOAuthCallback) {
            console.log("🔗 OAuth callback but no session - attempting recovery...");
            let attempts = 0;
            const maxAttempts = 3;
            
            const attemptRecovery = async (): Promise<void> => {
              attempts++;
              console.log(`🔄 Recovery attempt ${attempts}/${maxAttempts}`);
              
              const { data: { session: recoveredSession } } = await supabase.auth.getSession();
              
              if (recoveredSession?.user && mounted) {
                console.log("✅ OAuth session recovered!");
                setAuthState({
                  session: recoveredSession,
                  loading: false,
                  loadingState: 'ready',
                  error: null,
                  initialized: true
                });
                setTimeout(() => {
                  updateUserRelatedStates(recoveredSession.user);
                }, 0);
                return;
              }
              
              if (attempts < maxAttempts && mounted) {
                setTimeout(attemptRecovery, 1000 + (attempts * 500));
              } else if (mounted) {
                console.log("❌ Failed to recover OAuth session");
                setAuthState({
                  session: null,
                  loading: false,
                  loadingState: 'ready',
                  error: null,
                  initialized: true
                });
              }
            };
            
            setTimeout(attemptRecovery, 1000);
          } else {
            setAuthState({
              session: null,
              loading: false,
              loadingState: 'ready',
              error: null,
              initialized: true
            });
          }
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
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

    // Set up auth state listener FIRST (critical for session persistence)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // THEN check for existing session
    initializeAuth();

    return () => {
      console.log("🧹 Cleaning up auth listener");
      mounted = false;
      subscription.unsubscribe();
      toastShownRef.current.clear();
    };
  }, []); // Empty deps - only run once on mount

  const refreshSession = useCallback(async () => {
    try {
      console.log("🔄 Manual session refresh initiated");
      setAuthState(prev => ({ ...prev, loading: true, loadingState: 'refreshing-token' }));
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("❌ Error refreshing session:", error);
        setAuthState(prev => ({ ...prev, loading: false, loadingState: 'error', error }));
        return;
      }
      
      setAuthState(prev => ({ ...prev, session, loading: false, loadingState: 'ready', error: null }));
      
      if (session?.user) {
        setTimeout(() => {
          updateUserRelatedStates(session.user);
        }, 0);
        console.log("✅ Session refreshed for:", session.user.email);
      } else {
        resetUserStates();
        console.log("❌ No active session found after refresh");
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
      
      console.log("✅ Logout successful - state will be updated by auth listener");
      
    } catch (error) {
      console.error("❌ Logout catch error:", error);
      setAuthState(prev => ({ ...prev, loading: false, loadingState: 'error', error: error as Error }));
      resetUserStates();
    }
  }, [showAuthToast, resetUserStates]);

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