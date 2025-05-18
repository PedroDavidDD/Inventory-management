import * as SecureStore from 'expo-secure-store';
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
  initializeTestUsers: () => Promise<void>; // Nueva función para inicializar usuarios de prueba
}

const AUTH_KEY = 'auth_store';
const USER_KEY = 'user_data';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Función para inicializar usuarios de prueba
  initializeTestUsers: async () => {
    try {
      const storedUsers = await SecureStore.getItemAsync(USER_KEY);
      
      // Si ya hay usuarios almacenados, no hacemos nada
      if (storedUsers) return;
      
      // Crear usuarios de prueba
      const testUsers = [
        {
          id: '1',
          name: 'Administrador',
          email: 'admin@test.com',
          username: 'admin',
          password: 'admin123',
          role: 'admin'
        },
        {
          id: '2',
          name: 'Propietario',
          email: 'owner@test.com',
          username: 'owner',
          password: 'owner123',
          role: 'owner'
        }
      ];
      
      // Guardar usuarios de prueba
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(testUsers));
    } catch (error) {
      console.error('Error initializing test users:', error);
    }
  },

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Inicializar usuarios de prueba si no existen
      await get().initializeTestUsers();
      
      const storedUsers = await SecureStore.getItemAsync(USER_KEY);
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const user = users.find(
        (u: any) => u.username === username && u.password === password
      );
      
      if (!user) {
        throw new Error('Invalid username or password');
      }
      
      // Create a user object without password
      const authenticatedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      };
      
      // Save authentication state
      await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify({
        isAuthenticated: true,
        userId: user.id
      }));
      
      set({
        user: authenticatedUser,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      });
    }
  },

  register: async (name: string, email: string, username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Inicializar usuarios de prueba si no existen
      await get().initializeTestUsers();
      
      // In a real app, this would be an API call
      // For now, we'll store user data locally
      const storedUsers = await SecureStore.getItemAsync(USER_KEY);
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Check if username or email already exists
      const existingUser = users.find(
        (u: any) => u.username === username || u.email === email
      );
      
      if (existingUser) {
        throw new Error('Username or email already in use');
      }
      
      // Create a new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        username,
        password,
        role: "user", // Cambiado a "user" como valor por defecto en lugar de "owner"
      };
      
      // Add user to our "database"
      users.push(newUser);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(users));
      
      // Auto-login after registration
      const authenticatedUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role
      };
      
      // Save authentication state
      await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify({
        isAuthenticated: true,
        userId: newUser.id
      }));
      
      set({
        user: authenticatedUser,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // Clear auth state
      await SecureStore.deleteItemAsync(AUTH_KEY);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Logout failed'
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      // Inicializar usuarios de prueba si no existen
      await get().initializeTestUsers();
      
      // Check if user is authenticated
      const authData = await SecureStore.getItemAsync(AUTH_KEY);
      
      if (!authData) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }
      
      const { isAuthenticated, userId } = JSON.parse(authData);
      
      if (!isAuthenticated || !userId) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }
      
      // Get user data
      const storedUsers = await SecureStore.getItemAsync(USER_KEY);
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
      
      // Set user without password
      set({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role
        },
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      set({
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication check failed'
      });
    }
  }
}));