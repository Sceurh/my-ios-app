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
  role?: 'user' | 'admin'; // <-- ДОБАВЛЯЕМ role
  isGuest?: boolean;
  created_at?: string;
}

interface ProfileUpdateData {
  name?: string;
  avatar_url?: string;
  theme_preference?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isGuest: boolean;
  isAdmin: boolean; // <-- ДОБАВЛЯЕМ isAdmin
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
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  // Вычисляем isAdmin из user
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    console.log('AuthProvider mounted');
    return () => {
      console.log('AuthProvider unmounted');
      mountedRef.current = false;
    };
  }, []);

  // FIXED: Функция для очистки undefined
  const removeUndefined = <T extends Record<string, any>>(
    obj: T,
  ): Partial<T> => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key as keyof T] = value;
      return acc;
    }, {} as Partial<T>);
  };

  // Гостевые функции
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

  // НОВАЯ ФУНКЦИЯ: Загрузка профиля пользователя (с ролью)
  const fetchUserProfile = useCallback(
    async (userId: string): Promise<Partial<User> | null> => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('name, avatar_url, role')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.log('Profile fetch error:', error.message);
          return null;
        }

        console.log('Fetched profile:', data);
        return data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
    },
    [],
  );

  // FIXED: Улучшенная функция обработки сессии с загрузкой роли
  const processUserSession = useCallback(
    async (session: Session | null) => {
      if (!mountedRef.current) {
        setIsLoading(false);
        return;
      }

      try {
        if (session?.user) {
          console.log('Processing session for user:', session.user.email);

          // Проверяем валидность сессии
          const {
            data: { user: currentUser },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !currentUser) {
            console.log('Session not fully established, will retry...');
            setTimeout(() => refreshUser(), 1000);
            setIsLoading(false);
            return;
          }

          // Загружаем профиль с ролью
          const profile = await fetchUserProfile(session.user.id);

          const userData: User = {
            id: session.user.id,
            email: session.user.email!,
            name:
              profile?.name ||
              session.user.user_metadata?.name ||
              session.user.email?.split('@')[0],
            avatar_url:
              profile?.avatar_url || session.user.user_metadata?.avatar_url,
            role: profile?.role || 'user', // <-- ДОБАВЛЯЕМ role, по умолчанию 'user'
            isGuest: false,
            created_at: session.user.created_at,
          };

          await clearGuestData();

          // Обновляем профиль если нужно
          try {
            const profileData = removeUndefined({
              id: session.user.id,
              name: userData.name,
              avatar_url: userData.avatar_url,
              updated_at: new Date().toISOString(),
            });

            const { error: upsertError } = await supabase
              .from('user_profiles')
              .upsert(profileData, { onConflict: 'id' });

            if (upsertError) {
              console.log(
                'Profile upsert error (non-critical):',
                upsertError.message,
              );
            }
          } catch (e) {
            console.log('Profile upsert exception (non-critical):', e);
          }

          setUser(userData);
          setIsGuest(false);
        } else {
          const guestUser = await getGuestUser();
          if (guestUser) {
            console.log('Guest user found');
            setUser(guestUser);
            setIsGuest(true);
          }
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
    [clearGuestData, getGuestUser, fetchUserProfile],
  );

  // Инициализация
  const initAuth = async (retryCount = 0) => {
    if (initStartedRef.current) return;
    initStartedRef.current = true;

    console.log('Initializing auth...');
    try {
      const { data } = await supabase.auth.getSession();
      console.log('Initial auth check complete');

      setTimeout(() => {
        processUserSession(data.session);
      }, 100);
    } catch (error) {
      console.error('Error initializing auth:', error);

      if (retryCount < 3) {
        console.log(`Retrying auth init (${retryCount + 1}/3)...`);
        setTimeout(() => initAuth(retryCount + 1), 1000 * (retryCount + 1));
      } else {
        await processUserSession(null);
      }
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  // Подписка на изменения auth
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') return;
      console.log('Auth event:', event);

      if (event === 'PASSWORD_RECOVERY') {
        router.replace('/auth/update-password');
      }

      processUserSession(session);
    });

    return () => subscription.unsubscribe();
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
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка создания гостевого аккаунта');
    } finally {
      if (mountedRef.current) setIsLoading(false);
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
      if (data.user) await clearGuestData();
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка входа');
    } finally {
      if (mountedRef.current) setIsLoading(false);
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

      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('Пользователь с таким email уже существует');
        }
        throw error;
      }

      await clearGuestData();

      if (data.user) {
        console.log('Creating profile for user:', data.user.id);

        const profileData = removeUndefined({
          id: data.user.id,
          name: name,
          role: 'user', // <-- ДОБАВЛЯЕМ role по умолчанию
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert(profileData, { onConflict: 'id' });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        } else {
          console.log('Profile created successfully for:', email);
        }
      }

      if (data.user && !data.session) {
        Alert.alert(
          'Подтвердите email',
          'Мы отправили письмо с подтверждением на вашу почту.',
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

      // Перенос данных гостя
      const guestId = await SecureStore.getItemAsync(GUEST_ID_KEY);
      if (guestId && data.user) {
        const tables = [
          'moods',
          'journal',
          'practices',
          'saved_content',
          'chat_messages',
        ];
        for (const table of tables) {
          await supabase
            .from(table)
            .update({ user_id: data.user.id })
            .eq('user_id', guestId);
        }
      }

      await clearGuestData();

      if (data.user) {
        const profileData = removeUndefined({
          id: data.user.id,
          name: name,
          role: 'user', // <-- ДОБАВЛЯЕМ role по умолчанию
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        await supabase
          .from('user_profiles')
          .upsert(profileData, { onConflict: 'id' });
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка конвертации');
    } finally {
      if (mountedRef.current) setIsLoading(false);
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
        setUser(null);
        setIsGuest(false);
        setTimeout(
          () => continueAsGuest().catch(() => router.replace('/auth/welcome')),
          100,
        );
      }
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка выхода');
    } finally {
      if (mountedRef.current) setIsLoading(false);
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

  const updateProfile = async (data: ProfileUpdateData) => {
    if (!user) return;
    try {
      if (isGuest) {
        const updatedUser = { ...user, ...data };
        await saveGuestUser(updatedUser);
        setUser(updatedUser);
      } else {
        const cleanData = removeUndefined({
          ...data,
          updated_at: new Date().toISOString(),
        });
        const { error } = await supabase
          .from('user_profiles')
          .update(cleanData)
          .eq('id', user.id);
        if (error) throw error;
        setUser((prev) => (prev ? { ...prev, ...data } : null));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const redirectTo = __DEV__
        ? 'exp://192.168.0.35:8081/--/auth/update-password'
        : 'mindcare://auth/update-password';

      console.log('Redirecting to:', redirectTo);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) throw error;
      Alert.alert(
        'Письмо отправлено',
        'На вашу почту отправлена ссылка для восстановления пароля.',
      );
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка восстановления пароля');
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('Пользователь не найден');

      if (isGuest) {
        await clearGuestData();
        setUser(null);
        setIsGuest(false);
        Alert.alert(
          'Гостевые данные удалены',
          'Все временные данные очищены.',
          [{ text: 'OK', onPress: () => router.replace('/auth/welcome') }],
        );
        return;
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error('Сессия не найдена. Пожалуйста, войдите снова.');
      }

      let accessToken = session.access_token;
      const expiresAt = session.expires_at;

      if (expiresAt && expiresAt * 1000 - Date.now() < 30000) {
        console.log('Token expired or about to expire, refreshing...');

        const { data: refreshData, error: refreshError } =
          await supabase.auth.refreshSession();

        if (refreshError || !refreshData.session) {
          console.error('Session refresh failed:', refreshError);
          throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
        }

        accessToken = refreshData.session.access_token;
        console.log('Token refreshed successfully');
      }

      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
      const functionUrl = `${supabaseUrl}/functions/v1/delete-account`;
      const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          apikey: anonKey,
        },
        body: JSON.stringify({}),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Delete account failed:', responseData);

        if (response.status === 401) {
          const {
            data: { user: refreshedUser },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !refreshedUser) {
            throw new Error(
              'Ошибка аутентификации. Пожалуйста, войдите снова.',
            );
          }
        }

        throw new Error(responseData.error || `Ошибка ${response.status}`);
      }

      await supabase.auth.signOut();
      setUser(null);
      setIsGuest(false);

      Alert.alert(
        'Аккаунт удален',
        'Ваш аккаунт и все данные успешно удалены.',
        [{ text: 'OK', onPress: () => router.replace('/auth/welcome') }],
      );
    } catch (error: any) {
      console.error('Error in deleteAccount:', error);
      Alert.alert('Ошибка удаления', error.message);
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isGuest,
        isAdmin, // <-- ДОБАВЛЯЕМ isAdmin
        signIn,
        signUp,
        signOut,
        signInWithApple,
        continueAsGuest,
        convertGuestToUser,
        refreshUser,
        updateProfile,
        resetPassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
