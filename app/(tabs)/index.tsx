import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

// Советы дня
const dailyTips = [
  "Сегодня ты сильнее, чем думаешь.",
  "Сделай маленький шаг — он важнее, чем бездействие.",
  "Дыши глубже. Ты справишься.",
  "Ты достоин(а) хорошего.",
  "Сегодня отличный день, чтобы начать заново.",
  "Ты уже делаешь лучшее, на что способен(на).",
];

export default function HomeScreen() {
  const [tip, setTip] = useState("");
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  useEffect(() => {
    const random = dailyTips[Math.floor(Math.random() * dailyTips.length)];
    setTip(random);
  }, []);

  return (
    <ScrollView 
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0a0a0a" : "#f4f4f4" },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>
          Welcome!
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? "#aaa" : "#555" }]}>
          MindCare
        </Text>
      </View>

      {/* Совет дня */}
      <View style={styles.centeredSection}>
        <View
          style={[
            styles.tipBox,
            { backgroundColor: isDark ? "#1b1b1b" : "#6C5CE7" },
          ]}
        >
          <Text style={[styles.tipText, { color: isDark ? "#fff" : "#fff" }]}>
            {tip}
          </Text>
        </View>
      </View>

      {/* Быстрые действия */}
      <View style={styles.centeredSection}>
        <Text style={[styles.section, { color: isDark ? "#fff" : "#111" }]}>
          Quick Actions
        </Text>

        <View style={styles.actionsGrid}>
          <View style={styles.row}>
            <TouchableOpacity style={styles.quickCard}>
              <Text style={styles.quickCardText}>Совет дня</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickCard}>
              <Text style={styles.quickCardText}>Упражнение</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Link href="/screens/ChatScreen" asChild>
              <TouchableOpacity style={styles.quickCard}>
                <Text style={styles.quickCardText}>Ask AI</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/screens/LibraryScreen" asChild>
              <TouchableOpacity style={styles.quickCard}>
                <Text style={styles.quickCardText}>Library</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>

      {/* Цитата */}
      <View style={styles.centeredSection}>
        <Text style={[styles.section, { color: isDark ? "#fff" : "#111" }]}>
          Quote of the day
        </Text>

        <View
          style={[
            styles.quoteBox,
            {
              backgroundColor: isDark ? "#1a1a1a" : "#fff",
              borderLeftColor: "#6C5CE7",
            },
          ]}
        >
          <Text style={[styles.quote, { color: isDark ? "#bbb" : "#444" }]}>
            «Иногда, чтобы стать сильнее — нужно просто пережить день.»
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  contentContainer: { 
    padding: 20,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: { 
    fontSize: 32, 
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: { 
    fontSize: 18, 
    color: "#666",
    textAlign: "center",
  },
  centeredSection: {
    width: "100%",
    maxWidth: 600,
    alignItems: "center",
    marginBottom: 30,
  },
  tipBox: {
    padding: 20,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tipText: { 
    fontSize: 18, 
    lineHeight: 24,
    textAlign: "center",
    fontWeight: "500",
  },
  section: { 
    fontSize: 24, 
    fontWeight: "700", 
    marginBottom: 20,
    textAlign: "center",
  },
  actionsGrid: {
    width: "100%",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  quickCard: {
    width: "48%",
    paddingVertical: 20,
    backgroundColor: "#6C5CE7",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickCardText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "600",
    textAlign: "center",
  },
  quoteBox: {
    width: "100%",
    padding: 20,
    borderRadius: 14,
    borderLeftWidth: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  quote: { 
    fontSize: 16, 
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 22,
  },
});