import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { login } from "../services/authService";
import { ApiError } from "../types/auth";

/* ================== TYPES ================== */

type AuthState = {
  userToken: string | null;
  userID: number | null;
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
};

/* ================== CONTEXT ================== */

const AuthContext = createContext<AuthContextType | null>(null);

/* ================== PROVIDER ================== */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /* ---------- Restore session ---------- */
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const storedUserID = await AsyncStorage.getItem("userID");

        if (token) setUserToken(token);
        if (storedUserID) setUserID(JSON.parse(storedUserID));
      } catch (e) {
        console.warn("Auth restore failed", e);
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
    setIsLoading(true);
    try {
      const response = await login({ emailOrPhone, password });

      const { accessToken, userId } = response.data;

      setUserToken(accessToken);
      setUserID(userId);

      if (remember) {
        await AsyncStorage.multiSet([
          ["userToken", accessToken],
          ["userID", JSON.stringify(userId)],
        ]);
      }
    } catch (err) {
      const error = err as ApiError;
      throw new Error(error.message ?? "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- Sign out ---------- */
  const signOut = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.multiRemove(["userToken", "userID"]);
      setUserToken(null);
      setUserID(null);
    } catch (e) {
      console.warn("Sign out failed", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ userToken, userID, isLoading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
