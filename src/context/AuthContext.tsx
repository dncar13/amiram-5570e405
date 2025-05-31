
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged, User, logoutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

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
  hasAccessToTopic: () => false
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

  // רשימת נושאים חינמיים (זמינים לכולם)
  const FREE_TOPIC_IDS = [1];

  const extractUsernameFromEmail = (email?: string | null) => {
    if (!email) return "משתמש";
    const username = email.split('@')[0];
    // Convert to title case and replace potential separators
    return username
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  // פונקציה לבדיקה אם למשתמש יש גישה לנושא מסוים
  const hasAccessToTopic = (topicId: number): boolean => {
    // נושאים חינמיים זמינים לכולם
    if (FREE_TOPIC_IDS.includes(topicId)) {
      return true;
    }
    
    // משתמשי פרימיום או מנהלים יכולים לגשת לכל הנושאים
    return isPremium || isAdmin;
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? user.email : "No user");
      setCurrentUser(user);
      
      // בדיקה אם המשתמש הוא מנהל על פי האימייל שלו
      if (user && ADMIN_EMAILS.includes(user.email || "")) {
        console.log("User is admin:", user.email);
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      
      // בדיקה אם המשתמש הוא פרימיום על פי האימייל שלו או הסטטוס בלוקאל סטורג'
      const premiumStatusFromStorage = localStorage.getItem("isPremiumUser") === "true";
      const isPremiumByEmail = user && PREMIUM_EMAILS.includes(user.email || "");
      
      if (premiumStatusFromStorage || isPremiumByEmail) {
        console.log("User is premium:", premiumStatusFromStorage ? "from storage" : user?.email);
        setIsPremium(true);
      } else {
        setIsPremium(false);
      }
      
      // טעינת נתוני משתמש עם שם מופק מהאימייל
      if (user) {
        setUserData({
          firstName: extractUsernameFromEmail(user.email),
          lastName: '', // נשאיר ריק כיוון שאנחנו מסתמכים על האימייל
          premiumExpiration: isPremiumByEmail || premiumStatusFromStorage ? 
            new Date().setMonth(new Date().getMonth() + 1) : undefined
        });
      } else {
        setUserData(null);
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
      return Promise.resolve();
    } catch (error) {
      console.error("Error during logout:", error);
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
    hasAccessToTopic
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

