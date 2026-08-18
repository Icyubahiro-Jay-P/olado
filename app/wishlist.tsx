import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useWishlistStore, useCartStore } from "@/stores";
import { Colors, Shadows, BorderRadius } from "@/constants/theme";
import { formatPrice } from "@/utils/format";
import { EmptyState, ProductCard } from "@/components";

export default function WishlistScreen() {
  const router = useRouter();
  const { items, removeItem, toggleItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  return (
    <View className="flex-1 bg-olado-background">
      {/* Header */}
      <View
        className="bg-olado-green"
        style={{ paddingTop: Platform.OS === "ios" ? 50 : 36, paddingBottom: 16 }}
      >
        <View className="flex-row items-center px-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white font-bold text-2xl flex-1">
            Wishlist ({items.length})
          </Text>
        </View>
      </View>

      {items.length === 0 ? (
        <EmptyState
          icon="❤️"
          title="Your wishlist is empty"
          description="Save items you love for later"
          action={
            <TouchableOpacity
              onPress={() => router.push("/products")}
              className="bg-olado-green rounded-xl px-6 py-3"
            >
              <Text className="text-white font-semibold">Start Shopping</Text>
            </TouchableOpacity>
          }
        />
      ) : (
        <FlatList
          data={items}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 12,
          }}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="bg-white rounded-xl overflow-hidden mb-3 flex-1 mx-1" style={Shadows.sm}>
              <TouchableOpacity
                onPress={() => router.push(`/product/${item.id}`)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: item.images[0] }}
                  style={{ width: "100%", aspectRatio: 1 }}
                />
              </TouchableOpacity>
              <View className="p-3">
                <Text className="text-olado-text-secondary text-xs" numberOfLines={1}>
                  {item.brand || item.category.name}
                </Text>
                <Text className="text-olado-text font-medium text-sm" numberOfLines={2}>
                  {item.name}
                </Text>
                <Text className="text-olado-green font-bold text-base mt-1">
                  {formatPrice(item.price)}
                </Text>
                <View className="flex-row gap-2 mt-2">
                  <TouchableOpacity
                    onPress={() => addItem(item)}
                    className="flex-1 bg-olado-accent rounded-lg py-1.5 items-center"
                  >
                    <Text className="text-white text-xs font-semibold">Add to Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => toggleItem(item)}
                    className="bg-olado-background rounded-lg px-2 py-1.5"
                  >
                    <Ionicons name="trash-outline" size={14} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
