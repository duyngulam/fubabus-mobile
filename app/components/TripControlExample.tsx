import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useTripManager } from "../hooks/useTripManager";

/**
 * Example component showing how to integrate GPS tracking
 * This is just for demonstration - you can integrate this logic into any screen
 */
export const TripControlExample = () => {
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
    <View style={styles.container}>
      <Text style={styles.title}>Trip GPS Control</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>
            Active Trip: {activeTrip ? `#${activeTrip.tripId}` : "None"}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>
            Running: {isRunning ? "🟢 Yes" : "🔴 No"}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>
            GPS Tracking: {isTracking ? "📍 Active" : "📍 Inactive"}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.startButton]}
          onPress={handleStartTrip}
          disabled={isTracking}
        >
          <Text style={styles.buttonText}>Start Trip Tracking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={handleStopTrip}
          disabled={!isTracking}
        >
          <Text style={styles.buttonText}>Stop Trip Tracking</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>How it works:</Text>
        <Text style={styles.infoText}>
          • Start Trip Tracking sets the active trip{"\n"}• GPS automatically
          starts when trip status is "RUNNING"{"\n"}• GPS sends location every 5
          seconds via WebSocket{"\n"}• GPS stops when trip ends or status
          changes{"\n"}• Check console logs for detailed tracking info
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#D83E3E",
  },
  statusContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  statusRow: {
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  stopButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  infoContainer: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1976d2",
  },
  infoText: {
    fontSize: 12,
    color: "#1976d2",
    lineHeight: 18,
  },
});
