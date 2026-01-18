# GPS Tracking System Installation Guide

## Required Dependencies

Run the following commands to install the required packages:

```bash
# Core dependencies for GPS tracking
npm install expo-location

# WebSocket dependencies (choose one)
# Option 1: Using built-in WebSocket (recommended for React Native)
# No additional installation needed - uses native WebSocket

# Option 2: If you prefer STOMP protocol
# npm install @stomp/stompjs ws
# npm install --save-dev @types/ws
```

## Expo Configuration

Add location permissions to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "This app needs access to location to track GPS during trips.",
          "locationAlwaysPermission": "This app needs access to location to track GPS during trips.",
          "locationWhenInUsePermission": "This app needs access to location to track GPS during trips.",
          "isIosBackgroundLocationEnabled": true,
          "isAndroidBackgroundLocationEnabled": true
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "NSLocationAlwaysAndWhenInUseUsageDescription": "This app needs access to location to track GPS during trips.",
        "NSLocationWhenInUseUsageDescription": "This app needs access to location to track GPS during trips.",
        "UIBackgroundModes": ["location"]
      }
    },
    "android": {
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION"
      ]
    }
  }
}
```

## Backend WebSocket Configuration

Make sure your Spring Boot backend has WebSocket configured:

1. **WebSocket Endpoint**: `/ws`
2. **STOMP Destination**: `/app/gps/update`
3. **Expected Payload**:

```json
{
  "tripId": number,
  "latitude": number,
  "longitude": number,
  "speed": number,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Usage Instructions

### 1. Integration is Automatic

The GPS system is already integrated into your app through the root layout:

- `TripProvider` manages active trip state
- `TripGPSManager` handles GPS lifecycle automatically
- No UI components needed

### 2. Starting GPS Tracking

GPS tracking starts automatically when:

- A trip status is updated to "RUNNING"
- The trip is set as active in TripContext

### 3. From Route Management Screen

The route management screen now automatically:

- Updates the active trip when status changes
- Starts GPS tracking when trip status becomes "RUNNING"
- Stops GPS tracking when trip ends or status changes away from "RUNNING"

### 4. Manual Control (Optional)

If you need manual control in other screens:

```typescript
import { useTripManager } from './hooks/useTripManager';

const SomeScreen = () => {
  const { startTripTracking, stopTripTracking, isRunning } = useTripManager();

  const handleStartTrip = async () => {
    await startTripTracking(tripId);
  };

  const handleStopTrip = () => {
    stopTripTracking();
  };

  return (
    // Your UI here
  );
};
```

## Monitoring and Debugging

### Console Logs

The system provides detailed console logging:

- `[TripContext]` - Trip lifecycle events
- `[GPS]` - Location and permission events
- `[WebSocket]` - Connection status and data transmission
- `[TripGPSManager]` - Overall system status

### Key Log Messages to Watch:

- `🟢 GPS tracking STARTED for trip X` - GPS successfully started
- `🔴 GPS tracking STOPPED for trip X` - GPS stopped
- `⚠️ Location permission denied` - Permission issues
- `❌ WebSocket disconnected` - Connection problems
- `✅ WebSocket connected for GPS tracking` - Connection restored

## Architecture Overview

```
RootLayout
├── TripProvider (manages active trip state)
│   ├── TripGPSManager (handles GPS lifecycle)
│   │   └── useTripGPS (GPS tracking logic)
│   │       └── WebSocketService (sends GPS data)
│   └── Your App Screens
│       └── useTripManager (control trip from screens)
```

## Troubleshooting

### GPS Not Starting

1. Check location permissions in device settings
2. Verify trip status is "RUNNING"
3. Check console logs for error messages

### WebSocket Connection Issues

1. Verify backend WebSocket endpoint is running
2. Check network connectivity
3. Ensure correct WebSocket URL in API config

### Background Location (iOS)

1. Ensure `isIosBackgroundLocationEnabled: true` in app.json
2. Test on physical device (simulator has limitations)
3. Check iOS background app refresh settings

## Performance Considerations

- GPS updates every 5 seconds (configurable)
- WebSocket auto-reconnects on failure
- Automatic cleanup when trip stops
- Minimal battery impact with high accuracy GPS
