import {Zeit} from "@choiceform/zeit";
import type {CSSProperties} from "react";
import type {ContrastTabsType, ProjectProps} from "../type";

export type AppState = {
  project: ProjectProps;
  shadesConfig: CSSProperties;
  shadesCssVariables: CSSProperties;
  uiIsBusy: boolean;
  contrastTabs: ContrastTabsType;
};

export class Service extends Zeit<AppState, unknown> {}
