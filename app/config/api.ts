/**
 * API Configuration
 * Centralized API endpoints and base URL management
 */

// Base API URL - change this for different environments
export const API_BASE_URL = 'http://192.168.2.19:5230';

// API Endpointsr

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  // Add more endpoint groups as needed
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
  },
  // Example: TRIP, TICKET, etc.
} as const;

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 10000;

// Helper to build full URL
export const buildUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
