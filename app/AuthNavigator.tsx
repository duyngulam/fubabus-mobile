import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "./hooks/useAuth";

/**
 * AuthNavigator
 * Handles role-based navigation
 * - DRIVER/STAFF -> trip-check-in screen
 * - USER -> tabs (home, profile)
 * - No auth -> sign-in
 */
export default function AuthNavigator() {
  const { userToken, userRole, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && userToken && userRole) {
      console.log("[AuthNavigator] User authenticated with role:", userRole);

      // Redirect based on role
      if (userRole === "DRIVER" || userRole === "STAFF") {
        console.log(
          "[AuthNavigator] Redirecting to trip-check-in for driver/staff",
        );
        router.replace("/");
      } else if (userRole === "ADMIN") {
        console.log("[AuthNavigator] Admin role - redirecting to tabs");
        router.replace("/(tabs)");
      } else {
        console.log("[AuthNavigator] User role - redirecting to tabs");
        router.replace("/(tabs)");
      }
    } else if (!isLoading && !userToken) {
      console.log("[AuthNavigator] No auth token, staying on auth screen");
    }
  }, [isLoading, userToken, userRole]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#EAEAEA",
        }}
      >
        <ActivityIndicator size="large" color="#D83E3E" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName={userToken ? "(tabs)" : "(auth)"}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="trip-check-in" options={{ headerShown: false }} />
      <Stack.Screen name="route-management" options={{ headerShown: false }} />
    </Stack>
  );
}
