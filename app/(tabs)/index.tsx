// app/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Компоненты
import EmergencyModal from '../components/features/EmergencyModal';
import MoodPicker from '../components/features/MoodPicker';
import PracticeModal from '../components/features/PracticeModal';
import ProgressChart from '../components/features/ProgressChart';
import QuickActions from '../components/QuickActions';
import TipCard from '../components/TipCard';

// Контексты
import { PRACTICES } from '../constants/practices';
import { DAILY_TIPS } from '../constants/tips';
import { useTheme } from '../contexts/ThemeContext';

export default function HomeScreen() {
  const { colors } = useTheme();
  const [selectedPractice, setSelectedPractice] = useState<string | null>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [dailyTip, setDailyTip] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Выбираем случайный совет при загрузке
  useEffect(() => {
    selectRandomTip();
  }, []);

  const selectRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * DAILY_TIPS.length);
    setDailyTip(DAILY_TIPS[randomIndex]);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    selectRandomTip();
    // Имитация загрузки
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handlePracticePress = (practiceId: string) => {
    if (practiceId === 'emergency') {
      setShowEmergencyModal(true);
    } else {
      setSelectedPractice(practiceId);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={
          colors.background === '#0F172A' ? 'light-content' : 'dark-content'
        }
        backgroundColor={colors.background}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        {/* Заголовок */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              Добро пожаловать
            </Text>
            <Text style={[styles.appName, { color: colors.text }]}>
              MindCare
            </Text>
          </View>
        </View>

        {/* Селектор настроения */}
        <MoodPicker />

        {/* Совет дня */}
        <TipCard tip={dailyTip} />

        {/* Быстрые действия */}
        <QuickActions onPressAction={handlePracticePress} />

        {/* Прогресс недели */}
        <ProgressChart />

        {/* Цитата дня */}
        <View style={[styles.quoteCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.quoteMark, { color: colors.textSecondary }]}>
            ❝
          </Text>
          <Text style={[styles.quote, { color: colors.text }]}>
            Забота о психическом здоровье — это не пункт в списке дел.
          </Text>
          <Text style={[styles.quote, { color: colors.text }]}>
            Это основа, на которой строится всё остальное.
          </Text>
          <Text style={[styles.quoteAuthor, { color: colors.textSecondary }]}>
            — Современная психология
          </Text>
        </View>
      </ScrollView>

      {/* Модалка практики */}
      {selectedPractice &&
        PRACTICES[selectedPractice as keyof typeof PRACTICES] && (
          <PracticeModal
            visible={!!selectedPractice}
            onClose={() => setSelectedPractice(null)}
            practice={PRACTICES[selectedPractice as keyof typeof PRACTICES]}
          />
        )}

      {/* Модалка экстренной помощи */}
      <EmergencyModal
        visible={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
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
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  quoteCard: {
    borderRadius: 20,
    padding: 24,
    marginTop: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  quoteMark: {
    fontSize: 48,
    marginBottom: 12,
  },
  quote: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
});
