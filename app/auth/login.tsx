// app/auth/login.tsx
import * as AppleAuthentication from 'expo-apple-authentication';
import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../lib/database/api';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleAppleLogin = async () => {
    try {
      setIsLoading(true);

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Отправляем на сервер
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken!,
      });

      if (error) throw error;

      // Сохраняем пользователя
      if (data.user) {
        // Переходим на главную
      }
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        // Пользователь отменил
      } else {
        Alert.alert('Ошибка', 'Не удалось войти через Apple');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // return (
  //   <View style={styles.container}>
  //     <AppleAuthentication.AppleAuthenticationButton
  //       buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
  //       buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
  //       cornerRadius={20}
  //       style={styles.appleButton}
  //       onPress={handleAppleLogin}
  //       disabled={isLoading}
  //     />
  //   </View>
  // );
}
