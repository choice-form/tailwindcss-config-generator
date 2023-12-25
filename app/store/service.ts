import {Zeit} from "@choiceform/zeit";
import type {ContrastTabsType, ProjectProps, WorkspaceProps} from "../type";
import type {CSSProperties} from "react";
import {derivedState} from "./derived-state";

export type AppState = {
  project: ProjectProps;
  workspaces: WorkspaceProps[];
  shadesConfig: CSSProperties;
  shadesCssVariables: CSSProperties;
  uiIsBusy: boolean;
  contrastTabs: ContrastTabsType;
  containerWidth: "sm" | "md" | "lg" | null;
};

export class Service extends Zeit<AppState, ReturnType<typeof derivedState>> {}
