/**
 * Auth Service
 * Handles all authentication-related API calls
 */

import { API_ENDPOINTS, buildUrl, REQUEST_TIMEOUT } from "../config/api";
import {
  ApiError,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types/auth";

/**
 * Login user with email/phone and password
 * @param credentials - Login credentials
 * @returns Promise with login response
 */
export const login = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  console.log("[AuthService] Login request:", {
    emailOrPhone: credentials.emailOrPhone,
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    console.log("[AuthService] Calling:", buildUrl(API_ENDPOINTS.AUTH.LOGIN));
    const response = await fetch(buildUrl(API_ENDPOINTS.AUTH.LOGIN), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log("[AuthService] Login response status:", response.status);

    // Parse response
    const data = await response.json();
    console.log("[AuthService] Login response:", {
      success: data.success,
      message: data.message,
    });

    if (!response.ok) {
      // Handle error response
      console.error("[AuthService] Login failed:", data.message);
      const error: ApiError = {
        message: data.message || "Đăng nhập thất bại",
        code: data.code,
        errors: data.errors,
      };
      throw error;
    }

    console.log("[AuthService] Login successful");
    // Return successful response
    return data as LoginResponse;
  } catch (error: any) {
    console.error("[AuthService] Login error:", error);
    if (error.name === "AbortError") {
      throw { message: "Request timeout - vui lòng thử lại" } as ApiError;
    }

    if (error.message) {
      throw error as ApiError;
    }

    throw { message: "Không thể kết nối đến server" } as ApiError;
  }
};

/**
 * Register new user
 * @param userData - Registration data
 */
export const register = async (
  userData: RegisterRequest,
): Promise<LoginResponse> => {
  console.log("[AuthService] Register request:", {
    email: userData.email,
    fullName: userData.fullName,
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    console.log(
      "[AuthService] Calling:",
      buildUrl(API_ENDPOINTS.AUTH.REGISTER),
    );
    const response = await fetch(buildUrl(API_ENDPOINTS.AUTH.REGISTER), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log("[AuthService] Register response status:", response.status);

    const data = await response.json();
    console.log("[AuthService] Register response:", {
      success: data.success,
      message: data.message,
    });

    if (!response.ok) {
      console.error("[AuthService] Register failed:", data.message);
      const error: ApiError = {
        message: data.message || "Đăng ký thất bại",
        code: data.code,
        errors: data.errors,
      };
      throw error;
    }

    console.log("[AuthService] Registration successful");
    return data as LoginResponse;
  } catch (error: any) {
    console.error("[AuthService] Register error:", error);
    if (error.name === "AbortError") {
      throw { message: "Request timeout - vui lòng thử lại" } as ApiError;
    }

    if (error.message) {
      throw error as ApiError;
    }

    throw { message: "Không thể kết nối đến server" } as ApiError;
  }
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
export const refreshToken = async (
  refreshToken: string,
): Promise<LoginResponse> => {
  // TODO: Implement token refresh
  throw new Error("Not implemented");
};
