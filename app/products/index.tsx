import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSearchProducts, useCategoryProductsInfinite } from "@/api/hooks";
import { ProductCard, LoadingSpinner, EmptyState } from "@/components";
import { Colors } from "@/constants/theme";
import { SearchFilter, Product } from "@/types";

export default function ProductsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    category?: string;
    query?: string;
  }>();

  const [sortBy, setSortBy] = useState<SearchFilter["sortBy"]>("latest");
  const [showSort, setShowSort] = useState(false);

  const filter: SearchFilter = {
    query: params.query || "",
    category: params.category,
    sortBy,
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useSearchProducts(filter);

  const products = data?.pages.flatMap((p) => p.products) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  const sortOptions: { label: string; value: SearchFilter["sortBy"] }[] = [
    { label: "Latest", value: "latest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Rating", value: "rating" },
    { label: "Popular", value: "popular" },
  ];

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <View className="flex-1 bg-olado-background">
      {/* Header */}
      <View
        className="bg-olado-green"
        style={{ paddingTop: Platform.OS === "ios" ? 50 : 36, paddingBottom: 12 }}
      >
        <View className="flex-row items-center px-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white font-semibold text-base flex-1">
            {params.query
              ? `Search: "${params.query}"`
              : params.category
              ? "Category Products"
              : "All Products"}
          </Text>
          <Text className="text-white/70 text-sm">{total} items</Text>
        </View>
      </View>

      {/* Sort bar */}
      <View className="bg-white px-4 py-2 flex-row items-center justify-between border-b border-olado-border">
        <TouchableOpacity
          onPress={() => setShowSort(!showSort)}
          className="flex-row items-center"
        >
          <Ionicons name="swap-vertical" size={16} color={Colors.textSecondary} />
          <Text className="text-olado-text-secondary text-sm ml-1.5">
            Sort: {sortOptions.find((s) => s.value === sortBy)?.label}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/search")}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Sort dropdown */}
      {showSort && (
        <View className="bg-white border-b border-olado-border">
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                setSortBy(option.value);
                setShowSort(false);
              }}
              className={`px-4 py-3 flex-row items-center justify-between ${
                sortBy === option.value ? "bg-olado-green-50" : ""
              }`}
            >
              <Text
                className={`text-sm ${
                  sortBy === option.value
                    ? "text-olado-green font-semibold"
                    : "text-olado-text"
                }`}
              >
                {option.label}
              </Text>
              {sortBy === option.value && (
                <Ionicons name="checkmark" size={18} color={Colors.green} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No products found"
          description="Try adjusting your search or filters"
          action={
            <TouchableOpacity
              onPress={() => router.push("/")}
              className="bg-olado-green rounded-xl px-6 py-3"
            >
              <Text className="text-white font-semibold">Go Home</Text>
            </TouchableOpacity>
          }
        />
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 12 }}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard product={item} variant="grid" />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <LoadingSpinner size="small" />
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
