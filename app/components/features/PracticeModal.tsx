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
import { PRACTICES, PracticeId } from '../../constants/practices';
import { useTheme } from '../../contexts/ThemeContext';

interface PracticeModalProps {
  visible: boolean;
  onClose: () => void;
  practiceId: PracticeId;
}

export default function PracticeModal({
  visible,
  onClose,
  practiceId,
}: PracticeModalProps) {
  const { colors } = useTheme();

  // Защита от undefined
  const practice = PRACTICES[practiceId];

  if (!practice) {
    return null;
  }

  const handleStartPractice = () => {
    // Здесь можно добавить логику запуска таймера, навигации и т.д.
    // Например: router.push(`/practices/${practiceId}/timer`);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: colors.surface }]}>
            {/* Заголовок */}
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Text style={[styles.emoji]}>{practice.emoji}</Text>
                <View style={styles.titleTextContainer}>
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
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Контент */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}
            >
              {/* Описание */}
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
                    <View
                      style={[
                        styles.checkIcon,
                        { backgroundColor: practice.color },
                      ]}
                    >
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    </View>
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

              {/* Рекомендация */}
              {practice.instructions && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Рекомендация
                  </Text>
                  <View
                    style={[
                      styles.instructionBox,
                      { backgroundColor: practice.color + '15' },
                    ]}
                  >
                    <Ionicons
                      name="bulb-outline"
                      size={20}
                      color={practice.color}
                    />
                    <Text
                      style={[styles.instructionText, { color: colors.text }]}
                    >
                      {practice.instructions}
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Кнопки действий */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: colors.border }]}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.secondaryButtonText, { color: colors.text }]}
                >
                  Позже
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.startButton,
                  { backgroundColor: practice.color },
                ]}
                onPress={handleStartPractice}
                activeOpacity={0.8}
              >
                <Ionicons name="play-circle" size={22} color="#FFFFFF" />
                <Text style={styles.startButtonText}>Начать практику</Text>
              </TouchableOpacity>
            </View>
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
    maxHeight: '85%',
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
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    opacity: 0.8,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flexGrow: 0,
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
  checkIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  benefitText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  instructionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  secondaryButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
