"use client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import api from "@/lib/api";

type Barang = {
  id: number;
  kode: string;
  nama: string;
  kategori: string;
  harga: number;
};

export default function BarangPage() {
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [form, setForm] = useState<Omit<Barang, "id">>({
    kode: "",
    nama: "",
    kategori: "",
    harga: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const res = await api.get("/barangs");
      setBarangs(res.data.data ?? res.data);
    } catch (err) {
      console.error("❌ Fetch barang error:", err);
    }
  };

  const saveData = async () => {
    try {
      if (editingId) {
        await api.put(`/barangs/${editingId}`, form);
        setEditingId(null);
      } else {
        await api.post("/barangs", form);
      }
      setForm({ kode: "", nama: "", kategori: "", harga: 0 });
      fetchData();
    } catch (err) {
      console.error("❌ Save barang error:", err);
    }
  };

  const editData = (barang: Barang) => {
    setForm({
      kode: barang.kode,
      nama: barang.nama,
      kategori: barang.kategori,
      harga: barang.harga,
    });
    setEditingId(barang.id);
  };

  const deleteData = async (id: number) => {
    try {
      await api.delete(`/barangs/${id}`);
      fetchData();
    } catch (err) {
      console.error("❌ Delete barang error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <FlatList
      data={barangs}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
        <View style={styles.headerWrapper}>
          <Text style={styles.title}>📦 Master Data Barang</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Kode</Text>
            <TextInput
              style={styles.input}
              value={form.kode}
              onChangeText={(t) => setForm({ ...form, kode: t })}
            />

            <Text style={styles.label}>Nama</Text>
            <TextInput
              style={styles.input}
              value={form.nama}
              onChangeText={(t) => setForm({ ...form, nama: t })}
            />

            <Text style={styles.label}>Kategori</Text>
            <TextInput
              style={styles.input}
              value={form.kategori}
              onChangeText={(t) => setForm({ ...form, kategori: t })}
            />

            <Text style={styles.label}>Harga</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={form.harga.toString()}
              onChangeText={(t) => setForm({ ...form, harga: Number(t) })}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={saveData}>
              <Text style={styles.saveBtnText}>
                {editingId ? "✏️ Update" : "💾 Simpan"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.headerText]}>Kode</Text>
            <Text style={[styles.cell, styles.headerText]}>Nama</Text>
            <Text style={[styles.cell, styles.headerText]}>Kategori</Text>
            <Text style={[styles.cell, styles.headerText]}>Harga</Text>
            <Text style={[styles.cell, styles.headerText]}>Aksi</Text>
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.cell}>{item.kode}</Text>
          <Text style={styles.cell}>{item.nama}</Text>
          <Text style={styles.cell}>{item.kategori}</Text>
          <Text style={styles.cell}>{item.harga}</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => editData(item)}
              style={styles.editBtn}
            >
              <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteData(item.id)}
              style={styles.deleteBtn}
            >
              <Text style={styles.btnText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  headerWrapper: { padding: 16, backgroundColor: "#fff" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 4, color: "#111" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  saveBtn: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  saveBtnText: { color: "white", fontWeight: "bold" },
  tableHeader: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#2563eb",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  headerText: { fontWeight: "bold", color: "white", flex: 1, textAlign: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "white",
  },
  cell: { flex: 1, fontSize: 14, textAlign: "center", color: "#111" },
  actions: { flexDirection: "row", justifyContent: "center" },
  editBtn: {
    backgroundColor: "orange",
    padding: 6,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  deleteBtn: {
    backgroundColor: "red",
    padding: 6,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  btnText: { color: "white", fontSize: 12 },
});
