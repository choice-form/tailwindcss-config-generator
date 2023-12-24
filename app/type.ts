export interface WorkspaceProps {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectProps {
  id: number;
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
  lightenAmount: number;
  darkenAmount: number;
  hueAmount: number;
  desaturateUpAmount: number;
  desaturateDownAmount: number;
  saturationUpAmount: number;
  saturationDownAmount: number;
  defaultIndex: number | undefined;
}

export interface SwatchColorProps {
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
  [index: string]: string;
}

export interface SwatchColorMap {
  [key: string]: SwatchColorProps;
}

export type ColorSpacesType = "hex" | "hsl" | "rgb";
export type ContrastTabsType = "luminance" | "wcag2" | "apca";
export type LuminanceWarningType = {brighten: boolean; darken: boolean};
export type W3cContrastType = "none" | "aa" | "aaa";
