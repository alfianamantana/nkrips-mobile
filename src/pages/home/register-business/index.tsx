import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Image, ToastAndroid } from "react-native";
import Button from "../../../components/button"
import { postDaftarUsaha } from "../../../services/home/registerJadab/index"
import { HeaderDaftarBisnis } from "../../../components/registerBusiness/headerDaftarBisnis";
import DaftarUsahaForm from "../../../components/registerBusiness/daftarUsahaForm";
import AjukanModalForm from "../../../components/registerBusiness/ajukanModalForm";
import axios, { AxiosResponse } from "axios";

const RegisterBussinessScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    nama_usaha: '',
    alamat: '',
    bidang: '',
    deskripsi: '',
    foto_usaha_url: '',
    aset: '',
    bagi_hasil: 0,
    estimasi_untung: 0,
    jumlah_modal: 0,
    kredit: '',
    rencana: '',
    nomor_rekening: '',
    pemilik_rekening: ''
  });
  const [step, setStep] = useState(1);

  const isLocalImage = (uri: string) => {
    // Cek jika path lokal (bukan url http/https)
    return uri && !/^https?:\/\//.test(uri);
  };

  const isStep1Valid = () => {
    return (
      data.nama_usaha.trim() !== "" &&
      data.bidang.trim() !== "" &&
      data.alamat.trim() !== "" &&
      data.deskripsi.trim() !== "" &&
      data.foto_usaha_url.trim() !== ""
    );
  };

  const submit = async () => {
    if (loading) return;
    if (step === 1) {
      if (!isStep1Valid()) {
        ToastAndroid.show("Isi semua field!", ToastAndroid.SHORT);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      try {
        setLoading(true);
        if (isLocalImage(data.foto_usaha_url)) {
          const formData = new FormData();
          formData.append("file", {
            uri: data.foto_usaha_url,
            name: "foto_usaha.jpg",
            type: "image/jpeg",
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
          data.foto_usaha_url = res.data;
          setData({ ...data });
        }

        if (!data.foto_usaha_url) {
          ToastAndroid.show("Silakan upload foto usaha terlebih dahulu.", ToastAndroid.SHORT);
          return;
        }

        await postDaftarUsaha(data);
        ToastAndroid.show("Pengajuan berhasil", ToastAndroid.SHORT);
        navigation.replace("PengajuanSaya");
      } catch (err) {
        ToastAndroid.show(err?.message || "Terjadi kesalahan", ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    }
  };

  const onBack = () => {
    if (step > 1) {
      setStep(1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <View className="flex-1 bg-white ">
      <ScrollView>
        <View className="flex flex-col gap-y-2 px-2 pb-10">
          <HeaderDaftarBisnis step={step} />
          {step === 1 ? (
            <DaftarUsahaForm data={data} setData={setData} />
          ) : (
            <AjukanModalForm data={data} setData={setData} />
          )}
          <View className="mt-">
            <Button label="Lanjutkan" onPress={submit} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterBussinessScreen;
