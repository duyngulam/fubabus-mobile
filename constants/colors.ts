/**
 * Core Color Palette for FubaBus Mobile App
 * Supports both Light and Dark modes
 */

// 🎨 Primary Colors
export const COLORS = {
  // Brand Colors
  primary: '#D83E3E',
  primaryDark: '#8B1A1A',
  
  // Secondary Colors
  secondary: '#F5EFE1',
  secondaryDark: '#ECDDC0',
  
  // Basic Colors
  black: '#000000',
  white: '#FFFFFF',
  
  // Success/Error/Warning
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Transparent variants
  transparent: 'transparent',
  
  // Status colors for trips
  status: {
    waiting: '#F59E0B',    // Orange
    running: '#22C55E',    // Green
    completed: '#6B7280',  // Gray
    cancelled: '#EF4444',  // Red
  }
} as const;

// 🌫️ Gray Scale Palette
export const GRAY = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
} as const;

// 🌞 Light Theme Colors
export const LIGHT_COLORS = {
  // Background
  background: COLORS.white,
  backgroundSecondary: GRAY[50],
  surface: COLORS.white,
  card: COLORS.secondary,
  
  // Text
  text: GRAY[900],
  textSecondary: GRAY[600],
  textTertiary: GRAY[500],
  textInverse: COLORS.white,
  
  // Primary Actions
  primary: COLORS.primary,
  primaryText: COLORS.white,
  
  // Secondary Actions
  secondary: COLORS.secondary,
  secondaryText: COLORS.primary,
  
  // Borders & Dividers
  border: GRAY[200],
  divider: GRAY[200],
  
  // States
  disabled: GRAY[300],
  disabledText: GRAY[500],
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Input
  inputBackground: COLORS.white,
  inputBorder: GRAY[300],
  inputBorderFocus: COLORS.primary,
  placeholder: GRAY[400],
  
  // Shadow
  shadowColor: COLORS.black,
  
  // Status & Feedback
  success: COLORS.success,
  error: COLORS.error,
  warning: COLORS.warning,
  info: COLORS.info,
  
  // Status
  ...COLORS.status,
} as const;

// 🌙 Dark Theme Colors
export const DARK_COLORS = {
  // Background
  background: GRAY[900],
  backgroundSecondary: GRAY[800],
  surface: GRAY[800],
  card: GRAY[800],
  
  // Text
  text: COLORS.white,
  textSecondary: GRAY[400],
  textTertiary: GRAY[500],
  textInverse: GRAY[900],
  
  // Primary Actions
  primary: COLORS.primary,
  primaryText: COLORS.white,
  
  // Secondary Actions
  secondary: GRAY[700],
  secondaryText: COLORS.white,
  
  // Borders & Dividers
  border: GRAY[700],
  divider: GRAY[700],
  
  // States
  disabled: GRAY[700],
  disabledText: GRAY[500],
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Input
  inputBackground: GRAY[800],
  inputBorder: GRAY[700],
  inputBorderFocus: COLORS.primary,
  placeholder: GRAY[400],
  
  // Shadow
  shadowColor: COLORS.black,
  
  // Status & Feedback
  success: COLORS.success,
  error: COLORS.error,
  warning: COLORS.warning,
  info: COLORS.info,
  
  // Status
  ...COLORS.status,
} as const;

export type ColorScheme = typeof LIGHT_COLORS;
