// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './contexts/AuthContext';
import { MoodProvider } from './contexts/MoodContext';
import { ThemeProvider } from './contexts/ThemeContext';

// // Компонент-обертка для проверки авторизации
// function AuthGuard({ children }: { children: React.ReactNode }) {
//   const { user, isLoading } = useAuth();

//   if (isLoading) {
//     // Показываем загрузку
//     return null; // или <LoadingScreen />
//   }

//   if (!user) {
//     // Если не авторизован - на логин
//     return <Redirect href="/auth/login" />;
//   }

//   return <>{children}</>;
// }

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <MoodProvider>
            {/* AuthGuard проверяет авторизацию */}
            {/* <AuthGuard> */}
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="auth" />
              <Stack.Screen
                name="practices"
                options={{ presentation: 'modal' }}
              />
            </Stack>
            <StatusBar style="auto" />
            {/* </AuthGuard> */}
          </MoodProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
