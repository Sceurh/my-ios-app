// app/_layout.tsx
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MoodProvider } from './contexts/MoodContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { supabase } from './lib/database/api';

function LoadingScreen() {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      }}
    >
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={{ marginTop: 16, color: colors.text, fontSize: 16 }}>
        Загрузка...
      </Text>
    </View>
  );
}

function RootLayoutContent() {
  const { colors, isDark } = useTheme();
  const { user, isLoading, continueAsGuest } = useAuth();
  const [autoGuestCreated, setAutoGuestCreated] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Очистка таймаута при размонтировании
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  // Обработка глубоких ссылок для сброса пароля
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event in RootLayout:', event);

        if (event === 'PASSWORD_RECOVERY') {
          // Защита от повторной навигации
          if (isNavigating) {
            console.log('Already navigating, skipping...');
            return;
          }

          // Проверяем наличие токена
          if (!session?.access_token) {
            console.error('No access token in recovery event');
            Alert.alert(
              'Ошибка',
              'Ссылка для восстановления пароля недействительна',
            );
            return;
          }

          setIsNavigating(true);

          try {
            // Перенаправляем на экран смены пароля
            router.push({
              pathname: '/auth/update-password',
              params: {
                access_token: session.access_token,
                refresh_token: session?.refresh_token,
              },
            });
          } catch (error) {
            console.error('Navigation error:', error);
            Alert.alert(
              'Ошибка',
              'Не удалось открыть страницу восстановления пароля',
            );
          } finally {
            // Сбрасываем флаг через секунду
            navigationTimeoutRef.current = setTimeout(() => {
              setIsNavigating(false);
            }, 1000);
          }
        }

        if (event === 'USER_UPDATED') {
          console.log('Password updated successfully');
        }

        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          // Сбрасываем флаги при выходе
          setAutoGuestCreated(false);
        }
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [isNavigating]); // Добавляем isNavigating в зависимости

  // Автоматическое создание гостевого пользователя
  useEffect(() => {
    let mounted = true;

    const createGuest = async () => {
      if (!isLoading && !user && !autoGuestCreated && mounted) {
        console.log('No user found, creating guest automatically');
        setAutoGuestCreated(true);

        try {
          await continueAsGuest();
        } catch (error) {
          console.error('Failed to create guest:', error);
          if (mounted) {
            Alert.alert(
              'Ошибка',
              'Не удалось создать гостевой профиль. Проверьте подключение к интернету.',
            );
          }
        }
      }
    };

    createGuest();

    return () => {
      mounted = false;
    };
  }, [isLoading, user, autoGuestCreated, continueAsGuest]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {user ? (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="practices"
            options={{
              presentation: 'modal',
              headerShown: true,
              headerTitle: 'Практики',
            }}
          />
          <Stack.Screen
            name="auth/update-password"
            options={{
              presentation: 'modal',
              headerShown: true,
              headerTitle: 'Сброс пароля',
            }}
          />
          {/* Экран для создания контента (админ-панель) */}
          <Stack.Screen
            name="admin/create-content"
            options={{
              presentation: 'modal',
              headerShown: true,
              headerTitle: 'Добавить материал',
              headerStyle: {
                backgroundColor: colors.background,
              },
              headerTitleStyle: {
                color: colors.text,
              },
              headerTintColor: colors.accent,
            }}
          />
          {/* Экран для детального просмотра материала */}
          <Stack.Screen
            name="content/detail"
            options={{
              headerShown: true,
              headerTitle: 'Материал',
              headerStyle: {
                backgroundColor: colors.background,
              },
              headerTitleStyle: {
                color: colors.text,
              },
              headerTintColor: colors.accent,
              headerBackTitle: 'Назад',
            }}
          />
        </Stack>
      ) : (
        <LoadingScreen />
      )}
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <MoodProvider>
            <RootLayoutContent />
          </MoodProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
