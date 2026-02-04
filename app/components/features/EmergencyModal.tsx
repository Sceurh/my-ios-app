// app/components/features/EmergencyModal.tsx
import { Ionicons } from '@expo/vector-icons';
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { getLocales } from 'expo-localization';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  CRISIS_TIPS,
  EMERGENCY_NUMBERS,
  MOTIVATIONAL_MESSAGES,
} from '../../constants/emergency';
import { useTheme } from '../../contexts/ThemeContext';

type CountryCode = keyof typeof EMERGENCY_NUMBERS;

interface EmergencyModalProps {
  visible: boolean;
  onClose: () => void;
}

// Карта сопоставления кодов ISO со странами
const COUNTRY_MAPPING: Record<string, CountryCode> = {
  // Европа
  RU: 'RU',
  RUS: 'RU',
  UA: 'UA',
  UKR: 'UA',
  BY: 'BY',
  BLR: 'BY',
  KZ: 'KZ',
  KAZ: 'KZ',
  DE: 'DE',
  DEU: 'DE',
  FR: 'FR',
  FRA: 'FR',
  GB: 'UK',
  GBR: 'UK',
  UK: 'UK',
  IT: 'IT',
  ITA: 'IT',
  ES: 'ES',
  ESP: 'ES',
  PL: 'PL',
  POL: 'PL',
  NL: 'NL',
  NLD: 'NL',
  BE: 'BE',
  BEL: 'BE',
  CH: 'CH',
  CHE: 'CH',
  AT: 'AT',
  AUT: 'AT',
  SE: 'SE',
  SWE: 'SE',
  NO: 'NO',
  NOR: 'NO',
  FI: 'FI',
  FIN: 'FI',
  DK: 'DK',
  DNK: 'DK',
  CZ: 'CZ',
  CZE: 'CZ',
  SK: 'SK',
  SVK: 'SK',
  HU: 'HU',
  HUN: 'HU',
  RO: 'RO',
  ROU: 'RO',
  BG: 'BG',
  BGR: 'BG',
  GR: 'GR',
  GRC: 'GR',
  TR: 'TR',
  TUR: 'TR',

  // Северная Америка
  US: 'US',
  USA: 'US',
  CA: 'CA',
  CAN: 'CA',
  MX: 'MX',
  MEX: 'MX',

  // Южная Америка
  BR: 'BR',
  BRA: 'BR',
  AR: 'AR',
  ARG: 'AR',
  CO: 'CO',
  COL: 'CO',

  // Азия
  CN: 'CN',
  CHN: 'CN',
  JP: 'JP',
  JPN: 'JP',
  KR: 'KR',
  KOR: 'KR',
  IN: 'IN',
  IND: 'IN',
  ID: 'ID',
  IDN: 'ID',
  TH: 'TH',
  THA: 'TH',
  VN: 'VN',
  VNM: 'VN',

  // СНГ и Прибалтика
  UZ: 'UZ',
  UZB: 'UZ',
  KG: 'KG',
  KGZ: 'KG',
  TJ: 'TJ',
  TJK: 'TJ',
  TM: 'TM',
  TKM: 'TM',
  MD: 'MD',
  MDA: 'MD',
  AM: 'AM',
  ARM: 'AM',
  AZ: 'AZ',
  AZE: 'AZ',
  GE: 'GE',
  GEO: 'GE',
  LV: 'LV',
  LVA: 'LV',
  LT: 'LT',
  LTU: 'LT',
  EE: 'EE',
  EST: 'EE',

  // Африка
  ZA: 'ZA',
  ZAF: 'ZA',
  EG: 'EG',
  EGY: 'EG',
  NG: 'NG',
  NGA: 'NG',

  // Австралия и Океания
  AU: 'AU',
  AUS: 'AU',
  NZ: 'NZ',
  NZL: 'NZ',

  // Ближний Восток
  IL: 'IL',
  ISR: 'IL',
  SA: 'SA',
  SAU: 'SA',
  AE: 'AE',
  ARE: 'AE',
};

