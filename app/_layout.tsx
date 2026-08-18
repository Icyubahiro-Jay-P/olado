import "../global.css";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "react-native";

/*
 * ─── NAVIGATION FLOW ──────────────────────────────────────
 *
 * Root Stack (Stack Navigator)
 * ├── (tabs) - Bottom Tab Navigator
 * │   ├── index          → Home (search bar, carousel, categories, products)
 * │   ├── categories     → Categories (hierarchical category browser)
 * │   ├── cart           → Shopping Cart
 * │   └── profile        → Profile / Auth
 * │
 * ├── product/[id]       → Product Detail (deep link: olado://product/123)
 * ├── products           → Product Listing (filtered by category/search)
 * ├── wishlist           → Wishlist
 * ├── checkout           → Multi-step Checkout
 * ├── search             → Search (full-text with recent searches)
 * ├── auth/login         → Login
 * ├── auth/register      → Register
 * └── seller             → Seller Registration
 */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="product/[id]"
            options={{
              animation: "slide_from_right",
              presentation: "card",
            }}
          />
          <Stack.Screen name="products" />
          <Stack.Screen name="wishlist" />
          <Stack.Screen
            name="checkout"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen name="search" />
          <Stack.Screen
            name="auth/login"
            options={{
              animation: "slide_from_bottom",
              presentation: "card",
            }}
          />
          <Stack.Screen
            name="auth/register"
            options={{
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen name="seller" />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
