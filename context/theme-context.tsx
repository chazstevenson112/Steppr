import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define theme colors
const lightTheme = {
  colors: {
    primary: "#2A66FF",
    background: "#FAFAFD",
    card: "#FFFFFF",
    textPrimary: "#111827",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
  },
};

const darkTheme = {
  colors: {
    primary: "#4C8DFF",
    background: "#121417",
    card: "#1C1F23",
    textPrimary: "#F3F4F6",
    textSecondary: "#9CA3AF",
    border: "#2D3033",
  },
};

type Theme = typeof lightTheme;

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load saved theme preference
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("@theme_preference");
        if (savedTheme !== null) {
          setIsDark(savedTheme === "dark");
        } else {
          // Use system preference as default
          setIsDark(colorScheme === "dark");
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
        // Fallback to system preference
        setIsDark(colorScheme === "dark");
      }
    };

    loadThemePreference();
  }, [colorScheme]);

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem("@theme_preference", newTheme ? "dark" : "light");
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};