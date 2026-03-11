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
        soleil: {
          gold: "#F59E0B",
          "gold-light": "#FCD34D",
          "gold-dark": "#D97706",
          sunset: "#EF4444",
          sky: "#0EA5E9",
          "sky-light": "#38BDF8",
          emerald: "#10B981",
          indigo: "#1E1B4B",
          "indigo-light": "#312E81",
          cream: "#FFFBEB",
          "cream-dark": "#FEF3C7",
          gray: "#6B7280",
          "gray-light": "#F3F4F6",
        },
      },
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
      animation: {
        "score-fill": "score-fill 1.5s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "pulse-gold": "pulse-gold 2s infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        "score-fill": {
          "0%": { strokeDashoffset: "283" },
          "100%": { strokeDashoffset: "var(--score-offset)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245, 158, 11, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(245, 158, 11, 0)" },
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
