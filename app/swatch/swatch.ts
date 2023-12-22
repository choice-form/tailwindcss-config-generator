import {adjustHue, darken, getLuminance, lighten, toHex} from "color2k";
import {range} from "lodash";

export interface SwatchProps {
  swatch: {
    name: string;
    value: string;
    lightenAmount: number;
    darkenAmount: number;
    adjustHue: number;
  }[];
}

function swatch({swatch}: SwatchProps) {
  let swatchObject: Record<string, Record<number | "DEFAULT", string>> = {};

  swatch?.forEach((colorObj) => {
    let shades: Record<number | string, string> = {};
    const colorHex = toHex(colorObj.value);
    const colorLightenAmount = colorObj.lightenAmount ?? 18;
    const colorDarkenAmount = colorObj.darkenAmount ?? 18;
    const colorAdjustHue = colorObj.adjustHue ?? 0;

    const step = 20;

    const adjustHueRange = (i: number) =>
      colorAdjustHue < 0 ? (360 - colorAdjustHue * -1) * i : colorAdjustHue * i;

    const shadeColors = range(step)
      .slice(1, step)
      .reverse()
      .map((i) => adjustHue(lighten(colorHex, i / colorLightenAmount), adjustHueRange(i)))
      .concat(
        range(step).map((i) =>
          adjustHue(darken(colorHex, i / colorDarkenAmount), i > 0 ? adjustHueRange(i) : 0),
        ),
      )
      .filter((color) => getLuminance(color) < 0.999);

    shadeColors
      .slice((10 - Math.round(getLuminance(colorHex) * 10)) / 3, shadeColors.length)
      .slice(0, 11)
      .forEach((color, index) => {
        let hslValue = color
          .substring(5, color.length - 1) // Remove 'hsla(' and ')'
          .split(", ") // Split into array
          .slice(0, 3) // Use only first three array elements, ignore alpha
          .join(", "); // Join elements into string
        shades[index === 0 ? 50 : index === 10 ? 950 : index * 100] = hslValue;

        if (color === toHex(color)) {
          shades["DEFAULT"] = hslValue; // Set 'DEFAULT' shade to be the 500 shade
        }
      });
    swatchObject[colorObj.name] = shades;
  });

  let swatchJson = JSON.stringify(swatchObject).replace(/"(\w+)"\s*:/g, "$1:");

  return {swatchObject, swatchJson};
}
export default swatch;
