# 🎨 FubaBus Mobile - Theme System Guide

## 📋 Overview

This guide covers the complete theming system implementation for the FubaBus mobile app, providing consistent colors, typography, and components across Light and Dark modes.

## 🎯 Theme System Architecture

### 📁 File Structure

```
constants/
├── colors.ts          # Core color palette & light/dark themes
├── theme.ts           # Typography, spacing, shadows, complete themes

context/
├── ThemeContext.tsx   # Theme provider & useTheme hook

components/ui/
├── ThemedButton.tsx   # Themed button component
├── ThemedCard.tsx     # Themed card component
├── ThemedTextInput.tsx # Themed input component
```

## 🌈 Color System

### Primary Colors

- **Primary**: `#D83E3E` (Brand red)
- **Primary Dark**: `#8B1A1A` (Darker variant)
- **Secondary**: `#F5EFE1` (Light cream)
- **Secondary Dark**: `#ECDDC0` (Darker cream)

### Status Colors

- **Success**: `#22C55E` (Green)
- **Error**: `#EF4444` (Red)
- **Warning**: `#F59E0B` (Orange)
- **Info**: `#3B82F6` (Blue)

### Trip Status Colors

- **Waiting**: `#F59E0B` (Orange)
- **Running**: `#22C55E` (Green)
- **Completed**: `#6B7280` (Gray)
- **Cancelled**: `#EF4444` (Red)

## 🔧 Usage Examples

### 1. Using Theme Hook

```tsx
import { useTheme } from "../context/ThemeContext";

const MyComponent = () => {
  const { theme, isDark, colorScheme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Hello World</Text>
    </View>
  );
};
```

### 2. Themed Components

#### ThemedButton

```tsx
import { ThemedButton } from '../components/ui/ThemedButton';

// Primary button
<ThemedButton
  title="Start Trip"
  onPress={handleStart}
  variant="primary"
  size="lg"
/>

// Secondary button
<ThemedButton
  title="Cancel"
  onPress={handleCancel}
  variant="secondary"
  size="base"
/>

// Outline button
<ThemedButton
  title="More Info"
  onPress={handleInfo}
  variant="outline"
  disabled={loading}
  loading={loading}
/>
```

#### ThemedCard

```tsx
import { ThemedCard } from '../components/ui/ThemedCard';

// Default card
<ThemedCard>
  <Text>Card content</Text>
</ThemedCard>

// Elevated card with shadow
<ThemedCard variant="elevated" padding={6}>
  <Text>Elevated content</Text>
</ThemedCard>

// Surface card
<ThemedCard variant="surface" padding={3}>
  <Text>Surface content</Text>
</ThemedCard>
```

#### ThemedTextInput

```tsx
import { ThemedTextInput } from "../components/ui/ThemedTextInput";

<ThemedTextInput
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
/>;
```

## 🎨 Design Guidelines

### Component Colors

- **Primary Actions**: Use `theme.colors.primary`
- **Text**: Use `theme.colors.text` for main text, `theme.colors.textSecondary` for secondary
- **Backgrounds**: Use `theme.colors.background`, `theme.colors.card`, `theme.colors.surface`
- **Borders**: Use `theme.colors.border` or `theme.colors.divider`
- **Status**: Use `theme.colors.success/error/warning/info`

### Typography

```tsx
// Large title
<Text style={{
  fontSize: theme.typography.fontSize['2xl'],
  fontWeight: theme.typography.fontWeight.bold,
  color: theme.colors.text,
}}>Title</Text>

// Body text
<Text style={{
  fontSize: theme.typography.fontSize.base,
  lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.base,
  color: theme.colors.textSecondary,
}}>Body content</Text>
```

### Spacing

```tsx
// Using theme spacing
<View style={{
  padding: theme.spacing[4],        // 16px
  marginBottom: theme.spacing[6],   // 24px
  gap: theme.spacing[2],           // 8px
}}>
```

