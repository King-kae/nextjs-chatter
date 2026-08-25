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
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
      },
      colors: {
        brand: {
          50: "#fff1f2",
          100: "#ffe1e3",
          200: "#ffc7cb",
          300: "#ff9ea6",
          400: "#ff6675",
          500: "#fb3a52",
          600: "#e91b47",
          700: "#c4103c",
          800: "#a3113a",
          900: "#8b1237",
          950: "#4d0419",
        },
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d5d9e2",
          300: "#b1b9c9",
          400: "#8691ab",
          500: "#67728f",
          600: "#525b76",
          700: "#434a60",
          800: "#3a4051",
          900: "#333846",
          950: "#14151d",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "brand-mesh":
          "radial-gradient(at 20% 10%, rgba(251,58,82,0.18) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(250,204,21,0.18) 0px, transparent 50%), radial-gradient(at 90% 90%, rgba(139,18,55,0.15) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(99,102,241,0.15) 0px, transparent 50%)",
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(20, 21, 29, 0.08), 0 8px 24px -8px rgba(20, 21, 29, 0.10)",
        glow: "0 0 0 1px rgba(251,58,82,0.08), 0 8px 30px -6px rgba(251,58,82,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
