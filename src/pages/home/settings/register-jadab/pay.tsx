import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  ToastAndroid,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import InputImageDnD from "../../../../components/registerBusiness/inputImageDnD";
import moment from "moment";
import axios, { AxiosResponse } from "axios";
import { launchImageLibrary } from "react-native-image-picker";
import { postBayarBagiHasil, getDetailBayarBagiHasil } from "../../../../services/home/registerJadab";

const BayarBagiHasilScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<any, any>>();
  const { id } = route.params || {};
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    jatuh_tempo_id: Number(id),
    bukti_pembayaran_url: "",
    jumlah_pembayaran: "",
  });

  const pembayaran = {
    nomor_rekening: "1122334455",
    pemilik_rekening: "Hseo Grha Tekno",
  }

  async function fetchData() {
    setLoading(true);
    try {
      const { data } = await getDetailBayarBagiHasil(id);

      setData((prevData) => ({
        ...prevData,
        ...data,
      }));
    } catch (error) {
      ToastAndroid.show("Gagal mengambil detail", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  }

  // Mock info rekening, ganti dengan fetchDetailData jika sudah ada API
  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await postBayarBagiHasil(data);

      ToastAndroid.show("Pembayaran berhasil dikirim", ToastAndroid.SHORT);
      navigation.goBack();
    } catch (err: any) {
      ToastAndroid.show("Gagal mengirim pembayaran", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: any) => {
    try {
      if (!file.uri || !file.type) {
        throw new Error("File tidak valid");
      }

      const formData = new FormData();

      formData.append("file", {
        uri: file.uri,
        type: file.type,
        name: moment().format("YYYYMMDD_HHmmss") + ".jpg",
      });


      const res: AxiosResponse<string> = await axios.post(
        "https://awan.graf.run/upload",
        formData,
        {
          headers: {
            Authorization: "hseo",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setData({ ...data, bukti_pembayaran_url: res.data });
    } catch (err: any) {
      ToastAndroid.show("Gagal mengupload file", ToastAndroid.SHORT);
    }
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: "photo" });
    if (result.assets && result.assets.length > 0) {
      uploadFile(result.assets[0]);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Informasi Pembayaran */}
        <View className="font-satoshi flex flex-col gap-y-2" style={{ marginBottom: 24 }}>
          <Text style={{ fontWeight: "bold", fontSize: 20, color: "#222", marginBottom: 12 }}>Informasi Pembayaran</Text>
          <Text style={{ fontWeight: "bold", fontSize: 15, color: "#222" }}>Nomor Rekening</Text>
          <View style={{ borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 8 }}>
            <Text style={{ fontSize: 16, color: "#222" }}>{pembayaran.nomor_rekening}</Text>
          </View>
          <Text style={{ fontWeight: "bold", fontSize: 15, color: "#222" }}>Pemilik Rekening</Text>
          <View style={{ borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 8 }}>
            <Text style={{ fontSize: 16, color: "#222" }}>{pembayaran.pemilik_rekening}</Text>
          </View>
          <Text style={{ fontWeight: "bold", fontSize: 15, color: "#222" }}>Tanggal Pembayaran</Text>
          <View style={{ borderWidth: 1, borderRadius: 8, padding: 8 }}>
            <Text style={{ fontSize: 16, color: "#222" }}>{data.bulan}</Text>
          </View>
        </View>
        {/* Bukti Pembayaran */}
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 20, color: "#222", marginBottom: 12 }}>Bukti Pembayaran</Text>
          <Text style={{ fontWeight: "bold", fontSize: 15, color: "#222", marginBottom: 4 }}>Jumlah Pembayaran <Text style={{ color: "#ef4444" }}>*</Text></Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 8,
              marginBottom: 12,
              backgroundColor: "#fff",
            }}
          >
            <Text style={{ fontSize: 16, color: "#222", marginRight: 4 }}>Rp</Text>
            <TextInput
              id="jumlah_pembayaran"
              placeholder="Jumlah pembayaran"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={data.jumlah_pembayaran}
              onChangeText={(val) => setData({ ...data, jumlah_pembayaran: val })}
              style={{
                flex: 1,
                padding: 8,
                fontSize: 16,
                color: "#222",
                borderWidth: 0,
              }}
            />
          </View>
          {/* Upload Bukti Pembayaran */}
          <View style={{ marginTop: 16 }}>
            <Text style={{ marginBottom: 4, fontSize: 15, color: "#222" }}>
              Upload Bukti Pembayaran <Text style={{ color: "#ef4444" }}>*</Text>
            </Text>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: "#ccc",
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 32,
                marginTop: 8,
                marginBottom: 8,
                backgroundColor: "#fafafa",
              }}
              onPress={pickImage}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#ef4444" />
              ) : data.bukti_pembayaran_url ? (
                <Image
                  source={{ uri: data.bukti_pembayaran_url }}
                  style={{ width: 120, height: 120, borderRadius: 8, marginBottom: 8 }}
                  resizeMode="cover"
                />
              ) : (
                <InputImageDnD
                  onUploadFile={uploadFile}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={onSubmit}
          disabled={loading}
          style={{
            backgroundColor: "#ef4444",
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 16,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Lanjutkan</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default BayarBagiHasilScreen;