// app/auth/register.tsx
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, LogIn, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Валидация
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Ошибка', 'Пароль должен быть не менее 6 символов');
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, name);
      Alert.alert(
        'Успешно!',
        'Регистрация прошла успешно. Проверьте email для подтверждения.',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }],
      );
    } catch (error: any) {
      Alert.alert('Ошибка регистрации', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            {/* Кнопка назад */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>

            {/* Заголовок */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                Создать аккаунт
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Присоединяйтесь к MindCare
              </Text>
            </View>

            {/* Форма */}
            <View style={styles.form}>
              {/* Имя */}
              <View
                style={[styles.inputContainer, { borderColor: colors.border }]}
              >
                <User
                  size={20}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Имя"
                  placeholderTextColor={colors.textSecondary}
                  value={name}
                  onChangeText={setName}
                  editable={!isLoading}
                />
              </View>

              {/* Email */}
              <View
                style={[styles.inputContainer, { borderColor: colors.border }]}
              >
                <Mail
                  size={20}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Email"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isLoading}
                />
              </View>

              {/* Пароль */}
              <View
                style={[styles.inputContainer, { borderColor: colors.border }]}
              >
                <Lock
                  size={20}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Пароль"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>

              {/* Подтверждение пароля */}
              <View
                style={[styles.inputContainer, { borderColor: colors.border }]}
              >
                <Lock
                  size={20}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Подтвердите пароль"
                  placeholderTextColor={colors.textSecondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>

              {/* Кнопка регистрации */}
              <TouchableOpacity
                style={[
                  styles.registerButton,
                  { backgroundColor: colors.accent },
                ]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <LogIn size={20} color="#FFFFFF" />
                <Text style={styles.registerButtonText}>
                  {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Условия */}
            <Text style={[styles.terms, { color: colors.textSecondary }]}>
              Нажимая Зарегистрироваться, вы соглашаетесь с нашими{' '}
              <Text style={[styles.termsLink, { color: colors.accent }]}>
                Условиями использования
              </Text>{' '}
              и{' '}
              <Text style={[styles.termsLink, { color: colors.accent }]}>
                Политикой конфиденциальности
              </Text>
            </Text>

            {/* Уже есть аккаунт */}
            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                Уже есть аккаунт?
              </Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={[styles.loginLink, { color: colors.accent }]}>
                  Войти
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  form: {
    marginBottom: 24,
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  registerButton: {
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
    marginTop: 8,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  terms: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  termsLink: {
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
