export interface ProjectProps {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  shades: ShadesProps[];
  colorSpaces: ColorSpacesType;
  accessibility: {
    luminanceWarning: LuminanceWarningType;
    wcag2Contrast: W3cContrastType;
    apcaContrast: W3cContrastType;
  };
}

export interface ShadesProps {
  name: string;
  initColor: string;
  luminanceAmount: number[];
  saturationAmount: number[];
  desaturateAmount: number[];
  hueAmount: number;
  defaultIndex?: number | undefined;
}

export interface SwatchColorProps {
  50: chroma.Color;
  100: chroma.Color;
  200: chroma.Color;
  300: chroma.Color;
  400: chroma.Color;
  500: chroma.Color;
  600: chroma.Color;
  700: chroma.Color;
  800: chroma.Color;
  900: chroma.Color;
  950: chroma.Color;
  DEFAULT: chroma.Color;
  [index: string]: chroma.Color;
}

export interface SwatchColorMap {
  [key: string]: SwatchColorProps;
}

export type ColorSpacesType = "hex" | "hsl" | "rgb";
export type ContrastTabsType = "luminance" | "wcag2" | "apca";
export type LuminanceWarningType = {brighten: boolean; darken: boolean};
export type W3cContrastType = "none" | "aa" | "aaa";