### Shadows & Elevation

```tsx
// Card with shadow
<View style={{
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  ...theme.shadows.base,
  shadowColor: theme.colors.shadowColor,
}}>
```

## 🌙 Dark Mode Implementation

### Automatic Detection

The theme system automatically detects system color scheme:

```tsx
// In _layout.tsx
<ThemeProvider>
  <NavigationThemeProvider
    value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
  >
    <YourApp />
  </NavigationThemeProvider>
</ThemeProvider>
```

### Manual Override

```tsx
// Force light mode
<ThemeProvider forcedTheme="light">
  <YourApp />
</ThemeProvider>

// Force dark mode
<ThemeProvider forcedTheme="dark">
  <YourApp />
</ThemeProvider>
```

## ✨ Migration Guide

### Before (Hard-coded colors)

```tsx
// ❌ Old way - hard-coded colors
<View style={{ backgroundColor: "#f5f5f5" }}>
  <Text style={{ color: "#333" }}>Text</Text>
  <TouchableOpacity style={{ backgroundColor: "#D83E3E" }}>
    <Text style={{ color: "#fff" }}>Button</Text>
  </TouchableOpacity>
</View>
```

### After (Themed)

```tsx
// ✅ New way - using theme
const { theme } = useTheme();

<View style={{ backgroundColor: theme.colors.backgroundSecondary }}>
  <Text style={{ color: theme.colors.text }}>Text</Text>
  <ThemedButton title="Button" variant="primary" onPress={handlePress} />
</View>;
```

## 🚀 Examples in App

### Home Screen (Updated)

```tsx
// app/(tabs)/index.tsx
export default function TripTodayScreen() {
  const { theme } = useTheme();

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        {/* Header content with theme colors */}
      </View>

      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={{ color: theme.colors.textSecondary }}>No trips</Text>
    </ThemedView>
  );
}
```

### Trip Item (Updated)

```tsx
// components/trip/TripItem.tsx
export default function TripItem({ trip, onPress }) {
  const { theme } = useTheme();

  return (
    <Pressable
      style={[styles.container, { backgroundColor: theme.colors.card }]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            ...theme.shadows.base,
            shadowColor: theme.colors.shadowColor,
          },
        ]}
      >
        {/* Trip content with theme colors */}
      </View>
    </Pressable>
  );
}
```

## 🔍 Testing

### Light/Dark Mode Testing

1. **iOS**: Settings → Display & Brightness → Dark/Light
2. **Android**: Settings → Display → Dark theme
3. **Development**: Use device settings or force theme in `ThemeProvider`

### Color Accessibility

- All color combinations meet WCAG AA standards
- High contrast ratios for text readability
- Status colors are distinguishable in both modes

## 📱 Platform Considerations

### iOS

- Automatic status bar style adjustment
- Native navigation appearance
- System color integration

### Android

- Material Design compliance
- Edge-to-edge display support
- System UI theming

## 🎯 Best Practices

1. **Always use theme colors** - Never hard-code colors
2. **Use themed components** - Prefer ThemedButton over TouchableOpacity
3. **Consistent spacing** - Use theme.spacing values
4. **Typography hierarchy** - Follow theme.typography scale
5. **Test both modes** - Always verify light and dark appearance
6. **Semantic colors** - Use appropriate colors for status/actions

## 🔧 Extending the Theme

### Adding New Colors

```tsx
// In constants/colors.ts
export const COLORS = {
  // ...existing colors
  accent: "#FF6B6B",
  neutral: "#8E8E93",
};
```

### Custom Components

```tsx
import { useTheme } from "../context/ThemeContext";

export const MyThemedComponent = ({ children, ...props }) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.base,
        padding: theme.spacing[4],
      }}
    >
      {children}
    </View>
  );
};
```

This theming system ensures your FubaBus mobile app has a consistent, modern, and accessible design that works beautifully in both light and dark modes! 🎨✨
