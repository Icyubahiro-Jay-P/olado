import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing } from "@/constants/theme";

const badges = [
  { icon: "shield-checkmark" as const, title: "Quality", desc: "Verified products" },
  { icon: "car" as const, title: "Fast Delivery", desc: "Nationwide" },
  { icon: "return-down-back" as const, title: "3-Day Return", desc: "Easy returns" },
  { icon: "headset" as const, title: "24/7 Support", desc: "We're here" },
];

export default function TrustBadges() {
  return (
    <View className="flex-row justify-between px-1 py-3">
      {badges.map((badge, i) => (
        <View key={i} className="items-center flex-1">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mb-1.5"
            style={{ backgroundColor: Colors.green50 }}
          >
            <Ionicons name={badge.icon} size={20} color={Colors.green} />
          </View>
          <Text className="text-olado-text text-xs font-semibold text-center">
            {badge.title}
          </Text>
          <Text className="text-olado-text-secondary text-[10px] text-center">
            {badge.desc}
          </Text>
        </View>
      ))}
    </View>
  );
}