// Карта языков для определения страны по языку устройства
const LANGUAGE_MAPPING: Record<string, CountryCode> = {
  ru: 'RU',
  uk: 'UA',
  be: 'BY',
  kk: 'KZ',
  de: 'DE',
  fr: 'FR',
  en: 'US',
  it: 'IT',
  es: 'ES',
  pl: 'PL',
  nl: 'NL',
  sv: 'SE',
  no: 'NO',
  fi: 'FI',
  da: 'DK',
  cs: 'CZ',
  sk: 'SK',
  hu: 'HU',
  ro: 'RO',
  bg: 'BG',
  el: 'GR',
  tr: 'TR',
  pt: 'BR',
  ar: 'EG',
  he: 'IL',
  uz: 'UZ',
  ky: 'KG',
  tg: 'TJ',
  tk: 'TM',
  hy: 'AM',
  az: 'AZ',
  ka: 'GE',
  lv: 'LV',
  lt: 'LT',
  et: 'EE',
  zh: 'CN',
  ja: 'JP',
  ko: 'KR',
  hi: 'IN',
  id: 'ID',
  th: 'TH',
  vi: 'VN',
};

// Функция для определения страны по координатам
const getCountryFromCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<CountryCode> => {
  try {
    const geocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (geocode.length > 0) {
      const isoCountryCode = geocode[0].isoCountryCode;
      if (isoCountryCode && COUNTRY_MAPPING[isoCountryCode]) {
        return COUNTRY_MAPPING[isoCountryCode];
      }
    }

    return 'default';
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return 'default';
  }
};

// Функция для определения страны по языку устройства
const getCountryFromLocale = (): CountryCode => {
  try {
    const locales = getLocales();
    if (locales.length === 0) return 'default';

    const locale = locales[0];

    // Сначала проверяем регион
    if (locale.regionCode && COUNTRY_MAPPING[locale.regionCode]) {
      return COUNTRY_MAPPING[locale.regionCode];
    }

    // Затем проверяем язык
    if (locale.languageCode && LANGUAGE_MAPPING[locale.languageCode]) {
      return LANGUAGE_MAPPING[locale.languageCode];
    }

    return 'default';
  } catch (error) {
    console.error('Locale detection error:', error);
    return 'default';
  }
};

