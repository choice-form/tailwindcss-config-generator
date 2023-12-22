import {generateShades, generateShadesProps} from "../swatch/generateShades";

const generateShadeStyle = (
  props: generateShadesProps,
  colorName: string,
  index?: number,
): React.CSSProperties => {
  const shades = generateShades(props);
  let shade: {[key: string]: string} | undefined;

  if (index !== undefined) {
    const colorKeys = Object.keys(shades);
    const usedColorInSwatches = colorKeys[index] || "DEFAULT";
    shade = shades[usedColorInSwatches];
  } else {
    shade = shades[colorName] || shades["DEFAULT"];
  }

  let styles: {[key: string]: string} = {};

  if (!shade || colorName === "DEFAULT") return styles;

  Object.keys(shade).forEach((key) => {
    if (key !== "DEFAULT") {
      const cssVarName = `--${colorName}-${key}`;
      styles[cssVarName] = shade![key];
    }
  });

  return styles;
};

export default generateShadeStyle;
