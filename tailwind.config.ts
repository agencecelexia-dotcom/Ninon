import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#FF385C",
          dark: "#E31C5F",
          light: "#FF6B81",
          50: "#FFF0F3",
        },
        gold: {
          DEFAULT: "#F5A623",
          light: "#FFD166",
          dark: "#B8860B",
          50: "#FFF8E7",
        },
        dark: {
          DEFAULT: "#222222",
          light: "#484848",
          muted: "#717171",
        },
        surface: {
          DEFAULT: "#F7F7F7",
          card: "#FFFFFF",
          border: "#EBEBEB",
          hover: "#F0F0F0",
        },
        soleil: {
          gold: "#F5A623",
          "gold-light": "#FFD166",
          "gold-dark": "#B8860B",
          sunset: "#FF385C",
          sky: "#0EA5E9",
          "sky-light": "#38BDF8",
          emerald: "#00A699",
          indigo: "#222222",
          "indigo-light": "#484848",
          cream: "#FAFAFA",
          "cream-dark": "#F0F0F0",
          gray: "#717171",
          "gray-light": "#F7F7F7",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 6px 20px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 20px 60px rgba(0, 0, 0, 0.12)",
        float: "0 12px 40px rgba(0, 0, 0, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-gold": "pulseGold 2s infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245, 166, 35, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(245, 166, 35, 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
