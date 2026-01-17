// app/components/ThemeToggle.tsx
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

type ThemeToggleProps = {
  compact?: boolean;
};

const ThemeToggle = ({ compact = false }: ThemeToggleProps) => {
  const { colors, toggleTheme, isDark } = useTheme();

  if (compact) {
    return (
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        trackColor={{ false: '#CBD5E1', true: '#7C3AED' }}
        thumbColor="#FFFFFF"
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {isDark ? '🌙 Тёмная тема' : '☀️ Светлая тема'}
      </Text>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        trackColor={{ false: '#CBD5E1', true: '#7C3AED' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ThemeToggle;
