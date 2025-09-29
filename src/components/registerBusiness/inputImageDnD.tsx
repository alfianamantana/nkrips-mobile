import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

interface InputImageDnDProps {
  onUploadFile(file: any, onFinish: () => void): void;
  value?: string;
  preview?: boolean;
}

const InputImageDnD: React.FC<InputImageDnDProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | undefined>(undefined);

  const pickImage = async () => {
    setLoading(true);
    const result = await launchImageLibrary({ mediaType: "photo" });
    if (result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setFileName(file.fileName ?? file.uri.split("/").pop());
      props.onUploadFile(file, () => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  return (
    <View className="w-full h-48 relative">
      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-white/90 rounded-2xl w-full h-full flex flex-col items-center justify-center"
        onPress={pickImage}
      >
        {props.value ? (
          <Image
            source={{ uri: props.value }}
            className="w-full h-full rounded-2xl object-contain"
            resizeMode="contain"
          />
        ) : (
          <View className="flex flex-col items-center gap-1 px-3">
            {loading ? (
              <ActivityIndicator size="large" color="#22c55e" />
            ) : (
              <Text className="text-green-500 text-4xl">📷</Text>
            )}
            <Text className="mt-2 text-center text-sm z-2">
              {fileName ?? "Pilih gambar dari galeri"}
            </Text>
            <Text className="text-zinc-400 text-xs z-2">max file 5MB</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default InputImageDnD;