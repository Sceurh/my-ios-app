// app/(tabs)/library/index.tsx
import { useFocusEffect, useRouter } from 'expo-router';
import {
  BookOpen,
  Bookmark,
  FileText,
  Heart,
  Library,
  Trash2,
} from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  GestureResponderEvent,
  Pressable,
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
import { SavedContentWithDetails } from '../../types';

const TYPE_CONFIG: Record<string, { icon: any; color: string; label: string }> =
  {
    article: { icon: FileText, color: '#3B82F6', label: 'Статья' },
    meditation: { icon: BookOpen, color: '#8B5CF6', label: 'Медитация' },
    practice: { icon: Heart, color: '#10B981', label: 'Практика' },
    tip: { icon: Bookmark, color: '#F59E0B', label: 'Совет' },
    video: { icon: BookOpen, color: '#EF4444', label: 'Видео' },
  };

// Выносим форматирование даты для оптимизации
const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('ru-RU');
};

export default function LibraryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, isGuest } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savedItems, setSavedItems] = useState<SavedContentWithDetails[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');

  const loadSavedContent = useCallback(async () => {
    if (isGuest || !user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_content')
        .select(
          `
          content_id,
          created_at,
          content_items!inner (
            id,
            type,
            title,
            description,
            tags
          )
        `,
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Прямое преобразование, content_items уже объект
      const typedData = (data || []).map((item: any) => ({
        content_id: item.content_id,
        created_at: item.created_at,
        content_items: item.content_items || null,
      }));

      setSavedItems(typedData);
    } catch (error) {
      console.error('Error loading saved content:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить сохраненные материалы');
    } finally {
      setLoading(false);
    }
  }, [user, isGuest]);

  const handleDelete = useCallback(
    async (contentId: string) => {
      if (!user) return;

      Alert.alert(
        'Удалить',
        'Вы уверены, что хотите удалить этот материал из сохраненного?',
        [
          { text: 'Отмена', style: 'cancel' },
          {
            text: 'Удалить',
            style: 'destructive',
            onPress: async () => {
              try {
                const { error } = await supabase
                  .from('saved_content')
                  .delete()
                  .eq('user_id', user.id)
                  .eq('content_id', contentId);

                if (error) throw error;
                setSavedItems((prev) =>
                  prev.filter((item) => item.content_id !== contentId),
                );
              } catch (error) {
                console.error('Error deleting saved content:', error);
                Alert.alert('Ошибка', 'Не удалось удалить материал');
              }
            },
          },
        ],
      );
    },
    [user],
  );

  useFocusEffect(
    useCallback(() => {
      loadSavedContent();
    }, [loadSavedContent]),
  );

  // Мемоизированный отфильтрованный список
  const filteredItems = useMemo(() => {
    if (selectedType === 'all') return savedItems;
    return savedItems.filter(
      (item) => item.content_items?.type === selectedType,
    );
  }, [savedItems, selectedType]);

  // Мемоизированное количество категорий
  const categoriesCount = useMemo(() => {
    return new Set(savedItems.map((i) => i.content_items?.type).filter(Boolean))
      .size;
  }, [savedItems]);

  const getTypeIcon = useCallback((type: string) => {
    const config = TYPE_CONFIG[type];
    if (!config) return null;
    const Icon = config.icon;
    return <Icon size={16} color={config.color} />;
  }, []);

  const handleCardPress = useCallback(
    (contentId: string) => {
      router.push({
        pathname: '/content/detail',
        params: { id: contentId },
      });
    },
    [router],
  );

  const handleDeletePress = useCallback(
    (e: GestureResponderEvent, contentId: string) => {
      e.stopPropagation();
      handleDelete(contentId);
    },
    [handleDelete],
  );

  const typeOptions = useMemo(() => ['all', ...Object.keys(TYPE_CONFIG)], []);

  if (isGuest) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.emptyState}>
          <Library size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Войдите в аккаунт
          </Text>
          <Text
            style={[styles.emptyDescription, { color: colors.textSecondary }]}
          >
            Чтобы сохранять материалы и видеть их здесь, пожалуйста, войдите в
            аккаунт
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Загрузка...
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
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Библиотека</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Ваши сохраненные материалы
          </Text>
        </View>

        {/* Статистика */}
        <View style={[styles.stats, { backgroundColor: colors.surface }]}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.accent }]}>
              {savedItems.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Всего
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.accent }]}>
              {categoriesCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Категории
            </Text>
          </View>
        </View>

        {/* Фильтр по типу */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          <View style={styles.filterContainer}>
            {typeOptions.map((type) => {
              const isActive = selectedType === type;
              const config =
                type === 'all'
                  ? { color: colors.accent, label: 'Все' }
                  : TYPE_CONFIG[type];

              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterButton,
                    {
                      backgroundColor: isActive
                        ? config?.color || colors.accent
                        : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  {type !== 'all' && config && getTypeIcon(type)}
                  <Text
                    style={[
                      styles.filterButtonText,
                      { color: isActive ? '#FFFFFF' : colors.text },
                    ]}
                  >
                    {config?.label || type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Список сохраненного */}
        {filteredItems.length > 0 ? (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.content_id}
            scrollEnabled={false}
            contentContainerStyle={styles.itemsList}
            renderItem={({ item }) => {
              const config = TYPE_CONFIG[item.content_items?.type];

              return (
                <Pressable
                  onPress={() => handleCardPress(item.content_id)}
                  style={({ pressed }) => [
                    styles.cardTouchable,
                    pressed && styles.cardPressed,
                  ]}
                >
                  {({ pressed }) => (
                    <View
                      style={[
                        styles.itemCard,
                        { backgroundColor: colors.surface },
                        pressed && styles.itemCardPressed,
                      ]}
                    >
                      <View style={styles.itemHeader}>
                        <View style={styles.itemType}>
                          {getTypeIcon(item.content_items?.type)}
                          <Text
                            style={[
                              styles.itemTypeLabel,
                              { color: config?.color },
                            ]}
                          >
                            {config?.label}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.itemDate,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {formatDate(item.created_at)}
                        </Text>
                      </View>

                      <Text
                        style={[styles.itemTitle, { color: colors.text }]}
                        numberOfLines={2}
                      >
                        {item.content_items?.title || 'Загрузка...'}
                      </Text>

                      {item.content_items?.description && (
                        <Text
                          style={[
                            styles.itemDescription,
                            { color: colors.textSecondary },
                          ]}
                          numberOfLines={2}
                        >
                          {item.content_items.description}
                        </Text>
                      )}

                      {item.content_items?.tags &&
                        item.content_items.tags.length > 0 && (
                          <View style={styles.tagsContainer}>
                            {item.content_items.tags
                              .slice(0, 3)
                              .map((tag, index) => (
                                <View
                                  key={`${item.content_id}-tag-${index}`}
                                  style={[
                                    styles.tag,
                                    { backgroundColor: colors.border },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.tagText,
                                      { color: colors.textSecondary },
                                    ]}
                                  >
                                    #{tag}
                                  </Text>
                                </View>
                              ))}
                          </View>
                        )}

                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={(e) => handleDeletePress(e, item.content_id)}
                        activeOpacity={0.7}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Trash2 size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  )}
                </Pressable>
              );
            }}
          />
        ) : (
          <View style={styles.emptyState}>
            <BookOpen size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Пока ничего нет
            </Text>
            <Text
              style={[styles.emptyDescription, { color: colors.textSecondary }]}
            >
              Сохраняйте понравившиеся материалы на вкладке
              &quot;Исследовать&quot;, и они появятся здесь
            </Text>
          </View>
        )}
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
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.8,
  },
  filterScroll: {
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemsList: {
    gap: 12,
  },
  cardTouchable: {
    marginBottom: 12,
  },
  cardPressed: {
    opacity: 0.9,
  },
  itemCard: {
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemCardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemTypeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemDate: {
    fontSize: 12,
    opacity: 0.8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 22,
  },
  itemDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
    opacity: 0.8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#EF444410',
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});
