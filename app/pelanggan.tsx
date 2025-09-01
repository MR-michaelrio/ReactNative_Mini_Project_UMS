"use client";
import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "@/lib/api";

type Pelanggan = {
  id: number;
  kode: string;
  nama: string;
  domisili: string;
  jenis_kelamin: string;
};

export default function PelangganPage() {
  const [pelanggans, setPelanggans] = useState<Pelanggan[]>([]);
  const [form, setForm] = useState<Omit<Pelanggan, "id">>({
    kode: "", nama: "", domisili: "", jenis_kelamin: "PRIA"
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const res = await api.get("/pelanggans");
      setPelanggans(res.data.data ?? res.data);
    } catch (err) {
      console.error("❌ Fetch pelanggan error:", err);
    }
  };

  const saveData = async () => {
    try {
      if (editingId) {
        await api.put(`/pelanggans/${editingId}`, form);
        setEditingId(null);
      } else {
        await api.post("/pelanggans", form);
      }
      setForm({ kode: "", nama: "", domisili: "", jenis_kelamin: "PRIA" });
      fetchData();
    } catch (err) {
      console.error("❌ Save pelanggan error:", err);
    }
  };

  const editData = (p: Pelanggan) => {
    setForm({
      kode: p.kode,
      nama: p.nama,
      domisili: p.domisili,
      jenis_kelamin: p.jenis_kelamin,
    });
    setEditingId(p.id);
  };

  const deleteData = async (id: number) => {
    try {
      await api.delete(`/pelanggans/${id}`);
      fetchData();
    } catch (err) {
      console.error("❌ Delete pelanggan error:", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <FlatList
      data={pelanggans}
      keyExtractor={(i) => i.id.toString()}
      ListHeaderComponent={
        <View style={styles.headerWrapper}>
          <Text style={styles.title}>👤 Master Data Pelanggan</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Kode</Text>
            <TextInput style={styles.input} value={form.kode}
              onChangeText={(t) => setForm({ ...form, kode: t })} />

            <Text style={styles.label}>Nama</Text>
            <TextInput style={styles.input} value={form.nama}
              onChangeText={(t) => setForm({ ...form, nama: t })} />

            <Text style={styles.label}>Domisili</Text>
            <TextInput style={styles.input} value={form.domisili}
              onChangeText={(t) => setForm({ ...form, domisili: t })} />

            <Text style={styles.label}>Jenis Kelamin</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={form.jenis_kelamin}
                onValueChange={(val) => setForm({ ...form, jenis_kelamin: val })}
              >
                <Picker.Item label="Pria" value="PRIA" />
                <Picker.Item label="Wanita" value="WANITA" />
              </Picker>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={saveData}>
              <Text style={styles.saveBtnText}>
                {editingId ? "✏️ Update" : "💾 Simpan"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.headerText]}>Kode</Text>
            <Text style={[styles.cell, styles.headerText]}>Nama</Text>
            <Text style={[styles.cell, styles.headerText]}>Domisili</Text>
            <Text style={[styles.cell, styles.headerText]}>Gender</Text>
            <Text style={[styles.cell, styles.headerText]}>Aksi</Text>
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.cell}>{item.kode}</Text>
          <Text style={styles.cell}>{item.nama}</Text>
          <Text style={styles.cell}>{item.domisili}</Text>
          <Text style={styles.cell}>{item.jenis_kelamin}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => editData(item)} style={styles.editBtn}>
              <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteData(item.id)} style={styles.deleteBtn}>
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
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 12,
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
  editBtn: { backgroundColor: "orange", padding: 6, marginHorizontal: 2, borderRadius: 4 },
  deleteBtn: { backgroundColor: "red", padding: 6, marginHorizontal: 2, borderRadius: 4 },
  btnText: { color: "white", fontSize: 12 },
});
