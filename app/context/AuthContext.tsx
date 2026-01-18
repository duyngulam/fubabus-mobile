import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { login } from "../services/authService";
import { ApiError } from "../types/auth";

/* ================== TYPES ================== */

type AuthState = {
  userToken: string | null;
  userID: number | null;
  userRole: string | null; // ADMIN, USER, DRIVER, STAFF
  isLoading: boolean;
};

type SignInCredentials = {
  emailOrPhone: string;
  password: string;
  remember?: boolean;
};

type AuthContextType = AuthState & {
  signIn: (creds: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  userToken: string | null;
  userID: number | null;
  userRole: string | null;
};

/* ================== CONTEXT ================== */

const AuthContext = createContext<AuthContextType | null>(null);

/* ================== PROVIDER ================== */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /* ---------- Restore session ---------- */
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        console.log("[AuthContext] Restoring auth session");
        const token = await AsyncStorage.getItem("userToken");
        const storedUserID = await AsyncStorage.getItem("userID");
        const storedUserRole = await AsyncStorage.getItem("userRole");

        if (token) {
          setUserToken(token);
          console.log("[AuthContext] Token restored");
        }
        if (storedUserID) {
          setUserID(JSON.parse(storedUserID));
          console.log("[AuthContext] UserID restored:", storedUserID);
        }
        if (storedUserRole) {
          setUserRole(storedUserRole);
          console.log("[AuthContext] UserRole restored:", storedUserRole);
        }
      } catch (e) {
        console.warn("[AuthContext] Auth restore failed", e);
      } finally {
        setIsLoading(false);
      }
    };

    restoreAuth();
  }, []);

  /* ---------- Sign in ---------- */
  const signIn = async ({
    emailOrPhone,
    password,
    remember = true,
  }: SignInCredentials) => {
    console.log("[AuthContext] Sign in started:", { emailOrPhone });
    setIsLoading(true);
    try {
      const response = await login({ emailOrPhone, password });
      console.log("[AuthContext] Login response:", {
        success: response.success,
      });

      const { accessToken, userId, role } = response.data;
      console.log("[AuthContext] User logged in:", { userId, role });

      setUserToken(accessToken);
      setUserID(userId);
      setUserRole(role);

      if (remember) {
        await AsyncStorage.multiSet([
          ["userToken", accessToken],
          ["userID", JSON.stringify(userId)],
          ["userRole", role],
        ]);
        console.log("[AuthContext] Credentials saved to storage");
      }
    } catch (err) {
      console.error("[AuthContext] Sign in failed:", err);
      const error = err as ApiError;
      throw new Error(error.message ?? "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- Sign out ---------- */
  const signOut = async () => {
    console.log("[AuthContext] Signing out");
    setIsLoading(true);
    try {
      await AsyncStorage.multiRemove(["userToken", "userID", "userRole"]);
      setUserToken(null);
      setUserID(null);
      setUserRole(null);
      console.log("[AuthContext] User signed out");
    } catch (e) {
      console.warn("[AuthContext] Sign out failed", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ userToken, userID, userRole, isLoading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
