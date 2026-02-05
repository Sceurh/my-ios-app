// app/auth/welcome.tsx
import { useRouter } from 'expo-router';
import { Brain, LogIn, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { continueAsGuest, isLoading } = useAuth();

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleGuest = async () => {
    await continueAsGuest();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        {/* Лого и приветствие */}
        <View style={styles.header}>
          <View style={[styles.logo, { backgroundColor: colors.accent }]}>
            <Brain size={48} color="#FFFFFF" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Добро пожаловать в MindCare
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Ваш персональный помощник для ментального здоровья
          </Text>
        </View>

        {/* Кнопки выбора */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.accent }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <LogIn size={24} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Войти в аккаунт</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.border }]}
            onPress={handleGuest}
            disabled={isLoading}
          >
            <User size={24} color={colors.text} />
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              Продолжить как гость
            </Text>
          </TouchableOpacity>

          <Text style={[styles.note, { color: colors.textSecondary }]}>
            Гостевой режим позволит использовать основные функции без
            регистрации
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 32,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    marginBottom: 60,
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    gap: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});
