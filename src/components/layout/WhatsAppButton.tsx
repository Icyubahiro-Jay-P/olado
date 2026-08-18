import React from "react";
import { TouchableOpacity, Linking, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WHATSAPP_URL } from "@/constants/config";
import { Colors, Shadows } from "@/constants/theme";

export default function WhatsAppButton() {
  const handlePress = () => {
    Linking.openURL(WHATSAPP_URL).catch(() => {});
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="absolute z-50 rounded-full bottom-6 right-5"
      activeOpacity={0.8}
      style={{
        shadowColor: "#25D366",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <View
        className="items-center justify-center rounded-full w-14 h-14"
        style={{ backgroundColor: "#25D366" }}
      >
        <Ionicons name="logo-whatsapp" size={30} color="white" />
      </View>
    </TouchableOpacity>
  );
}
