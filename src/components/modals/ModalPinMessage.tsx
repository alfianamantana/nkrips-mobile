import React from "react";
import { View, Text, TouchableOpacity, ToastAndroid } from "react-native";
import Modal from "react-native-modal";

interface ModalPinMessageProps {
  isVisible: boolean;
  onClose: () => void;
  onPin: (duration: number) => Promise<void>;
  pinMessage?: any;
  selectedPinDuration: number;
  setSelectedPinDuration: (val: number) => void;
}

const ModalPinMessage: React.FC<ModalPinMessageProps> = ({
  isVisible,
  onClose,
  onPin,
  pinMessage,
  selectedPinDuration,
  setSelectedPinDuration,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      backdropOpacity={0.4}
    >
      <View style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 24,
        alignItems: "flex-start"
      }}>
        <Text style={{
          fontWeight: "bold",
          fontSize: 22,
          color: "#232B36",
          marginBottom: 24,
          alignSelf: "center"
        }}>
          Pilih Durasi Pin Pesan
        </Text>
        {[
          { label: "24 Jam", value: 1 },
          { label: "7 Hari", value: 7 },
          { label: "30 Hari", value: 30 }
        ].map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
            onPress={() => setSelectedPinDuration(opt.value)}
          >
            <View style={{
              width: 24, height: 24, borderRadius: 12,
              borderWidth: 2, borderColor: "#d32f2f",
              alignItems: "center", justifyContent: "center",
              marginRight: 12
            }}>
              {selectedPinDuration === opt.value && (
                <View style={{
                  width: 12, height: 12, borderRadius: 6,
                  backgroundColor: "#d32f2f"
                }} />
              )}
            </View>
            <Text style={{ fontSize: 18, color: "#232B36" }}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: 8 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 24,
              marginRight: 12
            }}
            onPress={onClose}
          >
            <Text style={{ color: "#232B36", fontWeight: "500", fontSize: 16 }}>Batal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#d32f2f",
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 24
            }}
            onPress={async () => {
              if (pinMessage) {
                await onPin(selectedPinDuration);
              }
              onClose();
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "500", fontSize: 16 }}>Pin Pesan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalPinMessage;