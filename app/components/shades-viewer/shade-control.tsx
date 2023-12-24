import classNames from "classnames";
import {useAtom} from "jotai";
import {ColorInput} from ".";
import {projectsAtom} from "../../atom";
import {UiSlider} from "../ui";
import {useState} from "react";

interface ShadeControlProps {
  index: number;
  isMobile: boolean;
}

const ShadeControl = ({index, isMobile}: ShadeControlProps) => {
  const [projects, setProjects] = useAtom(projectsAtom);
  const [tempName, setTempName] = useState(projects.shades[index].name);

  const handleRemoveSwatch = (i: number) => {
    setProjects({
      ...projects,
      shades: projects.shades.filter((_, index) => index !== i),
    });
  };

  const handleBlur = () => {
    setProjects({
      ...projects,
      shades: projects.shades.map((swatch, i) =>
        index === i ? {...swatch, name: tempName} : swatch,
      ),
    });
  };

  return (
    <div className={classNames("flex items-center flex-wrap", isMobile ? "gap-2" : "gap-4")}>
      <div className="inline-flex items-center gap-2 self-start flex-wrap">
        <div className="shade-control-input flex-grow">
          <button
            className="bg-white border dark:bg-gray-600 hover:bg-primary hover:text-primary-readable-color
            flex h-6 w-6 flex-shrink-0 items-center justify-center place-self-center rounded-full text-xs"
            onClick={() => handleRemoveSwatch(index)}
          >
            <div className="ic-[e-delete]" />
          </button>
          <input
            className="flex-grow"
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleBlur}
            placeholder="Enter name"
          />
        </div>
        <ColorInput index={index} />
      </div>

      <div
        className={classNames(
          "inline-flex min-h-10 gap-3 self-start py-2 text-xs flex-grow whitespace-nowrap dark:border-gray-700",
          isMobile ? "flex-col items-stretch" : "rounded-full border px-3 flex-wrap items-center",
        )}
      >
        <div className="flex items-center gap-2 flex-grow">
          <span>Lighten amount</span>
          <UiSlider
            className="min-w-10"
            min={10}
            max={50}
            step={1}
            start={10}
            connect={true}
            value={projects.shades[index].lightenAmount}
            onChange={(value: number | number[]) => {
              const newSwatch = {
                lightenAmount: typeof value === "number" ? value : 10,
              };
              setProjects({
                ...projects,
                shades: projects.shades.map((swatch, i) =>
                  index === i ? {...swatch, ...newSwatch} : swatch,
                ),
              });
            }}
          />
          <span className="shade-control-badge">
            {projects.shades[index].lightenAmount / 10 || 1}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-grow">
          <span>Darken amount</span>
          <UiSlider
            className="min-w-10"
            min={10}
            max={50}
            step={1}
            start={10}
            connect={true}
            value={projects.shades[index].darkenAmount}
            onChange={(value: number | number[]) => {
              const newSwatch = {
                darkenAmount: typeof value === "number" ? value : 10,
              };
              setProjects({
                ...projects,
                shades: projects.shades.map((swatch, i) =>
                  index === i ? {...swatch, ...newSwatch} : swatch,
                ),
              });
            }}
          />
          <span className="shade-control-badge">
            {projects.shades[index].darkenAmount / 10 || 1}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-grow">
          <span>Adjust hue</span>
          <UiSlider
            className="min-w-10"
            min={0}
            max={360}
            step={1}
            start={1}
            connect={true}
            value={projects.shades[index].adjustHue}
            onChange={(value: number | number[]) => {
              const newSwatch = {
                adjustHue: typeof value === "number" ? value : 10,
              };
              setProjects({
                ...projects,
                shades: projects.shades.map((swatch, i) =>
                  index === i ? {...swatch, ...newSwatch} : swatch,
                ),
              });
            }}
          />
          <span className="shade-control-badge">{projects.shades[index].adjustHue ?? 0}</span>
        </div>
      </div>
    </div>
  );
};

export default ShadeControl;
