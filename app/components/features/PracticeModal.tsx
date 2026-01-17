// app/components/features/PracticeModal.tsx
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface PracticeModalProps {
  visible: boolean;
  onClose: () => void;
  practice: {
    id: string;
    title: string;
    emoji: string;
    color: string;
    description: string;
    steps: string[];
    duration: string;
    benefits: string[];
  };
}

export default function PracticeModal({
  visible,
  onClose,
  practice,
}: PracticeModalProps) {
  const { colors } = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: colors.surface }]}>
            {/* Заголовок */}
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Text style={[styles.emoji, { color: practice.color }]}>
                  {practice.emoji}
                </Text>
                <View>
                  <Text style={[styles.title, { color: colors.text }]}>
                    {practice.title}
                  </Text>
                  <Text
                    style={[styles.duration, { color: colors.textSecondary }]}
                  >
                    ⏱️ {practice.duration}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Описание */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Описание
                </Text>
                <Text
                  style={[styles.description, { color: colors.textSecondary }]}
                >
                  {practice.description}
                </Text>
              </View>

              {/* Шаги */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Как выполнять
                </Text>
                {practice.steps.map((step, index) => (
                  <View key={index} style={styles.step}>
                    <View
                      style={[
                        styles.stepNumber,
                        { backgroundColor: practice.color },
                      ]}
                    >
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text
                      style={[styles.stepText, { color: colors.textSecondary }]}
                    >
                      {step}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Польза */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Польза
                </Text>
                {practice.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefit}>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={practice.color}
                    />
                    <Text
                      style={[
                        styles.benefitText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {benefit}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Кнопка начала */}
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: practice.color }]}
              onPress={() => {
                // Логика начала практики
                onClose();
              }}
            >
              <Text style={styles.startButtonText}>Начать практику</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalView: {
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  stepText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  benefitText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  startButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
