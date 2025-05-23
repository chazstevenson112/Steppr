import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock user type - would be replaced with Firebase Auth User
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthState = async () => {
      try {
        const userData = await AsyncStorage.getItem("@user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const signIn = async (email: string, password: string) => {
    // In a real app, this would authenticate with Firebase
    // For demo purposes, we'll just simulate a successful login
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock user
    const mockUser: User = {
      uid: "user123",
      email,
      displayName: email.split("@")[0],
      photoURL: null,
    };
    
    // Save user to AsyncStorage
    await AsyncStorage.setItem("@user", JSON.stringify(mockUser));
    
    // Update state
    setUser(mockUser);
  };

  const signUp = async (name: string, email: string, password: string) => {
    // In a real app, this would create a new user in Firebase
    // For demo purposes, we'll just simulate a successful registration
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock user
    const mockUser: User = {
      uid: "user123",
      email,
      displayName: name,
      photoURL: null,
    };
    
    // Save user to AsyncStorage
    await AsyncStorage.setItem("@user", JSON.stringify(mockUser));
    
    // Update state
    setUser(mockUser);
  };

  const signOut = async () => {
    // In a real app, this would sign out from Firebase
    // For demo purposes, we'll just clear the user from AsyncStorage
    
    await AsyncStorage.removeItem("@user");
    setUser(null);
  };

  const updateProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (!user) return;
    
    // In a real app, this would update the user profile in Firebase
    // For demo purposes, we'll just update the user in AsyncStorage
    
    const updatedUser = {
      ...user,
      ...data,
    };
    
    // Save updated user to AsyncStorage
    await AsyncStorage.setItem("@user", JSON.stringify(updatedUser));
    
    // Update state
    setUser(updatedUser);
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