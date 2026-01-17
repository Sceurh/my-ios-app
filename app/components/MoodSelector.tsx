// app/components/MoodSelector.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MOODS } from '../constants/themes';
import { useTheme } from '../contexts/ThemeContext';
import { MoodType } from '../types';

type MoodSelectorProps = {
  selectedMood: MoodType;
  onSelect: (mood: MoodType) => void;
};

const MoodSelector = ({ selectedMood, onSelect }: MoodSelectorProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Как ты себя чувствуешь?
      </Text>
      <View style={styles.chips}>
        {Object.entries(MOODS).map(([key, mood]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.chip,
              {
                backgroundColor:
                  selectedMood === key ? mood.color : colors.surface,
                borderColor: mood.color,
              },
            ]}
            onPress={() => onSelect(key as MoodType)}
          >
            <Text
              style={[
                styles.chipIcon,
                { color: selectedMood === key ? '#FFFFFF' : mood.color },
              ]}
            >
              {mood.emoji}
            </Text>
            <Text
              style={[
                styles.chipText,
                { color: selectedMood === key ? '#FFFFFF' : colors.text },
              ]}
            >
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flex: 1,
    minWidth: 80,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chipIcon: {
    fontSize: 16,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MoodSelector;
