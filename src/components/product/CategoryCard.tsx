import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Category } from "@/types";
import { Colors, BorderRadius, Shadows, Spacing } from "@/constants/theme";
import { Image } from "expo-image";

interface CategoryCardProps {
  category: Category;
  variant?: "grid" | "chip" | "list";
  size?: "sm" | "md" | "lg";
}

export default function CategoryCard({
  category,
  variant = "grid",
  size = "md",
}: CategoryCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/products?category=${category.id}`);
  };

  if (variant === "chip") {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className="flex-row items-center bg-white rounded-full px-4 py-2 mr-2 border border-olado-border"
        activeOpacity={0.7}
      >
        <Text className="text-lg mr-2">{category.icon}</Text>
        <Text className="text-olado-text text-sm font-medium" numberOfLines={1}>
          {category.name}
        </Text>
        {category.productCount > 0 && (
          <View className="ml-2 bg-olado-green-50 rounded-full px-2 py-0.5">
            <Text className="text-olado-green text-xs">{category.productCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === "list") {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className="flex-row items-center bg-white rounded-xl p-3 mb-2"
        style={Shadows.sm}
        activeOpacity={0.7}
      >
        <View
          className="w-14 h-14 rounded-xl items-center justify-center"
          style={{ backgroundColor: Colors.green50 }}
        >
          <Text className="text-2xl">{category.icon}</Text>
        </View>
        <View className="flex-1 ml-3">
          <Text className="text-olado-text font-semibold text-base">
            {category.name}
          </Text>
          <Text className="text-olado-text-secondary text-sm">
            {category.productCount} products
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
      </TouchableOpacity>
    );
  }

  // Grid variant (default)
  const sizeClasses = {
    sm: { container: "w-[72px]", icon: "text-2xl", text: "text-[10px]" },
    md: { container: "w-[90px]", icon: "text-3xl", text: "text-xs" },
    lg: { container: "w-[110px]", icon: "text-4xl", text: "text-sm" },
  };

  const s = sizeClasses[size];

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`${s.container} items-center mr-3`}
      activeOpacity={0.7}
    >
      <View
        className={`${s.container} rounded-2xl items-center justify-center mb-2`}
        style={{
          backgroundColor: Colors.green50,
          aspectRatio: 1,
          ...Shadows.sm,
        }}
      >
        <Text className={s.icon}>{category.icon}</Text>
      </View>
      <Text
        className={`text-olado-text font-medium ${s.text} text-center`}
        numberOfLines={2}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

// Need Ionicons for list variant
import { Ionicons } from "@expo/vector-icons";
