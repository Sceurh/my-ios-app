// app/(tabs)/explore/index.tsx
import {
  BookOpen,
  FileText,
  Headphones,
  Star,
  TrendingUp,
  Video,
} from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';

const CATEGORIES = [
  {
    id: 'articles',
    title: 'Статьи',
    description: 'Научные материалы о ментальном здоровье',
    icon: FileText,
    color: '#3B82F6',
    count: 24,
  },
  {
    id: 'meditations',
    title: 'Медитации',
    description: 'Аудио-гиды для практик осознанности',
    icon: Headphones,
    color: '#8B5CF6',
    count: 18,
  },
  {
    id: 'courses',
    title: 'Курсы',
    description: 'Пошаговые программы развития',
    icon: BookOpen,
    color: '#10B981',
    count: 8,
  },
  {
    id: 'videos',
    title: 'Видео',
    description: 'Лекции и практические занятия',
    icon: Video,
    color: '#EF4444',
    count: 32,
  },
];

const POPULAR_CONTENT = [
  {
    id: '1',
    title: 'Как справляться с тревогой',
    type: 'Статья',
    duration: '8 мин',
    likes: 245,
    color: '#3B82F6',
  },
  {
    id: '2',
    title: 'Утренняя медитация',
    type: 'Аудио',
    duration: '10 мин',
    likes: 189,
    color: '#8B5CF6',
  },
  {
    id: '3',
    title: 'Эмоциональный интеллект',
    type: 'Курс',
    duration: '2 недели',
    likes: 156,
    color: '#10B981',
  },
  {
    id: '4',
    title: 'Техники дыхания',
    type: 'Видео',
    duration: '15 мин',
    likes: 312,
    color: '#EF4444',
  },
];

export default function ExploreScreen() {
  const { colors } = useTheme();

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
          <Text style={[styles.title, { color: colors.text }]}>
            Исследовать
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Откройте новые пути к заботе о себе
          </Text>
        </View>

        {/* Категории */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Категории
        </Text>

        <View style={styles.categories}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: colors.surface }]}
              activeOpacity={0.7}
            >
              <View style={styles.categoryHeader}>
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color + '20' },
                  ]}
                >
                  <category.icon size={24} color={category.color} />
                </View>
                <Text style={[styles.categoryCount, { color: category.color }]}>
                  {category.count}
                </Text>
              </View>
              <Text style={[styles.categoryTitle, { color: colors.text }]}>
                {category.title}
              </Text>
              <Text
                style={[
                  styles.categoryDescription,
                  { color: colors.textSecondary },
                ]}
              >
                {category.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Популярное */}
        <View style={styles.popularHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Популярное сейчас
          </Text>
          <TrendingUp size={20} color={colors.textSecondary} />
        </View>

        <View style={styles.popularList}>
          {POPULAR_CONTENT.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.popularCard, { backgroundColor: colors.surface }]}
              activeOpacity={0.7}
            >
              <View
                style={[styles.popularBadge, { backgroundColor: item.color }]}
              >
                <Text style={styles.popularBadgeText}>{item.type}</Text>
              </View>
              <Text style={[styles.popularTitle, { color: colors.text }]}>
                {item.title}
              </Text>
              <View style={styles.popularFooter}>
                <Text
                  style={[
                    styles.popularDuration,
                    { color: colors.textSecondary },
                  ]}
                >
                  {item.duration}
                </Text>
                <View style={styles.popularLikes}>
                  <Star size={14} color={item.color} fill={item.color} />
                  <Text
                    style={[
                      styles.popularLikesText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {item.likes}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Для тебя */}
        <Text
          style={[styles.sectionTitle, { color: colors.text, marginTop: 32 }]}
        >
          Рекомендуем вам
        </Text>

        <View style={[styles.recommended, { backgroundColor: colors.surface }]}>
          <View style={styles.recommendedHeader}>
            <Text style={[styles.recommendedTitle, { color: colors.text }]}>
              Персональная подборка
            </Text>
            <Text
              style={[
                styles.recommendedSubtitle,
                { color: colors.textSecondary },
              ]}
            >
              На основе вашей активности
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.recommendedButton,
              { backgroundColor: colors.accent },
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.recommendedButtonText}>
              Смотреть рекомендации
            </Text>
          </TouchableOpacity>
        </View>

        {/* Новые поступления */}
        <Text
          style={[styles.sectionTitle, { color: colors.text, marginTop: 32 }]}
        >
          Новые материалы
        </Text>

        <View style={styles.newList}>
          {[1, 2].map((item) => (
            <View
              key={item}
              style={[styles.newCard, { backgroundColor: colors.surface }]}
            >
              <View
                style={[styles.newImage, { backgroundColor: colors.border }]}
              />
              <View style={styles.newContent}>
                <Text style={[styles.newTitle, { color: colors.text }]}>
                  Новый курс: Управление стрессом
                </Text>
                <Text
                  style={[
                    styles.newDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Практические техники для повседневной жизни
                </Text>
                <View style={styles.newBadge}>
                  <Text style={[styles.newBadgeText, { color: colors.accent }]}>
                    НОВОЕ
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  categoryCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryCount: {
    fontSize: 18,
    fontWeight: '700',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.8,
  },
  popularHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  popularList: {
    gap: 12,
    marginBottom: 32,
  },
  popularCard: {
    padding: 16,
    borderRadius: 12,
  },
  popularBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  popularTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
  },
  popularFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  popularDuration: {
    fontSize: 12,
    opacity: 0.8,
  },
  popularLikes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  popularLikesText: {
    fontSize: 12,
  },
  recommended: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
  },
  recommendedHeader: {
    marginBottom: 16,
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  recommendedSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  recommendedButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  recommendedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  newList: {
    gap: 16,
    marginBottom: 40,
  },
  newCard: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  newImage: {
    width: 80,
    height: 100,
  },
  newContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  newTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  newDescription: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.8,
    marginBottom: 8,
  },
  newBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
