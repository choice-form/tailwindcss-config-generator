import {create, original} from "mutative";
import type {ProjectProps} from "../../type";

export function updateProjectCommand(oldProject: ProjectProps, partial: Partial<ProjectProps>) {
  const newProject = {...oldProject, ...partial};
  return {
    prev: {
      project: oldProject,
    },
    next: {
      project: newProject,
    },
  };
}

export function updateProjectShadesCommand(
  oldProject: ProjectProps,
  getShades: (project: ProjectProps) => ProjectProps["shades"],
) {
  const newProject = {...oldProject, shades: getShades(oldProject)};
  return {
    prev: {
      project: oldProject,
    },
    next: {
      project: newProject,
    },
  };
}

export function updateProject<T extends ProjectProps>(project: T, partial: (draft: T) => void) {
  const [draft, finalize] = create(project);
  partial(draft);
  return {
    prev: {project: original(draft)},
    next: {project: finalize()},
  };
}
