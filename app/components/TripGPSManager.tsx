import { useEffect } from "react";
import { useTripContext } from "../context/TripContext";
import { useTripGPS } from "../hooks/useTripGPS";

export const TripGPSManager = () => {
  const { activeTrip, isRunning } = useTripContext();

  const { isTracking, hasLocationPermission, lastGPSUpdate, connectionStatus } =
    useTripGPS(activeTrip?.tripId || null, isRunning, {
      interval: 5000, // 5 seconds
    });

  // Log GPS manager status changes
  useEffect(() => {
    console.log("[TripGPSManager] Status update:", {
      activeTrip: activeTrip?.tripId || null,
      isRunning,
      isTracking,
      hasLocationPermission,
      connectionStatus,
      lastUpdate: lastGPSUpdate?.toISOString(),
    });
  }, [
    activeTrip?.tripId,
    isRunning,
    isTracking,
    hasLocationPermission,
    connectionStatus,
    lastGPSUpdate,
  ]);

  // Log when GPS tracking starts/stops
  useEffect(() => {
    if (isTracking && activeTrip) {
      console.log(
        `[TripGPSManager] 🟢 GPS tracking STARTED for trip ${activeTrip.tripId} (${activeTrip.routeName})`,
      );
    } else if (!isTracking && activeTrip) {
      console.log(
        `[TripGPSManager] 🔴 GPS tracking STOPPED for trip ${activeTrip.tripId}`,
      );
    }
  }, [isTracking, activeTrip?.tripId]);

  // Log location permission issues
  useEffect(() => {
    if (!hasLocationPermission && activeTrip && isRunning) {
      console.warn(
        "[TripGPSManager] ⚠️ Location permission denied - GPS tracking disabled",
      );
    }
  }, [hasLocationPermission, activeTrip, isRunning]);

  // Log WebSocket connection issues
  useEffect(() => {
    if (isTracking && !connectionStatus) {
      console.error(
        "[TripGPSManager] ❌ WebSocket disconnected during GPS tracking",
      );
    } else if (isTracking && connectionStatus) {
      console.log("[TripGPSManager] ✅ WebSocket connected for GPS tracking");
    }
  }, [isTracking, connectionStatus]);

  // This component has no UI - it only manages GPS lifecycle
  return null;
};
