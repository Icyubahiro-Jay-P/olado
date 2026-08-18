import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSearchStore, useCartStore } from "@/stores";
import { useSearchProducts } from "@/api/hooks";
import { ProductCard, EmptyState } from "@/components";
import { Colors, Shadows } from "@/constants/theme";
import { formatPrice } from "@/utils/format";

export default function SearchScreen() {
  const router = useRouter();
  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } =
    useSearchStore();
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSearchProducts({
      query: activeQuery,
      sortBy: "latest",
    });

  const products = data?.pages.flatMap((p) => p.products) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      addRecentSearch(query.trim());
      setActiveQuery(query.trim());
    }
  }, [query, addRecentSearch]);

  const handleRecentSearch = (term: string) => {
    setQuery(term);
    setActiveQuery(term);
  };

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <View className="flex-1 bg-olado-background">
      {/* Search Header */}
      <View
        className="bg-olado-green"
        style={{ paddingTop: Platform.OS === "ios" ? 50 : 36, paddingBottom: 12 }}
      >
        <View className="flex-row items-center px-4 gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1 bg-white rounded-xl flex-row items-center px-3 py-2.5">
            <Ionicons name="search" size={18} color={Colors.textLight} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              placeholder="Search products, brands..."
              placeholderTextColor={Colors.textLight}
              className="flex-1 ml-2 text-olado-text text-sm"
              autoFocus
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => { setQuery(""); setActiveQuery(""); }}>
                <Ionicons name="close-circle" size={18} color={Colors.textLight} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={handleSearch}>
            <Text className="text-white font-semibold text-sm">Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeQuery ? (
        // Search Results
        <View className="flex-1">
          {isLoading ? (
            <View className="flex-1 items-center justify-center py-8">
              <Ionicons name="search" size={48} color={Colors.border} />
              <Text className="text-olado-text-secondary mt-3">Searching...</Text>
            </View>
          ) : products.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No results found"
              description={`No products match "${activeQuery}"`}
            />
          ) : (
            <>
              <View className="px-4 py-2 bg-white border-b border-olado-border">
                <Text className="text-olado-text-secondary text-sm">
                  {total} results for "{activeQuery}"
                </Text>
              </View>
              <FlatList
                data={products}
                numColumns={2}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  paddingHorizontal: 12,
                }}
                contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ProductCard product={item} variant="grid" />
                )}
                onEndReached={loadMore}
                onEndReachedThreshold={0.3}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </View>
      ) : (
        // Recent Searches / Suggestions
        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
          {recentSearches.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-olado-text font-bold text-base">
                  Recent Searches
                </Text>
                <TouchableOpacity onPress={clearRecentSearches}>
                  <Text className="text-olado-green text-sm">Clear All</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((term, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleRecentSearch(term)}
                  className="flex-row items-center py-3 border-b border-olado-border"
                >
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={Colors.textLight}
                  />
                  <Text className="text-olado-text text-sm ml-3 flex-1">
                    {term}
                  </Text>
                  <TouchableOpacity onPress={() => removeRecentSearch(term)}>
                    <Ionicons
                      name="close"
                      size={16}
                      color={Colors.textLight}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View>
            <Text className="text-olado-text font-bold text-base mb-3">
              Popular Searches
            </Text>
            {[
              "Sandals",
              "Phones",
              "Laptop",
              "Baby Products",
              "Organic",
              "Made in Rwanda",
              "Sofa",
              "Kitchen",
            ].map((term) => (
              <TouchableOpacity
                key={term}
                onPress={() => handleRecentSearch(term)}
                className="flex-row items-center py-3 border-b border-olado-border"
              >
                <Ionicons
                  name="trending-up"
                  size={18}
                  color={Colors.accent}
                />
                <Text className="text-olado-text text-sm ml-3">{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
