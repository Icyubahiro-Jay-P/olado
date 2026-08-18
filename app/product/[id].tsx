import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useProduct, useRelatedProducts } from "@/api/hooks";
import { useCartStore, useWishlistStore, useAuthStore } from "@/stores";
import { Colors, Shadows, BorderRadius, Spacing } from "@/constants/theme";
import { formatPrice, calculateDiscount, getStockLabel } from "@/utils/format";
import { WHATSAPP_URL } from "@/constants/config";
import { LoadingSpinner, ErrorState, ProductCard } from "@/components";
import { Linking } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading, error, refetch } = useProduct(id!);
  const { data: relatedProducts } = useRelatedProducts(product ?? null);
  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <LoadingSpinner />;
  if (error || !product)
    return <ErrorState message="Product not found" onRetry={refetch} />;

  const inWishlist = isInWishlist(product.id);
  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const stockInfo = getStockLabel(product.stock);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push("/checkout");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product.name} on Olado! ${formatPrice(product.price)}`,
      });
    } catch {}
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi, I'm interested in "${product.name}" (${formatPrice(product.price)}). Is it available?`
    );
    Linking.openURL(`${WHATSAPP_URL}?text=${msg}`);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className="bg-olado-green flex-row items-center px-4"
        style={{ paddingTop: Platform.OS === "ios" ? 50 : 36, paddingBottom: 12 }}
      >
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-semibold text-base flex-1" numberOfLines={1}>
          {product.name}
        </Text>
        <TouchableOpacity onPress={handleShare} className="ml-3">
          <Ionicons name="share-outline" size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleItem(product)}
          className="ml-3"
        >
          <Ionicons
            name={inWishlist ? "heart" : "heart-outline"}
            size={22}
            color={inWishlist ? Colors.accent : "white"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View className="bg-white">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setSelectedImage(index);
            }}
          >
            {product.images.map((img, i) => (
              <View key={i} style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}>
                <Image
                  source={{ uri: img }}
                  contentFit="contain"
                  transition={300}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            ))}
          </ScrollView>

          {/* Image indicators */}
          {product.images.length > 1 && (
            <View className="flex-row justify-center py-2">
              {product.images.map((_, i) => (
                <View
                  key={i}
                  className="rounded-full mx-1"
                  style={{
                    width: i === selectedImage ? 20 : 8,
                    height: 8,
                    backgroundColor:
                      i === selectedImage ? Colors.green : Colors.border,
                    borderRadius: 4,
                  }}
                />
              ))}
            </View>
          )}
        </View>

        <View className="px-4 pt-4">
          {/* Discount badge */}
          {discount > 0 && (
            <View className="bg-red-50 self-start rounded-full px-3 py-1 mb-2">
              <Text className="text-olado-error text-xs font-bold">
                Save {discount}%
              </Text>
            </View>
          )}

          {/* Price */}
          <View className="flex-row items-baseline gap-3 mb-2">
            <Text className="text-olado-green font-bold text-2xl">
              {formatPrice(product.price)}
            </Text>
            {product.compareAtPrice && (
              <Text className="text-olado-text-light text-base line-through">
                {formatPrice(product.compareAtPrice)}
              </Text>
            )}
          </View>

          {/* Title */}
          <Text className="text-olado-text font-bold text-lg mb-2">
            {product.name}
          </Text>

          {/* Rating */}
          <View className="flex-row items-center mb-3">
            <View className="flex-row mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={
                    star <= Math.round(product.rating)
                      ? "star"
                      : "star-outline"
                  }
                  size={16}
                  color={Colors.gold}
                />
              ))}
            </View>
            <Text className="text-olado-text-secondary text-sm">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </Text>
          </View>

          {/* Stock */}
          <View className="flex-row items-center mb-4">
            <View
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: stockInfo.color }}
            />
            <Text
              className="text-sm font-medium"
              style={{ color: stockInfo.color }}
            >
              {stockInfo.text}
            </Text>
            {product.brand && (
              <Text className="text-olado-text-secondary text-sm ml-4">
                Brand: {product.brand}
              </Text>
            )}
          </View>

          {/* Quantity selector */}
          <View className="flex-row items-center mb-4">
            <Text className="text-olado-text font-medium text-sm mr-4">
              Quantity:
            </Text>
            <View className="flex-row items-center bg-olado-background rounded-xl overflow-hidden">
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2"
              >
                <Ionicons name="remove" size={18} color={Colors.text} />
              </TouchableOpacity>
              <Text className="text-olado-text font-bold text-base px-4 min-w-[40px] text-center">
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="px-4 py-2"
              >
                <Ionicons name="add" size={18} color={Colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-olado-text font-bold text-base mb-2">
              Description
            </Text>
            <Text className="text-olado-text-secondary text-sm leading-5">
              {product.description}
            </Text>
          </View>

          {/* Specs */}
          {product.specs.length > 0 && (
            <View className="mb-4">
              <Text className="text-olado-text font-bold text-base mb-2">
                Specifications
              </Text>
              <View className="bg-olado-background rounded-xl overflow-hidden">
                {product.specs.map((spec, i) => (
                  <View
                    key={i}
                    className={`flex-row px-4 py-3 ${
                      i % 2 === 0 ? "bg-white" : "bg-olado-background"
                    }`}
                  >
                    <Text className="text-olado-text-secondary text-sm w-[140px]">
                      {spec.label}
                    </Text>
                    <Text className="text-olado-text text-sm font-medium flex-1">
                      {spec.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Attributes */}
          {product.attributes.length > 0 && (
            <View className="mb-4">
              <Text className="text-olado-text font-bold text-base mb-2">
                Attributes
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {product.attributes.map((attr, i) => (
                  <View
                    key={i}
                    className="bg-olado-green-50 rounded-full px-3 py-1.5"
                  >
                    <Text className="text-olado-green text-xs font-medium">
                      {attr.name}: {attr.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Tags */}
          <View className="flex-row flex-wrap gap-2 mb-6">
            {product.tags.map((tag, i) => (
              <View
                key={i}
                className="bg-gray-100 rounded-full px-3 py-1"
              >
                <Text className="text-olado-text-secondary text-xs">#{tag}</Text>
              </View>
            ))}
          </View>

          {/* Reviews Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-olado-text font-bold text-base">
                Reviews ({product.reviews.length})
              </Text>
            </View>
            {product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <View
                  key={review.id}
                  className="bg-olado-background rounded-xl p-3 mb-2"
                >
                  <View className="flex-row items-center mb-1">
                    <Text className="text-olado-text font-medium text-sm mr-2">
                      {review.userName}
                    </Text>
                    <View className="flex-row">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Ionicons
                          key={s}
                          name={s <= review.rating ? "star" : "star-outline"}
                          size={12}
                          color={Colors.gold}
                        />
                      ))}
                    </View>
                  </View>
                  <Text className="text-olado-text-secondary text-sm">
                    {review.comment}
                  </Text>
                </View>
              ))
            ) : (
              <View className="bg-olado-background rounded-xl p-6 items-center">
                <Ionicons
                  name="chatbubble-outline"
                  size={32}
                  color={Colors.textLight}
                />
                <Text className="text-olado-text-secondary text-sm mt-2 text-center">
                  No reviews yet
                </Text>
                {isAuthenticated ? (
                  <TouchableOpacity className="bg-olado-green rounded-lg px-4 py-2 mt-3">
                    <Text className="text-white text-sm font-semibold">
                      Write a Review
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => router.push("/auth/login")}
                    className="mt-3"
                  >
                    <Text className="text-olado-green text-sm font-semibold">
                      Login to Review
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <View className="mb-8">
              <Text className="text-olado-text font-bold text-lg mb-3">
                Related Products
              </Text>
              <FlatList
                data={relatedProducts}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={{ width: 160, marginRight: 12 }}>
                    <ProductCard product={item} variant="grid" />
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        className="bg-white px-4 py-3 flex-row gap-3"
        style={{
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          paddingBottom: Platform.OS === "ios" ? 30 : 12,
          ...Shadows.lg,
        }}
      >
        <TouchableOpacity
          onPress={handleWhatsApp}
          className="bg-[#25D366] rounded-xl px-4 py-3 items-center justify-center"
        >
          <Ionicons name="logo-whatsapp" size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleAddToCart}
          disabled={!product.inStock}
          className={`flex-1 rounded-xl py-3 items-center ${
            product.inStock
              ? "bg-olado-green-light border-2 border-olado-green"
              : "bg-gray-200"
          }`}
        >
          <Text
            className={`font-semibold text-sm ${
              product.inStock ? "text-olado-green" : "text-olado-text-light"
            }`}
          >
            Add to Cart
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleBuyNow}
          disabled={!product.inStock}
          className={`flex-1 rounded-xl py-3 items-center ${
            product.inStock ? "bg-olado-accent" : "bg-gray-200"
          }`}
        >
          <Text
            className={`font-semibold text-sm ${
              product.inStock ? "text-white" : "text-olado-text-light"
            }`}
          >
            Buy Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
