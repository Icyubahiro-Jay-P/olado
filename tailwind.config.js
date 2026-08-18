/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,tsx}",
    "./src/**/*.{js,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        olado: {
          green: "#2E7D32",
          "green-dark": "#1B5E20",
          "green-light": "#4CAF50",
          "green-50": "#E8F5E9",
          "green-100": "#C8E6C9",
          accent: "#FF9800",
          "accent-dark": "#F57C00",
          "accent-light": "#FFB74D",
          gold: "#FFC107",
          surface: "#FFFFFF",
          background: "#F5F5F5",
          card: "#FFFFFF",
          text: "#212121",
          "text-secondary": "#757575",
          "text-light": "#9E9E9E",
          border: "#E0E0E0",
          error: "#D32F2F",
          success: "#388E3C",
          info: "#1976D2",
        },
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};
