import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCategories } from "@/api/hooks";
import { Category } from "@/types";
import { Colors, BorderRadius, Shadows, Spacing } from "@/constants/theme";
import { LoadingSpinner, ErrorState } from "@/components";

export default function CategoriesScreen() {
  const router = useRouter();
  const { data: categories, isLoading, error, refetch } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) return <LoadingSpinner />;
  if (error || !categories)
    return <ErrorState message="Failed to load categories" onRetry={refetch} />;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View className="flex-1 bg-olado-background">
      {/* Header */}
      <View
        className="bg-olado-green"
        style={{ paddingTop: Platform.OS === "ios" ? 50 : 36, paddingBottom: 16 }}
      >
        <View className="px-4">
          <Text className="text-white font-bold text-2xl">Categories</Text>
          <Text className="text-white/70 text-sm mt-1">Browse all product categories</Text>
        </View>
      </View>

      <View className="flex-1 flex-row">
        {/* Left: Main Categories */}
        <View
          className="w-[120px] bg-white"
          style={{ borderRightWidth: 1, borderRightColor: Colors.border }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              className={`px-3 py-4 border-l-2 ${
                !selectedCategory
                  ? "border-olado-green bg-olado-green-50"
                  : "border-transparent"
              }`}
            >
              <Text
                className={`text-xs font-medium text-center ${
                  !selectedCategory ? "text-olado-green" : "text-olado-text-secondary"
                }`}
              >
                All
              </Text>
            </TouchableOpacity>

            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat)}
                className={`px-3 py-3.5 border-l-2 items-center ${
                  selectedCategory?.id === cat.id
                    ? "border-olado-green bg-olado-green-50"
                    : "border-transparent"
                }`}
              >
                <Text className="text-xl mb-1">{cat.icon}</Text>
                <Text
                  className={`text-[11px] font-medium text-center ${
                    selectedCategory?.id === cat.id
                      ? "text-olado-green"
                      : "text-olado-text-secondary"
                  }`}
                  numberOfLines={2}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Right: Subcategories */}
        <View className="flex-1 px-3 py-4">
          {selectedCategory ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-olado-text font-bold text-lg mb-3">
                {selectedCategory.name}
              </Text>
              <Text className="text-olado-text-secondary text-sm mb-4">
                {selectedCategory.productCount} products
              </Text>

              {selectedCategory.children?.map((sub) => (
                <TouchableOpacity
                  key={sub.id}
                  onPress={() =>
                    router.push(`/products?category=${sub.id}`)
                  }
                  className="bg-white rounded-xl p-4 mb-3 flex-row items-center"
                  style={Shadows.sm}
                  activeOpacity={0.7}
                >
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: Colors.green50 }}
                  >
                    <Text className="text-xl">{sub.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-olado-text font-semibold text-sm">
                      {sub.name}
                    </Text>
                    <Text className="text-olado-text-secondary text-xs mt-0.5">
                      {sub.productCount} products
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={Colors.textLight}
                  />
                </TouchableOpacity>
              ))}

              {/* View all products in this category */}
              <TouchableOpacity
                onPress={() =>
                  router.push(`/products?category=${selectedCategory.id}`)
                }
                className="bg-olado-green rounded-xl py-3 mt-2 items-center"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-sm">
                  View All {selectedCategory.name}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-olado-text font-bold text-lg mb-3">
                Popular Categories
              </Text>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat)}
                  className="bg-white rounded-xl p-4 mb-3 flex-row items-center"
                  style={Shadows.sm}
                  activeOpacity={0.7}
                >
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: Colors.green50 }}
                  >
                    <Text className="text-xl">{cat.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-olado-text font-semibold text-sm">
                      {cat.name}
                    </Text>
                    <Text className="text-olado-text-secondary text-xs mt-0.5">
                      {cat.productCount} products
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={Colors.textLight}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
}
