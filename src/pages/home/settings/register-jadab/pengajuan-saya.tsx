import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import UsahaSaya from "./usaha";
import PengajuanSaya from "./pengajuan";
import Assets from "../../../../assets";

const PengajuanSayaScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<any, any>>();
  const { authorization, profile_data } = route.params || {};
  const [activePage, setActivePage] = useState<number>(0);

  return (
    <View className="flex-1 bg-white">
      {/* Tab Navigation */}
      <View className="flex-row items-center justify-center space-x-3 my-4">
        {[
          { label: "Usaha Saya", page: 0 },
          { label: "Pengajuan Saya", page: 1 },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.page}
            className={[
              "rounded-full px-6 py-1",
              activePage === tab.page ? "bg-red-600" : "bg-white border border-slate-600",
            ].join(" ")}
            onPress={() => setActivePage(tab.page)}
            activeOpacity={0.8}
          >
            <Text
              className={
                activePage === tab.page
                  ? "text-white font-bold "
                  : "text-neutral-900 font-medium"
              }
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Page Content */}
      <ScrollView className="flex-1">
        {activePage === 0 && (
          <UsahaSaya authorization={authorization} profile_data={profile_data} />
        )}
        {activePage === 1 && (
          <PengajuanSaya authorization={authorization} profile_data={profile_data} />
        )}
      </ScrollView>

      {/* Floating Button */}
      <TouchableOpacity
        className="absolute right-6 bottom-16 w-16 h-16 rounded-full bg-white items-center justify-center shadow"
        onPress={() => navigation.navigate("RegisterBussiness")}
      >
        <Assets.ImageNewMessage />
      </TouchableOpacity>

    </View>
  );
};

export default PengajuanSayaScreen;