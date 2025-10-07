import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ToastAndroid, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from "react-native-image-picker";
import InputImageDnD from "./inputImageDnD";
import axios, { AxiosResponse } from "axios";
import moment from "moment-timezone";
interface DaftarUsahaFormProps {
  data: {
    nama_usaha: string;
    alamat: string;
    bidang: string;
    deskripsi: string;
    foto_usaha_url: string;
    [key: string]: any;
  };
  setData: (data: any) => void;
}

const DaftarUsahaForm: React.FC<DaftarUsahaFormProps> = ({ data, setData }) => {
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 0;
  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: "photo" });
    if (result.assets && result.assets.length > 0) {
      setData({ ...data, foto_usaha_url: result.assets[0].uri });
    }
  };

  const uploadFile = async (file: any, cb: () => void) => {
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

      setData({ ...data, foto_usaha_url: res.data });
    } catch (err: any) {
      ToastAndroid.show("Gagal mengupload file", ToastAndroid.SHORT);
    } finally {
      cb();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View className="flex flex-col items-center gap-y-4">
              {/* Nama Usaha */}
              <View className="w-full">
                <Text className="mb-1 text-base text-neutral-900">
                  Nama Usaha <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="border border-neutral-300 rounded px-3 py-3 text-black"
                  value={data.nama_usaha}
                  placeholder="Nama Usaha"
                  placeholderTextColor="#888"
                  onChangeText={(text) => setData({ ...data, nama_usaha: text })}
                />
              </View>
              {/* Bidang */}
              <View className="w-full">
                <Text className="mb-1 text-base text-neutral-900">
                  Bidang Usaha <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="border border-neutral-300 rounded px-3 py-3 text-black"
                  value={data.bidang}
                  placeholder="Bidang Usaha"
                  placeholderTextColor="#888"
                  onChangeText={(text) => setData({ ...data, bidang: text })}
                />
              </View>
              {/* Alamat */}
              <View className="w-full">
                <Text className="mb-1 text-base text-neutral-900">
                  Alamat <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="border border-neutral-300 rounded px-3 py-3 text-black"
                  value={data.alamat}
                  placeholder="Alamat Usaha"
                  placeholderTextColor="#888"
                  onChangeText={(text) => setData({ ...data, alamat: text })}
                />
              </View>
              {/* Deskripsi */}
              <View className="w-full">
                <Text className="mb-1 text-base text-neutral-900">
                  Deskripsi <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  className="border border-neutral-300 rounded px-3 py-3 text-black"
                  value={data.deskripsi}
                  placeholder="Deskripsi Usaha"
                  placeholderTextColor="#888"
                  onChangeText={(text) => setData({ ...data, deskripsi: text })}
                />
              </View>
              {/* Upload Foto Usaha */}
              <View className="w-full">
                <Text className="mb-1 text-base text-neutral-900">
                  Upload Foto Usaha <Text className="text-red-500">*</Text>
                </Text>
                <TouchableOpacity
                  className="border border-dashed border-neutral-300 rounded flex items-center justify-center py-8"
                  onPress={pickImage}
                >
                  {data.foto_usaha_url ? (
                    <Image
                      source={{ uri: data.foto_usaha_url }}
                      className="w-32 h-32 rounded mb-2"
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
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DaftarUsahaForm;