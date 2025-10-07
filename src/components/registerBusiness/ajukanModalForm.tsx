import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

interface AjukanModalFormProps {
  data: any;
  setData: (data: any) => void;
}

const kreditOptions = [
  { key: "Ya", label: "Ya" },
  { key: "Tidak", label: "Tidak" },
];

const AjukanModalForm: React.FC<AjukanModalFormProps> = ({ data, setData }) => {
  const [rekomendasi, setRekomendasi] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 0;

  // Simulasi fetch rekomendasi (ganti dengan API call asli jika perlu)
  useEffect(() => {
    if (!searchValue) return;
    setLoading(true);
    setTimeout(() => {
      setRekomendasi([
        { label: "User 1", key: 1 },
        { label: "User 2", key: 2 },
      ]);
      setLoading(false);
    }, 500);
  }, [searchValue]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View className="flex flex-col  gap-4 w-full ">
              {/* Modal */}
              <View className="w-full">
                <Text className="mb-1 text-base text-neutral-900">
                  Modal
                  <Text className="text-red-500">*</Text>
                </Text>
                <View className="flex-row items-center border border-neutral-300 rounded px-2 py-2">
                  <Text className="text-black">
                    Rp
                  </Text>
                  <TextInput
                    className="text-black"
                    keyboardType="numeric"
                    value={String(data.jumlah_modal)}
                    placeholder="modal usaha"
                    placeholderTextColor="#888"
                    onChangeText={(text) => setData({ ...data, jumlah_modal: Number(text) })}
                  />
                </View>
              </View>
              {/* Rencana */}
              <View className="w-full">
                <Text className="mb-1 text-base text-neutral-900">Rencana <Text className="text-red-500">*</Text></Text>
                <TextInput
                  className="border border-neutral-300 rounded px-3 py-3 text-black"
                  value={data.rencana}
                  placeholder="rencana"
                  placeholderTextColor="#888"
                  onChangeText={(text) => setData({ ...data, rencana: text })}
                />
              </View>
              {/* Estimasi Profit */}
              <View className="w-full">
                <Text className="mb-1 text-base text-neutral-900">Estimasi Profit <Text className="text-red-500">*</Text></Text>

                <View className="flex-row items-center border border-neutral-300 rounded px-2 py-2 justify-between">
                  <Text className="text-black">Rp</Text>
                  <TextInput
                    className="flex-1 ml-2 text-black"
                    keyboardType="numeric"
                    value={String(data.estimasi_untung)}
                    placeholder="estimasi profit"
                    placeholderTextColor="#888"
                    onChangeText={(text) => setData({ ...data, estimasi_untung: Number(text) })}
                  />
                  <Text className="text-xs text-neutral-400 ml-2">/Minggu</Text>
                </View>
              </View>
              {/* Bagi Hasil */}
              <View className="w-full">
                <Text className="mb-1 text-base text-neutral-900">Bagi Hasil <Text className="text-red-500">*</Text></Text>
                <View className="flex-row items-center border border-neutral-300 rounded px-2 py-2 justify-between">
                  <TextInput
                    className="text-black"
                    keyboardType="numeric"
                    value={String(data.bagi_hasil)}
                    placeholder="bagi hasil"
                    placeholderTextColor="#888"
                    onChangeText={(text) => setData({ ...data, bagi_hasil: Number(text) })}
                  />
                  <Text className="text-neutral-400">%</Text>
                </View>
              </View>
              {/* Aset */}
              <View className="w-full">
                <Text className="mb-1 text-base text-neutral-900">Aset <Text className="text-red-500">*</Text></Text>
                <TextInput
                  className="border border-neutral-300 rounded px-3 py-3 text-black"
                  value={data.aset}
                  placeholder="aset yang dimiliki"
                  placeholderTextColor="#888"
                  onChangeText={(text) => setData({ ...data, aset: text })}
                />
              </View>
              {/* Kredit */}
              <View className="w-full">
                <Text className="mb-1 text-base text-neutral-900">Kredit <Text className="text-red-500">*</Text></Text>
                <View className="flex-row items-center gap-4">
                  {kreditOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt.key}
                      className="flex-row items-center gap-2"
                      onPress={() => setData({ ...data, kredit: opt.key })}
                    >
                      <View className={`w-5 h-5 rounded-full border ${data.kredit === opt.key ? "border-green-500" : "border-neutral-400"} items-center justify-center`}>
                        {data.kredit === opt.key && (
                          <View className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        )}
                      </View>
                      <Text className="text-base text-neutral-900">{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {/* Rekomendasi */}
              <View className="w-full">
                <Text className="mb-1 text-base text-neutral-900">Rekomendasi <Text className="text-red-500">*</Text></Text>
                <TextInput
                  className="border border-neutral-300 rounded px-3 py-3 text-black"
                  value={searchValue}
                  placeholder="Cari rekomendasi"
                  placeholderTextColor="#888"
                  onChangeText={setSearchValue}
                />
                {loading && <ActivityIndicator size="small" color="#22c55e" />}
                {!loading && rekomendasi.length > 0 && !data.rekomendasi && (
                  <View className="bg-white border border-neutral-200 rounded mt-1">
                    {rekomendasi.map((item) => (
                      <TouchableOpacity
                        key={item.key}
                        className="px-3 py-2"
                        onPress={() => {
                          setData({ ...data, rekomendasi: item.key });
                          setSearchValue(item.label);
                        }}
                      >
                        <Text>{item.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              {/* Nomor Rekening */}
              <View className="w-full">
                <Text className="mb-1 text-base text-neutral-900">Nomor Rekening <Text className="text-red-500">*</Text></Text>
                <TextInput
                  className="border border-neutral-300 rounded px-3 py-3 text-black"
                  value={data.nomor_rekening}
                  placeholder="nomor rekening"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    setData({ ...data, nomor_rekening: text.replace(/[^0-9]/g, "") })
                  }
                />
              </View>
              {/* Pemilik Rekening */}
              <View className="w-full">
                <Text className="mb-1 text-base text-neutral-900">Pemilik Rekening <Text className="text-red-500">*</Text></Text>
                <TextInput
                  className="border border-neutral-300 rounded px-3 py-3 text-black"
                  value={data.pemilik_rekening}
                  placeholder="nama pemilik rekening"
                  placeholderTextColor="#888"
                  onChangeText={(text) => setData({ ...data, pemilik_rekening: text })}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AjukanModalForm;