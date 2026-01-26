// app/(tabs)/profile/index.tsx
import {
  Bell,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  LogOut,
  Moon,
  Palette,
  Settings,
  Shield,
  Smartphone,
  Sun,
  User,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProfileScreen() {
  const { colors, theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);

  const themeOptions = [
    { id: 'auto', label: 'Системная', icon: Smartphone, value: 'auto' },
    { id: 'light', label: 'Светлая', icon: Sun, value: 'light' },
    { id: 'dark', label: 'Тёмная', icon: Moon, value: 'dark' },
  ];

  // Функция для получения текущей темы в текстовом виде
  const getCurrentThemeLabel = () => {
    const current = themeOptions.find((opt) => opt.value === theme);
    return current ? current.label : 'Системная';
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Заголовок */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <User size={32} color="#FFFFFF" />
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name || 'Пользователь'}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {user?.email || 'mindcare@example.com'}
            </Text>
          </View>
        </View>

        {/* Настройки */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Настройки
          </Text>
          {/* Уведомления */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={22} color={colors.textSecondary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Уведомления
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
          {/* Темы (раскрывающийся пункт) */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setIsThemeExpanded(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Palette size={22} color={colors.textSecondary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Тема
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {getCurrentThemeLabel()}
                </Text>
              </View>
            </View>
            <ChevronDown
              size={20}
              color={colors.textSecondary}
              style={{
                marginLeft: 8,
              }}
            />
          </TouchableOpacity>
          {/* Общие настройки */}
          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <Settings size={22} color={colors.textSecondary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Общие настройки
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Конфиденциальность */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Конфиденциальность
          </Text>

          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <Shield size={22} color={colors.textSecondary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Конфиденциальность и безопасность
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <HelpCircle size={22} color={colors.textSecondary} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Справка и поддержка
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Выход */}
        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: colors.border }]}
          onPress={signOut}
          activeOpacity={0.7}
        >
          <LogOut size={22} color="#EF4444" />
          <Text style={[styles.logoutText, { color: '#EF4444' }]}>
            Выйти из аккаунта
          </Text>
        </TouchableOpacity>

        {/* Версия приложения */}
        <Text style={[styles.version, { color: colors.textSecondary }]}>
          MindCare v1.0.0
        </Text>
      </ScrollView>

      {/* Модальное окно выбора темы */}
      <Modal
        visible={isThemeExpanded}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsThemeExpanded(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsThemeExpanded(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.text,
              },
            ]}
          >
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.modalItem,
                  theme === option.value && [
                    styles.modalItemSelected,
                    { backgroundColor: colors.accent + '15' },
                  ],
                ]}
                onPress={() => {
                  setTheme(option.value as any);
                  setIsThemeExpanded(false);
                }}
                activeOpacity={0.6}
              >
                <View style={styles.modalItemLeft}>
                  <View
                    style={[
                      styles.modalIcon,
                      {
                        backgroundColor:
                          theme === option.value
                            ? colors.accent
                            : colors.background,
                      },
                    ]}
                  >
                    <option.icon
                      size={18}
                      color={
                        theme === option.value
                          ? '#FFFFFF'
                          : colors.textSecondary
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.modalLabel,
                      {
                        color:
                          theme === option.value ? colors.accent : colors.text,
                        fontWeight: theme === option.value ? '600' : '400',
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>
                {theme === option.value && (
                  <View
                    style={[
                      styles.selectedDot,
                      { backgroundColor: colors.accent },
                    ]}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.8,
  },
  section: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    minHeight: 56,
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
  settingDescription: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.7,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginTop: 8,
    marginBottom: 30,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
    opacity: 0.6,
  },

  // Стили для модального окна (поверх всего)
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
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modalIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLabel: {
    fontSize: 16,
  },
  modalItemSelected: {
    // Стили применяются через массив
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
