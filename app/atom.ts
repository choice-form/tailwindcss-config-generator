import {atom} from "jotai";
import {generateShadesProps} from "./generate-shades/generate-shades";

export const colorSpacesAtom = atom<"hex" | "hsl" | "rgb">("hsl");

export const luminanceWarningAtom = atom(true);
export const darkenWarningAtom = atom(true);

export const shadesAtom = atom<generateShadesProps["swatches"]>([]);

export const shadesCssVariablesAtom = atom<React.CSSProperties>({});
export const shadesConfigAtom = atom<React.CSSProperties>({});

export const sliderIsDraggingAtom = atom<boolean>(false);

export const contrastTypeAtom = atom<"luminance" | "wcag2" | "apca">("luminance");

export const wcag2ContrastAtom = atom<{aa: boolean; aaa: boolean}>({aa: false, aaa: false});
export const apcaContrastAtom = atom<{aa: boolean; aaa: boolean}>({aa: false, aaa: false});
