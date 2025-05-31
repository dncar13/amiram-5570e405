
// Firebase User interface that matches the actual Firebase user
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

export const signInWithGoogle = async () => ({ user: null, error: new Error("Not implemented") });
export const loginWithEmailAndPassword = async () => ({ user: null, error: new Error("Not implemented") });
export const registerWithEmailAndPassword = async () => ({ user: null, error: new Error("Not implemented") });

export const logoutUser = async () => ({ success: false, error: new Error("Not implemented") });

export const checkFirebaseConnection = async () => false;

export const auth = null;
export const db = null;

// Fix the onAuthStateChanged function signature
export const onAuthStateChanged = (auth: any, callback: (user: User | null) => void) => {
  // Mock implementation that calls callback with null user
  callback(null);
  return () => {}; // Return unsubscribe function
};
