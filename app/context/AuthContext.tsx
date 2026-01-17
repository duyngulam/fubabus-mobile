import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { login } from '../services/authService';
import { ApiError, User } from '../types/auth';

type AuthState = {
  userToken: string | null;
  user: User | null;
  isLoading: boolean;
};

type SignInCredentials = { emailOrPhone: string; password: string; remember?: boolean };

type AuthContextType = AuthState & {
  signIn: (creds: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setUserToken(token);
          // Optionally restore a cached user object
          const raw = await AsyncStorage.getItem('user');
          if (raw) setUser(JSON.parse(raw));
        }
      } catch (e) {
        console.warn('Auth restore failed', e);
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const signIn = async ({ emailOrPhone, password, remember = true }: SignInCredentials) => {
    setIsLoading(true);
    try {
      // Call real API
      const response = await login({ emailOrPhone, password });
      
      // Validate response
      if (!response || !response.token) {
        throw { message: 'Invalid server response: missing token' } as ApiError;
      }

      setUserToken(response.token);
      setUser(response.user ?? null);

      if (remember) {
        try {
          // Ensure we're only storing strings
          const tokenToStore = String(response.token);
          await AsyncStorage.setItem('userToken', tokenToStore);
          if (response.user != null) {
            await AsyncStorage.setItem('user', JSON.stringify(response.user));
          } else {
            await AsyncStorage.removeItem('user');
          }
        } catch (storageErr) {
          console.warn('AsyncStorage set failed', { storageErr, response });
        }
      } else {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('user');
      }
    } catch (err) {
      const error = err as ApiError;
      throw new Error(error.message || 'Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
      setUserToken(null);
      setUser(null);
    } catch (e) {
      console.warn('Sign out failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
