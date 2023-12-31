import chroma from "chroma-js";
import {generateShades, generateShadesProps} from "../generate-shades";

const generateShadeStyle = (
  props: generateShadesProps,
  colorName: string,
  index?: number,
): React.CSSProperties => {
  const shades = generateShades(props);
  let shade: {[key: string]: chroma.Color} | undefined;

  if (index !== undefined) {
    const colorKeys = Object.keys(shades);
    const usedColorInSwatches = colorKeys[index] || "DEFAULT";
    shade = shades[usedColorInSwatches];
  } else {
    shade = shades[colorName] || shades["DEFAULT"];
  }

  let styles: {[key: string]: chroma.Color} = {};

  if (!shade || colorName === "DEFAULT") return styles;

  Object.keys(shade).forEach((key) => {
    if (key !== "DEFAULT") {
      const cssVariablesName = `--${colorName}-${key}`;
      styles[cssVariablesName] = shade![key];
    }
  });

  return styles;
};

export default generateShadeStyle;
