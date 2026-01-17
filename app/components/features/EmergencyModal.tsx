// app/components/features/EmergencyModal.tsx (правильное название)
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const EMERGENCY_NUMBERS = {
  RU: {
    police: '102',
    ambulance: '103',
    fire: '101',
    psychological: '8-800-2000-122',
  },
  UA: { police: '102', ambulance: '103', fire: '101', psychological: '7333' },
  BY: {
    police: '102',
    ambulance: '103',
    fire: '101',
    psychological: '8-801-100-1611',
  },
  KZ: { police: '102', ambulance: '103', fire: '101', psychological: '150' },
  default: {
    police: '112',
    ambulance: '112',
    fire: '112',
    psychological: '116123',
  },
} as const;

type CountryCode = keyof typeof EMERGENCY_NUMBERS;

interface EmergencyModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function EmergencyModal({
  visible,
  onClose,
}: EmergencyModalProps) {
  const { colors } = useTheme();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [countryCode, setCountryCode] = useState<CountryCode>('default');

  const requestLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Разрешение на геолокацию',
          'Для определения местных номеров разрешите доступ к геолокации',
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Заглушка - в реальном приложении используй API геокодирования
      setCountryCode('RU');
    } catch (error) {
      console.error('Location error:', error);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      requestLocation();
    }
  }, [visible, requestLocation]);

  const makeCall = (number: string) => {
    Linking.openURL(`tel:${number}`).catch((err) =>
      Alert.alert('Ошибка', 'Не удалось совершить звонок'),
    );
  };

  const numbers = EMERGENCY_NUMBERS[countryCode] || EMERGENCY_NUMBERS.default;

  const EmergencyButton = ({
    icon,
    title,
    number,
    onPress,
    color,
  }: {
    icon: string;
    title: string;
    number: string;
    onPress: () => void;
    color: string;
  }) => (
    <TouchableOpacity
      style={[styles.emergencyButton, { borderLeftColor: color }]}
      onPress={onPress}
    >
      <View style={styles.buttonContent}>
        <Text style={styles.buttonIcon}>{icon}</Text>
        <View style={styles.buttonText}>
          <Text style={[styles.buttonTitle, { color: colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.buttonNumber, { color }]}>{number}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: colors.surface }]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                🆘 Экстренная помощь
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Если тебе срочно нужна помощь, позвони по одному из номеров:
            </Text>

            <View style={styles.numbersList}>
              <EmergencyButton
                icon="🏥"
                title="Скорая помощь"
                number={numbers.ambulance}
                onPress={() => makeCall(numbers.ambulance)}
                color="#EF4444"
              />
              <EmergencyButton
                icon="🚓"
                title="Полиция"
                number={numbers.police}
                onPress={() => makeCall(numbers.police)}
                color="#3B82F6"
              />
              <EmergencyButton
                icon="🧠"
                title="Психологическая помощь"
                number={numbers.psychological}
                onPress={() => makeCall(numbers.psychological)}
                color="#8B5CF6"
              />
              <EmergencyButton
                icon="🔥"
                title="Пожарная служба"
                number={numbers.fire}
                onPress={() => makeCall(numbers.fire)}
                color="#F59E0B"
              />
            </View>

            <View style={styles.footer}>
              <Text
                style={[styles.locationText, { color: colors.textSecondary }]}
              >
                {location
                  ? `Определено по местоположению (${countryCode})`
                  : 'Используются номера по умолчанию'}
              </Text>
              <Text
                style={[
                  styles.disclaimer,
                  { color: colors.textSecondary, opacity: 0.6 },
                ]}
              >
                В экстренных случаях немедленно звони по этим номерам
              </Text>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalView: {
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  numbersList: {
    gap: 12,
  },
  emergencyButton: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderLeftWidth: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  buttonIcon: {
    fontSize: 32,
  },
  buttonText: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonNumber: {
    fontSize: 24,
    fontWeight: '800',
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  locationText: {
    fontSize: 14,
    marginBottom: 8,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
  },
});
