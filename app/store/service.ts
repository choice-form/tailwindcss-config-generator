import {Zeit} from "@choiceform/zeit";
import type {CSSProperties} from "react";
import type {ContrastTabsType, ProjectProps} from "../type";
import {derivedState} from "./derived-state";

export type AppState = {
  project: ProjectProps;
  shadesConfig: CSSProperties;
  shadesCssVariables: CSSProperties;
  uiIsBusy: boolean;
  contrastTabs: ContrastTabsType;
};

export class Service extends Zeit<AppState, ReturnType<typeof derivedState>> {}
