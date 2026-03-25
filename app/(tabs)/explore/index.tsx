// app/(tabs)/explore/index.tsx
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Brain,
  Flame,
  Heart,
  Leaf,
  Library,
  Moon,
  Music,
  Plus,
  Sparkles,
  Star,
  TrendingUp,
  Video,
  Zap,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/database/api';

// Типы для контента
interface ContentItem {
  id: string;
  type: 'article' | 'practice' | 'meditation' | 'video' | 'tip';
  title: string;
  description: string | null;
  content: string | null;
  cover_url: string | null;
  tags: string[];
  is_published: boolean;
  created_at: string;
}

// Категории
const CATEGORIES = [
  {
    id: 'all',
    title: 'Всё',
    icon: Library,
    color: '#6366F1',
    type: null,
  },
  {
    id: 'article',
    title: 'Статьи',
    icon: BookOpen,
    color: '#3B82F6',
    type: 'article',
  },
  {
    id: 'practice',
    title: 'Практики',
    icon: Heart,
    color: '#EC489A',
    type: 'practice',
  },
  {
    id: 'meditation',
    title: 'Медитации',
    icon: Music,
    color: '#8B5CF6',
    type: 'meditation',
  },
  {
    id: 'tip',
    title: 'Советы',
    icon: Sparkles,
    color: '#F59E0B',
    type: 'tip',
  },
  {
    id: 'video',
    title: 'Видео',
    icon: Video,
    color: '#EF4444',
    type: 'video',
  },
];

