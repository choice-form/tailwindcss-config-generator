// @ts-nocheck
import tailwindcssSvgIcon from "@choiceform/tailwindcss-svg-icon";
import type {Config} from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "hsla(var(--color-50), <alpha-value>)",
          100: "hsla(var(--color-100), <alpha-value>)",
          200: "hsla(var(--color-200), <alpha-value>)",
          300: "hsla(var(--color-300), <alpha-value>)",
          400: "hsla(var(--color-400), <alpha-value>)",
          500: "hsla(var(--color-500), <alpha-value>)",
          600: "hsla(var(--color-600), <alpha-value>)",
          700: "hsla(var(--color-700), <alpha-value>)",
          800: "hsla(var(--color-800), <alpha-value>)",
          900: "hsla(var(--color-900), <alpha-value>)",
          950: "hsla(var(--color-950), <alpha-value>)",
          DEFAULT: "hsla(var(--color-default), <alpha-value>)",
          "readable-color": "var(--readable-color)",
        },
      },
    },
  },
  plugins: [
    tailwindcssSvgIcon({
      classPrefix: "ic",
      defaultSize: 1,
      unit: "rem",
    }),
  ],
};
export default config;
