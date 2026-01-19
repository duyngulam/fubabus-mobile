import React from "react";
import { View, Text, Alert } from "react-native";
import { useTripManager } from "../hooks/useTripManager";
import { useTheme } from "../../context/ThemeContext";
import { ThemedButton } from "../../components/ui/ThemedButton";
import { ThemedCard } from "../../components/ui/ThemedCard";

/**
 * Example component showing how to integrate GPS tracking
 * This is just for demonstration - you can integrate this logic into any screen
 */
export const TripControlExample = () => {
  const { theme } = useTheme();
  const {
    activeTrip,
    isRunning,
    isTracking,
    startTripTracking,
    stopTripTracking,
  } = useTripManager();

  const handleStartTrip = async () => {
    // In a real app, you'd get this from a trip selection screen
    const mockTripId = 123;

    try {
      await startTripTracking(mockTripId);
      Alert.alert(
        "Success",
        "Trip tracking started! GPS will automatically start if trip status is RUNNING.",
      );
    } catch (error) {
      Alert.alert("Error", "Failed to start trip tracking");
    }
  };

  const handleStopTrip = () => {
    stopTripTracking();
    Alert.alert(
      "Success",
      "Trip tracking stopped! GPS tracking will also stop.",
    );
  };

  return (
    <ThemedCard variant="elevated" style={{ margin: theme.spacing[4] }}>
      <Text
        style={{
          fontSize: theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.bold,
          textAlign: "center",
          marginBottom: theme.spacing[5],
          color: theme.colors.primary,
        }}
      >
        Trip GPS Control
      </Text>

      <ThemedCard variant="surface" style={{ marginBottom: theme.spacing[5] }}>
        <Text
          style={{
            fontSize: theme.typography.fontSize.base,
            fontWeight: theme.typography.fontWeight.semibold,
            marginBottom: theme.spacing[3],
            color: theme.colors.text,
          }}
        >
          Status:
        </Text>
        <View style={{ gap: theme.spacing[1] }}>
          <Text
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textSecondary,
            }}
          >
            Active Trip: {activeTrip ? `#${activeTrip.tripId}` : "None"}
          </Text>
          <Text
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textSecondary,
            }}
          >
            Running: {isRunning ? "🟢 Yes" : "🔴 No"}
          </Text>
          <Text
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textSecondary,
            }}
          >
            GPS Tracking: {isTracking ? "📍 Active" : "📍 Inactive"}
          </Text>
        </View>
      </ThemedCard>

      <View style={{ gap: theme.spacing[3], marginBottom: theme.spacing[5] }}>
        <ThemedButton
          title="Start Trip Tracking"
          onPress={handleStartTrip}
          variant="primary"
          disabled={isTracking}
        />

        <ThemedButton
          title="Stop Trip Tracking"
          onPress={handleStopTrip}
          variant="secondary"
          disabled={!isTracking}
        />
      </View>

      <ThemedCard
        variant="surface"
        style={{ backgroundColor: `${theme.colors.info}10` }}
      >
        <Text
          style={{
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.semibold,
            marginBottom: theme.spacing[2],
            color: theme.colors.info,
          }}
        >
          How it works:
        </Text>
        <Text
          style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.info,
            lineHeight:
              theme.typography.lineHeight.loose * theme.typography.fontSize.xs,
          }}
        >
          • Start Trip Tracking sets the active trip{"\n"}• GPS automatically
          starts when trip status is "RUNNING"{"\n"}• GPS sends location every 5
          seconds via WebSocket{"\n"}• GPS stops when trip ends or status
          changes{"\n"}• Check console logs for detailed tracking info
        </Text>
      </ThemedCard>
    </ThemedCard>
  );
};
