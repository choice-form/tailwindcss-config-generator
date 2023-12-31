import {faker} from "@faker-js/faker";
import {Button} from "@nextui-org/react";
import chroma from "chroma-js";
import {updateProjectShadesCommand} from "../../store/commands/update-project";
import {useService, useStore} from "../../store/provider";
import {ShadesProps} from "../../type";
import {isValidColor} from "../../utilities";
import ExportPopover from "../export/export-popover";
import {PresetPopover} from "../preset";
import ContrastPopover from "./contrast-popover";
import {saveConfig} from "../../config";

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
      project.shades.map((shade) => shade.name).includes(formattedColorName) ||
      // Filter out the following names
      formattedColorName === "white" ||
      formattedColorName === "black"
    );
    const newShade = {
      name: formattedColorName,
      // If the name is a legal color name, the color name is used to generate the color.
      // If it is not legal, the color is randomly generated.
      initColor: isValidColor(formattedColorName) ? formattedColorName : chroma.random().hex(),
      scaleMode: "lrgb",
    };
    service.execute(
      updateProjectShadesCommand(project, ({shades}) => {
        return [newShade, ...shades] as ShadesProps[];
      }),
    );
  };

  return (
    <div className="sticky top-16 z-40 bg-white/80 px-8 backdrop-blur dark:bg-black/80">
      <div className="container mx-auto flex flex-wrap gap-2 py-8">
        <div className="flex flex-1 gap-4">
          <Button startContent={<div className="ic-[e-add]" />} onClick={handleAddShade}>
            Add shade
          </Button>

          <PresetPopover />
        </div>

        <div className="flex gap-2">
          <Button variant="light" isDisabled={!service.canUndo} onPress={() => service.undo()}>
            Undo
          </Button>
          <Button variant="light" isDisabled={!service.canRedo} onPress={() => service.redo()}>
            Redo
          </Button>

          <ContrastPopover />

          <ExportPopover />

          <Button
            variant="light"
            isDisabled={project.shades.length === 0}
            onClick={async () => {
              const res = await saveConfig(JSON.stringify(service.state));
              if (res) {
                // TODO 显示成功
                alert("Success");
              } else {
                // TODO 显示失败
                alert("Error");
              }
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
