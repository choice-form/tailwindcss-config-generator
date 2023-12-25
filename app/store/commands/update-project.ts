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
