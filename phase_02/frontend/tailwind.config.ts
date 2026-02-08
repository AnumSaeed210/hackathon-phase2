import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "'Roboto', var(--font-roboto)",
          "system-ui",
          "sans-serif",
        ],
        grotesk: [
          "'Space Grotesk', var(--font-space-grotesk)",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        // Soft Pastel Minimalist Theme Colors
        background: {
          DEFAULT: "#F5EDE4", // Warm beige/cream
        },
        sidebar: {
          DEFAULT: "#E8DCD3", // Light tan/peach
        },
        cards: {
          DEFAULT: "#C5B5C9", // Muted purple/mauve
        },
        primary: {
          DEFAULT: "#B49BC4", // Soft Purple
          light: "#C9BFD9",
          dark: "#9F87AF",
        },
        secondary: {
          DEFAULT: "#F4A460", // Peach/Coral
          light: "#F6B882",
          dark: "#E09459",
        },
        highlight: {
          DEFAULT: "#F4C542", // Yellow
          light: "#F6CE63",
          dark: "#DDBE3C",
        },

        // Text colors
        text: {
          primary: "#4A4458", // Dark charcoal
          secondary: "#6B5D73",
          tertiary: "#5B4E7C",
        },

        // Semantic colors
        error: "#ff6b6b",
        errorLight: "#ff8c8c",
        warning: "#F4C542",
        success: "#cbe857",
      },
      spacing: {
        "128": "32rem",
        // Design system spacing scale (4px base grid)
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
      },
      screens: {
        mobile: "320px",
        tablet: "768px",
        desktop: "1024px",
      },
      borderRadius: {
        none: "0",
        sm: "4px",
        base: "8px",
        md: "12px",
        lg: "16px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        base: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        md: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        lg: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        xl: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
        slowest: "500ms",
      },
      keyframes: {
        "jello-vertical": {
          "0%": { transform: "scale3d(1, 1, 1)" },
          "30%": { transform: "scale3d(0.75, 1.25, 1)" },
          "40%": { transform: "scale3d(1.25, 0.75, 1)" },
          "50%": { transform: "scale3d(0.85, 1.15, 1)" },
          "65%": { transform: "scale3d(1.05, 0.95, 1)" },
          "75%": { transform: "scale3d(0.95, 1.05, 1)" },
          "100%": { transform: "scale3d(1, 1, 1)" },
        },
      },
      animation: {
        "jello-vertical": "jello-vertical 0.9s both",
      },
    },
  },
  plugins: [],
};

export default config;
