import { StyleSheet, Text, View } from "react-native";

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Чат пока недоступен 😅</Text>
      <Text style={styles.sub}>Скоро здесь будет ИИ помощник.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 22, fontWeight: "600", color: "#999898ff" },
  sub: { marginTop: 10, color: "#666" },
});
