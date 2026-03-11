import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/database/api';

export default function UpdatePasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    // Проверяем, есть ли hash с токеном
    const handleDeepLink = async () => {
      const url = await Linking.getInitialURL();
      console.log('Deep link URL:', url);

      if (url && url.includes('access_token')) {
        // Supabase сам обработает токен
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          setIsValidSession(true);
        }
      } else {
        // Обычный вход на экран
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          setIsValidSession(true);
        } else {
          Alert.alert('Ошибка', 'Ссылка для сброса пароля недействительна');
          router.replace('/auth/login');
        }
      }
    };

    handleDeepLink();
  }, []);

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Ошибка', 'Заполните все поля');
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
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      Alert.alert(
        'Успешно',
        'Пароль успешно изменен. Теперь вы можете войти с новым паролем.',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }],
      );
    } catch (error: any) {
      Alert.alert('Ошибка', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidSession) {
    return null; // или покажи загрузку
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/auth/login')}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Новый пароль
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Введите новый пароль для вашего аккаунта
            </Text>
          </View>

          <View style={styles.form}>
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
                placeholder="Новый пароль"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

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

            <TouchableOpacity
              style={[styles.updateButton, { backgroundColor: colors.accent }]}
              onPress={handleUpdatePassword}
              disabled={isLoading}
            >
              <Text style={styles.updateButtonText}>
                {isLoading ? 'Обновление...' : 'Обновить пароль'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  form: { gap: 16 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16 },
  updateButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
