import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/stores";
import { Colors, Shadows } from "@/constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    const success = await login(email.trim(), password);
    if (success) {
      router.back();
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View
          className="bg-olado-green"
          style={{ paddingTop: Platform.OS === "ios" ? 50 : 36, paddingBottom: 40 }}
        >
          <View className="px-4">
            <TouchableOpacity onPress={() => router.back()} className="mb-4">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white font-bold text-2xl">Welcome Back</Text>
            <Text className="text-white/70 text-sm mt-1">
              Sign in to your Olado account
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>
          {/* Email */}
          <View className="mb-4">
            <Text className="text-olado-text font-medium text-sm mb-2">Email</Text>
            <View className="bg-olado-background rounded-xl flex-row items-center px-4 py-3">
              <Ionicons name="mail-outline" size={20} color={Colors.textLight} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor={Colors.textLight}
                className="flex-1 ml-3 text-olado-text text-sm"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View className="mb-4">
            <Text className="text-olado-text font-medium text-sm mb-2">Password</Text>
            <View className="bg-olado-background rounded-xl flex-row items-center px-4 py-3">
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textLight} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor={Colors.textLight}
                className="flex-1 ml-3 text-olado-text text-sm"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={Colors.textLight}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity className="self-end mb-6">
            <Text className="text-olado-green text-sm font-medium">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Error */}
          {error ? (
            <View className="bg-red-50 rounded-xl px-4 py-3 mb-4">
              <Text className="text-olado-error text-sm">{error}</Text>
            </View>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className="bg-olado-green rounded-xl py-4 items-center mb-4"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">
              {isLoading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-olado-border" />
            <Text className="text-olado-text-light text-sm mx-3">or</Text>
            <View className="flex-1 h-px bg-olado-border" />
          </View>

          {/* Register Link */}
          <TouchableOpacity
            onPress={() => router.push("/auth/register")}
            className="border-2 border-olado-green rounded-xl py-4 items-center mb-6"
          >
            <Text className="text-olado-green font-semibold text-base">
              Create Account
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
