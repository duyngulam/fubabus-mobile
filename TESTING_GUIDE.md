# Complete GPS Tracking Setup & Testing Guide

## 📋 Prerequisites

Make sure you have:

- ✅ Expo CLI installed (`npm install -g @expo/cli`)
- ✅ Backend server running on `localhost:5230`
- ✅ Physical device or emulator for testing

## 🔧 Step 1: Install Required Dependencies

```bash
cd d:\KTMP\HK5\SE100\fubabus-mobile
npm install expo-location
```

## 📱 Step 2: Configure App Permissions

Update your `app.json` to include location permissions:

```json
{
  "expo": {
    "name": "fubabus-mobile",
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "This app needs access to location to track bus routes during trips.",
          "locationAlwaysPermission": "This app needs access to location in the background to track bus routes during trips.",
          "locationWhenInUsePermission": "This app needs access to location when the app is open to track bus routes.",
          "isIosBackgroundLocationEnabled": true,
          "isAndroidBackgroundLocationEnabled": true
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "NSLocationAlwaysAndWhenInUseUsageDescription": "This app needs access to location to track bus routes during trips.",
        "NSLocationWhenInUseUsageDescription": "This app needs access to location when the app is open to track bus routes.",
        "UIBackgroundModes": ["location"]
      }
    },
    "android": {
      "permissions": [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_BACKGROUND_LOCATION"
      ]
    }
  }
}
```

## 🛜 Step 3: Backend WebSocket Setup

Ensure your backend has WebSocket endpoint configured:

**Endpoint:** `ws://localhost:5230/ws`  
**STOMP Destination:** `/app/gps/update`

Expected GPS payload:

```json
{
  "tripId": 123,
  "driverId": "driver123",
  "latitude": 10.762622,
  "longitude": 106.660172,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🚀 Step 4: Start the Development Server

```bash
npx expo start
```

Choose your testing platform:

- **Android Emulator:** Press 'a'
- **iOS Simulator:** Press 'i'
- **Physical Device:** Scan QR code with Expo Go

## 📍 Step 5: Testing GPS Tracking

### 5.1 Basic Testing

1. **Open the App:** Navigate to Home tab
2. **Find GPS Demo:** Scroll down to see "Trip GPS Control" section
3. **Check Status:** You should see:
   - Active Trip: None
   - Running: 🔴 No
   - GPS Tracking: 📍 Inactive

### 5.2 Test Trip Tracking

1. **Start Tracking:** Tap "Start Trip Tracking"
   - This sets trip ID 123 as active trip
   - GPS will start if trip status is "RUNNING"

2. **Monitor Console:** Check for logs:

   ```
   [TripGPS] 🔄 GPS tracking started for trip 123
   [WebSocket] 🔗 Connected to WebSocket
   [TripGPS] 📍 GPS location update: {...}
   ```

3. **Stop Tracking:** Tap "Stop Trip Tracking"
   - GPS stops automatically
   - WebSocket disconnects

### 5.3 Test Automatic GPS Lifecycle

The GPS system automatically:

- ✅ **Starts** when trip status becomes "RUNNING"
- ✅ **Stops** when trip status changes to "COMPLETED", "CANCELLED", or "FINISHED"
- ✅ **Reconnects** WebSocket if connection drops
- ✅ **Handles** location permission requests

### 5.4 Test Real Trip Integration

1. **Go to Route Management:**
   - Select a trip from list
   - Tap "Quản lý hành trình"

2. **Start Trip:**
   - Change status from "WAITING" → "RUNNING"
   - GPS should start automatically

3. **Monitor Tracking:**
   - Check console for GPS updates every 5 seconds
   - Verify WebSocket messages being sent

## 🔍 Step 6: Debugging

### Common Issues & Solutions

**🚫 "Location permission denied"**

```
Solution: Grant location permissions in device settings
- iOS: Settings > Privacy & Security > Location Services > Expo Go
- Android: Settings > Apps > Expo Go > Permissions > Location
```

**🚫 "WebSocket connection failed"**

```
Solution: Check backend server
- Ensure server is running on localhost:5230
- Verify WebSocket endpoint /ws is available
- Check network connectivity
```

**🚫 "GPS not starting automatically"**

```
Solution: Check trip status
- Trip must be in "RUNNING" status
- Active trip must be set in TripContext
- Check console logs for error messages
```

### Debug Console Logs

Monitor these log prefixes:

- `[TripGPS]` - GPS tracking events
- `[WebSocket]` - WebSocket connection status
- `[TripContext]` - Active trip state changes
- `[TripManager]` - Trip lifecycle control

### Network Configuration

**For Physical Devices:**
Update API base URL in `app/config/api.ts`:

```typescript
export const API_BASE_URL = "http://192.168.1.100:5230"; // Your computer's IP
```

**For Android Emulator:**

```typescript
export const API_BASE_URL = "http://10.0.2.2:5230"; // Host machine alias
```

## 📊 Step 7: Production Checklist

### Before Production Release:

- [ ] **Location Permissions:** Test on both iOS and Android
- [ ] **Background Location:** Verify GPS works when app is backgrounded
- [ ] **Battery Optimization:** Test GPS efficiency and battery usage
- [ ] **WebSocket Reliability:** Test reconnection on network changes
- [ ] **Error Handling:** Test behavior with no network/GPS
- [ ] **Memory Leaks:** Monitor memory usage during long trips
- [ ] **Data Usage:** Monitor WebSocket data consumption

### Production Configuration:

1. **Update API URLs:** Change from localhost to production server
2. **WebSocket SSL:** Use `wss://` for secure WebSocket connections
3. **Location Accuracy:** Fine-tune GPS accuracy vs battery usage
4. **Update Frequency:** Adjust GPS update interval (currently 5 seconds)
5. **Error Reporting:** Add crash analytics for production debugging

## 🎯 Architecture Overview

```
App Architecture:
├── TripContext (Global trip state)
├── TripGPSManager (GPS lifecycle)
├── useTripGPS (Location tracking)
├── websocketService (Real-time data)
├── useTripManager (Screen integration)
└── Components (UI integration)

Flow:
1. User starts trip → TripContext.startTrip()
2. Trip status "RUNNING" → useTripGPS.startTracking()
3. GPS location → websocketService.sendGPS()
4. Backend receives → Real-time trip monitoring
5. Trip ends → Auto cleanup all resources
```

## 🆘 Support

If you encounter issues:

1. **Check Console Logs:** Look for error messages with prefixes above
2. **Verify Permissions:** Ensure location permissions are granted
3. **Test Network:** Verify backend server connectivity
4. **Restart App:** Sometimes helps with permission or connection issues

## 🎉 Success Indicators

You'll know everything is working when you see:

✅ **Console Logs:**

```
[TripContext] 🚀 Trip started: 123
[TripGPS] 🔄 GPS tracking started for trip 123
[WebSocket] 🔗 Connected to WebSocket
[TripGPS] 📍 GPS location update sent
```

✅ **UI Status:**

- Active Trip: #123
- Running: 🟢 Yes
- GPS Tracking: 📍 Active

✅ **Backend Receiving:** GPS data every 5 seconds at `/app/gps/update`

---

**Happy GPS Tracking! 🚌📍**
