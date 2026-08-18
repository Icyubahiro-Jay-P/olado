import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCartStore, useAuthStore } from "@/stores";
import { Colors, Shadows } from "@/constants/theme";
import { formatPrice, generateOrderId } from "@/utils/format";
import { Address, ShippingMethod, PaymentMethod } from "@/types";
import {
  STANDARD_SHIPPING,
  EXPRESS_SHIPPING,
  PICKUP_SHIPPING,
  TAX_RATE,
} from "@/constants/config";

type CheckoutStep = "address" | "shipping" | "payment" | "review";

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [step, setStep] = useState<CheckoutStep>("address");
  const [address, setAddress] = useState<Address>({
    name: "",
    phone: "",
    email: "",
    city: "Kigali",
    country: "Rwanda",
    addressLine1: "",
    addressLine2: "",
  });
  const [shipping, setShipping] = useState<ShippingMethod>("standard");
  const [payment, setPayment] = useState<PaymentMethod>("momo");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const subtotal = getTotal();
  const shippingCost =
    shipping === "standard"
      ? STANDARD_SHIPPING
      : shipping === "express"
      ? EXPRESS_SHIPPING
      : PICKUP_SHIPPING;
  const freeShipping = subtotal >= 50000;
  const effectiveShipping = freeShipping ? 0 : shippingCost;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + effectiveShipping + tax;

  const steps: { key: CheckoutStep; label: string; icon: string }[] = [
    { key: "address", label: "Address", icon: "location" },
    { key: "shipping", label: "Shipping", icon: "car" },
    { key: "payment", label: "Payment", icon: "card" },
    { key: "review", label: "Review", icon: "checkmark-circle" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const handleNext = () => {
    const idx = steps.findIndex((s) => s.key === step);
    if (idx < steps.length - 1) {
      setStep(steps[idx + 1].key);
    }
  };

  const handleBack = () => {
    const idx = steps.findIndex((s) => s.key === step);
    if (idx > 0) {
      setStep(steps[idx - 1].key);
    } else {
      router.back();
    }
  };

  const handlePlaceOrder = () => {
    const id = generateOrderId();
    setOrderId(id);
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <View className="w-20 h-20 rounded-full bg-olado-green-50 items-center justify-center mb-6">
          <Ionicons name="checkmark-circle" size={48} color={Colors.green} />
        </View>
        <Text className="text-olado-text font-bold text-2xl text-center mb-2">
          Order Placed!
        </Text>
        <Text className="text-olado-text-secondary text-sm text-center mb-1">
          Order ID:
        </Text>
        <Text className="text-olado-green font-bold text-lg mb-4">
          {orderId}
        </Text>
        <Text className="text-olado-text-secondary text-sm text-center mb-8 leading-5">
          Thank you for your order! We'll send you a confirmation
          {payment === "momo" ? " via Mobile Money" : " via email"}.
        </Text>
        <TouchableOpacity
          onPress={() => router.dismissAll()}
          className="bg-olado-green rounded-xl px-8 py-3 mb-3"
        >
          <Text className="text-white font-semibold">Continue Shopping</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-olado-green font-semibold">View Orders</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-2xl mb-4">🛒</Text>
        <Text className="text-olado-text font-semibold text-lg mb-2">
          Your cart is empty
        </Text>
        <TouchableOpacity
          onPress={() => router.dismissAll()}
          className="bg-olado-green rounded-xl px-6 py-3"
        >
          <Text className="text-white font-semibold">Go Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-olado-background">
      {/* Header */}
      <View
        className="bg-olado-green"
        style={{ paddingTop: Platform.OS === "ios" ? 50 : 36, paddingBottom: 12 }}
      >
        <View className="flex-row items-center px-4">
          <TouchableOpacity onPress={handleBack} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white font-bold text-lg flex-1">Checkout</Text>
        </View>

        {/* Step indicators */}
        <View className="flex-row px-6 mt-3 mb-1">
          {steps.map((s, i) => (
            <React.Fragment key={s.key}>
              <View className="items-center">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    i <= currentStepIndex
                      ? "bg-white"
                      : "bg-white/20"
                  }`}
                >
                  <Ionicons
                    name={s.icon as any}
                    size={16}
                    color={
                      i <= currentStepIndex ? Colors.green : "rgba(255,255,255,0.5)"
                    }
                  />
                </View>
                <Text
                  className={`text-[10px] mt-1 ${
                    i <= currentStepIndex ? "text-white font-semibold" : "text-white/50"
                  }`}
                >
                  {s.label}
                </Text>
              </View>
              {i < steps.length - 1 && (
                <View
                  className="flex-1 h-0.5 mx-2 mt-4"
                  style={{
                    backgroundColor:
                      i < currentStepIndex ? "white" : "rgba(255,255,255,0.2)",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Step: Address */}
        {step === "address" && (
          <View>
            <Text className="text-olado-text font-bold text-lg mb-4">
              Delivery Address
            </Text>

            {[
              { key: "name", label: "Full Name", icon: "person", placeholder: "John Doe" },
              { key: "phone", label: "Phone Number", icon: "call", placeholder: "+250 7XX XXX XXX", keyboardType: "phone-pad" as const },
              { key: "email", label: "Email", icon: "mail", placeholder: "your@email.com", keyboardType: "email-address" as const },
              { key: "addressLine1", label: "Address Line 1", icon: "location", placeholder: "Street address" },
              { key: "addressLine2", label: "Address Line 2", icon: "location", placeholder: "Apt, suite, etc. (optional)" },
              { key: "city", label: "City", icon: "map", placeholder: "Kigali" },
              { key: "country", label: "Country", icon: "globe", placeholder: "Rwanda" },
            ].map((field) => (
              <View key={field.key} className="mb-3">
                <Text className="text-olado-text font-medium text-sm mb-1.5">
                  {field.label}
                </Text>
                <View className="bg-white rounded-xl flex-row items-center px-4 py-3" style={Shadows.sm}>
                  <Ionicons
                    name={field.icon as any}
                    size={18}
                    color={Colors.textLight}
                  />
                  <TextInput
                    value={(address as any)[field.key]}
                    onChangeText={(val) =>
                      setAddress({ ...address, [field.key]: val })
                    }
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.textLight}
                    className="flex-1 ml-3 text-olado-text text-sm"
                    keyboardType={field.keyboardType || "default"}
                    autoCapitalize="none"
                  />
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={handleNext}
              className="bg-olado-green rounded-xl py-4 items-center mt-4 mb-6"
            >
              <Text className="text-white font-bold">Continue to Shipping</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step: Shipping */}
        {step === "shipping" && (
          <View>
            <Text className="text-olado-text font-bold text-lg mb-4">
              Shipping Method
            </Text>

            {[
              {
                key: "standard" as const,
                title: "Standard Delivery",
                desc: "3-5 business days",
                price: freeShipping ? 0 : STANDARD_SHIPPING,
                icon: "car",
              },
              {
                key: "express" as const,
                title: "Express Delivery",
                desc: "1-2 business days",
                price: freeShipping ? 0 : EXPRESS_SHIPPING,
                icon: "rocket",
              },
              {
                key: "pickup" as const,
                title: "Store Pickup",
                desc: "Pick up from nearest location",
                price: PICKUP_SHIPPING,
                icon: "storefront",
              },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                onPress={() => setShipping(option.key)}
                className={`bg-white rounded-xl p-4 mb-3 flex-row items-center border-2 ${
                  shipping === option.key
                    ? "border-olado-green"
                    : "border-transparent"
                }`}
                style={Shadows.sm}
              >
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                    shipping === option.key ? "bg-olado-green-50" : "bg-olado-background"
                  }`}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color={shipping === option.key ? Colors.green : Colors.textSecondary}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-olado-text font-semibold text-sm">
                    {option.title}
                  </Text>
                  <Text className="text-olado-text-secondary text-xs mt-0.5">
                    {option.desc}
                  </Text>
                </View>
                <Text className="text-olado-text font-semibold text-sm">
                  {option.price === 0 ? "FREE" : formatPrice(option.price)}
                </Text>
              </TouchableOpacity>
            ))}

            {freeShipping && (
              <View className="bg-olado-green-50 rounded-xl p-3 mt-2">
                <Text className="text-olado-green text-sm font-medium text-center">
                  🎉 You qualify for free shipping!
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handleNext}
              className="bg-olado-green rounded-xl py-4 items-center mt-6 mb-6"
            >
              <Text className="text-white font-bold">Continue to Payment</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step: Payment */}
        {step === "payment" && (
          <View>
            <Text className="text-olado-text font-bold text-lg mb-4">
              Payment Method
            </Text>

            {[
              {
                key: "momo" as const,
                title: "Mobile Money (MoMo)",
                desc: "MTN/Airtel Mobile Money",
                icon: "phone-portrait",
                color: "#FFC107",
              },
              {
                key: "cod" as const,
                title: "Cash on Delivery",
                desc: "Pay when you receive",
                icon: "cash",
                color: "#4CAF50",
              },
              {
                key: "card" as const,
                title: "Credit/Debit Card",
                desc: "Visa, Mastercard via DPO",
                icon: "card",
                color: "#1976D2",
              },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                onPress={() => setPayment(option.key)}
                className={`bg-white rounded-xl p-4 mb-3 flex-row items-center border-2 ${
                  payment === option.key
                    ? "border-olado-green"
                    : "border-transparent"
                }`}
                style={Shadows.sm}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${option.color}20` }}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color={option.color}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-olado-text font-semibold text-sm">
                    {option.title}
                  </Text>
                  <Text className="text-olado-text-secondary text-xs mt-0.5">
                    {option.desc}
                  </Text>
                </View>
                <View
                  className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                    payment === option.key
                      ? "border-olado-green bg-olado-green"
                      : "border-olado-border"
                  }`}
                >
                  {payment === option.key && (
                    <Ionicons name="checkmark" size={12} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {payment === "momo" && (
              <View className="bg-yellow-50 rounded-xl p-4 mt-3">
                <Text className="text-olado-text text-sm font-medium mb-2">
                  Mobile Money Number
                </Text>
                <TextInput
                  placeholder="+250 7XX XXX XXX"
                  placeholderTextColor={Colors.textLight}
                  className="bg-white rounded-lg px-4 py-3 text-olado-text text-sm"
                  keyboardType="phone-pad"
                />
              </View>
            )}

            <TouchableOpacity
              onPress={handleNext}
              className="bg-olado-green rounded-xl py-4 items-center mt-6 mb-6"
            >
              <Text className="text-white font-bold">Review Order</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step: Review */}
        {step === "review" && (
          <View>
            <Text className="text-olado-text font-bold text-lg mb-4">
              Order Review
            </Text>

            {/* Items */}
            <View className="bg-white rounded-xl p-4 mb-3" style={Shadows.sm}>
              <Text className="text-olado-text font-semibold text-sm mb-3">
                Items ({items.length})
              </Text>
              {items.map((item) => (
                <View
                  key={item.product.id}
                  className="flex-row items-center mb-3 pb-3 border-b border-olado-border"
                >
                  <Image
                    source={{ uri: item.product.images[0] }}
                    style={{ width: 50, height: 50, borderRadius: 8 }}
                  />
                  <View className="flex-1 ml-3">
                    <Text className="text-olado-text text-sm" numberOfLines={1}>
                      {item.product.name}
                    </Text>
                    <Text className="text-olado-text-secondary text-xs">
                      Qty: {item.quantity}
                    </Text>
                  </View>
                  <Text className="text-olado-text font-semibold text-sm">
                    {formatPrice(item.product.price * item.quantity)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Address */}
            <View className="bg-white rounded-xl p-4 mb-3" style={Shadows.sm}>
              <Text className="text-olado-text font-semibold text-sm mb-2">
                Delivery Address
              </Text>
              <Text className="text-olado-text-secondary text-sm">
                {address.name} | {address.phone}
              </Text>
              <Text className="text-olado-text-secondary text-sm">
                {address.addressLine1}
                {address.addressLine2 ? `, ${address.addressLine2}` : ""}
              </Text>
              <Text className="text-olado-text-secondary text-sm">
                {address.city}, {address.country}
              </Text>
            </View>

            {/* Shipping */}
            <View className="bg-white rounded-xl p-4 mb-3" style={Shadows.sm}>
              <Text className="text-olado-text font-semibold text-sm mb-2">
                Shipping
              </Text>
              <Text className="text-olado-text-secondary text-sm capitalize">
                {shipping === "cod"
                  ? "Cash on Delivery"
                  : `${shipping} Delivery`}
                {freeShipping ? " (Free)" : ""}
              </Text>
            </View>

            {/* Payment */}
            <View className="bg-white rounded-xl p-4 mb-3" style={Shadows.sm}>
              <Text className="text-olado-text font-semibold text-sm mb-2">
                Payment
              </Text>
              <Text className="text-olado-text-secondary text-sm">
                {payment === "momo"
                  ? "Mobile Money"
                  : payment === "cod"
                  ? "Cash on Delivery"
                  : "Credit/Debit Card"}
              </Text>
            </View>

            {/* Summary */}
            <View className="bg-white rounded-xl p-4 mb-6" style={Shadows.sm}>
              <Text className="text-olado-text font-semibold text-sm mb-3">
                Order Summary
              </Text>
              <View className="flex-row justify-between mb-2">
                <Text className="text-olado-text-secondary text-sm">Subtotal</Text>
                <Text className="text-olado-text text-sm">{formatPrice(subtotal)}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-olado-text-secondary text-sm">Shipping</Text>
                <Text
                  className={`text-sm ${
                    effectiveShipping === 0
                      ? "text-olado-success font-medium"
                      : "text-olado-text"
                  }`}
                >
                  {effectiveShipping === 0 ? "FREE" : formatPrice(effectiveShipping)}
                </Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-olado-text-secondary text-sm">TVA (18%)</Text>
                <Text className="text-olado-text text-sm">{formatPrice(tax)}</Text>
              </View>
              <View className="border-t border-olado-border pt-3 flex-row justify-between">
                <Text className="text-olado-text font-bold text-lg">Total</Text>
                <Text className="text-olado-green font-bold text-lg">
                  {formatPrice(total)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handlePlaceOrder}
              className="bg-olado-accent rounded-xl py-4 items-center mb-8"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-base">
                Place Order - {formatPrice(total)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
