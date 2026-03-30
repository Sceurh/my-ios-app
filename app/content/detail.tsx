import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/database/api';
import { SupabaseContentItem } from '../types';

export default function ContentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<SupabaseContentItem | null>(null);

  const loadContent = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      if (!data) {
        Alert.alert('Ошибка', 'Материал не найден');
        router.back();
        return;
      }

      setContent(data);
    } catch (error) {
      console.error('Error loading content:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить материал');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (!id) {
      router.back();
      return;
    }
    loadContent();
  }, [id, loadContent, router]);

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!content) {
    return null;
  }

  // Определяем тип материала для отображения
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'article':
        return 'Статья';
      case 'meditation':
        return 'Медитация';
      case 'practice':
        return 'Практика';
      case 'tip':
        return 'Совет';
      case 'video':
        return 'Видео';
      default:
        return 'Материал';
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        bounces={true}
      >
        {/* tittle */}
        <Text style={[styles.title, { color: colors.text }]}>
          {content.title}
        </Text>

        {/* Мета-информация(type) */}
        <View style={styles.metaContainer}>
          <View style={styles.typeBadge}>
            <Text style={[styles.typeText, { color: colors.textSecondary }]}>
              {getTypeLabel(content.type)}
            </Text>
          </View>
          <View style={[styles.metaDot, { backgroundColor: colors.border }]} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {content.tags?.length || 0} тегов
          </Text>
        </View>

        {/* tags */}
        {content.tags && content.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {content.tags.map((tag: string, index: number) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  {
                    backgroundColor: `${colors.accent}17`,
                    borderColor: `${colors.accent}15`,
                    shadowColor: colors.accent,
                  },
                ]}
              >
                <Text style={[styles.tagText, { color: colors.accent }]}>
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Описание(description) в стиле курсив */}
        {content.description && (
          <View style={styles.redditBlock}>
            <View
              style={[styles.redditBar, { backgroundColor: colors.accent }]}
            />
            <View style={styles.redditContent}>
              <Text
                style={[
                  styles.redditText,
                  { color: colors.textSecondary, fontStyle: 'italic' },
                ]}
              >
                {content.description}
              </Text>
            </View>
          </View>
        )}

        {/* content */}
        {content.content && (
          <Text style={[styles.contentText, { color: colors.text }]}>
            {content.content}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.5,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 6000,
    elevation: 200,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  redditBlock: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  redditBar: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  redditContent: {
    flex: 1,
  },
  redditText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  contentText: {
    fontSize: 16,
    lineHeight: 26,
    letterSpacing: 0.2,
  },
});
