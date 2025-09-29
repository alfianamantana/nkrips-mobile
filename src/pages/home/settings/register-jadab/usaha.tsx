import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, ToastAndroid, ActivityIndicator } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { getUsahaSaya } from "../../../../services/home/registerJadab";

const UsahaSaya = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<any, any>>();

  const [data, setData] = useState<any[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await getUsahaSaya();
      setData(data.data);
      setTotalData(data.total);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      ToastAndroid.show("Gagal memuat data usaha.", ToastAndroid.SHORT);
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

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 flex-col bg-white">
      <View >
        {data.map((item: any) => (
          <TouchableOpacity
            id={`usaha-${item.id}`}
            key={item.id}
            className="flex flex-row items-start space-x-4 mb-4 mx-3 p-4 bg-white rounded-xl shadow-sm"
            onPress={() => navigation.navigate('DetailBussiness', { id: item.id })}
            activeOpacity={0.85}
          >
            <Image
              source={{ uri: item.foto_usaha_url }}
              className="rounded-lg w-28 h-20 bg-gray-200"
              resizeMode="cover"
            />
            <View className="flex-1 flex-col justify-between">
              <View>
                <View className="flex flex-row space-x-2 mb-1">
                  <Text className="text-[15px] font-normal text-gray-800">Nama Usaha :</Text>
                  <Text className="text-[15px] text-black font-medium">{item.nama_usaha}</Text>
                </View>
                <View className="flex flex-row space-x-2 mb-1">
                  <Text className="text-[15px] font-normal text-gray-800">Bidang :</Text>
                  <Text className="text-[15px] text-black font-medium">{item.bidang}</Text>
                </View>
                <View className="flex flex-row space-x-2 mb-1">
                  <Text className="text-[15px] font-normal text-gray-800">Modal :</Text>
                  <Text className="text-[15px] text-black font-medium">
                    Rp. {formatCurrency(item.jumlah_modal)}
                  </Text>
                </View>
                <View className="flex flex-row space-x-2">
                  <Text className="text-[15px] font-normal text-gray-800">Bagi Hasil :</Text>
                  <Text className="text-[15px] text-black font-medium">{item.bagi_hasil}%</Text>
                </View>
              </View>
              <View className="flex flex-row w-full items-end justify-end mt-3">
                <Text
                  className={`text-[15px] font-bold ${item.status === "Pending"
                    ? "text-yellow-500"
                    : item.status === "Ditolak"
                      ? "text-red-500"
                      : item.status === "Disetujui"
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default UsahaSaya