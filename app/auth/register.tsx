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
import { Colors } from "@/constants/theme";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    const success = await register(name.trim(), email.trim(), phone.trim(), password);
    if (success) {
      router.dismissAll();
    } else {
      setError("Registration failed. Please try again.");
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
          style={{ paddingTop: Platform.OS === "ios" ? 50 : 36, paddingBottom: 30 }}
        >
          <View className="px-4">
            <TouchableOpacity onPress={() => router.back()} className="mb-4">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white font-bold text-2xl">Create Account</Text>
            <Text className="text-white/70 text-sm mt-1">
              Join Olado and start shopping
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          {/* Name */}
          <View className="mb-3">
            <Text className="text-olado-text font-medium text-sm mb-1.5">Full Name</Text>
            <View className="bg-olado-background rounded-xl flex-row items-center px-4 py-3">
              <Ionicons name="person-outline" size={20} color={Colors.textLight} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="John Doe"
                placeholderTextColor={Colors.textLight}
                className="flex-1 ml-3 text-olado-text text-sm"
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email */}
          <View className="mb-3">
            <Text className="text-olado-text font-medium text-sm mb-1.5">Email</Text>
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

          {/* Phone */}
          <View className="mb-3">
            <Text className="text-olado-text font-medium text-sm mb-1.5">Phone Number</Text>
            <View className="bg-olado-background rounded-xl flex-row items-center px-4 py-3">
              <Ionicons name="call-outline" size={20} color={Colors.textLight} />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+250 7XX XXX XXX"
                placeholderTextColor={Colors.textLight}
                className="flex-1 ml-3 text-olado-text text-sm"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Password */}
          <View className="mb-3">
            <Text className="text-olado-text font-medium text-sm mb-1.5">Password</Text>
            <View className="bg-olado-background rounded-xl flex-row items-center px-4 py-3">
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textLight} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 6 characters"
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

          {/* Confirm Password */}
          <View className="mb-4">
            <Text className="text-olado-text font-medium text-sm mb-1.5">
              Confirm Password
            </Text>
            <View className="bg-olado-background rounded-xl flex-row items-center px-4 py-3">
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textLight} />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repeat password"
                placeholderTextColor={Colors.textLight}
                className="flex-1 ml-3 text-olado-text text-sm"
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          {/* Error */}
          {error ? (
            <View className="bg-red-50 rounded-xl px-4 py-3 mb-4">
              <Text className="text-olado-error text-sm">{error}</Text>
            </View>
          ) : null}

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading}
            className="bg-olado-green rounded-xl py-4 items-center mb-4"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">
              {isLoading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center mb-8">
            <Text className="text-olado-text-secondary text-sm">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-olado-green text-sm font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
