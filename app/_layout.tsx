// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MoodProvider } from './contexts/MoodContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

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
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="practices" />
          </>
        ) : (
          <>
            <Stack.Screen name="auth" />
          </>
        )}
      </Stack>
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
