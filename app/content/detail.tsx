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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {content.title}
          </Text>
          {content.tags && content.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {content.tags.map((tag: string, index: number) => (
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
            </View>
          )}
        </View>

        {content.description && (
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {content.description}
          </Text>
        )}

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
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    lineHeight: 36,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
