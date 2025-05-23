import React, { createContext, useContext, useState, useEffect } from "react";
import { Platform } from "react-native";
import { 
  Auth,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged,
  getAuth,
  initializeAuth
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import app, { db } from "@/lib/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  user: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Initialize Firebase Auth with proper typing
let auth: Auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  // For React Native, use initializeAuth with AsyncStorage persistence
  try {
    // Import getReactNativePersistence dynamically for React Native
    const { getReactNativePersistence } = require('firebase/auth/react-native');
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch (error) {
    // Fallback to regular auth if React Native persistence is not available
    console.warn('React Native persistence not available, using default auth');
    auth = getAuth(app);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      // Provide specific error messages based on Firebase error codes
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('No account found with this email address.');
        case 'auth/wrong-password':
          throw new Error('Incorrect password. Please try again.');
        case 'auth/invalid-email':
          throw new Error('Invalid email address format.');
        case 'auth/user-disabled':
          throw new Error('This account has been disabled.');
        case 'auth/too-many-requests':
          throw new Error('Too many failed attempts. Please try again later.');
        case 'auth/invalid-credential':
          throw new Error('Invalid email or password. Please check your credentials.');
        default:
          throw new Error('Failed to sign in. Please check your credentials.');
      }
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await firebaseUpdateProfile(userCredential.user, {
        displayName: name,
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName: name,
        email: email,
        createdAt: new Date(),
        dailyStepGoal: 10000,
        totalSteps: 0,
        activeChallenges: [],
      });

      setUser(userCredential.user);
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      // Provide specific error messages based on Firebase error codes
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('An account with this email already exists.');
        case 'auth/invalid-email':
          throw new Error('Invalid email address format.');
        case 'auth/weak-password':
          throw new Error('Password should be at least 6 characters long.');
        case 'auth/operation-not-allowed':
          throw new Error('Email/password accounts are not enabled.');
        default:
          throw new Error('Failed to create account. Please try again.');
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw new Error('Failed to sign out. Please try again.');
    }
  };

  const updateProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (!user) return;
    
    try {
      // Update Firebase Auth profile
      await firebaseUpdateProfile(user, data);
      
      // Update Firestore user document
      await setDoc(doc(db, 'users', user.uid), data, { merge: true });
      
      // Update local user state
      setUser({ ...user, ...data } as FirebaseUser);
    } catch (error) {
      console.error("Update profile error:", error);
      throw new Error('Failed to update profile. Please try again.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};