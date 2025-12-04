// import React from "react";
// import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import exploreData from "../../data/exploreData";

// export default function ExploreScreen() {
//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Исследуй</Text>
//       <Text style={styles.subtitle}>
//         Подборки упражнений, техник и советов для твоего состояния.
//       </Text>

//       {exploreData.map((section) => (
//         <View key={section.id} style={styles.block}>
//           <Text style={styles.blockTitle}>{section.title}</Text>

//           {section.items.map((item) => (
//             <TouchableOpacity key={item.id} style={styles.card}>
//               <Text style={styles.cardTitle}>{item.title}</Text>
//               <Text style={styles.cardDescription}>{item.description}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#f9faff" },
//   title: { fontSize: 28, fontWeight: "700", marginBottom: 5 },
//   subtitle: { fontSize: 16, color: "#555", marginBottom: 20 },
//   block: { marginBottom: 25 },
//   blockTitle: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
//   card: {
//     backgroundColor: "#fff",
//     padding: 18,
//     borderRadius: 14,
//     marginBottom: 12,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
//   cardDescription: { fontSize: 14, color: "#555" },
// });
