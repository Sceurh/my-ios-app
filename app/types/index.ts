// app/types/index.ts
export type MoodType = 'calm' | 'energy' | 'focus' | 'rest';

export interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  route: string;
}

export interface UserMood {
  type: MoodType;
  timestamp: Date;
  note?: string;
}

// Добавь типы для Supabase
export interface SupabaseMood {
  id: string;
  user_id: string;
  mood_type: MoodType;
  note?: string;
  created_at: string;
}

export interface SupabaseUserProfile {
  id: string;
  name?: string;
  avatar_url?: string;
  theme_preference: 'light' | 'dark' | 'auto';
  created_at: string;
  updated_at: string;
}

export interface PracticeType {
  id: string;
  title: string;
  emoji: string;
  color: string;
  duration: string;
  description: string;
  steps: string[];
  benefits: string[];
  instructions?: string;
}
