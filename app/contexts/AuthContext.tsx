// app/contexts/AuthContext.tsx
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Alert } from 'react-native';
import { supabase } from '../lib/database/api';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  isGuest?: boolean;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isGuest: boolean;
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
  continueAsGuest: () => Promise<void>;
  convertGuestToUser: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{
    user: SupabaseUser | null;
    session: Session | null;
  }>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Константы для таймаутов
const AUTH_TIMEOUT = 5000; // 5 секунд таймаут
const AUTH_CHECK_INTERVAL = 30000; // 30 секунд для периодической проверки

const GUEST_USER_KEY = 'guest_user_data';
const GUEST_ID_KEY = 'guest_user_id';
const GUEST_CREATED_AT_KEY = 'guest_created_at';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const mountedRef = useRef(true);
  const initializedRef = useRef(false);
  const initStartedRef = useRef(false);

  useEffect(() => {
    console.log('AuthProvider mounted');
    return () => console.log('AuthProvider unmounted');
  }, []);

  // Функции для работы с гостевой сессией
  const getGuestUser = useCallback(async (): Promise<User | null> => {
    try {
      const guestData = await SecureStore.getItemAsync(GUEST_USER_KEY);
      const guestCreatedAt =
        await SecureStore.getItemAsync(GUEST_CREATED_AT_KEY);

      if (guestData) {
        const userData = JSON.parse(guestData);
        return {
          ...userData,
          created_at: guestCreatedAt || new Date().toISOString(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting guest user:', error);
      return null;
    }
  }, []);

  const saveGuestUser = useCallback(async (guestUser: User) => {
    try {
      const guestData = {
        id: guestUser.id,
        email: guestUser.email,
        name: guestUser.name,
        isGuest: true,
      };

      await SecureStore.setItemAsync(GUEST_USER_KEY, JSON.stringify(guestData));
      await SecureStore.setItemAsync(GUEST_ID_KEY, guestUser.id);
      await SecureStore.setItemAsync(
        GUEST_CREATED_AT_KEY,
        guestUser.created_at || new Date().toISOString(),
      );
    } catch (error) {
      console.error('Error saving guest user:', error);
    }
  }, []);

  const clearGuestData = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(GUEST_USER_KEY);
      await SecureStore.deleteItemAsync(GUEST_ID_KEY);
      await SecureStore.deleteItemAsync(GUEST_CREATED_AT_KEY);
    } catch (error) {
      console.error('Error clearing guest data:', error);
    }
  }, []);

  // Функция обработки сессии пользователя
  const processUserSession = useCallback(
    async (session: Session | null) => {
      if (!mountedRef.current) {
        setIsLoading(false);
        return;
      }

      try {
        if (session?.user) {
          console.log('Authenticated user:', session.user.email);

          // Получаем профиль из базы данных
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const userData: User = {
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || session.user.user_metadata?.name,
            avatar_url:
              profile?.avatar_url || session.user.user_metadata?.avatar_url,
            isGuest: false,
            created_at: session.user.created_at,
          };

          await clearGuestData();

          // Обновляем или создаем профиль
          await supabase.from('user_profiles').upsert({
            id: session.user.id,
            name: userData.name,
            email: userData.email,
            avatar_url: userData.avatar_url,
            updated_at: new Date().toISOString(),
          });

          setUser(userData);
          setIsGuest(false);
          initializedRef.current = true;
        } else {
          const guestUser = await getGuestUser();
          if (guestUser) {
            console.log('Guest user found');
            setUser(guestUser);
            setIsGuest(true);
          } else {
            console.log('No user found, redirecting to welcome');
          }
          initializedRef.current = true;
        }
      } catch (error) {
        console.error('Error in processUserSession:', error);
        const guestUser = await getGuestUser();
        if (guestUser) {
          setUser(guestUser);
          setIsGuest(true);
        }
      } finally {
        initializedRef.current = true;
        setIsLoading(false);
      }
    },
    [clearGuestData, getGuestUser],
  );

  // Инициализация авторизации с таймаутом
  const initAuth = async () => {
    if (initStartedRef.current) return;

    initStartedRef.current = true;
    console.log('Initializing auth...');
    try {
      const { data } = await supabase.auth.getSession();
      console.log('Initial auth check complete');
      await processUserSession(data.session);
    } catch (error) {
      console.error('Error initializing auth:', error);
      await processUserSession(null);
    }
  };

  // Инициализация при загрузке - ОДИН РАЗ
  useEffect(() => {
    initAuth();
  }, []);

  // Подписка на изменения auth состояния
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Игнорируем INITIAL_SESSION после инициализации
      if (event === 'INITIAL_SESSION') {
        console.log('Ignoring INITIAL_SESSION after initialization');
        return;
      }
      console.log('Auth event:', event);
      processUserSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [processUserSession]);

  const generateGuestId = (): string => {
    return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const continueAsGuest = async () => {
    setIsLoading(true);
    try {
      const guestId = generateGuestId();
      const guestUser: User = {
        id: guestId,
        email: 'guest@mindcare.app',
        name: 'Гость',
        isGuest: true,
        created_at: new Date().toISOString(),
      };

      await saveGuestUser(guestUser);
      setUser(guestUser);
      setIsGuest(true);

      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Error in continueAsGuest:', error);
      throw new Error(error.message || 'Ошибка создания гостевого аккаунта');
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
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
        await clearGuestData();
        // onAuthStateChange обработает SIGNED_IN
      }
    } catch (error: any) {
      console.error('Error in signIn:', error);
      if (mountedRef.current) {
        setIsLoading(false);
      }
      throw new Error(error.message || 'Ошибка входа');
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

      await clearGuestData();

      // Создаем профиль пользователя
      if (data.user) {
        try {
          await supabase.from('user_profiles').upsert({
            id: data.user.id,
            name: name,
            email: email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Error creating profile:', error);
        }
      }

      // Показываем уведомление о подтверждении email
      if (data.user && !data.session) {
        Alert.alert(
          'Подтвердите email',
          'Мы отправили письмо с подтверждением на вашу почту. Пожалуйста, проверьте вашу почту и подтвердите регистрацию.',
          [{ text: 'OK' }],
        );
      }

      if (mountedRef.current) {
        setIsLoading(false);
      }

      return data;
    } catch (error: any) {
      console.error('Error in signUp:', error);
      if (mountedRef.current) {
        setIsLoading(false);
      }
      throw new Error(error.message || 'Ошибка регистрации');
    }
  };

  const convertGuestToUser = async (
    email: string,
    password: string,
    name: string,
  ) => {
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

      // Переносим гостевые данные
      const guestId = await SecureStore.getItemAsync(GUEST_ID_KEY);
      if (guestId && data.user) {
        console.log(
          'Migrating data from guest:',
          guestId,
          'to user:',
          data.user.id,
        );
        try {
          const { error: migrateError } = await supabase
            .from('moods')
            .update({ user_id: data.user.id })
            .eq('user_id', guestId);

          if (migrateError) {
            console.error('Error migrating data:', migrateError);
          }
        } catch (migrateError) {
          console.error('Error migrating data:', migrateError);
        }
      }

      await clearGuestData();

      // Создаем профиль
      if (data.user) {
        await supabase.from('user_profiles').upsert({
          id: data.user.id,
          name: name,
          email: email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      if (mountedRef.current) {
        setIsLoading(false);
      }

      return data;
    } catch (error: any) {
      console.error('Error in convertGuestToUser:', error);
      if (mountedRef.current) {
        setIsLoading(false);
      }
      throw new Error(error.message || 'Ошибка конвертации');
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      if (isGuest) {
        await clearGuestData();
        setUser(null);
        setIsGuest(false);
        router.replace('/auth/login');
      } else {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        // onAuthStateChange обработает SIGNED_OUT
      }
    } catch (error: any) {
      console.error('Error in signOut:', error);
      if (mountedRef.current) {
        setIsLoading(false);
      }
      throw new Error(error.message || 'Ошибка выхода');
    }
  };

  const signInWithApple = async () => {
    throw new Error('Apple Sign In не поддерживается в этом регионе');
  };

  const refreshUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await processUserSession(session);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    try {
      if (isGuest) {
        // Обновляем гостевые данные
        const updatedUser = { ...user, ...data };
        await saveGuestUser(updatedUser);
        setUser(updatedUser);
      } else {
        // Обновляем в базе данных
        const { error } = await supabase
          .from('user_profiles')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error) throw error;

        // Обновляем локальное состояние
        setUser((prev) => (prev ? { ...prev, ...data } : null));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isGuest,
        signIn,
        signUp,
        signOut,
        signInWithApple,
        continueAsGuest,
        convertGuestToUser,
        refreshUser,
        updateProfile,
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
