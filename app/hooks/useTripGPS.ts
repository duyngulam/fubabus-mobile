import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { webSocketService, GPSPayload } from '../services/websocketService';

interface GPSOptions {
  interval?: number; // milliseconds
  accuracy?: Location.Accuracy;
}

export const useTripGPS = (
  tripId: number | null,
  isRunning: boolean,
  options: GPSOptions = {}
) => {
  const {
    interval = 5000, // 5 seconds default
    accuracy = Location.Accuracy.High,
  } = options;

  const [isTracking, setIsTracking] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [lastGPSUpdate, setLastGPSUpdate] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isInitializedRef = useRef(false);

  // Request location permission
  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      console.log('[GPS] Requesting location permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        console.log('[GPS] Location permission granted');
        setHasLocationPermission(true);
        return true;
      } else {
        console.warn('[GPS] Location permission denied');
        setHasLocationPermission(false);
        return false;
      }
    } catch (error) {
      console.error('[GPS] Error requesting location permission:', error);
      setHasLocationPermission(false);
      return false;
    }
  };

  // Get current location and send GPS data
  const sendGPSUpdate = async (): Promise<boolean> => {
    if (!tripId || !hasLocationPermission) {
      return false;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy,
      });

      const gpsPayload: GPSPayload = {
        tripId,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        speed: location.coords.speed || 0,
        timestamp: new Date().toISOString(),
      };

      const success = await webSocketService.sendGPS(gpsPayload);
      
      if (success) {
        setLastGPSUpdate(new Date());
        console.log('[GPS] GPS update sent successfully for trip:', tripId);
      } else {
        console.warn('[GPS] Failed to send GPS update for trip:', tripId);
      }

      return success;
    } catch (error) {
      console.error('[GPS] Error getting location or sending GPS:', error);
      return false;
    }
  };

  // Start GPS tracking
  const startGPSTracking = async () => {
    if (isTracking || !tripId || !isRunning) {
      return;
    }

    console.log('[GPS] Starting GPS tracking for trip:', tripId);

    // Request permission if needed
    const hasPermission = hasLocationPermission || await requestLocationPermission();
    if (!hasPermission) {
      console.error('[GPS] Cannot start tracking: no location permission');
      return;
    }

    // Connect to WebSocket
    try {
      await webSocketService.connect();
      setConnectionStatus(true);
      console.log('[GPS] WebSocket connected for GPS tracking');
    } catch (error) {
      console.error('[GPS] Failed to connect WebSocket:', error);
      setConnectionStatus(false);
      return;
    }

    // Start periodic GPS updates
    setIsTracking(true);
    
    // Send initial GPS update
    await sendGPSUpdate();
    
    // Set up interval for periodic updates
    intervalRef.current = setInterval(async () => {
      const status = webSocketService.getConnectionStatus();
      setConnectionStatus(status);
      
      if (status) {
        await sendGPSUpdate();
      } else {
        console.warn('[GPS] WebSocket disconnected, attempting to reconnect...');
        try {
          await webSocketService.connect();
          setConnectionStatus(true);
        } catch (error) {
          console.error('[GPS] Failed to reconnect WebSocket:', error);
        }
      }
    }, interval);

    console.log(`[GPS] GPS tracking started with ${interval}ms interval`);
  };

  // Stop GPS tracking
  const stopGPSTracking = () => {
    if (!isTracking) {
      return;
    }

    console.log('[GPS] Stopping GPS tracking for trip:', tripId);

    setIsTracking(false);
    
    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Disconnect WebSocket
    webSocketService.disconnect();
    setConnectionStatus(false);

    console.log('[GPS] GPS tracking stopped');
  };

  // Effect to handle trip state changes
  useEffect(() => {
    const shouldTrack = tripId && isRunning;
    
    console.log('[GPS] Trip state changed:', {
      tripId,
      isRunning,
      shouldTrack,
      currentlyTracking: isTracking,
    });

    if (shouldTrack && !isTracking) {
      startGPSTracking();
    } else if (!shouldTrack && isTracking) {
      stopGPSTracking();
    }

    // Cleanup on unmount or when tracking should stop
    return () => {
      if (isTracking && !shouldTrack) {
        stopGPSTracking();
      }
    };
  }, [tripId, isRunning, hasLocationPermission]);

  // Initialize permission check
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      requestLocationPermission();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopGPSTracking();
    };
  }, []);

  return {
    isTracking,
    hasLocationPermission,
    lastGPSUpdate,
    connectionStatus,
    requestLocationPermission,
    startGPSTracking,
    stopGPSTracking,
  };
};
