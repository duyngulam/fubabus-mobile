# API Configuration Guide

## Cấu trúc thư mục

```
app/
├── config/
│   └── api.ts          # Cấu hình API endpoints & base URL
├── services/
│   └── authService.ts  # Auth API calls
├── types/
│   └── auth.ts         # TypeScript types
└── context/
    └── AuthContext.tsx # Auth state management
```

## Thay đổi môi trường (Dev/Prod)

### Cách 1: Thay đổi trực tiếp trong `app/config/api.ts`

```ts
// Development
export const API_BASE_URL = 'http://localhost:5230';

// Production
export const API_BASE_URL = 'https://api.futa-bus.com';

// Staging
export const API_BASE_URL = 'https://staging-api.futa-bus.com';
```

### Cách 2: Dùng environment variables (khuyến nghị)

Cài `expo-constants`:
```bash
expo install expo-constants
```

Tạo file `app.config.js`:
```js
export default {
  extra: {
    apiUrl: process.env.API_URL || 'http://localhost:5230',
  },
};
```

Sử dụng trong `api.ts`:
```ts
import Constants from 'expo-constants';

export const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5230';
```

## Thêm endpoints mới

### 1. Thêm vào `app/config/api.ts`

```ts
export const API_ENDPOINTS = {
  AUTH: { ... },
  TRIP: {
    LIST: '/trips',
    DETAIL: '/trips/:id',
    BOOK: '/trips/:id/book',
  },
  TICKET: {
    MY_TICKETS: '/tickets/my',
    CANCEL: '/tickets/:id/cancel',
  },
};
```

### 2. Tạo service file tương ứng

Tạo `app/services/tripService.ts`:
```ts
import { API_ENDPOINTS, buildUrl } from '@/config/api';

export const getTrips = async (filters: any) => {
  const response = await fetch(buildUrl(API_ENDPOINTS.TRIP.LIST), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
};
```

### 3. Tạo types trong `app/types/`

Tạo `app/types/trip.ts`:
```ts
export interface Trip {
  id: string;
  from: string;
  to: string;
  // ... more fields
}
```

## Xử lý lỗi chung

Tạo `app/services/apiClient.ts` để tái sử dụng:
```ts
export const apiClient = async (url: string, options: RequestInit) => {
  const token = await AsyncStorage.getItem('userToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw { message: data.message || 'API Error', code: data.code };
  }

  return data;
};
```

## Authentication header

Nếu API yêu cầu Bearer token cho các request khác:

```ts
const response = await fetch(url, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`,
  },
});
```

## Testing với mock data

Để test không cần backend, thêm flag mock trong `api.ts`:
```ts
export const USE_MOCK = __DEV__ && false; // Set true to use mock

// In service:
if (USE_MOCK) {
  return mockData;
}
// real API call...
```

## Timeout và retry logic

Đã có timeout trong `authService.ts`. Để thêm retry:
```ts
const retryFetch = async (url: string, options: any, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
};
```

## Kết nối với localhost từ device

- **iOS Simulator**: `http://localhost:5230` hoạt động
- **Android Emulator**: dùng `http://10.0.2.2:5230`
- **Physical device**: dùng IP máy tính, ví dụ `http://192.168.1.100:5230`

Để tự động detect:
```ts
import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5230';
    }
    return 'http://localhost:5230';
  }
  return 'https://api.futa-bus.com';
};

export const API_BASE_URL = getBaseUrl();
```
