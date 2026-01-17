// app/contexts/ThemeContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeType = 'light' | 'dark' | 'auto';

interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
  border: string;
  tabBar: string;
  tabBarActive: string;
  tabBarInactive: string;
}

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const lightColors: ThemeColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#64748B',
  accent: '#7C3AED',
  border: '#E2E8F0',
  tabBar: '#FFFFFF',
  tabBarActive: '#7C3AED',
  tabBarInactive: '#64748B',
};

const darkColors: ThemeColors = {
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  accent: '#8B5CF6',
  border: '#334155',
  tabBar: '#1E293B',
  tabBarActive: '#8B5CF6',
  tabBarInactive: '#94A3B8',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('auto');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem('theme_preference');
      if (saved === 'light' || saved === 'dark' || saved === 'auto') {
        setThemeState(saved);
      } else {
        // Если нет сохраненной темы, используем системную
        setThemeState('auto');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      setThemeState('auto');
    } finally {
      setIsReady(true);
    }
  };

  const isDark = theme === 'auto' ? systemScheme === 'dark' : theme === 'dark';

  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem('theme_preference', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  if (!isReady) {
    // Можно вернуть спиннер или пустой экран
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{ theme, isDark, colors, toggleTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
