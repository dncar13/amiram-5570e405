import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuz9bgFenY-7iyVqZwGgoJz_C9FOFZHYs",
  authDomain: "pogodin-e8784.firebaseapp.com",
  projectId: "pogodin-e8784",
  storageBucket: "pogodin-e8784.firebasestorage.app",
  messagingSenderId: "159805684853",
  appId: "1:159805684853:web:9f45a9ca80d727f7790c3c",
  measurementId: "G-SRGRKG1MD5"
};

// Initialize Firebase
let app;
let analytics;
let auth;
let db;
let googleProvider;

try {
  // Initialize Firebase with error handling
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Check if we're in development mode (for handling auth domain issues)
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname.includes('lovableproject.com');

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    if (!auth) throw new Error("Firebase auth not initialized");
    
    // In development, notify about the domain restriction
    if (isDevelopment) {
      console.warn("Firebase Google authentication will not work in development environment due to domain restrictions.");
      console.info("To fix this, add this domain to your Firebase Console > Authentication > Settings > Authorized Domains.");
      return { 
        user: null, 
        error: new Error("auth/unauthorized-domain"), 
        message: "Google התחברות לא זמינה בסביבת הפיתוח. בהפעלה באתר האמיתי (pogodin.co.il) זה יעבוד כראוי."
      };
    }
    
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    
    // Handle unauthorized domain error specifically
    if (error.code === "auth/unauthorized-domain") {
      return { 
        user: null, 
        error,
        message: "Google התחברות לא זמינה בסביבת הפיתוח. בהפעלה באתר האמיתי (pogodin.co.il) זה יעבוד כראוי."
      };
    }
    
    return { user: null, error };
  }
};

export const registerWithEmailAndPassword = async (email: string, password: string) => {
  try {
    if (!auth) throw new Error("Firebase auth not initialized");
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    console.error("Error registering with email and password:", error);
    return { user: null, error };
  }
};

export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    if (!auth) throw new Error("Firebase auth not initialized");
    
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    console.error("Error logging in with email and password:", error);
    return { user: null, error };
  }
};

export const logoutUser = async () => {
  try {
    if (!auth) throw new Error("Firebase auth not initialized");
    
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false, error };
  }
};

// Helper function to check Firebase connectivity
export const checkFirebaseConnection = async () => {
  try {
    if (!db) return false;
    
    // Try a simple operation with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // We'll just check if we can access Firestore but not actually read anything
    await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    console.warn("Firebase connectivity check failed:", error);
    return false;
  }
};

// Re-export needed functions and objects
export { auth, db, onAuthStateChanged };
export type { User };
