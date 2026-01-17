import { Href } from 'expo-router';

// app/types/index.ts
export type MoodType = 'calm' | 'energy' | 'focus' | 'rest';

export interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  route: Href;
}

export interface ThemeType {
  isDark: boolean;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
}

export interface UserMood {
  type: MoodType;
  timestamp: Date;
  note?: string;
}
