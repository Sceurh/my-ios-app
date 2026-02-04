// app/(tabs)/emergency/index.tsx
import {
  AlertTriangle,
  Clock,
  Heart,
  Phone,
  Shield,
  Users,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmergencyModal from '../../components/features/EmergencyModal';
import { useTheme } from '../../contexts/ThemeContext';

export default function EmergencyScreen() {
  const { colors } = useTheme();
  const [showNumbersModal, setShowNumbersModal] = useState(false);

  const emergencyContacts = [
    {
      icon: Phone,
      title: 'Экстренные номера',
      description: 'Прямой звонок в службы помощи',
      color: '#EF4444',
      onPress: () => setShowNumbersModal(true),
    },
    {
      icon: Heart,
      title: 'Техники успокоения',
      description: 'Мгновенные методы самопомощи',
      color: '#8B5CF6',
      onPress: () => Alert.alert('Скоро', 'Раздел в разработке'),
    },
    {
      icon: Users,
      title: 'Поддержка близких',
      description: 'Как попросить о помощи',
      color: '#3B82F6',
      onPress: () => Alert.alert('Скоро', 'Раздел в разработке'),
    },
    {
      icon: Shield,
      title: 'План безопасности',
      description: 'Что делать в кризисной ситуации',
      color: '#10B981',
      onPress: () => Alert.alert('Скоро', 'Раздел в разработке'),
    },
  ];

  const breathingExercise = () => {
    Alert.alert(
      'Дыхание 4-7-8',
      '1. Вдох через нос на 4 счета\n2. Задержка дыхания на 7 счетов\n3. Медленный выдох через рот на 8 счетов\n\nПовторите 4 раза.',
      [
        { text: 'Понятно', style: 'default' },
        {
          text: 'Запустить таймер',
          onPress: () => Alert.alert('Таймер', 'Скоро будет реализован'),
        },
      ],
    );
  };

  const groundingExercise = () => {
    Alert.alert(
      'Техника 5-4-3-2-1',
      'Назовите:\n\n5 вещей, которые видите\n4 вещи, которые чувствуете (осязание)\n3 звука, которые слышите\n2 запаха, которые ощущаете\n1 вкус во рту\n\nЭта техника возвращает в настоящее.',
      [{ text: 'Понятно', style: 'default' }],
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Заголовок */}
        <View style={styles.header}>
          <AlertTriangle size={32} color="#EF4444" />
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.text }]}>
              Экстренная помощь
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Если вам срочно нужна помощь
            </Text>
          </View>
        </View>

        {/* Предупреждение */}
        <View
          style={[
            styles.warning,
            { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
          ]}
        >
          <AlertTriangle size={20} color="#DC2626" />
          <Text style={[styles.warningText, { color: '#DC2626' }]}>
            В случае непосредственной угрозы жизни немедленно звоните 112
          </Text>
        </View>

        {/* Быстрые действия */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Быстрые действия
        </Text>

        <View style={styles.actionsGrid}>
          {emergencyContacts.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { borderLeftColor: item.color }]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: item.color + '20' },
                ]}
              >
                <item.icon size={24} color={item.color} />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>
                {item.title}
              </Text>
              <Text
                style={[
                  styles.actionDescription,
                  { color: colors.textSecondary },
                ]}
              >
                {item.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Техники первой помощи */}
        <Text
          style={[styles.sectionTitle, { color: colors.text, marginTop: 32 }]}
        >
          Техники первой помощи
        </Text>

        <View style={styles.techniques}>
          <TouchableOpacity
            style={[styles.technique, { backgroundColor: colors.surface }]}
            onPress={breathingExercise}
            activeOpacity={0.7}
          >
            <View style={styles.techniqueHeader}>
              <Clock size={20} color="#7C3AED" />
              <Text style={[styles.techniqueTitle, { color: colors.text }]}>
                Дыхание 4-7-8
              </Text>
            </View>
            <Text
              style={[
                styles.techniqueDescription,
                { color: colors.textSecondary },
              ]}
            >
              Успокаивает нервную систему за 2 минуты
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.technique, { backgroundColor: colors.surface }]}
            onPress={groundingExercise}
            activeOpacity={0.7}
          >
            <View style={styles.techniqueHeader}>
              <Shield size={20} color="#10B981" />
              <Text style={[styles.techniqueTitle, { color: colors.text }]}>
                Техника 5-4-3-2-1
              </Text>
            </View>
            <Text
              style={[
                styles.techniqueDescription,
                { color: colors.textSecondary },
              ]}
            >
              Возвращает в настоящее при тревоге
            </Text>
          </TouchableOpacity>
        </View>

        {/* Важная информация */}
        <View style={[styles.infoBox, { backgroundColor: colors.surface }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            Важно знать
          </Text>
          <View style={styles.infoList}>
            <Text style={[styles.infoItem, { color: colors.textSecondary }]}>
              • Просить о помощи — это нормально и правильно
            </Text>
            <Text style={[styles.infoItem, { color: colors.textSecondary }]}>
              • Кризисные состояния временны
            </Text>
            <Text style={[styles.infoItem, { color: colors.textSecondary }]}>
              • Вы не одиноки — помощь доступна 24/7
            </Text>
            <Text style={[styles.infoItem, { color: colors.textSecondary }]}>
              • Позаботьтесь о себе — это приоритет
            </Text>
          </View>
        </View>

        {/* Контакт доверия */}
        <TouchableOpacity
          style={[styles.trustLine, { backgroundColor: '#8B5CF6' }]}
          onPress={() => Linking.openURL('tel:88002000122')}
        >
          <Phone size={20} color="#FFFFFF" />
          <View style={styles.trustText}>
            <Text style={styles.trustTitle}>Телефон доверия</Text>
            <Text style={styles.trustNumber}>8-800-2000-122</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Модалка с номерами */}
      <EmergencyModal
        visible={showNumbersModal}
        onClose={() => setShowNumbersModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 24,
    gap: 12,
  },
  warningText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderLeftWidth: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  techniques: {
    gap: 12,
  },
  technique: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  techniqueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  techniqueTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  techniqueDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoBox: {
    padding: 20,
    borderRadius: 16,
    marginTop: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    fontSize: 14,
    lineHeight: 20,
  },
  trustLine: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  trustText: {
    flex: 1,
  },
  trustTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  trustNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
});
