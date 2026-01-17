// app/constants/themes.ts
export const Colors = {
  // Основные цвета
  primary: '#7C3AED',
  primaryLight: '#8B5CF6',
  success: '#10B981',
  info: '#3B82F6',
  warning: '#F59E0B',
  danger: '#EF4444',

  // Градиенты для настроений
  gradients: {
    calm: ['#8B5CF6', '#A78BFA'],
    energy: ['#10B981', '#34D399'],
    focus: ['#3B82F6', '#60A5FA'],
    rest: ['#F59E0B', '#FBBF24'],
  },

  // Темная тема
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#334155',
  },

  // Светлая тема
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0',
  },
};

export const MOODS = [
  { id: 'calm', emoji: '😌', label: 'Спокойно', color: '#8B5CF6' },
  { id: 'energy', emoji: '⚡', label: 'Энергия', color: '#10B981' },
  { id: 'focus', emoji: '🎯', label: 'Фокус', color: '#3B82F6' },
  { id: 'rest', emoji: '😴', label: 'Отдых', color: '#F59E0B' },
] as const;

export type MoodType = (typeof MOODS)[number]['id'];
