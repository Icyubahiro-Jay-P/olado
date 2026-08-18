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
import { useCartStore } from "@/stores";
import { Colors, Shadows, BorderRadius } from "@/constants/theme";
import { formatPrice } from "@/utils/format";
import { EmptyState } from "@/components";
import { CartItem } from "@/types";

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotal, getItemCount } =
    useCartStore();

  const subtotal = getTotal();
  const shipping = subtotal >= 50000 ? 0 : 3000;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-olado-background">
        <View
          className="bg-olado-green"
          style={{ paddingTop: Platform.OS === "ios" ? 50 : 36, paddingBottom: 16 }}
        >
          <View className="px-4">
            <Text className="text-white font-bold text-2xl">My Cart</Text>
          </View>
        </View>
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Start shopping and add items to your cart"
          action={
            <TouchableOpacity
              onPress={() => router.push("/products")}
              className="bg-olado-green rounded-xl px-6 py-3"
            >
              <Text className="text-white font-semibold">Browse Products</Text>
            </TouchableOpacity>
          }
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-olado-background">
      {/* Header */}
      <View
        className="bg-olado-green"
        style={{ paddingTop: Platform.OS === "ios" ? 50 : 36, paddingBottom: 16 }}
      >
        <View className="flex-row items-center px-4">
          <Text className="text-white font-bold text-2xl flex-1">
            My Cart ({getItemCount()})
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: CartItem }) => (
          <View
            className="bg-white rounded-xl p-4 mb-3 flex-row"
            style={Shadows.sm}
          >
            <Image
              source={{ uri: item.product.images[0] }}
              style={{ width: 80, height: 80, borderRadius: BorderRadius.md }}
            />
            <View className="flex-1 ml-3 justify-between">
              <View>
                <Text
                  className="text-olado-text font-medium text-sm"
                  numberOfLines={2}
                >
                  {item.product.name}
                </Text>
                <Text className="text-olado-green font-bold text-base mt-1">
                  {formatPrice(item.product.price)}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center bg-olado-background rounded-lg overflow-hidden">
                  <TouchableOpacity
                    onPress={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    className="px-3 py-1.5"
                  >
                    <Ionicons name="remove" size={18} color={Colors.text} />
                  </TouchableOpacity>
                  <Text className="text-olado-text font-semibold text-sm px-2">
                    {item.quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    className="px-3 py-1.5"
                  >
                    <Ionicons name="add" size={18} color={Colors.text} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeItem(item.product.id)}>
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={Colors.error}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View>
            {/* Summary */}
            <View className="bg-white rounded-xl p-4 mt-2" style={Shadows.sm}>
              <Text className="text-olado-text font-bold text-base mb-3">
                Order Summary
              </Text>
              <View className="flex-row justify-between mb-2">
                <Text className="text-olado-text-secondary text-sm">Subtotal</Text>
                <Text className="text-olado-text text-sm font-medium">
                  {formatPrice(subtotal)}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-olado-text-secondary text-sm">
                  Shipping
                </Text>
                <Text
                  className={`text-sm font-medium ${
                    shipping === 0 ? "text-olado-success" : "text-olado-text"
                  }`}
                >
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </Text>
              </View>
              {shipping > 0 && (
                <Text className="text-olado-text-light text-xs mb-2">
                  Free shipping on orders over 50,000 RWF
                </Text>
              )}
              <View className="flex-row justify-between mb-2">
                <Text className="text-olado-text-secondary text-sm">
                  TVA (18%)
                </Text>
                <Text className="text-olado-text text-sm font-medium">
                  {formatPrice(tax)}
                </Text>
              </View>
              <View
                className="border-t border-olado-border pt-2 mt-2 flex-row justify-between"
              >
                <Text className="text-olado-text font-bold text-base">Total</Text>
                <Text className="text-olado-green font-bold text-lg">
                  {formatPrice(total)}
                </Text>
              </View>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              onPress={() => router.push("/checkout")}
              className="bg-olado-green rounded-xl py-4 mt-4 items-center mb-8"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-base">
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
