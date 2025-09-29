import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, LayoutAnimation, Platform, UIManager, ToastAndroid, ActivityIndicator } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { getPengajuanSaya, approveOffer as approveOfferService, rejectOffer as rejectOfferService } from "../../../../services/home/registerJadab";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PengajuanSaya = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<any, any>>();
  const { authorization } = route.params || {};

  const [data, setData] = useState<any[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getPengajuanSaya(authorization);

      setData(data.data);
      setTotalData(data.total);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      ToastAndroid.show("Gagal memuat data pengajuan.", ToastAndroid.SHORT);
    }
  };

  const approveOffer = async (id: number) => {
    try {
      await approveOfferService(id);
      await fetchData();
    } catch {
      ToastAndroid.show("Gagal menyetujui penawaran.", ToastAndroid.SHORT);
    }
  };

  const rejectOffer = async (id: number) => {
    try {
      await rejectOfferService(id);
      await fetchData();
    } catch {
      ToastAndroid.show("Gagal menolak penawaran.", ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    fetchData().catch((e) => console.log("error", e));
  }, []);

  function formatCurrency(amount: number | string) {
    if (!amount) return "";
    let numStr = amount.toString().replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(parseFloat(numStr));
  }

  const handleCollapse = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenItemId(openItemId === id ? null : id);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 flex-col">
      {data.map((item) => {
        const isCollapsible = openItemId === item.id;
        return (
          <View key={item.id}>
            <TouchableOpacity
              onPress={() => handleCollapse(item.id)}
              className="flex flex-row space-x-4 border-b border-gray-100 p-4"
              activeOpacity={0.8}
            >
              <View>
                <Image
                  source={{ uri: item.foto_usaha_url }}
                  className="rounded-md w-32 h-20"
                  resizeMode="cover"
                />
              </View>
              <View className="flex flex-col flex-1">
                <View className="flex flex-row space-x-2">
                  <Text className="text-black font-normal">Nama Usaha :</Text>
                  <Text className="text-black font-medium">{item.nama_usaha}</Text>
                </View>
                <View className="flex flex-row justify-between items-center">
                  <View className="flex flex-row space-x-2">
                    <Text className="text-black font-normal ">Bidang :</Text>
                    <Text className="text-black font-medium">{item.bidang}</Text>
                  </View>
                  {/* Jika ingin collapsible khusus status tertentu, bisa tambahkan kondisi di sini */}
                </View>
                <View className="flex flex-row space-x-2">
                  <Text className="text-black font-normal ">Modal :</Text>
                  <Text className="text-black font-medium">
                    Rp. {formatCurrency(item.jumlah_modal)}
                  </Text>
                </View>
                <View className="flex flex-row w-full items-end justify-end">
                  <Text
                    className={`text-[15px] ${item.status === "Pending"
                      ? "text-yellow-400"
                      : item.status === "Ditolak"
                        ? "text-red-500"
                        : item.status === "Disetujui"
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                  >
                    {item.status === 'Budget_Controller_Acknowledge' ? "Budget Controller Acknowledge" : item.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            {isCollapsible && (
              <>
                {item.status === "Penawaran" && (
                  <View className="overflow-hidden bg-gray-100 border rounded-md mx-4 mb-2 p-4 flex flex-row items-center justify-between">
                    <View className="flex flex-col text-sm">
                      <Text className="text-black">Bagi Hasil</Text>
                      <Text className="text-black">{item.bagi_hasil}%</Text>
                    </View>
                    <View className="flex flex-col text-sm">
                      <Text className="text-black">Modal Diberikan</Text>
                      <Text className="text-black">
                        Rp. {formatCurrency(Number(item.jumlah_modal))}
                      </Text>
                    </View>
                    <View className="flex flex-row space-x-4">
                      <TouchableOpacity
                        onPress={() => rejectOffer(item.id)}
                        className="mt-2 bg-white border border-red-500 px-4 py-2 rounded-md"
                      >
                        <Text className="text-red-500 font-medium">Tolak</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => approveOffer(item.id)}
                        className="mt-2 bg-red-500 px-4 py-2 rounded-md"
                      >
                        <Text className="text-white font-medium">Terima</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default PengajuanSaya;