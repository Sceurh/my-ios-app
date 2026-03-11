import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Send } from 'lucide-react-native';
import React, { useState } from 'react';
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
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Ошибка', 'Пожалуйста, введите email');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Письмо отправлено',
        'Проверьте вашу почту для восстановления пароля.',
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch (error: any) {
      Alert.alert('Ошибка', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
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
              Восстановление пароля
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Введите email, указанный при регистрации
            </Text>
          </View>

          {/* Форма */}
          <View style={styles.form}>
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

            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: colors.accent }]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              <Send size={20} color="#FFFFFF" />
              <Text style={styles.resetButtonText}>
                {isLoading ? 'Отправка...' : 'Отправить ссылку'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  form: {
    marginBottom: 24,
    gap: 20,
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
  resetButton: {
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
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
