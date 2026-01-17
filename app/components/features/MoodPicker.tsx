// app/components/features/MoodPicker.tsx
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MOODS } from '../../constants/themes';
import { useMood } from '../../contexts/MoodContext';
import { useTheme } from '../../contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function MoodPicker() {
  const { colors } = useTheme();
  const { currentMood, setMood } = useMood();
  const [glowAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    startGlowAnimation();
  }, []);

  const handleSelectMood = (moodId: (typeof MOODS)[number]['id']) => {
    setMood(moodId);

    // Анимация выбора
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startGlowAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const selectedMoodData = MOODS.find((m) => m.id === currentMood);

  return (
    <View style={styles.container}>
      <BlurView
        intensity={20}
        tint={colors.background === '#0F172A' ? 'dark' : 'light'}
        style={styles.blurContainer}
      >
        {selectedMoodData && (
          <LinearGradient
            colors={[
              selectedMoodData.color + '20',
              selectedMoodData.color + '05',
            ]}
            style={[styles.gradientBackground, { opacity: 0.15 }]}
          />
        )}

        <Text style={[styles.title, { color: colors.text }]}>
          Как ты себя чувствуешь сегодня?
        </Text>

        {/* Glow эффект */}
        {selectedMoodData && (
          <Animated.View
            style={[
              styles.glowEffect,
              {
                backgroundColor: selectedMoodData.color,
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.1, 0.3],
                }),
                transform: [
                  {
                    scale: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1.1],
                    }),
                  },
                ],
              },
            ]}
          />
        )}

        <View style={styles.moodsGrid}>
          {MOODS.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              onPress={() => handleSelectMood(mood.id)}
              style={[
                styles.moodItem,
                currentMood === mood.id && styles.moodItemSelected,
                { borderColor: mood.color },
              ]}
            >
              <View
                style={[
                  styles.emojiContainer,
                  { backgroundColor: `${mood.color}20` },
                ]}
              >
                <Text style={styles.emoji}>{mood.emoji}</Text>
              </View>
              <Text
                style={[
                  styles.moodLabel,
                  {
                    color:
                      currentMood === mood.id
                        ? mood.color
                        : colors.textSecondary,
                    fontWeight: currentMood === mood.id ? '700' : '600',
                  },
                ]}
              >
                {mood.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMoodData && (
          <View style={styles.selectedInfo}>
            <Text
              style={[styles.selectedText, { color: selectedMoodData.color }]}
            >
              Выбрано: {selectedMoodData.label}
            </Text>
            <Text style={[styles.hint, { color: colors.textSecondary }]}>
              Настроение сохранится до конца дня
            </Text>
          </View>
        )}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    borderRadius: 24,
    overflow: 'hidden',
  },
  blurContainer: {
    padding: 24,
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    zIndex: 1,
  },
  glowEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    marginLeft: -width * 0.4,
    marginTop: -width * 0.4,
  },
  moodsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    zIndex: 1,
  },
  moodItem: {
    flex: 1,
    minWidth: (width - 72) / 4,
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  moodItemSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
  },
  emojiContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 28,
  },
  moodLabel: {
    fontSize: 13,
    textAlign: 'center',
  },
  selectedInfo: {
    marginTop: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    opacity: 0.8,
  },
});
