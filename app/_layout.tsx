import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider } from "./context/AuthContext";
import { TripProvider } from "./context/TripContext";
import { ThemeProvider } from "../context/ThemeContext";
import { TripGPSManager } from "./components/TripGPSManager";
import AuthNavigator from "./AuthNavigator";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider>
      <NavigationThemeProvider
        value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <AuthProvider>
          <TripProvider>
            <TripGPSManager />
            <AuthNavigator />
          </TripProvider>
        </AuthProvider>
        <StatusBar style="auto" />
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}
