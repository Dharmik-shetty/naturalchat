import { createContext, useContext, useEffect, useState } from "react";
import { User as FirebaseUser, onAuthStateChanged, signInWithRedirect, signOut } from "firebase/auth";
import { auth, googleProvider, getRedirectResult } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Firebase is properly configured
    const isFirebaseConfigured = 
      import.meta.env.VITE_FIREBASE_API_KEY && 
      import.meta.env.VITE_FIREBASE_API_KEY !== "demo-key" &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID !== "demo-project";

    if (!isFirebaseConfigured) {
      console.warn("Firebase not properly configured, running in demo mode");
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        
        if (user) {
          // Sync user data with backend
          try {
            await apiRequest("POST", "/api/auth/sync", {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            });
          } catch (error) {
            console.error("Failed to sync user data:", error);
          }
        }
        
        setLoading(false);
      });

      // Check for redirect result
      getRedirectResult(auth).catch((error) => {
        console.error("Auth redirect error:", error);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Firebase initialization error:", error);
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      // Check if Firebase is properly configured
      if (!import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === "demo-key") {
        console.warn("Firebase not configured, using demo mode");
        return;
      }
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
