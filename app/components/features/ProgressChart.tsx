// app/components/features/ProgressChart.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { MOODS } from '../../constants/themes';
import { useMood } from '../../contexts/MoodContext';
import { useTheme } from '../../contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function ProgressChart() {
  const { colors } = useTheme();
  const { moodHistory, getWeekStats } = useMood();
  const [chartData, setChartData] = useState<{
    labels: string[];
    data: number[];
  }>({
    labels: [],
    data: [],
  });

  const loadChartData = useCallback(() => {
    // Берем последние 7 настроений
    const lastWeekMoods = moodHistory.slice(-7);

    // Преобразуем в числовые значения
    const moodValues = lastWeekMoods.map((entry) => {
      switch (entry.mood) {
        case 'calm':
          return 8;
        case 'energy':
          return 9;
        case 'focus':
          return 7;
        case 'rest':
          return 6;
        default:
          return 5;
      }
    });

    // Формируем даты
    const dateLabels = lastWeekMoods.map((entry) => {
      const date = new Date(entry.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    // Если данных меньше 7 дней, добавляем заглушки
    if (moodValues.length < 7) {
      const needed = 7 - moodValues.length;
      for (let i = 0; i < needed; i++) {
        moodValues.unshift(5);
        dateLabels.unshift('');
      }
    }

    setChartData({
      labels: dateLabels,
      data: moodValues,
    });
  }, [moodHistory]);

  useEffect(() => {
    loadChartData();
  }, [loadChartData]);

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (_opacity = 1) => colors.accent,
    labelColor: (_opacity = 1) => colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.accent,
    },
  };

  const stats = getWeekStats();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Твоя неделя заботы
        </Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.accent }]}>
              {moodHistory.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              записей
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.accent }]}>
              {Object.values(stats).reduce((a, b) => a + b, 0)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              за неделю
            </Text>
          </View>
        </View>
      </View>

      {chartData.data.length > 0 && (
        <LineChart
          data={{
            labels: chartData.labels,
            datasets: [
              {
                data: chartData.data,
                color: (_opacity = 1) => colors.accent,
                strokeWidth: 3,
              },
            ],
          }}
          width={width - 80}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={false}
          withShadow={false}
          segments={4}
        />
      )}

      <View style={styles.moodStats}>
        {Object.entries(stats).map(([mood, count]) => {
          const moodData = MOODS.find((m) => m.id === mood);
          if (!moodData) return null;

          return (
            <View key={mood} style={styles.moodStatItem}>
              <Text style={[styles.moodEmoji, { color: moodData.color }]}>
                {moodData.emoji}
              </Text>
              <Text style={[styles.moodCount, { color: colors.text }]}>
                {count}
              </Text>
              <Text style={[styles.moodLabel, { color: colors.textSecondary }]}>
                {moodData.label}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          График показывает твое эмоциональное состояние за неделю
        </Text>
        <Text
          style={[styles.hint, { color: colors.textSecondary, opacity: 0.6 }]}
        >
          Чем выше линия, тем лучше настроение
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  moodStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    marginBottom: 12,
  },
  moodStatItem: {
    alignItems: 'center',
    gap: 4,
  },
  moodEmoji: {
    fontSize: 20,
  },
  moodCount: {
    fontSize: 16,
    fontWeight: '700',
  },
  moodLabel: {
    fontSize: 10,
  },
  footer: {
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
  },
});
