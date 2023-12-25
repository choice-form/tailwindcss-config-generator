import {useAtom} from "jotai";
import {projectsAtom} from "../../atom";
import {ColorSpacesType} from "../../type";
import {UiTabs} from "../ui";
import {useService, useStore} from "../../store/provider";
import {updateProjectCommand} from "../../store/commands/update-project";

interface ColorSpacesProps {}

const colorSpacesOptions = ["hex", "hsl", "rgb"] as const;

const ColorSpaces = ({}: ColorSpacesProps) => {
  const service = useService();
  const project = useStore((state) => state.project);

  return (
    <div className="bg-black/5 dark:bg-white/10 p-4 rounded-lg flex flex-col gap-4">
      <h3 className="text-sm">Color Spaces</h3>
      <UiTabs
        tabs={colorSpacesOptions.map((type) => ({
          label: type,
          checked: type === project.colorSpaces,
          onClick: () => {
            // service.patch({ ...project, colorSpaces: type });
            service.execute(updateProjectCommand(project, {colorSpaces: type}));
          },
        }))}
      />

      <button disabled={!service.canRedo} onPointerDown={() => service.redo()}>
        Redo
      </button>
      <button disabled={!service.canUndo} onPointerDown={() => service.undo()}>
        Undo
      </button>

      {project.colorSpaces === "hex" && (
        <span className="text-xs opacity-60">
          In the HEX color space, due to the lack of alpha channel support, it's not possible to
          directly represent transparency. For instance, when using HEX codes (like bg-blue-500/50),
          achieving a 50% transparency effect is unfeasible.
        </span>
      )}
    </div>
  );
};

export default ColorSpaces;
