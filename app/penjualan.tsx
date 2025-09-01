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
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import api from "@/lib/api";

type Item = {
  kode_barang: string;
  qty: number;
};

type Pelanggan = {
  id: number;
  kode: string;
  nama: string;
};

type Barang = {
  id: number;
  kode: string;
  nama: string;
  harga: number;
};

type Penjualan = {
  id: number;
  nota: string;
  tgl: string;
  pelanggan?: Pelanggan;
  items: { barang: Barang; qty: number; total: number }[];
  subtotal: number;
};

export default function PenjualanPage() {
  const [penjualans, setPenjualans] = useState<Penjualan[]>([]);
  const [pelanggans, setPelanggans] = useState<Pelanggan[]>([]);
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [nota, setNota] = useState("");
  const [tgl, setTgl] = useState("");
  const [kodePelanggan, setKodePelanggan] = useState("");
  const [items, setItems] = useState<Item[]>([{ kode_barang: "", qty: 1 }]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const res = await api.get("/penjualans");
      setPenjualans(res.data.data ?? res.data);
      setPelanggans((await api.get("/pelanggans")).data.data ?? []);
      setBarangs((await api.get("/barangs")).data.data ?? []);
    } catch (err) {
      console.error("❌ Fetch penjualan error:", err);
    }
  };

  const saveData = async () => {
    try {
      const payload = { nota, tgl, kode_pelanggan: kodePelanggan, items };
      if (editingId) {
        await api.put(`/penjualans/${editingId}`, payload);
        setEditingId(null);
      } else {
        await api.post("/penjualans", payload);
      }
      setNota("");
      setTgl("");
      setKodePelanggan("");
      setItems([{ kode_barang: "", qty: 1 }]);
      fetchData();
    } catch (err) {
      console.error("❌ Save penjualan error:", err);
    }
  };

  const editData = (p: Penjualan) => {
    setNota(p.nota);
    setTgl(p.tgl);
    setKodePelanggan(p.pelanggan?.kode ?? "");
    setItems(
      p.items.map((it) => ({
        kode_barang: it.barang.kode,
        qty: it.qty,
      }))
    );
    setEditingId(p.id);
  };

  const deleteData = async (id: number) => {
    try {
      await api.delete(`/penjualans/${id}`);
      fetchData();
    } catch (err) {
      console.error("❌ Delete penjualan error:", err);
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Penjualan</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nota"
          value={nota}
          onChangeText={setNota}
        />
        <TextInput
          style={styles.input}
          placeholder="Tanggal (YYYY-MM-DD)"
          value={tgl}
          onChangeText={setTgl}
        />

        <Text style={styles.label}>Pelanggan</Text>

        <View style={styles.pickerWrapper}>
            <Picker
                selectedValue={kodePelanggan}
                onValueChange={(val) => setKodePelanggan(val)}
            >
                <Picker.Item label="-- pilih pelanggan --" value="" />
                {pelanggans.map((p) => (
                <Picker.Item key={p.id} label={p.nama} value={p.kode} />
                ))}
            </Picker>
        </View>

        <Text style={styles.label}>Items</Text>
        {items.map((it, idx) => (
          <View key={idx} style={styles.itemRow}>
            <View style={[styles.pickerWrapper, { flex: 2 }]}>
                <Picker
                    selectedValue={it.kode_barang}
                    style={styles.picker}
                    onValueChange={(val) => {
                    const newItems = [...items];
                    newItems[idx].kode_barang = val;
                    setItems(newItems);
                    }}
                >
                    <Picker.Item label="-- pilih barang --" value="" />
                    {barangs.map((b) => (
                        <Picker.Item key={b.id} label={`${b.nama} (${b.kode})`} value={b.kode} />
                    ))}
                </Picker>
            </View>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Qty"
              keyboardType="numeric"
              value={it.qty.toString()}
              onChangeText={(val) => {
                const newItems = [...items];
                newItems[idx].qty = Number(val);
                setItems(newItems);
              }}
            />
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => removeItem(idx)}
            >
                <Icon name="delete" size={18} color="white" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setItems([...items, { kode_barang: "", qty: 1 }])}
        >
          <Text style={styles.btnText}>+ Barang</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={saveData}>
          <Text style={styles.saveBtnText}>
            {editingId ? "✏️ Update" : "💾 Simpan"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={penjualans}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.headerText]}>Nota</Text>
            <Text style={[styles.cell, styles.headerText]}>Tanggal</Text>
            <Text style={[styles.cell, styles.headerText]}>Pelanggan</Text>
            <Text style={[styles.cell, styles.headerText]}>Subtotal</Text>
            <Text style={[styles.cell, styles.headerText]}>Aksi</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.nota}</Text>
            <Text style={styles.cell}>{item.tgl}</Text>
            <Text style={styles.cell}>{item.pelanggan?.nama}</Text>
            <Text style={styles.cell}>{item.subtotal}</Text>
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
        nestedScrollEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "white" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12, color: "#333" },
  form: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  label: { fontWeight: "600", marginBottom: 4, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  tableHeader: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#007bff",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  headerText: { fontWeight: "bold", color: "white" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  cell: { flex: 1, fontSize: 14 },
  actions: { flexDirection: "row" },
  saveBtn: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnText: { color: "white", fontWeight: "bold" },
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
  addBtn: {
    backgroundColor: "green",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 8,
  },
  btnText: { color: "white", fontSize: 12 },
  selectBox: {
    marginBottom: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: "#fff",
    height: 40,
    justifyContent: "center",
  },
  
  picker: {
    color: "#000",
    height: 50
  },
  
  
});
