import { create } from 'zustand';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  initTheme: () => Promise<void>;
}

const THEME_KEY = 'theme_mode';

// Helper function for non-web platforms
const persistTheme = async (isDarkMode: boolean) => {
  if (Platform.OS !== 'web') {
    try {
      await SecureStore.setItemAsync(THEME_KEY, JSON.stringify({ isDarkMode }));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  } else {
    // For web, use localStorage
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify({ isDarkMode }));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }
};

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false,
  
  toggleTheme: () => {
    set((state) => {
      const newThemeState = { isDarkMode: !state.isDarkMode };
      persistTheme(newThemeState.isDarkMode);
      return newThemeState;
    });
  },
  
  initTheme: async () => {
    try {
      let themeData;
      
      if (Platform.OS !== 'web') {
        // For native platforms
        themeData = await SecureStore.getItemAsync(THEME_KEY);
      } else {
        // For web
        themeData = localStorage.getItem(THEME_KEY);
      }
      
      if (themeData) {
        const { isDarkMode } = JSON.parse(themeData);
        set({ isDarkMode });
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  }
}));