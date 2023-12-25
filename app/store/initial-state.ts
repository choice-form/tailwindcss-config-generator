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
  workspaces: [],
  shadesConfig: {},
  shadesCssVariables: {},
  uiIsBusy: false,
  containerWidth: null,
  contrastTabs: "luminance",
} satisfies AppState;
