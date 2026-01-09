/**
 * Auth Service
 * Handles all authentication-related API calls
 */

import { API_ENDPOINTS, buildUrl, REQUEST_TIMEOUT } from '../config/api';
import { ApiError, LoginRequest, LoginResponse } from '../types/auth';

/**
 * Login user with email/phone and password
 * @param credentials - Login credentials
 * @returns Promise with login response
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(buildUrl(API_ENDPOINTS.AUTH.LOGIN), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response
    const data = await response.json();

    if (!response.ok) {
      // Handle error response
      const error: ApiError = {
        message: data.message || 'Đăng nhập thất bại',
        code: data.code,
        errors: data.errors,
      };
      throw error;
    }

    // Return successful response
    // Adjust based on your backend response structure
    return data as LoginResponse;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw { message: 'Request timeout - vui lòng thử lại' } as ApiError;
    }
    
    if (error.message) {
      throw error as ApiError;
    }

    throw { message: 'Không thể kết nối đến server' } as ApiError;
  }
};

/**
 * Register new user
 * @param userData - Registration data
 */
export const register = async (userData: any): Promise<any> => {
  // TODO: Implement registration
  throw new Error('Not implemented');
};

/**
 * Logout user
 * @param token - Auth token
 */
export const logout = async (token: string): Promise<void> => {
  // TODO: Implement logout API call if needed
  // Some backends require server-side logout
};

/**
 * Refresh token
 * @param refreshToken - Refresh token
 */
export const refreshToken = async (refreshToken: string): Promise<LoginResponse> => {
  // TODO: Implement token refresh
  throw new Error('Not implemented');
};
