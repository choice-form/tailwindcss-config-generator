import type {AppState} from "./service";

export function derivedState<S extends AppState>(state: S) {
  const workspaceCount = state.workspaces.length;

  return {
    workspaceCount,
  };
}
