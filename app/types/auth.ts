/**
 * Auth related TypeScript types
 */

// Login request matching backend DTO
export interface LoginRequest {
  emailOrPhone: string;
  password: string;
}

// Login response from backend
export interface LoginResponse {
  token: string;
  user: User;
  refreshToken?: string;
  expiresIn?: number;
}

// User object
export interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  avatar?: string;
}

// API error response
export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

// Generic API response wrapper (if backend uses ApiResponse pattern)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}