// Темы для рекомендаций
const THEMES = [
  { id: 'anxiety', title: 'Тревога', icon: Brain, color: '#3B82F6' },
  { id: 'stress', title: 'Стресс', icon: Zap, color: '#F59E0B' },
  { id: 'sleep', title: 'Сон', icon: Moon, color: '#8B5CF6' },
  { id: 'focus', title: 'Фокус', icon: Flame, color: '#EF4444' },
  { id: 'calm', title: 'Спокойствие', icon: Leaf, color: '#10B981' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, isGuest, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [popularContent, setPopularContent] = useState<ContentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Загрузка контента
  const loadContent = useCallback(async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('content_items')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      const category = CATEGORIES.find((c) => c.id === selectedCategory);
      if (category?.type) {
        query = query.eq('type', category.type);
      }

      const { data, error } = await query;

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error loading content:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить контент');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  // Загрузка популярного контента
  const loadPopularContent = useCallback(async () => {
    try {
      // Получаем все сохранения
      const { data: savedData, error: savedError } = await supabase
        .from('saved_content')
        .select('content_id');

      if (savedError) throw savedError;

      // Считаем количество сохранений для каждого content_id
      const counts: Record<string, number> = {};
      savedData?.forEach((item) => {
        counts[item.content_id] = (counts[item.content_id] || 0) + 1;
      });

      // Получаем топ-5 ID
      const topIds = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id]) => id);

      if (topIds.length === 0) {
        setPopularContent([]);
        return;
      }

      // Загружаем контент по топ-5 ID
      const { data: contentData } = await supabase
        .from('content_items')
        .select('*')
        .in('id', topIds)
        .eq('is_published', true);

      setPopularContent(contentData || []);
    } catch (error) {
      console.error('Error loading popular content:', error);
    }
  }, []);

  // Загрузка сохраненного контента пользователя
  const loadSavedContent = useCallback(async () => {
    if (isGuest || !user) return;

    try {
      const { data, error } = await supabase
        .from('saved_content')
        .select('content_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const savedSet = new Set(data?.map((item) => item.content_id) || []);
      setSavedIds(savedSet);
    } catch (error) {
      console.error('Error loading saved content:', error);
    }
  }, [user, isGuest]);

  // Сохранение/удаление из избранного
  const toggleSaved = useCallback(
    async (contentId: string) => {
      if (isGuest) {
        Alert.alert(
          'Войдите в аккаунт',
          'Чтобы сохранять материалы, пожалуйста, войдите в аккаунт',
          [
            { text: 'Отмена', style: 'cancel' },
            {
              text: 'Войти',
              onPress: () => router.push('/auth/login'),
            },
          ],
        );
        return;
      }

      try {
        const isSaved = savedIds.has(contentId);

        if (isSaved) {
          const { error } = await supabase
            .from('saved_content')
            .delete()
            .eq('user_id', user!.id)
            .eq('content_id', contentId);

          if (error) throw error;

          setSavedIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(contentId);
            return newSet;
          });
        } else {
          const { error } = await supabase
            .from('saved_content')
            .insert({ user_id: user!.id, content_id: contentId });

          if (error) throw error;

          setSavedIds((prev) => new Set(prev).add(contentId));
        }
      } catch (error) {
        console.error('Error toggling saved:', error);
        Alert.alert('Ошибка', 'Не удалось сохранить материал');
      }
    },
    [user, isGuest, savedIds, router],
  );

  useFocusEffect(
    useCallback(() => {
      loadContent();
      loadPopularContent();
      loadSavedContent();
    }, [loadContent, loadPopularContent, loadSavedContent]),
  );

  const renderContentItem = ({ item }: { item: ContentItem }) => {
    const category = CATEGORIES.find((c) => c.type === item.type);
    const Icon = category?.icon || BookOpen;
    const isSaved = savedIds.has(item.id);

    return (
      <TouchableOpacity
        style={[styles.contentCard, { backgroundColor: colors.surface }]}
        activeOpacity={0.7}
        onPress={() => {
          router.push({
            pathname: '/content/detail',
            params: { id: item.id },
          });
        }}
      >
        <View style={styles.contentHeader}>
          <View
            style={[
              styles.contentBadge,
              { backgroundColor: category?.color + '20' },
            ]}
          >
            <Icon size={16} color={category?.color} />
            <Text style={[styles.contentBadgeText, { color: category?.color }]}>
              {category?.title || item.type}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => toggleSaved(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isSaved ? (
              <BookmarkCheck size={22} color={colors.accent} />
            ) : (
              <Bookmark size={22} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>

        <Text style={[styles.contentTitle, { color: colors.text }]}>
          {item.title}
        </Text>

        {item.description && (
          <Text
            style={[styles.contentDescription, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        )}

        <View style={styles.contentFooter}>
          {item.tags && item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.slice(0, 2).map((tag, index) => (
                <View
                  key={index}
                  style={[styles.tag, { backgroundColor: colors.border }]}
                >
                  <Text
                    style={[styles.tagText, { color: colors.textSecondary }]}
                  >
                    #{tag}
                  </Text>
                </View>
              ))}
              {item.tags.length > 2 && (
                <Text
                  style={[styles.moreTags, { color: colors.textSecondary }]}
                >
                  +{item.tags.length - 2}
                </Text>
              )}
            </View>
          )}
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {new Date(item.created_at).toLocaleDateString('ru-RU')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategory = ({ item }: { item: (typeof CATEGORIES)[0] }) => {
    const isSelected = selectedCategory === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          { backgroundColor: isSelected ? colors.accent : colors.surface },
        ]}
        onPress={() => setSelectedCategory(item.id)}
        activeOpacity={0.7}
      >
        <item.icon size={20} color={isSelected ? '#FFFFFF' : item.color} />
        <Text
          style={[
            styles.categoryButtonText,
            { color: isSelected ? '#FFFFFF' : colors.text },
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading && content.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Загрузка материалов...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Заголовок с кнопкой для админа */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>
              Исследовать
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Откройте новые практики для заботы о себе
            </Text>
          </View>
          {isAdmin && (
            <TouchableOpacity
              style={[styles.adminButton, { backgroundColor: colors.accent }]}
              onPress={() => router.push('/admin/create-content')}
              activeOpacity={0.8}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.adminButtonText}>Добавить</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Категории */}
        <View style={styles.categoriesSection}>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Популярное сейчас */}
        {popularContent.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={22} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Популярное сейчас
              </Text>
            </View>
            <View style={styles.popularGrid}>
              {popularContent.slice(0, 3).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.popularCard,
                    { backgroundColor: colors.surface },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => {
                    router.push({
                      pathname: '/content/detail',
                      params: { id: item.id },
                    });
                  }}
                >
                  <Text
                    style={[styles.popularTitle, { color: colors.text }]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <View style={styles.popularFooter}>
                    <Star
                      size={14}
                      color={colors.accent}
                      fill={colors.accent}
                    />
                    <Text
                      style={[
                        styles.popularLikes,
                        { color: colors.textSecondary },
                      ]}
                    >
                      В тренде
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Все материалы */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Library size={22} color={colors.accent} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {selectedCategory === 'all'
                ? 'Все материалы'
                : CATEGORIES.find((c) => c.id === selectedCategory)?.title}
            </Text>
          </View>

          {content.length === 0 ? (
            <View
              style={[styles.emptyState, { backgroundColor: colors.surface }]}
            >
              <BookOpen size={48} color={colors.textSecondary} />
              <Text
                style={[styles.emptyStateText, { color: colors.textSecondary }]}
              >
                В этой категории пока нет материалов
              </Text>
            </View>
          ) : (
            <FlatList
              data={content}
              renderItem={renderContentItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.contentList}
            />
          )}
        </View>

        {/* Темы для изучения */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Sparkles size={22} color={colors.accent} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Темы для изучения
            </Text>
          </View>
          <View style={styles.themesGrid}>
            {THEMES.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                style={[styles.themeCard, { backgroundColor: colors.surface }]}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.themeIcon,
                    { backgroundColor: theme.color + '20' },
                  ]}
                >
                  <theme.icon size={24} color={theme.color} />
                </View>
                <Text style={[styles.themeTitle, { color: colors.text }]}>
                  {theme.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 20,
    opacity: 0.8,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  adminButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesSection: {
    marginBottom: 32,
  },
  categoriesList: {
    gap: 12,
    paddingHorizontal: 4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  contentList: {
    gap: 12,
  },
  contentCard: {
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  contentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 24,
  },
  contentDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    opacity: 0.8,
  },
  contentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  moreTags: {
    fontSize: 11,
    fontWeight: '500',
  },
  date: {
    fontSize: 11,
    opacity: 0.6,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  popularCard: {
    flex: 1,
    minWidth: '30%',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  popularTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 18,
  },
  popularFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  popularLikes: {
    fontSize: 11,
    opacity: 0.7,
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeCard: {
    width: '23%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  themeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeTitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
