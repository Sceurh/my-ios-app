// app/(tabs)/library/index.tsx
import {
  Bookmark,
  BookOpen,
  Download,
  FileText,
  Filter,
  Heart,
  Trash2,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';

// Типы сохраненного контента
type SavedItemType = 'article' | 'meditation' | 'exercise' | 'quote';

interface SavedItem {
  id: string;
  title: string;
  type: SavedItemType;
  date: string;
  duration?: string;
  isDownloaded: boolean;
}

const SAMPLE_ITEMS: SavedItem[] = [
  {
    id: '1',
    title: 'Как справляться с паническими атаками',
    type: 'article',
    date: '2024-01-15',
    duration: '10 мин',
    isDownloaded: true,
  },
  {
    id: '2',
    title: 'Вечерняя медитация для сна',
    type: 'meditation',
    date: '2024-01-14',
    duration: '15 мин',
    isDownloaded: true,
  },
  {
    id: '3',
    title: 'Дыхание 4-7-8',
    type: 'exercise',
    date: '2024-01-13',
    duration: '5 мин',
    isDownloaded: false,
  },
  {
    id: '4',
    title: 'Цитата дня: Спокойствие - это не отсутствие бури...',
    type: 'quote',
    date: '2024-01-12',
    isDownloaded: false,
  },
  {
    id: '5',
    title: 'Управление тревогой в рабочей среде',
    type: 'article',
    date: '2024-01-11',
    duration: '12 мин',
    isDownloaded: true,
  },
];

const TYPE_CONFIG = {
  article: { icon: FileText, color: '#3B82F6', label: 'Статья' },
  meditation: { icon: BookOpen, color: '#8B5CF6', label: 'Медитация' },
  exercise: { icon: Heart, color: '#10B981', label: 'Упражнение' },
  quote: { icon: Bookmark, color: '#F59E0B', label: 'Цитата' },
};

export default function LibraryScreen() {
  const { colors } = useTheme();
  const [savedItems, setSavedItems] = useState<SavedItem[]>(SAMPLE_ITEMS);
  const [showDownloadedOnly, setShowDownloadedOnly] = useState(false);
  const [selectedType, setSelectedType] = useState<SavedItemType | 'all'>(
    'all',
  );

  const filteredItems = savedItems.filter((item) => {
    if (showDownloadedOnly && !item.isDownloaded) return false;
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    return true;
  });

  const handleDelete = (id: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDownload = (id: string) => {
    setSavedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isDownloaded: true } : item,
      ),
    );
  };

  const getTypeIcon = (type: SavedItemType) => {
    const config = TYPE_CONFIG[type];
    const Icon = config.icon;
    return <Icon size={16} color={config.color} />;
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
          <View>
            <Text style={[styles.title, { color: colors.text }]}>
              Библиотека
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Ваши сохраненные материалы
            </Text>
          </View>
          <BookOpen size={32} color={colors.textSecondary} />
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
              {savedItems.filter((i) => i.isDownloaded).length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Офлайн
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.accent }]}>
              {new Set(savedItems.map((i) => i.type)).size}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Категории
            </Text>
          </View>
        </View>

        {/* Фильтры */}
        <View style={styles.filters}>
          <View style={styles.filterGroup}>
            <Filter size={18} color={colors.textSecondary} />
            <Text style={[styles.filterLabel, { color: colors.text }]}>
              Фильтры
            </Text>
          </View>

          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, { color: colors.text }]}>
              Только офлайн
            </Text>
            <Switch
              value={showDownloadedOnly}
              onValueChange={setShowDownloadedOnly}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Типы контента */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.typesScroll}
          contentContainerStyle={styles.typesContainer}
        >
          {['all', ...(Object.keys(TYPE_CONFIG) as SavedItemType[])].map(
            (type) => {
              const isActive = selectedType === type;
              const config =
                type === 'all'
                  ? { color: colors.accent, label: 'Все' }
                  : TYPE_CONFIG[type as SavedItemType];

              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor: isActive ? config.color : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setSelectedType(type as any)}
                >
                  {type !== 'all' && (
                    <View style={styles.typeIcon}>
                      {getTypeIcon(type as SavedItemType)}
                    </View>
                  )}
                  <Text
                    style={[
                      styles.typeButtonText,
                      { color: isActive ? '#FFFFFF' : colors.text },
                    ]}
                  >
                    {config.label}
                  </Text>
                </TouchableOpacity>
              );
            },
          )}
        </ScrollView>

        {/* Список сохраненного */}
        {filteredItems.length > 0 ? (
          <View style={styles.itemsList}>
            {filteredItems.map((item) => {
              const config = TYPE_CONFIG[item.type];

              return (
                <View
                  key={item.id}
                  style={[styles.itemCard, { backgroundColor: colors.surface }]}
                >
                  <View style={styles.itemHeader}>
                    <View style={styles.itemType}>
                      {getTypeIcon(item.type)}
                      <Text
                        style={[styles.itemTypeLabel, { color: config.color }]}
                      >
                        {config.label}
                      </Text>
                    </View>
                    <Text
                      style={[styles.itemDate, { color: colors.textSecondary }]}
                    >
                      {item.date}
                    </Text>
                  </View>

                  <Text style={[styles.itemTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>

                  {item.duration && (
                    <Text
                      style={[
                        styles.itemDuration,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {item.duration}
                    </Text>
                  )}

                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        {
                          backgroundColor: item.isDownloaded
                            ? '#10B98120'
                            : colors.border,
                        },
                      ]}
                      onPress={() => handleDownload(item.id)}
                      disabled={item.isDownloaded}
                    >
                      <Download
                        size={16}
                        color={
                          item.isDownloaded ? '#10B981' : colors.textSecondary
                        }
                      />
                      <Text
                        style={[
                          styles.actionText,
                          {
                            color: item.isDownloaded
                              ? '#10B981'
                              : colors.textSecondary,
                          },
                        ]}
                      >
                        {item.isDownloaded ? 'Скачано' : 'Скачать'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: '#EF444420' },
                      ]}
                      onPress={() => handleDelete(item.id)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                      <Text style={[styles.actionText, { color: '#EF4444' }]}>
                        Удалить
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <BookOpen size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Пока ничего нет
            </Text>
            <Text
              style={[styles.emptyDescription, { color: colors.textSecondary }]}
            >
              Сохраняйте понравившиеся материалы, и они появятся здесь
            </Text>
          </View>
        )}

        {/* Быстрые действия */}
        <View
          style={[styles.quickActions, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.quickTitle, { color: colors.text }]}>
            Быстрые действия
          </Text>
          <View style={styles.quickButtons}>
            <TouchableOpacity
              style={[styles.quickButton, { backgroundColor: colors.accent }]}
              activeOpacity={0.8}
            >
              <Download size={20} color="#FFFFFF" />
              <Text style={styles.quickButtonText}>Скачать всё</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickButton, { backgroundColor: colors.border }]}
              activeOpacity={0.8}
            >
              <Trash2 size={20} color={colors.text} />
              <Text style={[styles.quickButtonText, { color: colors.text }]}>
                Очистить
              </Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 14,
  },
  typesScroll: {
    marginBottom: 24,
  },
  typesContainer: {
    gap: 8,
    paddingRight: 20,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  typeIcon: {
    marginRight: 4,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemsList: {
    gap: 12,
    marginBottom: 32,
  },
  itemCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
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
  itemDuration: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 12,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
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
  quickActions: {
    padding: 20,
    borderRadius: 16,
  },
  quickTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
