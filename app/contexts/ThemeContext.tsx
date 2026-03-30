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
  primary: string;
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
  primary: '#7C3AED',
  border: '#E2E8F0',
  tabBar: '#FFFFFF',
  tabBarActive: '#7C3AED',
  tabBarInactive: '#64748B',
};

const darkColors: ThemeColors = {
  background: '#030303',
  primary: '#8B5CF6',
  surface: '#1A1A1B',
  text: '#D7DADC',
  textSecondary: '#818384',
  accent: '#8B5CF6',
  border: '#343536',
  tabBar: '#1A1A1B',
  tabBarActive: '#8B5CF6',
  tabBarInactive: '#818384',
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
