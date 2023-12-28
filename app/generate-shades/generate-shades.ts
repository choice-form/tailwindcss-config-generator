import chroma from "chroma-js";
import {ShadesProps, SwatchColorMap} from "../type";

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
      luminanceAmount = [0, 1],
      saturationAmount = [0, 1],
      desaturateAmount = [0, 1],
      hueAmount = 0,

      defaultIndex,
    } = swatch;

    // Adjust colors and tints using chroma.js
    let keyColor = chroma(initColor);
    const degreesPerUnit = 6;
    let lightenColor = keyColor
      // .brighten(lightenAmount)
      // .set("hsl.l", 1 - luminanceAmount[0])
      .luminance(1 - luminanceAmount[0])
      .saturate(saturationAmount[0] * 10)
      .desaturate(desaturateAmount[0] * 10)
      .set("hsl.h", keyColor.get("hsl.h") - hueAmount * degreesPerUnit);
    let darkenColor = keyColor
      // .darken(darkenAmount)
      // .set("hsl.l", 1 - luminanceAmount[1])
      .luminance(1 - luminanceAmount[1])
      .saturate((1 - saturationAmount[1]) * 10)
      .desaturate((1 - desaturateAmount[1]) * 10)
      .set("hsl.h", keyColor.get("hsl.h") + hueAmount * degreesPerUnit);

    // Calculate the ratio for color scale domain only when "defaultIndex" is defined
    let colors: string[];
    if (defaultIndex !== undefined) {
      let ratio = defaultIndex / 11; // len is the length of your color array
      colors = chroma
        .scale([lightenColor, keyColor, darkenColor])
        .mode("lab")
        .domain([0, ratio, 1])
        .colors(13);
    } else {
      colors = chroma.scale([lightenColor, keyColor, darkenColor]).mode("lab").colors(13);
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

    shadesObject[name] = {
      50: chroma(colors[1]),
      100: chroma(colors[2]),
      200: chroma(colors[3]),
      300: chroma(colors[4]),
      400: chroma(colors[5]),
      500: chroma(colors[6]),
      600: chroma(colors[7]),
      700: chroma(colors[8]),
      800: chroma(colors[9]),
      900: chroma(colors[10]),
      950: chroma(colors[11]),
      DEFAULT:
        defaultIndex !== undefined
          ? chroma(colors[defaultIndex])
          : chroma(colors[closestColorIndex]),
    };
  });

  return shadesObject;
};

export default generateShades;
