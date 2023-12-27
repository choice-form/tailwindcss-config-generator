import {faker} from "@faker-js/faker";
import chroma from "chroma-js";
import classNames from "classnames";
import {updateProjectShadesCommand} from "../../store/commands/update-project";
import {useService, useStore} from "../../store/provider";
import {ShadesProps} from "../../type";
import {isValidColor} from "../../utilities";
import ExportPopover from "../export/export-popover";
import {PresetPopover} from "../preset";
import ContrastPopover from "./contrast-popover";

interface ToolbarProps {}

const Toolbar = ({}: ToolbarProps) => {
  const service = useService();
  const project = useStore((state) => state.project);

  // Create a new shade
  const handleAddShade = () => {
    let formattedColorName;
    do {
      // Generate a random color name
      let colorName = faker.color.human();
      // Remove spaces and make it lowercase
      formattedColorName = colorName.toLowerCase().replace(/ /g, "-");
    } while (
      // Check if the color name already exists
      Object.keys(project.shades.map((shade) => shade.name)).includes(formattedColorName) ||
      // Filter out the following names
      formattedColorName === "white" ||
      formattedColorName === "black"
    );
    const newShade = {
      name: formattedColorName,
      // If the name is a legal color name, the color name is used to generate the color.
      // If it is not legal, the color is randomly generated.
      initColor: isValidColor(formattedColorName) ? formattedColorName : chroma.random().hex(),
    };
    service.execute(
      updateProjectShadesCommand(project, ({shades}) => {
        return [newShade, ...shades] as ShadesProps[];
      }),
    );
  };

  return (
    <div className="sticky top-16 z-40 bg-white/80 px-8 backdrop-blur dark:bg-gray-900/80">
      <div className="container mx-auto flex flex-wrap gap-x-8 gap-y-4 py-8">
        <div className="flex flex-1 gap-4">
          <button
            className="flex items-center gap-1 whitespace-nowrap rounded-lg bg-black px-3 py-2 text-sm
            text-white ring ring-white/50 dark:bg-white dark:text-black dark:ring-black/50"
            onClick={handleAddShade}
          >
            <div className="ic-[e-add]" />
            Add shade
          </button>

          <PresetPopover />
        </div>

        <button
          className={classNames(!service.canUndo && "opacity-30")}
          disabled={!service.canUndo}
          onPointerDown={() => service.undo()}
        >
          Undo
        </button>
        <button
          className={classNames(!service.canRedo && "opacity-30")}
          disabled={!service.canRedo}
          onPointerDown={() => service.redo()}
        >
          Redo
        </button>
        <ContrastPopover />

        <ExportPopover />
        <button>Save</button>
      </div>
    </div>
  );
};

export default Toolbar;
