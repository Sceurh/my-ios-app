// app/(tabs)/profile/index.tsx
import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  LogIn,
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
  const router = useRouter();
  const { colors, theme, setTheme } = useTheme();
  const { user, isGuest, signOut, isLoading } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);

  const themeOptions = [
    { id: 'auto', label: 'Системная', icon: Smartphone, value: 'auto' },
    { id: 'light', label: 'Светлая', icon: Sun, value: 'light' },
    { id: 'dark', label: 'Тёмная', icon: Moon, value: 'dark' },
  ];

  const getCurrentThemeLabel = () => {
    const current = themeOptions.find((opt) => opt.value === theme);
    return current ? current.label : 'Системная';
  };

  const handleAuthAction = () => {
    if (isGuest) {
      // Для гостя - переход на логин
      router.push('/auth/login');
    } else {
      // Для авторизованного пользователя - выход
      signOut();
    }
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
          <View
            style={[
              styles.avatar,
              { backgroundColor: isGuest ? colors.border : colors.accent },
            ]}
          >
            <User
              size={32}
              color={isGuest ? colors.textSecondary : '#FFFFFF'}
            />
            {isGuest && (
              <View
                style={[styles.guestBadge, { backgroundColor: colors.surface }]}
              >
                <Text
                  style={[
                    styles.guestBadgeText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Гость
                </Text>
              </View>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name || 'Пользователь'}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {isGuest
                ? 'Гостевой режим'
                : user?.email || 'mindcare@example.com'}
            </Text>
            {isGuest && (
              <Text style={[styles.guestNote, { color: colors.accent }]}>
                Для синхронизации данных войдите в аккаунт
              </Text>
            )}
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
          {/* Темы */}
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
            <ChevronDown size={20} color={colors.textSecondary} />
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

        {/* Основная кнопка (Войти/Выйти) */}
        <TouchableOpacity
          style={[
            styles.mainAuthButton,
            {
              backgroundColor: isGuest ? colors.accent : 'transparent',
              borderColor: isGuest ? 'transparent' : colors.border,
              borderWidth: isGuest ? 0 : 2,
            },
          ]}
          onPress={handleAuthAction}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          {isGuest ? (
            <>
              <LogIn size={22} color="#FFFFFF" />
              <Text style={[styles.mainAuthButtonText, { color: '#FFFFFF' }]}>
                Войти в аккаунт
              </Text>
            </>
          ) : (
            <>
              <LogOut size={22} color="#EF4444" />
              <Text style={[styles.mainAuthButtonText, { color: '#EF4444' }]}>
                Выйти из аккаунта
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Дополнительная кнопка для гостя */}
        {isGuest && (
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.border }]}
            onPress={signOut}
            activeOpacity={0.7}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              Очистить гостевые данные
            </Text>
          </TouchableOpacity>
        )}

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
    position: 'relative',
  },
  guestBadge: {
    position: 'absolute',
    bottom: -6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  guestBadgeText: {
    fontSize: 10,
    fontWeight: '600',
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
    marginBottom: 4,
  },
  guestNote: {
    fontSize: 12,
    fontWeight: '500',
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
  mainAuthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mainAuthButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 30,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
    opacity: 0.6,
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
  modalItemSelected: {},
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
