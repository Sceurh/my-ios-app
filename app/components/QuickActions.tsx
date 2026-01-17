// app/components/QuickActions.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { QUICK_ACTIONS } from '../constants/tips';
import { QuickAction } from '../types';

type QuickActionsProps = {
  actions?: QuickAction[];
  onPressAction?: (practiceId: string) => void;
};

const QuickActions = ({
  actions = QUICK_ACTIONS,
  onPressAction,
}: QuickActionsProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Быстрые практики</Text>
      <View style={styles.grid}>
        {actions.map((action) => (
          <Link key={action.id} href={action.route} asChild>
            <TouchableOpacity
              style={styles.card}
              onPress={() => onPressAction?.(action.id)}
            >
              <LinearGradient
                colors={[`${action.color}CC`, `${action.color}99`]}
                style={[styles.gradient, { borderLeftColor: action.color }]}
              >
                <Text style={styles.icon}>{action.icon}</Text>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.subtitle}>{action.subtitle}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
    color: '#0F172A',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gradient: {
    padding: 20,
    borderLeftWidth: 4,
    minHeight: 120,
  },
  icon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
  },
});

export default QuickActions;
