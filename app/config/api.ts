/**
 * API Configuration
 * Centralized API endpoints and base URL management
 */

// Base API URL - change this for different environments
export const API_BASE_URL = 'http://localhost:5230';

// API Endpointsr

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },

  USER: {
    // Profile
    PROFILE: '/users/profile',                 // GET
    UPDATE_PROFILE: '/users/profile',           // PUT
    CHANGE_PASSWORD: '/users/profile/password', // PUT

    // Avatar
    UPLOAD_AVATAR: '/users/profile/avatar',     // POST (multipart)
    DELETE_AVATAR: '/users/profile/avatar',     // DELETE
  },
  // Example: TRIP, TICKET, etc.
} as const;

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 10000;

// Helper to build full URL
export const buildUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
