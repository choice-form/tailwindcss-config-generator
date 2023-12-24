import classNames from "classnames";
import {useAtom} from "jotai";
import {ColorInput} from ".";
import {projectsAtom} from "../../atom";
import {UiSlider} from "../ui";
import {useState, useEffect} from "react";

interface ShadeControlProps {
  index: number;
  isMobile: boolean;
}

const ShadeControl = ({index, isMobile}: ShadeControlProps) => {
  const [projects, setProjects] = useAtom(projectsAtom);
  const [tempName, setTempName] = useState(projects.shades[index].name);
  const [nameCheck, setNameCheck] = useState<string>("");

  const handleRemoveSwatch = (i: number) => {
    setProjects({
      ...projects,
      shades: projects.shades.filter((_, index) => index !== i),
    });
  };

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (nameCheck) {
      timerId = setTimeout(() => {
        setNameCheck("");
      }, 3000);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [nameCheck]);

  const handleBlur = () => {
    let newName = tempName;

    // Check if the name is a number
    if (/^\d+$/.test(newName)) {
      newName = `color-${newName}`;
      setNameCheck(
        "Name cannot be a number. We have added a prefix 'color-' to your name automatically.",
      );
    }

    let duplicate = projects.shades.find((s, j) => s.name === newName && j !== index);

    // Check if the name already exists
    if (duplicate) {
      newName = `${newName}${index}`;
      setNameCheck(
        'Name already exists. We have added a suffix "-${index}" to your name automatically.',
      );
    }

    setTempName(newName);

    setProjects({
      ...projects,
      shades: projects.shades.map((swatch, i) =>
        index === i ? {...swatch, name: newName} : swatch,
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
          <div className="flex-grow relative">
            {nameCheck && (
              <span className="text-xs absolute -top-8 -left-8 opacity-50 whitespace-nowrap">
                {nameCheck}
              </span>
            )}
            <input
              className="flex-grow"
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleBlur}
              placeholder="Enter name"
            />
          </div>
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
          <span className={classNames(isMobile && "w-24 shrink-0")}>Lighten amount</span>
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
          <span className={classNames(isMobile && "w-24 shrink-0")}>Darken amount</span>
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
          <span className={classNames(isMobile && "w-24 shrink-0")}>Adjust hue</span>
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
