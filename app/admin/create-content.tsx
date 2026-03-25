// app/admin/create-content.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/database/api';
import { ContentType } from '../types';

export default function CreateContentScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState<ContentType>('article');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // Проверка прав админа
  if (!isAdmin) {
    router.replace('/(tabs)/explore');
    return null;
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите заголовок');
      return;
    }

    setLoading(true);
    try {
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const { error } = await supabase.from('content_items').insert({
        type,
        title: title.trim(),
        description: description.trim() || null,
        content: content.trim() || null,
        tags: tagsArray,
        is_published: isPublished,
      });

      if (error) throw error;

      Alert.alert('Успешно', 'Материал добавлен', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error('Error creating content:', error);
      Alert.alert('Ошибка', error.message || 'Не удалось добавить материал');
    } finally {
      setLoading(false);
    }
  };

  const contentTypes: { id: ContentType; label: string; color: string }[] = [
    { id: 'article', label: 'Статья', color: '#3B82F6' },
    { id: 'practice', label: 'Практика', color: '#EC489A' },
    { id: 'meditation', label: 'Медитация', color: '#8B5CF6' },
    { id: 'video', label: 'Видео', color: '#EF4444' },
    { id: 'tip', label: 'Совет', color: '#F59E0B' },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Добавить материал
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Заполните информацию о новом контенте
          </Text>
        </View>

        {/* Тип контента */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>
            Тип контента *
          </Text>
          <View style={styles.typeGrid}>
            {contentTypes.map((ct) => (
              <TouchableOpacity
                key={ct.id}
                style={[
                  styles.typeButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                  type === ct.id && { borderColor: ct.color, borderWidth: 2 },
                ]}
                onPress={() => setType(ct.id)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    { color: type === ct.id ? ct.color : colors.textSecondary },
                  ]}
                >
                  {ct.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Заголовок */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>
            Заголовок *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Введите заголовок"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Описание */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>
            Краткое описание
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Краткое описание материала"
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Основной контент */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>
            Основной текст
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Полный текст материала..."
            placeholderTextColor={colors.textSecondary}
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={6}
          />
        </View>

        {/* Теги */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>
            Теги (через запятую)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="психология, тревога, медитация"
            placeholderTextColor={colors.textSecondary}
            value={tags}
            onChangeText={setTags}
          />
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            Пример: психология, тревога, сон
          </Text>
        </View>

        {/* Публикация */}
        <View style={styles.section}>
          <View style={styles.publishContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Опубликовать сразу
            </Text>
            <TouchableOpacity
              style={[
                styles.publishButton,
                {
                  backgroundColor: isPublished ? colors.accent : colors.border,
                },
              ]}
              onPress={() => setIsPublished(!isPublished)}
            >
              <Text style={styles.publishButtonText}>
                {isPublished ? 'Опубликовано' : 'Черновик'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Кнопки */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.cancelButton,
              { borderColor: colors.border },
            ]}
            onPress={() => router.back()}
          >
            <Text
              style={[styles.cancelButtonText, { color: colors.textSecondary }]}
            >
              Отмена
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              { backgroundColor: colors.accent },
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Добавить</Text>
            )}
          </TouchableOpacity>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  hint: {
    fontSize: 12,
    marginTop: 6,
    opacity: 0.7,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  publishContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  publishButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
