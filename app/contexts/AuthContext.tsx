// app/contexts/AuthContext.tsx
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/database/api';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{
    user: SupabaseUser | null;
    session: Session | null;
  }>;
  signOut: () => Promise<void>;
  signInWithApple: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем активную сессию
    checkUser();

    // Слушаем изменения авторизации
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, session?.user?.email);

      if (session?.user) {
        // Сохраняем пользователя
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
          avatar_url: session.user.user_metadata?.avatar_url,
        };

        // Обновляем профиль если нужно
        await updateUserProfile(session.user.id, {
          name: session.user.user_metadata?.name,
        });

        setUser(userData);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
          avatar_url: session.user.user_metadata?.avatar_url,
        });
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (userId: string, data: { name?: string }) => {
    try {
      const { error } = await supabase.from('user_profiles').upsert(
        {
          id: userId,
          name: data.name,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'id',
        },
      );

      if (error) throw error;
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: 'mindcare://auth/callback',
        },
      });

      if (error) throw error;

      // Создаем профиль пользователя
      if (data.user) {
        await updateUserProfile(data.user.id, { name });
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      router.replace('/auth/login');
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка выхода');
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    // Пока заглушка
    throw new Error('Apple Sign In не поддерживается в этом регионе');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        signInWithApple,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
