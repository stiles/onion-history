import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        mono: ["Space Mono", "monospace"],
      },
      colors: {
        cream: "#fffbeb",
        ink: "#0f0f0f",
        muted: "#737373",
        highlight: "#047857",
        rule: "#e5e5e5",
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.125rem", { lineHeight: "1.5" }],
        xl: ["1.25rem", { lineHeight: "1.4" }],
        "2xl": ["1.5rem", { lineHeight: "1.3" }],
        "3xl": ["2rem", { lineHeight: "1.2" }],
        "4xl": ["2.5rem", { lineHeight: "1.1" }],
        "5xl": ["3.5rem", { lineHeight: "1" }],
        "6xl": ["4.5rem", { lineHeight: "0.95" }],
      },
    },
  },
  plugins: [],
};

export default config;
