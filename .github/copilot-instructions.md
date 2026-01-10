# fuba-mobile - Expo React Native Mobile App Instructions

## Architecture Overview

fuba-mobile is an **Expo + React Native + TypeScript** mobile app with:
- **Expo Router** for file-based navigation
- **Context API** for authentication state management
- **TypeScript** for type safety
- **Tab-based navigation** for main app screens
- **Authentication flow** with JWT tokens
- **API integration** with Spring Boot backend (FubaBusBE)

## Project Structure

```
app/
├── _layout.tsx            # Root layout (AuthProvider wrapper)
├── modal.tsx              # Modal screens
├── (auth)/                # Auth group (login/signup)
│   └── SignIn.tsx         # Login screen
├── (tabs)/                # Tab navigator group
│   ├── _layout.tsx        # Tab bar configuration
│   ├── index.tsx          # Home tab
│   └── explore.tsx        # Explore tab
├── config/
│   └── api.ts             # API configuration (base URL, endpoints)
├── context/
│   └── AuthContext.tsx    # Authentication context provider
├── hooks/
│   └── useAuth.ts         # Auth hook (wraps AuthContext)
├── services/
│   └── authService.ts     # API calls for authentication
└── types/
    └── auth.ts            # TypeScript types for auth

assets/
└── images/                # Static images

components/
├── ui/                    # Reusable UI components
│   ├── collapsible.tsx
│   ├── icon-symbol.tsx
│   └── [other-ui]/
└── [feature-components]   # Feature-specific components

constants/
└── theme.ts               # App-wide theme constants
```

## Critical Patterns

### 1. Navigation (Expo Router)
- **File-based routing**: File structure = navigation structure
- **Groups**: `(auth)`, `(tabs)` - parentheses create layout groups without route segments
- **Layouts**: `_layout.tsx` defines navigation structure for children
- **Stack vs. Tabs**: Stack for hierarchical, Tabs for parallel navigation

```typescript
// app/_layout.tsx - Root layout with AuthProvider
export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}

// app/(tabs)/_layout.tsx - Tab navigation
export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
    </Tabs>
  );
}
```

### 2. Authentication Flow
- **AuthContext**: Manages auth state (user, token, isLoading)
- **useAuth hook**: Provides clean API for components
- **Token storage**: Uses Expo SecureStore (or AsyncStorage fallback)
- **Protected routes**: Check `isAuthenticated` in layouts/screens
- **Login flow**: SignIn → authService.login() → store token → navigate to tabs

```typescript
// app/context/AuthContext.tsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setToken(response.accessToken);
    setUser(response.user);
    await SecureStore.setItemAsync('token', response.accessToken);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// app/hooks/useAuth.ts
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be inside AuthProvider');
  return context;
};
```

### 3. API Integration
- **Centralized config**: `app/config/api.ts` for base URL and endpoints
- **Service layer**: `app/services/` for API calls (e.g., `authService.ts`)
- **Type safety**: TypeScript types in `app/types/`
- **Backend**: FubaBusBE at `http://localhost:5230` (use IP for physical devices)
- **Headers**: `Authorization: Bearer <token>` for authenticated requests

```typescript
// app/config/api.ts
export const API_BASE_URL = 'http://localhost:5230';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  USER: {
    PROFILE: '/user/profile',
  },
} as const;

// app/services/authService.ts
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },
};
```

### 4. Component Patterns
- **Functional components**: Use hooks (no class components)
- **TypeScript**: Type all props with `interface` or `type`
- **Styles**: Use `StyleSheet.create()` for performance
- **Theming**: Colors/spacing from `constants/theme.ts`
- **UI components**: Reusable components in `components/ui/`

```typescript
// components/ui/Button.tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, styles[variant]]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
  },
  primary: { backgroundColor: '#007AFF' },
  secondary: { backgroundColor: '#8E8E93' },
  text: { color: '#FFFFFF', fontWeight: '600' },
});
```

### 5. State Management
- **Context API**: For global state (auth, theme, etc.)
- **useState**: For local component state
- **useEffect**: For side effects (API calls, subscriptions)
- **No Redux**: Keep it simple with Context + hooks

