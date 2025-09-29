import React from "react";
import { View, Text } from "react-native";

interface HeaderDaftarBisnisProps {
  step: 1 | 2;
}

export function HeaderDaftarBisnis(props: HeaderDaftarBisnisProps) {
  return (
    <View className="flex flex-col gap-1.5 mb-3">
      <View className="flex-row items-center gap-2">
        {[0, 1].map((i) => (
          <View
            key={i}
            className={`flex-1 h-1 w-full rounded-full ${i < props.step ? "bg-red-500" : "bg-neutral-400"}`}
          />
        ))}
      </View>
      <Text className="text-base font-semibold text-neutral-900 mt-3">
        Daftar Usaha
      </Text>
      <Text className="text-sm text-neutral-700">
        Silakan lengkapi formulir untuk mendaftarkan usaha
      </Text>
    </View>
  );
}
