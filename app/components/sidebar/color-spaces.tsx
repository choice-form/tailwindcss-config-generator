import {useAtom} from "jotai";
import {projectsAtom} from "../../atom";
import {ColorSpacesType} from "../../type";
import {UiTabs} from "../ui";

interface ColorSpacesProps {}

const colorSpacesOptions = ["hex", "hsl", "rgb"];

const ColorSpaces = ({}: ColorSpacesProps) => {
  const [projects, setProjects] = useAtom(projectsAtom);

  return (
    <div className="bg-black/5 dark:bg-white/10 p-4 rounded-lg flex flex-col gap-4">
      <h3 className="text-sm">Color Spaces</h3>
      <UiTabs
        tabs={colorSpacesOptions.map((type) => ({
          label: type,
          checked: type === projects.colorSpaces,
          onClick: () => setProjects({...projects, colorSpaces: type as ColorSpacesType}),
        }))}
      />

      {projects.colorSpaces === "hex" && (
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
