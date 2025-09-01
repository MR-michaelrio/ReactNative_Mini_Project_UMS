import { Link } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>✨ Selamat Datang ✨</Text>
      <Text style={styles.subtitle}>Silakan pilih menu di bawah ini</Text>

      <View style={styles.menuWrapper}>
        <Link href="/pelanggan" asChild>
          <TouchableOpacity style={styles.card}>
            <MaterialCommunityIcons name="account-group" size={40} color="#007BFF" />
            <Text style={styles.cardText}>Pelanggan</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/barang" asChild>
          <TouchableOpacity style={styles.card}>
            <MaterialCommunityIcons name="package-variant" size={40} color="#007BFF" />
            <Text style={styles.cardText}>Barang</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/penjualan" asChild>
          <TouchableOpacity style={styles.card}>
            <MaterialCommunityIcons name="file-document" size={40} color="#007BFF" />
            <Text style={styles.cardText}>Penjualan</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f6fa", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginTop: 40, color: "#333" },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 30 },
  menuWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
  card: {
    width: 140,
    height: 140,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: { marginTop: 10, fontSize: 16, fontWeight: "600", color: "#333" },
});
