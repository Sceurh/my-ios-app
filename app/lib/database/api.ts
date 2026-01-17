// app/lib/database/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// ВСТАВЬ СВОИ КЛЮЧИ СЮДА
const supabaseUrl = 'https://zmfswvuoxznhfqdgaxwq.supabase.co';
const supabaseAnonKey = 'sb_publishable_8vYVGgDE6gtYmT0b-fM37w_eL6BQ5y3';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Типы для таблиц
export type Tables = {
  users: User;
  moods: Mood;
  journal: JournalEntry;
  practices: PracticeProgress;
  saved_content: SavedContent;
  chat_messages: ChatMessage;
};

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  theme_preference?: 'light' | 'dark' | 'auto';
  created_at: string;
}

export interface Mood {
  id: string;
  user_id: string;
  mood_type: 'calm' | 'energy' | 'focus' | 'rest';
  note?: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  mood_type?: string;
  tags?: string[];
  created_at: string;
}

export interface PracticeProgress {
  id: string;
  user_id: string;
  practice_id: string;
  completed: boolean;
  duration: number;
  created_at: string;
}

export interface SavedContent {
  id: string;
  user_id: string;
  type: 'tip' | 'article' | 'quote' | 'practice';
  content_id: string;
  data: any;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  is_ai: boolean;
  created_at: string;
}
