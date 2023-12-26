import type {AppState} from "./service";

export const initialState = {
  project: {
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
  },
  shadesConfig: {},
  shadesCssVariables: {},
  uiIsBusy: false,
  contrastTabs: "luminance",
} satisfies AppState;
