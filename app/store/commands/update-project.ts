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
