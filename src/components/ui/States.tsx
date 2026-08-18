import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Colors } from "@/constants/theme";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      {icon && (
        <Text className="text-5xl mb-4">{icon}</Text>
      )}
      <Text className="text-olado-text font-semibold text-lg text-center mb-2">
        {title}
      </Text>
      {description && (
        <Text className="text-olado-text-secondary text-sm text-center mb-6">
          {description}
        </Text>
      )}
      {action}
    </View>
  );
}

export function LoadingSpinner({ size = "large" }: { size?: "small" | "large" }) {
  return (
    <View className="flex-1 items-center justify-center py-8">
      <ActivityIndicator size={size} color={Colors.green} />
    </View>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <Text className="text-4xl mb-4">😔</Text>
      <Text className="text-olado-text font-semibold text-lg text-center mb-2">
        Something went wrong
      </Text>
      <Text className="text-olado-text-secondary text-sm text-center mb-6">
        {message}
      </Text>
      {onRetry && (
        <View className="bg-olado-green rounded-xl px-6 py-3">
          <Text className="text-white font-semibold">Try Again</Text>
        </View>
      )}
    </View>
  );
}
