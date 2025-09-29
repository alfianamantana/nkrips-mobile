import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
  ToastAndroid,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Assets from "../../../../assets";
import { getBagiHasilUsaha } from "../../../../services/home/registerJadab";
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BagiHasilScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<any, any>>();
  const { id } = route.params || {};

  const [data, setData] = useState<any[]>([]);
  const [openItemId, setOpenItemId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const { data } = await getBagiHasilUsaha(id);
      setData(data.data);
    } catch (err) {
      ToastAndroid.show("Error fetching data", ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (date: string) => {
    const new_date = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new_date.toLocaleDateString("id-ID", options);
  };

  function formatCurrency(amount: number | string) {
    if (!amount) return "";
    let numStr = amount.toString().replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(parseFloat(numStr));
  }

  const handleCollapse = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenItemId(openItemId === id ? null : id);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* List */}
      <ScrollView>
        {data.map((item) => {
          const isCollapsible = openItemId === item.id;
          return (
            <View key={item.id}>
              <TouchableOpacity
                onPress={() => handleCollapse(item.id)}
                style={{
                  borderBottomWidth: 1,
                  borderColor: "#eee",
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#fff",
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
                activeOpacity={0.8}
              >
                <View>
                  <Text className="text-black font-medium" style={{ fontSize: 16 }}>{item.bulan}</Text>
                </View>
                <View style={[
                  { transform: [{ rotate: "90deg" }] },
                  isCollapsible ? { transform: [{ rotate: "270deg" }] } : {}
                ]}>
                  <Assets.IconArrowBack />
                </View>
              </TouchableOpacity>
              {/* Collapsible */}
              {isCollapsible && (
                <View style={{ overflow: "hidden", backgroundColor: "#f3f4f6" }}>
                  {item.is_open && (
                    <View style={{ padding: 16, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, backgroundColor: "#f3f4f6", flexDirection: "row", alignItems: "center", justifyContent: "space-between", margin: 8 }}>
                      <Text className="text-black font-medium">{formatDate(String(new Date()))}</Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("PayJadab", { id: item.id })}
                        style={{ backgroundColor: "#ef4444", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
                      >
                        <Text style={{ color: "#fff" }}>Bayar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {/* Riwayat pembayaran */}
                  {item.payment.length === 0 ? (
                    <View style={{ padding: 16, alignItems: "center" }}>
                      <Text className="text-black font-medium">Belum ada pembayaran</Text>
                    </View>
                  ) : (
                    item.payment.map((pay: any) => (
                      <View
                        key={pay.id}
                        style={{ padding: 16, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, backgroundColor: "#f3f4f6", flexDirection: "row", alignItems: "center", justifyContent: "space-between", margin: 8 }}
                      >
                        <View style={{ flexDirection: "column" }}>
                          <Text style={{ fontSize: 13 }} className="text-black font-medium">Jumlah</Text>
                          <Text style={{ fontSize: 13, fontWeight: "bold" }} className="text-black font-medium">Rp. {formatCurrency(pay.jumlah_pembayaran)}</Text>
                        </View>
                        <View style={{ flexDirection: "column" }}>
                          <Text style={{ fontSize: 13 }} className="text-black font-medium">Tanggal</Text>
                          <Text style={{ fontSize: 13 }} className="text-black font-medium">{formatDate(String(pay.created_at))}</Text>
                        </View>
                        <Text style={{ fontSize: 13 }} className="text-black font-medium">{pay.status}</Text>
                      </View>
                    ))
                  )}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default BagiHasilScreen;