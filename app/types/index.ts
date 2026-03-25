// app/types/index.ts

// ============================================
// Основные типы приложения
// ============================================

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

// ============================================
// Supabase типы (соответствуют схеме БД)
// ============================================

// user_profiles
export interface SupabaseUserProfile {
  id: string;
  name?: string;
  avatar_url?: string;
  theme_preference: 'light' | 'dark' | 'auto';
  role: 'user' | 'admin'; // ДОБАВЛЕНО
  created_at: string;
  updated_at: string;
}

// moods
export interface SupabaseMood {
  id: string;
  user_id: string;
  mood_type: MoodType;
  note?: string;
  created_at: string;
}

// practices
export interface SupabasePractice {
  id: string;
  user_id: string;
  practice_id: string;
  completed: boolean;
  duration?: number;
  created_at: string;
}

// journal
export interface SupabaseJournal {
  id: string;
  user_id: string;
  content: string;
  mood_type?: string;
  tags: string[];
  created_at: string;
}

// content_items
export type ContentType =
  | 'article'
  | 'practice'
  | 'meditation'
  | 'video'
  | 'tip';

export interface SupabaseContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string | null;
  content: string | null;
  cover_url: string | null;
  tags: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// saved_content
export interface SupabaseSavedContent {
  user_id: string;
  content_id: string;
  created_at: string;
}

// saved_content с JOIN на content_items (для library)
export interface SavedContentWithDetails {
  content_id: string;
  created_at: string;
  content_items: SupabaseContentItem;
}

// chat_messages
export interface SupabaseChatMessage {
  id: string;
  user_id: string;
  content: string;
  is_ai: boolean;
  created_at: string;
}

// ============================================
// Типы для навигации
// ============================================

export type RootStackParamList = {
  '(tabs)': undefined;
  'content/detail': { id: string };
  'admin/create-content': undefined;
  'auth/update-password': { access_token: string; refresh_token?: string };
  'auth/login': undefined;
  practices: undefined;
};
