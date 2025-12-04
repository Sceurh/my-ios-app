import { Ionicons } from '@expo/vector-icons';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from "react-native";

export default function ProfileScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return (
    <ScrollView 
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0a0a0a" : "#f8f9fa" }
      ]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Хедер профиля */}
      <View style={styles.header}>
        <Text style={[
          styles.title,
          { color: isDark ? "#fff" : "#111" }
        ]}>
          Профиль
        </Text>
        <View style={styles.profileIndicator}>
          <View style={[
            styles.indicatorDot,
            { backgroundColor: "#FF6B8B" }
          ]} />
          <Text style={[
            styles.indicatorText,
            { color: isDark ? "#aaa" : "#666" }
          ]}>
            Гость
          </Text>
        </View>
      </View>

      {/* Карточка профиля */}
      <View style={[
        styles.profileBox,
        {
          backgroundColor: isDark ? "#1a1a1a" : "#fff",
          shadowColor: isDark ? "#000" : "#6C5CE7",
        }
      ]}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
            style={styles.avatar}
          />
          {/* Это визуальный элемент, не связанный с онлайн статусом */}
          <View style={[
            styles.statusIndicator,
            { backgroundColor: "#4CAF50" }
          ]} />
        </View>
        
        <Text style={[
          styles.name,
          { color: isDark ? "#fff" : "#111" }
        ]}>
          Добро пожаловать!
        </Text>
        <Text style={[
          styles.sub,
          { color: isDark ? "#aaa" : "#666" }
        ]}>
          Войдите, чтобы сохранять прогресс и получить доступ ко всем функциям
        </Text>

        <TouchableOpacity 
          style={[
            styles.button,
            { backgroundColor: "#6C5CE7" }
          ]}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="log-in" 
            size={20} 
            color="#fff" 
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Войти / Создать аккаунт</Text>
        </TouchableOpacity>
      </View>

      {/* Секция настроек */}
      <Text style={[
        styles.section,
        { color: isDark ? "#fff" : "#111" }
      ]}>
        Настройки
      </Text>

      <View style={[
        styles.settingsContainer,
        {
          backgroundColor: isDark ? "#1a1a1a" : "#fff",
          shadowColor: isDark ? "#000" : "#e0e0e0",
        }
      ]}>
        {settingsItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.card,
              index !== settingsItems.length - 1 && styles.cardBorder
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.cardLeft}>
              <View style={[
                styles.iconContainer,
                { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5' }
              ]}>
                <Ionicons 
                  name={item.icon} 
                  size={22} 
                  color="#6C5CE7" 
                />
              </View>
              <Text style={[
                styles.cardText,
                { color: isDark ? "#fff" : "#333" }
              ]}>
                {item.title}
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={isDark ? "#666" : "#999"} 
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Дополнительные опции */}
      <Text style={[
        styles.section,
        { color: isDark ? "#fff" : "#111", marginTop: 10 }
      ]}>
        Поддержка
      </Text>

      <View style={[
        styles.settingsContainer,
        {
          backgroundColor: isDark ? "#1a1a1a" : "#fff",
          shadowColor: isDark ? "#000" : "#e0e0e0",
        }
      ]}>
        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
          <View style={styles.cardLeft}>
            <View style={[
              styles.iconContainer,
              { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5' }
            ]}>
              <Ionicons 
                name="heart" 
                size={22} 
                color="#FF6B8B" 
              />
            </View>
            <Text style={[
              styles.cardText,
              { color: isDark ? "#fff" : "#333" }
            ]}>
              Оценить приложение
            </Text>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDark ? "#666" : "#999"} 
          />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.cardBorder]} activeOpacity={0.7}>
          <View style={styles.cardLeft}>
            <View style={[
              styles.iconContainer,
              { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5' }
            ]}>
              <Ionicons 
                name="share-social" 
                size={22} 
                color="#4CAF50" 
              />
            </View>
            <Text style={[
              styles.cardText,
              { color: isDark ? "#fff" : "#333" }
            ]}>
              Поделиться
            </Text>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDark ? "#666" : "#999"} 
          />
        </TouchableOpacity>
      </View>

      {/* Информация о приложении */}
      <View style={[
        styles.infoBox,
        { backgroundColor: isDark ? "#1a1a1a" : "#fff" }
      ]}>
        <Ionicons 
          name="leaf" 
          size={24} 
          color="#6C5CE7" 
          style={styles.infoIcon}
        />
        <Text style={[
          styles.infoTitle,
          { color: isDark ? "#fff" : "#111" }
        ]}>
          MindCare
        </Text>
        <Text style={[
          styles.infoText,
          { color: isDark ? "#aaa" : "#666" }
        ]}>
          Версия 1.0.0 • Забота о ментальном здоровье
        </Text>
        <Text style={[
          styles.infoSubtext,
          { color: isDark ? "#666" : "#999" }
        ]}>
          © 2025 MindCare Team
        </Text>
      </View>
    </ScrollView>
  );
}

const settingsItems = [
  { title: "Темная тема", icon: "moon" as const },
  { title: "Уведомления", icon: "notifications" as const },
  { title: "Конфиденциальность", icon: "lock-closed" as const },
  { title: "Язык", icon: "language" as const },
  { title: "Помощь", icon: "help-circle" as const },
  { title: "О приложении", icon: "information-circle" as const },
];

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  title: { 
    fontSize: 32, 
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  profileIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  indicatorText: {
    fontSize: 14,
    fontWeight: '600',
  },
  profileBox: {
    padding: 28,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 30,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(108, 92, 231, 0.2)',
  },
  statusIndicator: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
    bottom: 0,
    right: 0,
  },
  name: { 
    fontSize: 24, 
    fontWeight: "700",
    marginBottom: 6,
    textAlign: 'center',
  },
  sub: { 
    fontSize: 14,
    fontWeight: "400",
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "600", 
    fontSize: 16,
  },
  section: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginBottom: 16,
    marginLeft: 4,
  },
  settingsContainer: {
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 25,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  cardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(108, 92, 231, 0.1)',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardText: { 
    fontSize: 16,
    fontWeight: "500",
  },
  infoBox: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoIcon: {
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoSubtext: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 8,
  },
});