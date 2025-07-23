import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Check if Firebase is properly configured
const isFirebaseConfigured = 
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_API_KEY !== "demo-key" &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID !== "demo-project" &&
  import.meta.env.VITE_FIREBASE_APP_ID &&
  import.meta.env.VITE_FIREBASE_APP_ID !== "demo-app-id";

let app: any = null;
let auth: any;
let db: any = null;
let googleProvider: any = null;

if (isFirebaseConfigured) {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
    app = null;
    auth = null;
    db = null;
    googleProvider = null;
  }
}

// Create mock auth object when Firebase is not configured
if (!auth) {
  console.warn("Firebase not configured, running in demo mode");
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback: any) => {
      // Immediately call with null user in demo mode
      setTimeout(() => callback(null), 0);
      return () => {};
    },
    signInWithRedirect: () => Promise.reject(new Error("Firebase not configured")),
    signOut: () => Promise.reject(new Error("Firebase not configured")),
  };
}

// Mock getRedirectResult function
export const getRedirectResult = (authInstance: any) => {
  if (!isFirebaseConfigured) {
    return Promise.resolve(null);
  }
  try {
    return import("firebase/auth").then(({ getRedirectResult: firebaseGetRedirectResult }) => 
      firebaseGetRedirectResult(authInstance)
    );
  } catch (error) {
    return Promise.resolve(null);
  }
};

export { auth, db, googleProvider };
export default app;