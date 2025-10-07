'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCrypto } from './CryptoContext';
import { AuthState, UserResponse } from '@/types/auth.types';
import { API_ROUTES, APP_ROUTES } from '@/config/constants';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { unlock, lock } = useCrypto();

  /**
   * Check if user is authenticated on mount
   */
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Login user and unlock vault
   */
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await fetch(API_ROUTES.auth.login, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            message: data.message || 'Login failed',
          };
        }

        // Set user
        setUser(data.user);

        // Unlock vault with credentials
        const unlocked = await unlock(email, password);
        if (!unlocked) {
          console.error('Failed to unlock vault');
        }

        // Redirect to vault
        router.push(APP_ROUTES.vault);

        return {
          success: true,
          message: 'Login successful',
        };
      } catch (error: any) {
        console.error('Login error:', error);
        return {
          success: false,
          message: error.message || 'An error occurred during login',
        };
      }
    },
    [unlock, router]
  );

  /**
   * Register user and unlock vault
   */
  const register = useCallback(
    async (email: string, password: string, confirmPassword: string) => {
      try {
        const response = await fetch(API_ROUTES.auth.register, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password, confirmPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            message: data.message || 'Registration failed',
          };
        }

        // Set user
        setUser(data.user);

        // Unlock vault with credentials
        const unlocked = await unlock(email, password);
        if (!unlocked) {
          console.error('Failed to unlock vault');
        }

        // Redirect to vault
        router.push(APP_ROUTES.vault);

        return {
          success: true,
          message: 'Registration successful',
        };
      } catch (error: any) {
        console.error('Registration error:', error);
        return {
          success: false,
          message: error.message || 'An error occurred during registration',
        };
      }
    },
    [unlock, router]
  );

  /**
   * Logout user and lock vault
   */
  const logout = useCallback(async () => {
    try {
      await fetch(API_ROUTES.auth.logout, {
        method: 'POST',
        credentials: 'include',
      });

      // Clear user state
      setUser(null);

      // Lock vault
      lock();

      // Redirect to login
      router.push(APP_ROUTES.login);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [lock, router]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

/**
 * Hook that redirects to login if not authenticated
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(APP_ROUTES.login);
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading, user };
}