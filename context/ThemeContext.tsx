import React, { createContext, useContext, ReactNode } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme } from "../constants/theme";

// Create a union type that accepts both light and dark themes
type AppTheme = typeof lightTheme | typeof darkTheme;

interface ThemeContextType {
  theme: AppTheme;
  isDark: boolean;
  colorScheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  forcedTheme?: "light" | "dark";
}

export const ThemeProvider = ({
  children,
  forcedTheme,
}: ThemeProviderProps) => {
  const systemColorScheme = useColorScheme();
  const colorScheme = forcedTheme || systemColorScheme || "light";
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;

  const value: ThemeContextType = {
    theme,
    isDark,
    colorScheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
