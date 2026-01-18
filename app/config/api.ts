/**
 * API Configuration
 * Centralized API endpoints and base URL management
 */

// Base API URL - change this for different environments
// export const API_BASE_URL = "http://192.168.2.9:5230";
export const API_BASE_URL = "http://192.168.1.20:5230";

// API Endpointsr

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },

  USER: {
    // Profile
    PROFILE: "/users/profile", // GET
    UPDATE_PROFILE: "/users/profile", // PUT
    CHANGE_PASSWORD: "/users/profile/password", // PUT

    // Avatar
    UPLOAD_AVATAR: "/users/profile/avatar", // POST (multipart)
    DELETE_AVATAR: "/users/profile/avatar", // DELETE
  },

  TRIP: {
    DRIVER_TRIPS: (driverId: number) => `/trips/driver/${driverId}`,
    PASSENGERS_ON_TRIP: (tripId: number) => `/trips/${tripId}/passengers`,
    COMPLETE_TRIP: (tripId: number) => `/trips/${tripId}/complete`,
    UPDATE_STATUS: (tripId: number) => `/trips/${tripId}/status`,
  },

  TICKET: {
    DETAIL: (ticketId: number) => `/tickets/${ticketId}`,
  },
  // Example: TRIP, TICKET, etc.
} as const;

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 10000;

// Helper to build full URL
export const buildUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
