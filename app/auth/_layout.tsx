import { Stack } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function AuthLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="reset-password" />{' '}
      {/* старый экран для ввода email */}
      <Stack.Screen name="update-password" />{' '}
      {/* НОВЫЙ экран для ввода нового пароля */}
    </Stack>
  );
}
