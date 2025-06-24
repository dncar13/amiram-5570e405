import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged, User, logoutUser } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isDevEnvironment: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  userData: UserData | null;
  logout: () => Promise<void>;
  updatePremiumStatus: (status: boolean) => void;
  hasAccessToTopic: (topicId: number) => boolean;
  checkAndUpdateSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  isDevEnvironment: false,
  isAdmin: false,
  isPremium: false,
  userData: null,
  logout: async () => {},
  updatePremiumStatus: () => {},
  hasAccessToTopic: () => true,
  checkAndUpdateSession: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { toast } = useToast();
  
  const isDevEnvironment = window.location.hostname === 'localhost' || 
                           window.location.hostname.includes('lovableproject.com');

  const FREE_TOPIC_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
    
    if (currentUser) {
      setUserData(prevData => ({
        ...prevData,
        premiumExpiration: status ? 
          new Date().setMonth(new Date().getMonth() + 1) : undefined
      }));
    }
  };

  // Enhanced auth state update with better Google Auth handling
  const updateAuthState = (user: User | null) => {
    console.log("🔄 Updating auth state with user:", user?.email || "null");
    console.log("🖼️ User photo URL:", user?.photoURL || "null");
    
    setCurrentUser(user);
    
    if (user) {
      console.log("✅ User found, updating related states...");
      
      const isUserAdmin = ADMIN_EMAILS.includes(user.email || "");
      console.log("  - Is admin:", isUserAdmin);
      setIsAdmin(isUserAdmin);
      
      const premiumStatusFromStorage = localStorage.getItem("isPremiumUser") === "true";
      const isPremiumByEmail = PREMIUM_EMAILS.includes(user.email || "");
      const isPremiumUser = premiumStatusFromStorage || isPremiumByEmail;
      
      console.log("  - Premium from storage:", premiumStatusFromStorage);
      console.log("  - Premium by email:", isPremiumByEmail);
      console.log("  - Final premium status:", isPremiumUser);
      setIsPremium(isPremiumUser);
      
      // Enhanced user data with proper display name and photo
      const displayName = user.displayName || extractUsernameFromEmail(user.email);
      const newUserData = {
        firstName: displayName,
        lastName: '',
        premiumExpiration: isPremiumUser ? 
          new Date().setMonth(new Date().getMonth() + 1) : undefined
      };
      console.log("  - User data:", newUserData);
      console.log("  - Photo URL:", user.photoURL);
      setUserData(newUserData);
    } else {
      console.log("❌ No user, resetting states...");
      setIsAdmin(false);
      setIsPremium(false);
      setUserData(null);
    }
    
    setIsLoading(false);
  };

  const checkAndUpdateSession = async () => {
    try {
      console.log("🔍 Checking current session...");
      
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session check timeout')), 5000)
      );
      
      const { data: { session }, error } = await Promise.race([
        sessionPromise,
        timeoutPromise
      ]) as any;
      
      if (error) {
        console.error("❌ Error getting session:", error);
        updateAuthState(null);
        return;
      }
      
      if (session?.user) {
        console.log("✅ Found active session for:", session.user.email);
        console.log("🖼️ Session user photo:", session.user.user_metadata?.avatar_url);
        const convertedUser: User = {
          uid: session.user.id,
          email: session.user.email,
          displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
          photoURL: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
          metadata: {
            creationTime: session.user.created_at,
            lastSignInTime: session.user.last_sign_in_at,
          },
        };
        updateAuthState(convertedUser);
      } else {
        console.log("❌ No active session found");
        updateAuthState(null);
      }
    } catch (error) {
      console.error("❌ Error in checkAndUpdateSession:", error);
      updateAuthState(null);
    }
  };

  useEffect(() => {
    console.log("🔧 AuthContext: Setting up enhanced auth state listener...");
    
    let isMounted = true;
    let initialCheckDone = false;
    
    const handleAuthChange = (user: any) => {
      console.log("🔔 Auth state changed:");
      console.log("  - User exists:", !!user);
      console.log("  - User email:", user?.email || "No email");
      console.log("  - User ID:", user?.uid || "No ID");
      console.log("  - User photo:", user?.photoURL || "No photo");
      console.log("  - Component mounted:", isMounted);
      console.log("  - Initial check done:", initialCheckDone);
      
      if (isMounted) {
        updateAuthState(user);
        if (!initialCheckDone) {
          initialCheckDone = true;
          setTimeout(() => {
            if (isMounted) {
              setIsLoading(false);
            }
          }, 100);
        }
      }
    };
    
    // Check for Google Auth redirect on initial load
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'google') {
      console.log("🔗 Google Auth redirect detected, checking session...");
      setTimeout(() => {
        checkAndUpdateSession();
      }, 1000);
    }
    
    const initialCheck = async () => {
      try {
        await checkAndUpdateSession();
      } catch (error) {
        console.error("❌ Initial auth check failed:", error);
        updateAuthState(null);
      } finally {
        if (isMounted && !initialCheckDone) {
          initialCheckDone = true;
          setIsLoading(false);
        }
      }
    };
    
    initialCheck();
    
    const unsubscribe = onAuthStateChanged(auth, handleAuthChange);

    return () => {
      console.log("🧹 Cleaning up auth listener");
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Debug effect to track state changes
  useEffect(() => {
    console.log("🔍 Auth state update:");
    console.log("  - currentUser:", currentUser?.email || "null");
    console.log("  - photoURL:", currentUser?.photoURL || "null");
    console.log("  - isLoading:", isLoading);
    console.log("  - isAdmin:", isAdmin);
    console.log("  - isPremium:", isPremium);
  }, [currentUser, isLoading, isAdmin, isPremium]);

  const logout = async () => {
    try {
      console.log("🚪 Attempting logout...");
      
      setCurrentUser(null);
      setIsAdmin(false);
      setIsPremium(false);
      setUserData(null);
      setIsLoading(false);
      
      localStorage.removeItem("isPremiumUser");
      
      const result = await logoutUser();
      
      console.log("✅ Logout successful");
      
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
      return Promise.resolve();
    } catch (error) {
      console.error("❌ Error during logout:", error);
      
      setCurrentUser(null);
      setIsAdmin(false);
      setIsPremium(false);
      setUserData(null);
      setIsLoading(false);
      
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
      return Promise.reject(error);
    }
  };

  const value = {
    currentUser,
    isLoading,
    isDevEnvironment,
    isAdmin,
    isPremium,
    userData,
    logout,
    updatePremiumStatus,
    hasAccessToTopic,
    checkAndUpdateSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
