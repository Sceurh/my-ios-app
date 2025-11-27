import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

export default function HomeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return (
    <View
      style={[styles.container, { backgroundColor: isDark ? "#0a0a0a" : "#f4f4f4" }]}
    >
      <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>Welcome!</Text>
      <Text style={[styles.subtitle, { color: isDark ? "#aaa" : "#555" }]}>MindCare</Text>

      <Link href="/screens/ChatScreen" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ask AI</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/screens/LibraryScreen" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Library</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  button: {
    width: "80%",
    paddingVertical: 14,
    backgroundColor: "#6C5CE7",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 14,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});