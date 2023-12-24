import chroma from "chroma-js";
import {ShadesProps, SwatchColorMap} from "../type";
import {formatHSL} from "../utilities";

export interface generateShadesProps {
  shades: ShadesProps[];
  initial?: boolean;
}

const generateShades = ({shades = [], initial = true}: generateShadesProps): SwatchColorMap => {
  const shadesObject: SwatchColorMap = {};

  shades.forEach((swatch) => {
    // Extract colors and adjust parameters from the interface
    let {
      name,
      initColor,
      lightenAmount = 10,
      darkenAmount = 10,
      hueAmount = 0,
      saturationUpAmount = 0,
      saturationDownAmount = 0,
      desaturateUpAmount = 0,
      desaturateDownAmount = 0,
      defaultIndex,
    } = swatch;

    // Adjust colors and tints using chroma.js
    let keyColor = chroma(initColor);
    const degreesPerUnit = 4;
    let lightenColor = keyColor
      .brighten(lightenAmount / 10)
      .saturate(saturationUpAmount / 10)
      .desaturate(desaturateUpAmount / 10)
      .set("hsl.h", keyColor.get("hsl.h") - hueAmount * degreesPerUnit);
    let darkenColor = keyColor
      .darken(darkenAmount / 10)
      .saturate(saturationDownAmount / 10)
      .desaturate(desaturateDownAmount / 10)
      .set("hsl.h", keyColor.get("hsl.h") + hueAmount * degreesPerUnit);

    // Calculate the ratio for color scale domain only when "defaultIndex" is defined
    let colors: string[];
    if (defaultIndex !== undefined) {
      let ratio = defaultIndex / 11; // len is the length of your color array
      colors = chroma
        .scale([lightenColor, keyColor, darkenColor])
        .mode("lab")
        .domain([0, ratio, 1])
        .colors(12);
    } else {
      colors = chroma.scale([lightenColor, keyColor, darkenColor]).mode("lab").colors(12);
    }

    // Find the color closest to keyColor in the color sequence and replace it with keyColor
    let minDeltaE = Infinity;
    let closestColorIndex: number = 0;

    colors.forEach((color, index) => {
      let deltaE = chroma.deltaE(keyColor, color);
      if (deltaE < minDeltaE) {
        minDeltaE = deltaE;
        closestColorIndex = index;
      }
    });

    // Replace the color closest to keyColor in the color sequence with keyColor
    colors[closestColorIndex] = chroma(keyColor).hex();

    // Format the colors to get rid of 'hsl', '(', ')' and into percentage format and add it to the output JSON
    shadesObject[name] = {
      50: formatHSL(colors[0], initial),
      100: formatHSL(colors[1], initial),
      200: formatHSL(colors[2], initial),
      300: formatHSL(colors[3], initial),
      400: formatHSL(colors[4], initial),
      500: formatHSL(colors[5], initial),
      600: formatHSL(colors[6], initial),
      700: formatHSL(colors[7], initial),
      800: formatHSL(colors[8], initial),
      900: formatHSL(colors[9], initial),
      950: formatHSL(colors[10], initial),
      DEFAULT:
        defaultIndex !== undefined
          ? formatHSL(colors[defaultIndex], initial)
          : formatHSL(colors[closestColorIndex], initial),
    };
  });

  return shadesObject;
};

export default generateShades;
