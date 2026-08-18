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
import { Colors, Shadows } from "@/constants/theme";
import { WHATSAPP_URL } from "@/constants/config";
import { Linking } from "react-native";

export default function SellerScreen() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    phone: "",
    email: "",
    location: "",
    category: "",
    description: "",
    website: "",
  });

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <View className="w-20 h-20 rounded-full bg-olado-green-50 items-center justify-center mb-6">
          <Ionicons name="checkmark-circle" size={48} color={Colors.green} />
        </View>
        <Text className="text-olado-text font-bold text-2xl text-center mb-2">
          Application Received!
        </Text>
        <Text className="text-olado-text-secondary text-sm text-center mb-8 leading-5">
          Thank you for your interest in selling on Olado. Our team will
          review your application and get back to you within 48 hours.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-olado-green rounded-xl px-8 py-3"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View
          className="bg-olado-green"
          style={{ paddingTop: Platform.OS === "ios" ? 50 : 36, paddingBottom: 24 }}
        >
          <View className="px-4">
            <TouchableOpacity onPress={() => router.back()} className="mb-4">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white font-bold text-2xl">Sell on Olado</Text>
            <Text className="text-white/70 text-sm mt-1">
              Reach thousands of customers across Rwanda
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          {/* Benefits */}
          <View className="mb-6">
            <Text className="text-olado-text font-bold text-base mb-3">
              Why Sell on Olado?
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {[
                "🚀 Reach 1000+ daily buyers",
                "💰 Low commission rates",
                "📱 Easy listing process",
                "🚚 Integrated logistics",
                "💳 Fast payments",
              ].map((benefit) => (
                <View
                  key={benefit}
                  className="bg-olado-green-50 rounded-lg px-3 py-2"
                >
                  <Text className="text-olado-green text-xs font-medium">
                    {benefit}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <Text className="text-olado-text font-bold text-base mb-4">
            Seller Registration
          </Text>

          {[
            { key: "businessName", label: "Business Name", placeholder: "Your shop name" },
            { key: "contactName", label: "Contact Person", placeholder: "Full name" },
            { key: "phone", label: "Phone Number", placeholder: "+250 7XX XXX XXX", keyboardType: "phone-pad" as const },
            { key: "email", label: "Email", placeholder: "business@email.com", keyboardType: "email-address" as const },
            { key: "location", label: "Location", placeholder: "Kigali, Rwanda" },
            { key: "category", label: "Primary Category", placeholder: "e.g. Fashion, Electronics" },
            { key: "website", label: "Website (optional)", placeholder: "https://" },
          ].map((field) => (
            <View key={field.key} className="mb-3">
              <Text className="text-olado-text font-medium text-sm mb-1.5">
                {field.label}
              </Text>
              <View className="bg-olado-background rounded-xl flex-row items-center px-4 py-3">
                <TextInput
                  value={(form as any)[field.key]}
                  onChangeText={(val) => setForm({ ...form, [field.key]: val })}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.textLight}
                  className="flex-1 text-olado-text text-sm"
                  keyboardType={field.keyboardType || "default"}
                  autoCapitalize="none"
                />
              </View>
            </View>
          ))}

          <View className="mb-4">
            <Text className="text-olado-text font-medium text-sm mb-1.5">
              Tell us about your business
            </Text>
            <View className="bg-olado-background rounded-xl px-4 py-3">
              <TextInput
                value={form.description}
                onChangeText={(val) => setForm({ ...form, description: val })}
                placeholder="What products do you sell?"
                placeholderTextColor={Colors.textLight}
                className="text-olado-text text-sm"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-olado-accent rounded-xl py-4 items-center mb-4"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">Submit Application</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL(WHATSAPP_URL)}
            className="bg-olado-green-50 rounded-xl py-3 items-center mb-8 flex-row justify-center"
          >
            <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
            <Text className="text-olado-green font-semibold text-sm ml-2">
              Contact Us on WhatsApp
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