```typescript
// Example: Trip list with local state
export default function TripsScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/trips`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTrips(data.data);
      setLoading(false);
    };
    fetchTrips();
  }, [token]);

  return <FlatList data={trips} renderItem={({ item }) => <TripCard trip={item} />} />;
}
```

### 6. TypeScript Conventions
- **Strict mode**: Enabled in `tsconfig.json`
- **Types location**: 
  - Feature types: `app/types/[feature].ts`
  - Component props: Inline or separate interface
- **API types**: Match backend response structure
- **Enums**: Use `const` objects or string unions

```typescript
// app/types/auth.ts
export interface User {
  userId: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'USER' | 'DRIVER' | 'STAFF';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    userId: string;
    email: string;
    fullName: string;
    role: string;
  };
}
```

## Key Features

### Authentication
- JWT token-based authentication
- Secure token storage (Expo SecureStore)
- Auto-refresh tokens on expiry (implement in interceptor)
- Protected routes (check auth state before rendering)

### Navigation
- Tab navigation for main app screens
- Stack navigation for hierarchical flows (e.g., Trip → TripDetail → Booking)
- Modal screens for overlays (e.g., filters, confirmations)

### API Integration
- RESTful API calls to FubaBusBE
- Centralized error handling
- Loading states for async operations
- Retry logic for failed requests

## Development Workflow

### Running the App
```bash
npm install              # Install dependencies
npx expo start           # Start development server

# Run on:
# - Android: Press 'a' in terminal or scan QR with Expo Go
# - iOS: Press 'i' in terminal or scan QR with Camera app
# - Web: Press 'w' in terminal
```

### Environment Setup
- **Physical devices**: Change `API_BASE_URL` to your computer's IP (not `localhost`)
  - Example: `http://192.168.1.100:5230`
- **Android Emulator**: Use `http://10.0.2.2:5230` (alias for host machine)
- **iOS Simulator**: Can use `http://localhost:5230`

### Building
```bash
npx expo prebuild        # Generate native projects
eas build --platform android   # Build APK/AAB with EAS
eas build --platform ios       # Build IPA with EAS
```

## Common Pitfalls

1. **API URL on physical devices**: Use IP address, not `localhost`
2. **Navigation after auth**: Use `router.replace()` not `router.push()` to prevent back navigation
3. **Token storage**: Use SecureStore for tokens (more secure than AsyncStorage)
4. **Image imports**: Use `require()` for static images, `{ uri: 'url' }` for remote
5. **Keyboard handling**: Use `KeyboardAvoidingView` for forms
6. **FlatList performance**: Add `keyExtractor` and optimize `renderItem`
7. **Safe areas**: Use `SafeAreaView` on iOS to avoid notch/status bar overlap
8. **Type imports**: Use `import type { ... }` for type-only imports

## Integration Points

- **Backend API**: FubaBusBE at `localhost:5230` (or IP for devices)
- **Shared types**: Keep in sync with backend response structures
- **Web counterpart**: FutaBusFE (Next.js) - shares same backend
- **External libraries**:
  - `expo-router` - File-based navigation
  - `expo-secure-store` - Secure token storage
  - `@react-native-community/datetimepicker` - Date/time inputs (if needed)

## Reference Files

- `app/_layout.tsx` - Root layout with auth provider
- `app/(auth)/SignIn.tsx` - Login screen example
- `app/context/AuthContext.tsx` - Context API pattern
- `app/services/authService.ts` - Service layer pattern
- `app/config/api.ts` - Centralized API configuration
- `docs/API_SETUP.md` - API integration documentation

## Testing

- **Expo Go**: Quick testing without builds
- **Development builds**: For native modules (more like production)
- **EAS Build**: Cloud builds for distribution

## Next Steps

When implementing new features:
1. Define types in `app/types/[feature].ts`
2. Create service in `app/services/[feature]Service.ts`
3. Build UI in `app/(tabs)/[feature].tsx` or new screen
4. Add to navigation if needed
5. Handle loading/error states
// Primary colors (for CTAs, important actions)
COLORS.primary        // #D83E3E - Main brand red
COLORS.primaryDark    // #8B1A1A - Darker shade for hover states

// Secondary colors (for complementary elements)
COLORS.secondary      // #F5EFE1 - Light beige/cream
COLORS.secondaryDark  // #ECDDC0 - Darker beige

// Background
COLORS.background     // #EAEAEA - Main background color
