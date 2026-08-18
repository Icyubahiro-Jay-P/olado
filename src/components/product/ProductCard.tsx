import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, BorderRadius, Spacing, Shadows } from "@/constants/theme";
import { calculateDiscount, getStockLabel, formatPrice } from "@/utils/format";
import { Product } from "@/types";
import { useCartStore } from "@/stores";
import { useWishlistStore } from "@/stores";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

interface ProductCardProps {
  product: Product;
  variant?: "grid" | "list" | "horizontal";
  style?: any;
}

export default function ProductCard({
  product,
  variant = "grid",
  style,
}: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const stockInfo = getStockLabel(product.stock);

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  if (variant === "horizontal") {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className="flex-row bg-white rounded-xl overflow-hidden"
        style={[Shadows.sm, style]}
      >
        <Image
          source={{ uri: product.images[0] }}
          contentFit="cover"
          transition={300}
          style={{ width: 120, height: 120 }}
          placeholder={undefined}
        />
        <View className="flex-1 p-3 justify-between">
          <View>
            <Text
              className="text-olado-text-secondary text-xs mb-1"
              numberOfLines={1}
            >
              {product.brand || product.category.name}
            </Text>
            <Text className="text-olado-text font-medium text-sm" numberOfLines={2}>
              {product.name}
            </Text>
          </View>
          <View>
            <View className="flex-row items-center gap-2">
              <Text className="text-olado-green font-bold text-base">
                {formatPrice(product.price)}
              </Text>
              {product.compareAtPrice && (
                <Text className="text-olado-text-light text-xs line-through">
                  {formatPrice(product.compareAtPrice)}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => addItem(product)}
              className="bg-olado-green rounded-lg py-1.5 px-4 mt-2 items-center"
            >
              <Text className="text-white text-xs font-semibold">Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className="bg-white rounded-xl overflow-hidden flex-1"
      style={[Shadows.sm, { marginHorizontal: 4, marginBottom: 10 }, style]}
    >
      <View className="relative">
        <Image
          source={{ uri: product.images[0] }}
          contentFit="cover"
          transition={300}
          style={{ width: "100%", aspectRatio: 1 }}
          placeholder={undefined}
        />

        {discount > 0 && (
          <View className="absolute top-2 left-2 bg-olado-error rounded-full px-2 py-0.5">
            <Text className="text-white text-xs font-bold">-{discount}%</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => toggleItem(product)}
          className="absolute top-2 right-2 bg-white/80 rounded-full p-1.5"
          style={Shadows.sm}
        >
          <Ionicons
            name={inWishlist ? "heart" : "heart-outline"}
            size={18}
            color={inWishlist ? Colors.error : Colors.textSecondary}
          />
        </TouchableOpacity>

        {!product.inStock && (
          <View className="absolute inset-0 bg-black/40 items-center justify-center">
            <Text className="text-white font-bold text-sm bg-black/60 px-3 py-1 rounded-full">
              Out of Stock
            </Text>
          </View>
        )}
      </View>

      <View className="p-3">
        <Text
          className="text-olado-text-secondary text-xs mb-1"
          numberOfLines={1}
        >
          {product.brand || product.category.name}
        </Text>
        <Text
          className="text-olado-text font-medium text-sm mb-2"
          numberOfLines={2}
        >
          {product.name}
        </Text>

        <View className="flex-row items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= Math.round(product.rating) ? "star" : "star-outline"}
              size={12}
              color={Colors.gold}
            />
          ))}
          <Text className="text-olado-text-light text-xs ml-1">
            ({product.reviewCount})
          </Text>
        </View>

        <View className="flex-row items-baseline gap-2">
          <Text className="text-olado-green font-bold text-base">
            {formatPrice(product.price)}
          </Text>
          {product.compareAtPrice && (
            <Text className="text-olado-text-light text-xs line-through">
              {formatPrice(product.compareAtPrice)}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => addItem(product)}
          disabled={!product.inStock}
          className={`rounded-lg py-2 mt-3 items-center ${
            product.inStock ? "bg-olado-accent" : "bg-gray-200"
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`text-sm font-semibold ${
              product.inStock ? "text-white" : "text-olado-text-light"
            }`}
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
