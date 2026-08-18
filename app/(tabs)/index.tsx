import React from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFeaturedProducts, useCategories } from "@/api/hooks";
import { banners } from "@/data";
import {
  Header,
  BannerCarousel,
  TrustBadges,
  ProductCard,
  CategoryCard,
  WhatsAppButton,
  LoadingSpinner,
  ErrorState,
} from "@/components";
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from "@/constants/theme";
import { formatPrice } from "@/utils/format";

export default function HomeScreen() {
  const router = useRouter();
  const {
    data: featuredProducts,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useFeaturedProducts();
  const { data: categories, isLoading: catsLoading } = useCategories();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchProducts();
    setRefreshing(false);
  };

  if (productsLoading || catsLoading) return <LoadingSpinner />;
  if (!featuredProducts) return <ErrorState message="Could not load products" onRetry={refetchProducts} />;

  return (
    <View className="flex-1 bg-olado-background">
      {/* Header */}
      <View
        className="bg-olado-green"
        style={{ paddingTop: Platform.OS === "ios" ? 50 : 36, paddingBottom: 12 }}
      >
        <View className="flex-row items-center px-4 mb-3">
          <TouchableOpacity
            onPress={() => router.push("/")}
            className="flex-row items-center flex-1"
          >
            <View className="bg-white rounded-lg px-2.5 py-1.5 mr-2">
              <Ionicons name="bag" size={18} color={Colors.green} />
            </View>
            <View>
              <Text className="text-white font-bold text-xl tracking-tight">Olado</Text>
              <Text className="text-white/60 text-[10px]">Your Marketplace</Text>
            </View>
          </TouchableOpacity>

          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={() => router.push("/search")}
              className="bg-white/15 rounded-full p-2"
            >
              <Ionicons name="search" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/wishlist")}
              className="relative"
            >
              <Ionicons name="heart-outline" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/cart")}
              className="relative"
            >
              <Ionicons name="bag-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search bar */}
        <TouchableOpacity
          onPress={() => router.push("/search")}
          className="mx-4 bg-white rounded-xl flex-row items-center px-3 py-2.5"
          activeOpacity={0.8}
        >
          <Ionicons name="search" size={18} color={Colors.textLight} />
          <Text className="text-olado-text-light text-sm ml-2">
            Search products, brands...
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.green]}
            tintColor={Colors.green}
          />
        }
      >
        {/* Hero Carousel */}
        <View className="mt-4 px-4">
          <BannerCarousel banners={banners} />
        </View>

        {/* Trust Badges */}
        <View className="mx-4 mt-1">
          <TrustBadges />
        </View>

        {/* Categories */}
        <View className="mt-4">
          <View className="flex-row items-center justify-between px-4 mb-3">
            <Text className="text-olado-text font-bold text-lg">Categories</Text>
            <TouchableOpacity onPress={() => router.push("/categories")}>
              <Text className="text-olado-green text-sm font-semibold">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
          >
            {categories?.map((cat) => (
              <CategoryCard key={cat.id} category={cat} variant="chip" />
            ))}
          </ScrollView>
        </View>

        {/* Category Grid */}
        <View className="mt-5">
          <View className="flex-row items-center justify-between px-4 mb-3">
            <Text className="text-olado-text font-bold text-lg">Shop by Category</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
          >
            {categories?.map((cat) => (
              <CategoryCard key={cat.id} category={cat} variant="grid" size="lg" />
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View className="mt-6 px-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-olado-text font-bold text-lg">Featured Products</Text>
            <TouchableOpacity onPress={() => router.push("/products")}>
              <Text className="text-olado-green text-sm font-semibold">View All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={featuredProducts}
            renderItem={({ item }) => (
              <ProductCard product={item} variant="grid" />
            )}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            scrollEnabled={false}
          />
        </View>

        {/* Quick Picks - Horizontal scroll */}
        <View className="mt-6 mb-8">
          <View className="flex-row items-center justify-between px-4 mb-3">
            <Text className="text-olado-text font-bold text-lg">Trending Now 🔥</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
          >
            {featuredProducts?.slice(0, 8).map((product) => (
              <View key={product.id} style={{ width: 160, marginRight: 12 }}>
                <ProductCard product={product} variant="grid" />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <WhatsAppButton />
    </View>
  );
}
