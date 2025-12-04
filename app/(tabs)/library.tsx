import { StyleSheet, Text, View } from "react-native";

export default function LibraryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Библиотека</Text>
      <Text style={styles.subtitle}>
        Здесь будут храниться твои сохранённые советы, упражнения и избранное.
      </Text>

      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>Пока пусто…</Text>
        <Text style={styles.emptySub}>Добавляй материалы из раздела Explore.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 16, marginTop: 6, color: "#666" },

  emptyBox: {
    marginTop: 40,
    padding: 30,
    borderRadius: 14,
    backgroundColor: "#909090ff",
    alignItems: "center",
  },

  emptyText: { fontSize: 20, fontWeight: "600" },
  emptySub: { marginTop: 4, color: "#555" },
});
