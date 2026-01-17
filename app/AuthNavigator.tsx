import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "./hooks/useAuth";

export default function AuthNavigator() {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
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
