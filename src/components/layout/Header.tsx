import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useCartStore, useWishlistStore } from "@/stores";
import { Colors, Shadows } from "@/constants/theme";

interface HeaderProps {
  showBack?: boolean;
  showSearch?: boolean;
}

export default function Header({ showBack, showSearch = true }: HeaderProps) {
  const router = useRouter();
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getItemCount());

  return (
    <View
      className="flex-row items-center bg-olado-green px-4 py-3"
      style={{
        paddingTop: Platform.OS === "ios" ? 50 : 40,
      }}
    >
      {showBack && (
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => router.push("/")}
        className="flex-row items-center flex-1"
      >
        <View className="bg-white rounded-lg px-2 py-1 mr-2">
          <View className="flex-row items-center">
            <Ionicons name="bag" size={16} color={Colors.green} />
            <View className="ml-1">
              <View
                className="h-1 rounded-full mb-0.5"
                style={{ width: 20, backgroundColor: Colors.green }}
              />
              <View
                className="h-1 rounded-full"
                style={{ width: 14, backgroundColor: Colors.green }}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {showSearch && (
        <TouchableOpacity
          onPress={() => router.push("/search")}
          className="flex-1 mx-3 bg-white/20 rounded-xl flex-row items-center px-3 py-2"
        >
          <Ionicons name="search" size={18} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      )}

      <View className="flex-row items-center gap-3">
        <TouchableOpacity
          onPress={() => router.push("/wishlist")}
          className="relative"
        >
          <Ionicons name="heart-outline" size={24} color="white" />
          {wishlistCount > 0 && (
            <View className="absolute -top-1.5 -right-1.5 bg-olado-accent rounded-full w-4 h-4 items-center justify-center">
              <View className="text-white text-[9px] font-bold">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </View>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/cart")}
          className="relative"
        >
          <Ionicons name="bag-outline" size={24} color="white" />
          {cartCount > 0 && (
            <View className="absolute -top-1.5 -right-1.5 bg-olado-accent rounded-full min-w-[18px] h-[18px] items-center justify-center">
              <View className="text-white text-[9px] font-bold">
                {cartCount > 99 ? "99+" : cartCount}
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