export default function EmergencyModal({
  visible,
  onClose,
}: EmergencyModalProps) {
  const { colors } = useTheme();
  const [countryCode, setCountryCode] = useState<CountryCode>('default');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [crisisTip, setCrisisTip] = useState('');
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [locationInfo, setLocationInfo] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Ref для предотвращения повторных запросов
  const isRequestingRef = useRef(false);

  // Выбираем случайные сообщения
  useEffect(() => {
    if (visible) {
      const randomMotivation =
        MOTIVATIONAL_MESSAGES[
          Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)
        ];
      const randomTip =
        CRISIS_TIPS[Math.floor(Math.random() * CRISIS_TIPS.length)];
      setMotivationalMessage(randomMotivation);
      setCrisisTip(randomTip);
      setErrorMessage('');
    }
  }, [visible]);

  const addDebugLog = useCallback((message: string) => {
    console.log(`[EmergencyModal] ${message}`);
    setDebugLog((prev) => [
      ...prev.slice(-5),
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  }, []);

  const requestLocation = useCallback(async (): Promise<void> => {
    if (!visible || isRequestingRef.current) return;

    isRequestingRef.current = true;
    setIsLoadingLocation(true);
    setDebugLog([]);
    setLocationInfo('');
    setErrorMessage('');
    setCountryCode('default');

    try {
      addDebugLog('Запрашиваем разрешение на геолокацию...');

      // 1. Запрашиваем разрешение
      const { status } = await Location.requestForegroundPermissionsAsync();
      addDebugLog(`Статус разрешения: ${status}`);

      if (status === 'granted') {
        addDebugLog('Разрешение получено. Получаем координаты...');

        // 2. Получаем местоположение (с таймаутом)
        const locationPromise = Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
          timeInterval: 5000,
        });

        // Таймаут 10 секунд
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Таймаут геолокации')), 10000),
        );

        const currentLocation = (await Promise.race([
          locationPromise,
          timeoutPromise,
        ])) as Location.LocationObject;

        const { latitude, longitude } = currentLocation.coords;
        addDebugLog(
          `Координаты: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        );

        setLocationInfo(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

        // 3. Определяем страну через reverse geocoding
        addDebugLog('Определяем страну по координатам...');
        const country = await getCountryFromCoordinates(latitude, longitude);

        if (country !== 'default') {
          addDebugLog(`Определена страна: ${country} (по координатам)`);
          setCountryCode(country);
        } else {
          // Если reverse geocoding не сработал, определяем по языку
          addDebugLog(
            'Reverse geocoding не дал результат. Определяем по языку...',
          );
          const localeCountry = getCountryFromLocale();
          setCountryCode(localeCountry);
          addDebugLog(`Определена страна: ${localeCountry} (по языку)`);
        }
      } else {
        // Если пользователь отказал
        addDebugLog(
          'Разрешение не получено. Определяем по языку устройства...',
        );
        const country = getCountryFromLocale();
        addDebugLog(`Страна определена как: ${country} (по языку)`);
        setCountryCode(country);
        setLocationInfo('Недоступно (разрешение не предоставлено)');
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Неизвестная ошибка';
      addDebugLog(`Ошибка: ${errorMsg}`);
      setErrorMessage(`Ошибка определения: ${errorMsg}`);

      // Фолбэк на определение по языку
      const country = getCountryFromLocale();
      setCountryCode(country);
      setLocationInfo('Ошибка определения');
      addDebugLog(`Используем фолбэк: ${country}`);
    } finally {
      setIsLoadingLocation(false);
      isRequestingRef.current = false;
      addDebugLog('Завершено');
    }
  }, [addDebugLog, visible]);

  useEffect(() => {
    if (visible) {
      requestLocation();
    }

    // Сброс ref при закрытии модального окна
    return () => {
      isRequestingRef.current = false;
    };
  }, [visible, requestLocation]);

  const makeCall = useCallback((number: string) => {
    // Проверяем формат номера
    const cleanNumber = number.replace(/[^+\d]/g, '');

    if (!cleanNumber || cleanNumber === 'N/A') {
      Alert.alert('Ошибка', 'Номер телефона недоступен для этой страны');
      return;
    }

    Linking.openURL(`tel:${cleanNumber}`).catch((err) => {
      console.error('Ошибка звонка:', err);
      Alert.alert(
        'Ошибка',
        'Не удалось совершить звонок. Проверьте номер и разрешения.',
      );
    });
  }, []);

  const numbers = EMERGENCY_NUMBERS[countryCode] || EMERGENCY_NUMBERS.default;

  // Компонент кнопки экстренного вызова
  const EmergencyButton = useCallback(
    ({
      icon,
      title,
      number,
      description,
      onPress,
      color,
      isAnonymous = false,
    }: {
      icon: string;
      title: string;
      number: string;
      description?: string;
      onPress: () => void;
      color: string;
      isAnonymous?: boolean;
    }) => (
      <TouchableOpacity
        style={[styles.emergencyButton, { borderLeftColor: color }]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!number || number === 'N/A'}
      >
        <View style={styles.buttonContent}>
          <View style={styles.buttonIconContainer}>
            <Text style={styles.buttonIcon}>{icon}</Text>
            {isAnonymous && (
              <View style={styles.anonymousBadge}>
                <Text style={styles.anonymousText}>АНОНИМНО</Text>
              </View>
            )}
          </View>
          <View style={styles.buttonText}>
            <Text style={[styles.buttonTitle, { color: colors.text }]}>
              {title}
            </Text>
            {description && (
              <Text
                style={[
                  styles.buttonDescription,
                  { color: colors.textSecondary },
                ]}
              >
                {description}
              </Text>
            )}
            <Text style={[styles.buttonNumber, { color }]}>
              {number && number !== 'N/A' ? number : 'Недоступно'}
            </Text>
          </View>
          {number && number !== 'N/A' && (
            <Ionicons name="call-outline" size={24} color={color} />
          )}
        </View>
      </TouchableOpacity>
    ),
    [colors],
  );

  // Добавляем кнопку для экстренной помощи (suicide)
  const addSuicideButton =
    numbers.suicide !== numbers.psychological && numbers.suicide.trim() !== '';

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.centeredView}>
            <View
              style={[styles.modalView, { backgroundColor: colors.surface }]}
            >
              {/* Отладочная информация (только для разработки) */}
              {__DEV__ && (
                <View style={[styles.debugBox, { backgroundColor: '#1E293B' }]}>
                  <Text style={styles.debugTitle}>🔍 Отладка геолокации</Text>
                  {debugLog.map((log, index) => (
                    <Text key={index} style={styles.debugText}>
                      {log}
                    </Text>
                  ))}
                  <Text style={styles.debugText}>
                    Статус: {isLoadingLocation ? 'Загружается...' : 'Готово'}
                  </Text>
                  <Text style={styles.debugText}>
                    Определенная страна: {numbers.country} ({countryCode})
                  </Text>
                  {locationInfo && (
                    <Text style={styles.debugText}>
                      Координаты: {locationInfo}
                    </Text>
                  )}
                  {errorMessage && (
                    <Text style={[styles.debugText, { color: '#EF4444' }]}>
                      {errorMessage}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={styles.debugButton}
                    onPress={requestLocation}
                  >
                    <Text style={styles.debugButtonText}>Обновить</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Заголовок и кнопка закрытия */}
              <View style={styles.header}>
                <View style={styles.titleContainer}>
                  <Text style={[styles.emoji]}>🆘</Text>
                  <View>
                    <Text style={[styles.title, { color: colors.text }]}>
                      Экстренная помощь
                    </Text>
                    <Text
                      style={[styles.subtitle, { color: colors.textSecondary }]}
                    >
                      Вы не одиноки. Помощь доступна 24/7
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {/* Мотивационное сообщение */}
              <View
                style={[
                  styles.motivationBox,
                  { backgroundColor: colors.accent + '15' },
                ]}
              >
                <Ionicons
                  name="heart-outline"
                  size={20}
                  color={colors.accent}
                />
                <Text style={[styles.motivationText, { color: colors.text }]}>
                  {motivationalMessage}
                </Text>
              </View>

              {/* Локация */}
              <View style={styles.locationInfo}>
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={colors.textSecondary}
                />
                <Text
                  style={[styles.locationText, { color: colors.textSecondary }]}
                >
                  {isLoadingLocation
                    ? 'Определяем ваше местоположение...'
                    : `Местоположение: ${numbers.country}${locationInfo ? ` (${locationInfo})` : ''}`}
                </Text>
              </View>

              {/* Экстренные номера */}
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Немедленная помощь
              </Text>

              <View style={styles.numbersList}>
                <EmergencyButton
                  icon="🚓"
                  title="Полиция"
                  number={numbers.police}
                  onPress={() => makeCall(numbers.police)}
                  color="#3B82F6"
                />
                <EmergencyButton
                  icon="🏥"
                  title="Скорая помощь"
                  number={numbers.ambulance}
                  onPress={() => makeCall(numbers.ambulance)}
                  color="#EF4444"
                />
                <EmergencyButton
                  icon="🔥"
                  title="Пожарная служба"
                  number={numbers.fire}
                  onPress={() => makeCall(numbers.fire)}
                  color="#F59E0B"
                />
              </View>

              {/* Психологическая помощь */}
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text, marginTop: 24 },
                ]}
              >
                Психологическая поддержка
              </Text>

              <View style={styles.numbersList}>
                <EmergencyButton
                  icon="🧠"
                  title="Кризисная помощь"
                  number={numbers.psychological}
                  description="Круглосуточно, анонимно"
                  onPress={() => makeCall(numbers.psychological)}
                  color="#8B5CF6"
                  isAnonymous
                />
                {addSuicideButton && (
                  <EmergencyButton
                    icon="🆘"
                    title="Экстренная помощь"
                    number={numbers.suicide}
                    description="Кризисная линия"
                    onPress={() => makeCall(numbers.suicide)}
                    color="#DC2626"
                    isAnonymous
                  />
                )}
                <EmergencyButton
                  icon="🫂"
                  title="Анонимная помощь"
                  number={numbers.anonymous}
                  description="Ваши данные защищены"
                  onPress={() => makeCall(numbers.anonymous)}
                  color="#10B981"
                  isAnonymous
                />
                <EmergencyButton
                  icon="👩"
                  title="Помощь женщинам"
                  number={numbers.women}
                  description="Конфиденциально"
                  onPress={() => makeCall(numbers.women)}
                  color="#EC4899"
                  isAnonymous
                />
                <EmergencyButton
                  icon="👶"
                  title="Помощь детям"
                  number={numbers.children}
                  description="Безопасно для детей"
                  onPress={() => makeCall(numbers.children)}
                  color="#06B6D4"
                  isAnonymous
                />
              </View>

              {/* Быстрые советы */}
              <View
                style={[styles.tipsBox, { backgroundColor: colors.background }]}
              >
                <Text style={[styles.tipsTitle, { color: colors.text }]}>
                  💡 Быстрая помощь сейчас
                </Text>
                <Text
                  style={[styles.tipsContent, { color: colors.textSecondary }]}
                >
                  {crisisTip}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.moreTipsButton,
                    { borderColor: colors.border },
                  ]}
                  onPress={() => {
                    const randomTip =
                      CRISIS_TIPS[
                        Math.floor(Math.random() * CRISIS_TIPS.length)
                      ];
                    setCrisisTip(randomTip);
                  }}
                >
                  <Text style={[styles.moreTipsText, { color: colors.accent }]}>
                    Ещё один совет
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Важная информация */}
              <View style={styles.infoSection}>
                <View style={styles.infoItem}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color="#10B981"
                  />
                  <Text
                    style={[styles.infoText, { color: colors.textSecondary }]}
                  >
                    Все звонки на психологические линии —{' '}
                    <Text style={{ color: '#10B981' }}>абсолютно анонимны</Text>
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="time-outline" size={18} color="#3B82F6" />
                  <Text
                    style={[styles.infoText, { color: colors.textSecondary }]}
                  >
                    Помощь доступна{' '}
                    <Text style={{ color: '#3B82F6' }}>24 часа в сутки</Text>, 7
                    дней в неделю
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="card-outline" size={18} color="#8B5CF6" />
                  <Text
                    style={[styles.infoText, { color: colors.textSecondary }]}
                  >
                    Все услуги —{' '}
                    <Text style={{ color: '#8B5CF6' }}>бесплатны</Text>
                  </Text>
                </View>
              </View>

              {/* Кнопка "Я в безопасности" */}
              <TouchableOpacity
                style={[styles.safeButton, { backgroundColor: '#10B981' }]}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                <Text style={styles.safeButtonText}>Я в безопасности</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </BlurView>
    </Modal>
  );
}

// Стили остаются без изменений...
const styles = StyleSheet.create({
  // ... все стили из вашего кода оставляем без изменений
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 40,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: '100%',
  },
  modalView: {
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  debugBox: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  debugTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  debugText: {
    color: '#CBD5E1',
    fontSize: 11,
    marginBottom: 2,
    lineHeight: 14,
  },
  debugButton: {
    backgroundColor: '#3B82F6',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  closeButton: {
    padding: 4,
  },
  motivationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    gap: 12,
  },
  motivationText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    flex: 1,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  locationText: {
    fontSize: 13,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
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
  buttonIconContainer: {
    position: 'relative',
  },
  buttonIcon: {
    fontSize: 32,
  },
  anonymousBadge: {
    position: 'absolute',
    top: -6,
    right: -12,
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 70,
  },
  anonymousText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    textAlign: 'center',
  },
  buttonText: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  buttonDescription: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 4,
  },
  buttonNumber: {
    fontSize: 22,
    fontWeight: '800',
  },
  tipsBox: {
    padding: 20,
    borderRadius: 16,
    marginTop: 24,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  tipsContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  moreTipsButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  moreTipsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    gap: 12,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  safeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  safeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
