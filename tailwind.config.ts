import tailwindcssSvgIcon from "@choiceform/tailwindcss-svg-icon";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
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
