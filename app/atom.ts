import { atom } from "jotai";
import { generateShadesProps } from "./swatch/generateShades";

export const luminanceWarningAtom = atom(true);
export const darkenWarningAtom = atom(true);

export const shadesAtom = atom<generateShadesProps["swatches"]>([]);
