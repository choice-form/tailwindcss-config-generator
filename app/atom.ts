import {atom} from "jotai";
import {ContrastTabsType, ProjectProps, WorkspaceProps} from "./type";

export const workspaceAtom = atom<WorkspaceProps[]>([]);

export const projectsAtom = atom<ProjectProps>({
  id: "",
  name: "",
  createdAt: "",
  updatedAt: "",
  shades: [],
  colorSpaces: "hsl",
  accessibility: {
    luminanceWarning: {brighten: true, darken: true},
    wcag2Contrast: "none",
    apcaContrast: "none",
  },
});

export const contrastTabsAtom = atom<ContrastTabsType>("luminance");

export const shadesCssVariablesAtom = atom<React.CSSProperties>({});
export const shadesConfigAtom = atom<React.CSSProperties>({});

export const uiIsBusyAtom = atom<boolean>(false);

export const containerWidthAtom = atom<"sm" | "md" | "lg" | null>(null);
