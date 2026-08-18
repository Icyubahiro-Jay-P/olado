import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore, useWishlistStore } from "@/stores";
import { Colors, Shadows } from "@/constants/theme";
import { WHATSAPP_URL } from "@/constants/config";
import { Linking } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const wishlistCount = useWishlistStore((s) => s.getItemCount());

  const menuItems = [
    {
      icon: "heart" as const,
      title: "My Wishlist",
      badge: wishlistCount,
      onPress: () => router.push("/wishlist"),
    },
    {
      icon: "receipt" as const,
      title: "My Orders",
      onPress: () => {},
    },
    {
      icon: "location" as const,
      title: "Saved Addresses",
      onPress: () => {},
    },
    {
      icon: "card" as const,
      title: "Payment Methods",
      onPress: () => {},
    },
    {
      icon: "storefront" as const,
      title: "Sell on Olado",
      subtitle: "Become a seller",
      onPress: () => router.push("/seller"),
    },
    {
      logo: "logo-whatsapp" as const,
      title: "Chat on WhatsApp",
      color: "#25D366",
      onPress: () => Linking.openURL(WHATSAPP_URL),
    },
    {
      icon: "call" as const,
      title: "Contact Support",
      onPress: () => Linking.openURL("tel:+250783229174"),
    },
    {
      icon: "information-circle" as const,
      title: "About Olado",
      onPress: () => {},
    },
  ];

  return (
    <View className="flex-1 bg-olado-background">
      {/* Header */}
      <View
        className="bg-olado-green"
        style={{ paddingTop: Platform.OS === "ios" ? 50 : 36, paddingBottom: 24 }}
      >
        <View className="px-4">
          <Text className="text-white font-bold text-2xl">Account</Text>
        </View>

        {isAuthenticated && user ? (
          <View className="flex-row items-center mt-4 px-4">
            <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center mr-3">
              <Text className="text-white font-bold text-xl">
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-lg">{user.name}</Text>
              <Text className="text-white/70 text-sm">{user.email}</Text>
            </View>
          </View>
        ) : (
          <View className="px-4 mt-4">
            <TouchableOpacity
              onPress={() => router.push("/auth/login")}
              className="bg-white rounded-xl py-3 items-center flex-row justify-center"
            >
              <Ionicons name="log-in-outline" size={20} color={Colors.green} />
              <Text className="text-olado-green font-semibold ml-2">
                Login / Register
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            className="bg-white rounded-xl px-4 py-4 mb-2 flex-row items-center"
            style={Shadows.sm}
            activeOpacity={0.7}
          >
            {item.logo ? (
              <Ionicons name={item.logo} size={22} color={item.color} />
            ) : (
              <Ionicons
                name={item.icon!}
                size={22}
                color={item.color || Colors.textSecondary}
              />
            )}
            <View className="flex-1 ml-3">
              <Text className="text-olado-text font-medium text-sm">
                {item.title}
              </Text>
              {item.subtitle && (
                <Text className="text-olado-text-secondary text-xs">
                  {item.subtitle}
                </Text>
              )}
            </View>
            {item.badge !== undefined && item.badge > 0 && (
              <View className="bg-olado-accent rounded-full min-w-[20px] h-5 items-center justify-center px-1.5 mr-2">
                <Text className="text-white text-xs font-bold">{item.badge}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
          </TouchableOpacity>
        ))}

        {isAuthenticated && (
          <TouchableOpacity
            onPress={logout}
            className="bg-white rounded-xl px-4 py-4 mb-8 flex-row items-center"
            style={Shadows.sm}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={22} color={Colors.error} />
            <Text className="text-olado-error font-medium ml-3 text-sm">
              Logout
            </Text>
          </TouchableOpacity>
        )}

        <View className="items-center py-6 mb-8">
          <Text className="text-olado-text-light text-xs">
            Olado v1.0.0 - Your Trusted Marketplace
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
