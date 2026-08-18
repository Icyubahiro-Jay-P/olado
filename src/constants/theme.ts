export const Colors = {
  green: "#2E7D32",
  greenDark: "#1B5E20",
  greenLight: "#4CAF50",
  green50: "#E8F5E9",
  green100: "#C8E6C9",
  accent: "#FF9800",
  accentDark: "#F57C00",
  accentLight: "#FFB74D",
  gold: "#FFC107",
  white: "#FFFFFF",
  background: "#F5F5F5",
  card: "#FFFFFF",
  text: "#212121",
  textSecondary: "#757575",
  textLight: "#9E9E9E",
  border: "#E0E0E0",
  error: "#D32F2F",
  success: "#388E3C",
  info: "#1976D2",
  overlay: "rgba(0,0,0,0.5)",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  title: 32,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

import { Platform } from "react-native";

const webShadow = (x: number, y: number, r: number, o: number) =>
  Platform.OS === "web"
    ? { boxShadow: `${x}px ${y}px ${r}px rgba(0,0,0,${o})` }
    : {};

export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    ...webShadow(0, 1, 2, 0.08),
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
    ...webShadow(0, 2, 4, 0.12),
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    ...webShadow(0, 4, 8, 0.15),
  },
} as const;
