import React, { createContext, useContext, useState, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { useRouter } from 'expo-router';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { post } = useApi();
  const router = useRouter();

  const login = useCallback(async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await post<any>('auth/login', {
        username,
        password
      });

      if (response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setError(null);
        router.replace('/(tabs)');
      } else {
        setError(response.error || 'Login failed');
        throw new Error(response.error || 'Login failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [post, router]);

  const register = useCallback(async (fullName: string, email: string, username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await post<any>('auth/register', {
        fullName,
        email,
        username,
        password
      });

      if (response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setError(null);
        router.replace('/(tabs)');
      } else {
        setError(response.error || 'Registration failed');
        throw new Error(response.error || 'Registration failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [post, router]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/(auth)/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
