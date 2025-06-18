import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged, User, logoutUser } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

// רשימת אימיילים של משתמשים שהם מנהלי מערכת
const ADMIN_EMAILS = [
  "admin@example.com",
  "dncar13@gmail.com", // הוספת האימייל החדש
  "buldir@gmail.com", // הוספת המשתמש החדש כמנהל
  // הוסף כאן אימיילים נוספים של מנהלים
];

// רשימת אימיילים של משתמשים פרימיום
const PREMIUM_EMAILS = [
  "premium@example.com",
  "dncar13@gmail.com", // הוספת האימייל החדש כמשתמש פרימיום
  "buldir@gmail.com", // הוספת המשתמש החדש כמשתמש פרימיום
  "dncar20@gmail.com", // הוספת המשתמש החדש כמשתמש פרימיום
  // הוסף כאן אימיילים נוספים של משתמשים פרימיום
];

// מבנה נתוני משתמש
interface UserData {
  firstName?: string;
  lastName?: string;
  premiumExpiration?: string | number;
  // תכונות נוספות של משתמש
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
  hasAccessToTopic: (topicId: number) => boolean; // פונקציה חדשה לבדיקת גישה לנושא
  checkAndUpdateSession: () => Promise<void>; // פונקציה חדשה לבדיקת סשן
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
  hasAccessToTopic: () => true, // ברירת מחדל - גישה לכל הנושאים
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
  
  // Check if we're in development mode (for handling auth domain issues)
  const isDevEnvironment = window.location.hostname === 'localhost' || 
                           window.location.hostname.includes('lovableproject.com');

  // כל הנושאים זמינים לכולם עכשיו
  const FREE_TOPIC_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const extractUsernameFromEmail = (email?: string | null) => {
    if (!email) return "משתמש";
    const username = email.split('@')[0];
    // Convert to title case and replace potential separators
    return username
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  // פונקציה לבדיקה אם למשתמש יש גישה לנושא מסוים - עכשיו כל הנושאים פתוחים
  const hasAccessToTopic = (topicId: number): boolean => {
    // כל הנושאים זמינים לכולם עכשיו
    return true;
  };

  // פונקציה חדשה לעדכון סטטוס פרימיום
  const updatePremiumStatus = (status: boolean) => {
    console.log("Updating premium status:", status);
    if (status) {
      localStorage.setItem("isPremiumUser", "true");
    } else {
      localStorage.removeItem("isPremiumUser");
    }
    setIsPremium(status);
    
    // עדכון נתוני המשתמש עם תאריך פקיעת הפרימיום
    if (currentUser) {
      setUserData(prevData => ({
        ...prevData,
        premiumExpiration: status ? 
          new Date().setMonth(new Date().getMonth() + 1) : undefined
      }));
    }
  };

  // Function to update auth state
  const updateAuthState = (user: User | null) => {
    console.log("🔄 Updating auth state with user:", user?.email || "null");
    
    setCurrentUser(user);
    
    if (user) {
      console.log("✅ User found, updating related states...");
      
      // בדיקה אם המשתמש הוא מנהל על פי האימייל שלו
      const isUserAdmin = ADMIN_EMAILS.includes(user.email || "");
      console.log("  - Is admin:", isUserAdmin);
      setIsAdmin(isUserAdmin);
      
      // בדיקה אם המשתמש הוא פרימיום על פי האימייל שלו או הסטטוס בלוקאל סטורג'
      const premiumStatusFromStorage = localStorage.getItem("isPremiumUser") === "true";
      const isPremiumByEmail = PREMIUM_EMAILS.includes(user.email || "");
      const isPremiumUser = premiumStatusFromStorage || isPremiumByEmail;
      
      console.log("  - Premium from storage:", premiumStatusFromStorage);
      console.log("  - Premium by email:", isPremiumByEmail);
      console.log("  - Final premium status:", isPremiumUser);
      setIsPremium(isPremiumUser);
      
      // טעינת נתוני משתמש עם שם מופק מהאימייל
      const newUserData = {
        firstName: extractUsernameFromEmail(user.email),
        lastName: '', // נשאיר ריק כיוון שאנחנו מסתמכים על האימייל
        premiumExpiration: isPremiumUser ? 
          new Date().setMonth(new Date().getMonth() + 1) : undefined
      };
      console.log("  - User data:", newUserData);
      setUserData(newUserData);
    } else {
      console.log("❌ No user, resetting states...");
      setIsAdmin(false);
      setIsPremium(false);
      setUserData(null);
    }
    
    setIsLoading(false);
  };

  // פונקציה חדשה לבדיקה ועדכון של הסשן הנוכחי
  const checkAndUpdateSession = async () => {
    try {
      console.log("🔍 Checking current session...");
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("❌ Error getting session:", error);
        updateAuthState(null);
        return;
      }
      
      if (session?.user) {
        console.log("✅ Found active session for:", session.user.email);
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
    console.log("🔧 AuthContext: Setting up auth state listener...");
    
    let isMounted = true;
    
    // בדיקה ראשונית של הסשן
    checkAndUpdateSession();
    
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔔 Auth state changed:");
      console.log("  - User exists:", !!user);
      console.log("  - User email:", user?.email || "No email");
      console.log("  - User ID:", user?.uid || "No ID");
      console.log("  - Component mounted:", isMounted);
      
      if (isMounted) {
        updateAuthState(user);
      }
    });

    return () => {
      console.log("🧹 Cleaning up auth listener");
      isMounted = false;
      unsubscribe();
    };
  }, []); // Remove dependencies to prevent re-initialization

  // Debug effect to track state changes
  useEffect(() => {
    console.log("🔍 Auth state update:");
    console.log("  - currentUser:", currentUser?.email || "null");
    console.log("  - isLoading:", isLoading);
    console.log("  - isAdmin:", isAdmin);
    console.log("  - isPremium:", isPremium);
  }, [currentUser, isLoading, isAdmin, isPremium]);

  const logout = async () => {
    try {
      console.log("🚪 Attempting logout...");
      await logoutUser();
      console.log("✅ Logout successful");
      return Promise.resolve();
    } catch (error) {
      console.error("❌ Error during logout:", error);
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
