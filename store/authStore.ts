import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (name: string, email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  initializeTestUsers: () => Promise<void>;
}

const AUTH_KEY = 'auth_store';
const USER_KEY = 'user_data';

// Funciones universales que cambian según la plataforma
const getStorageItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return await SecureStore.getItemAsync(key);
  } else {
    return localStorage.getItem(key);
  }
};

const setStorageItem = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    await SecureStore.setItemAsync(key, value);
  } else {
    localStorage.setItem(key, value);
  }
};

const deleteStorageItem = async (key: string): Promise<void> => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    await SecureStore.deleteItemAsync(key);
  } else {
    localStorage.removeItem(key);
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Inicializa usuarios de prueba
  initializeTestUsers: async () => {
    try {
      const storedUsers = await getStorageItem(USER_KEY);

      if (storedUsers) return;

      const testUsers = [
        {
          id: '1',
          name: 'Administrador',
          email: 'admin@test.com',
          username: 'admin',
          password: 'admin123',
          role: 'admin',
        },
        {
          id: '2',
          name: 'Propietario',
          email: 'owner@test.com',
          username: 'owner',
          password: 'owner123',
          role: 'owner',
        },
      ];

      await setStorageItem(USER_KEY, JSON.stringify(testUsers));
    } catch (error) {
      console.error('Error initializing test users:', error);
    }
  },

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await get().initializeTestUsers();

      const storedUsers = await getStorageItem(USER_KEY);
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const user = users.find(
        (u: any) => u.username === username && u.password === password
      );

      if (!user) {
        throw new Error('usuario o contraseña incorrectos');
      }

      const authenticatedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      };

      await setStorageItem(AUTH_KEY, JSON.stringify({
        isAuthenticated: true,
        userId: user.id,
      }));

      set({
        user: authenticatedUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      });
    }
  },

  register: async (name: string, email: string, username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await get().initializeTestUsers();

      const storedUsers = await getStorageItem(USER_KEY);
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const existingUser = users.find(
        (u: any) => u.username === username || u.email === email
      );

      if (existingUser) {
        throw new Error('Nombre de usuario o correo electrónico ya en uso');
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        username,
        password,
        role: "user",
      };

      users.push(newUser);
      await setStorageItem(USER_KEY, JSON.stringify(users));

      const authenticatedUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      };

      await setStorageItem(AUTH_KEY, JSON.stringify({
        isAuthenticated: true,
        userId: newUser.id,
      }));

      set({
        user: authenticatedUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await deleteStorageItem(AUTH_KEY);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      await get().initializeTestUsers();

      const authData = await getStorageItem(AUTH_KEY);

      if (!authData) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }

      const { isAuthenticated, userId } = JSON.parse(authData);

      if (!isAuthenticated || !userId) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }

      const storedUsers = await getStorageItem(USER_KEY);
      if (!storedUsers) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }

      const users = JSON.parse(storedUsers);
      const user = users.find((u: any) => u.id === userId);

      if (!user) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }

      set({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication check failed',
      });
    }
  },
}));