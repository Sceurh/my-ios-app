import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  ChevronRight,
  Key,
  Smartphone,
  Trash2,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isGuest, deleteAccount, isLoading } = useAuth();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Удаление аккаунта',
      'Вы уверены? Это действие нельзя отменить. Все ваши данные будут удалены безвозвратно.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              setIsDeleteModalVisible(false);
            } catch (error) {
              console.error('Failed to delete account:', error);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.screenTitle, { color: colors.text }]}>
          Настройки
        </Text>

        {/* Аккаунт */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Аккаунт
          </Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/auth/update-password')}
          >
            <View style={styles.settingLeft}>
              <Key size={22} color={colors.textSecondary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Сменить пароль
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {!isGuest && (
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setIsDeleteModalVisible(true)}
            >
              <View style={styles.settingLeft}>
                <Trash2 size={22} color="#EF4444" />
                <Text style={[styles.settingLabel, { color: '#EF4444' }]}>
                  Удалить аккаунт
                </Text>
              </View>
              <ChevronRight size={20} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>

        {/* О приложении */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            О приложении
          </Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Smartphone size={22} color={colors.textSecondary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Версия
              </Text>
            </View>
            <Text
              style={[styles.settingValue, { color: colors.textSecondary }]}
            >
              v1.0.0
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Модальное окно удаления аккаунта */}
      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.deleteModalContent,
              { backgroundColor: colors.surface },
            ]}
          >
            <AlertTriangle
              size={48}
              color="#EF4444"
              style={styles.deleteIcon}
            />
            <Text style={[styles.deleteTitle, { color: colors.text }]}>
              Удалить аккаунт?
            </Text>
            <Text style={[styles.deleteText, { color: colors.textSecondary }]}>
              Это действие нельзя отменить. Все ваши данные будут удалены
              безвозвратно.
            </Text>
            <View style={styles.deleteButtons}>
              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  styles.cancelButton,
                  { borderColor: colors.border },
                ]}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                  Отмена
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: '#EF4444' }]}
                onPress={handleDeleteAccount}
                disabled={isLoading}
              >
                <Text style={styles.deleteButtonText}>
                  {isLoading ? 'Удаление...' : 'Удалить'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 24,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxWidth: 300,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalItemSelected: {},
  modalLabel: {
    fontSize: 16,
    flex: 1,
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  deleteModalContent: {
    width: '80%',
    maxWidth: 300,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  deleteIcon: {
    marginBottom: 16,
  },
  deleteTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  deleteText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  deleteButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
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
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
