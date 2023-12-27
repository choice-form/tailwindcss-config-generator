import tailwindcssSvgIcon from "@choiceform/tailwindcss-svg-icon";
import containerQueries from "@tailwindcss/container-queries";
import type {Config} from "tailwindcss";
const {nextui} = require("@nextui-org/react");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {},
    },
  },
  plugins: [
    nextui({
      prefix: "tx", // prefix for themes variables
      defaultTheme: "light", // default theme from the themes object
    }),
    containerQueries,
    tailwindcssSvgIcon({
      classPrefix: "ic",
      defaultSize: 1,
      unit: "rem",
    }),
  ],
};
export default config;
