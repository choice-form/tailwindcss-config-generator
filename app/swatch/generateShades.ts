import chroma from "chroma-js";

export interface generateShadesProps {
  swatches: {
    name: string;
    value: string;
    lightenAmount: number;
    darkenAmount: number;
    adjustHue: number;
  }[];
}

interface SwatchColor {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
  DEFAULT: string;
}

export interface SwatchColorMap {
  [key: string]: SwatchColor;
}

export const generateShades = ({swatches}: generateShadesProps): SwatchColorMap => {
  const shadesObject: SwatchColorMap = {};
  swatches.forEach((swatch) => {
    // 从接口提取颜色和调整参数
    let {name, value, lightenAmount, darkenAmount, adjustHue} = swatch;

    // 使用chroma.js调整颜色和色调
    let keyColor = chroma(value);
    let lightenColor = keyColor.brighten(lightenAmount);
    let darkenColor = keyColor.darken(darkenAmount);
    let adjustedKeyColor = keyColor.set("hsl.h", adjustHue % 360); // Hue is in range [0°, 360°]

    // 根据keyColor生成颜色序列
    let colors = chroma
      .scale([lightenColor, value, darkenColor])
      .classes(12)
      .mode("hsl")
      .colors(12);

    // 格式化颜色以去掉'hsl'，'('，')'，并变成百分比格式，并将其添加到输出JSON
    shadesObject[name] = {
      50: formatHSL(colors[0]),
      100: formatHSL(colors[1]),
      200: formatHSL(colors[2]),
      300: formatHSL(colors[3]),
      400: formatHSL(colors[4]),
      500: formatHSL(colors[5]),
      600: formatHSL(colors[6]),
      700: formatHSL(colors[7]),
      800: formatHSL(colors[8]),
      900: formatHSL(colors[9]),
      950: formatHSL(colors[10]),
      DEFAULT: formatHSL(value),
    };
  });

  return shadesObject;
};

// Helper function to format HSL color
const formatHSL = (color: string): string => {
  let hsl = chroma(color).hsl();
  let h = isNaN(hsl[0]) ? 0 : Math.round(hsl[0]);
  let s = isNaN(hsl[1]) ? 0 : Math.round(hsl[1] * 100);
  let l = isNaN(hsl[2]) ? 0 : Math.round(hsl[2] * 100);

  // 不带hsl前缀和括号
  return `${h},${s}%,${l}%`;
};
