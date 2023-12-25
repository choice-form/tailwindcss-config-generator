import classNames from "classnames";
import {useAtom, useAtomValue} from "jotai";
import {ColorInput, ColorSlider} from ".";
import {containerWidthAtom, projectsAtom} from "../../atom";

import {useState, useEffect, Fragment} from "react";
import {formatHSL} from "../../utilities";
import {useService, useStore} from "../../store/provider";
import {
  updateProjectCommand,
  updateProjectShadesCommand,
} from "../../store/commands/update-project";
import {set} from "lodash";

interface ShadeControlProps {
  index: number;
}

const ShadeControl = ({index}: ShadeControlProps) => {
  // const [projects, setProjects] = useAtom(projectsAtom);

  const service = useService();
  const project = useStore((state) => state.project);

  const [tempName, setTempName] = useState(project.shades[index].name);
  const [nameCheck, setNameCheck] = useState<string>("");
  const containerWidth = useAtomValue(containerWidthAtom);

  const handleRemoveSwatch = (i: number) => {
    service.execute(
      updateProjectShadesCommand(project, ({shades}) => {
        return shades.filter((_, index) => index !== i);
      }),
    );
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

    let duplicate = project.shades.find((s, j) => s.name === newName && j !== index);

    // Check if the name already exists
    if (duplicate) {
      newName = `${newName}${index}`;
      setNameCheck(
        'Name already exists. We have added a suffix "-${index}" to your name automatically.',
      );
    }

    setTempName(newName);

    service.execute(
      updateProjectShadesCommand(project, ({shades}) => {
        return shades.map((swatch, i) => (index === i ? {...swatch, name: newName} : swatch));
      }),
    );
  };

  return (
    <div
      className={classNames(
        "flex flex-wrap items-center",
        containerWidth === "md" ? "flex-col gap-2" : "gap-4",
      )}
    >
      <div
        className={classNames(
          "flex-wrap items-center gap-2 self-start",
          containerWidth === "md" ? "grid w-full grid-cols-2" : "inline-flex",
          containerWidth === "sm" ? "grid w-full" : "inline-flex",
        )}
      >
        <div className="shade-control-input flex-grow">
          <button
            className="flex h-6 w-6 flex-shrink-0 items-center
            justify-center place-self-center rounded-full border bg-white text-xs hover:bg-primary hover:text-primary-readable-color dark:bg-gray-600"
            onClick={() => handleRemoveSwatch(index)}
          >
            <div className="ic-[e-delete]" />
          </button>
          <div className="relative flex-grow">
            {nameCheck && (
              <span className="absolute -left-8 -top-8 whitespace-nowrap text-xs opacity-50">
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
          "flex-1 gap-2",
          containerWidth === "md" ? "grid w-full grid-cols-2" : "flex",
          containerWidth === "sm" ? "grid w-full" : "flex",
        )}
      >
        <ColorSlider
          label="lightness"
          count={10}
          color={{
            default: formatHSL(project.shades[index].initColor),
          }}
          slider={[
            {
              label: "Step up %",
              min: 10,
              max: 50,
              step: 1,
              start: 10,
              connect: true,
              value: project.shades[index].lightenAmount,
              onChange: (value: number | number[]) => {
                const newSwatch = {
                  lightenAmount: typeof value === "number" ? value : 10,
                };
                service.execute(
                  updateProjectShadesCommand(project, ({shades}) => {
                    return shades.map((swatch, i) =>
                      index === i ? {...swatch, ...newSwatch} : swatch,
                    );
                  }),
                );
              },
            },
            {
              label: "Step down %",
              min: 10,
              max: 50,
              step: 1,
              start: 10,
              connect: true,
              value: project.shades[index].darkenAmount,
              onChange: (value: number | number[]) => {
                const newSwatch = {
                  darkenAmount: typeof value === "number" ? value : 10,
                };
                service.execute(
                  updateProjectShadesCommand(project, ({shades}) => {
                    return shades.map((swatch, i) =>
                      index === i ? {...swatch, ...newSwatch} : swatch,
                    );
                  }),
                );
              },
            },
          ]}
        />

        <ColorSlider
          label="Saturation"
          count={10}
          color={{
            default: formatHSL(project.shades[index].initColor),
          }}
          slider={[
            {
              label: "Step up %",
              min: 0,
              max: 50,
              step: 1,
              start: 0,
              connect: true,
              value: project.shades[index].saturationUpAmount,
              onChange: (value: number | number[]) => {
                const newSwatch = {
                  saturationUpAmount: typeof value === "number" ? value : 0,
                };
                service.execute(
                  updateProjectShadesCommand(project, ({shades}) => {
                    return shades.map((swatch, i) =>
                      index === i ? {...swatch, ...newSwatch} : swatch,
                    );
                  }),
                );
              },
            },
            {
              label: "Step down %",
              min: 0,
              max: 50,
              step: 1,
              start: 0,
              connect: true,
              value: project.shades[index].saturationDownAmount,
              onChange: (value: number | number[]) => {
                const newSwatch = {
                  saturationDownAmount: typeof value === "number" ? value : 0,
                };
                service.execute(
                  updateProjectShadesCommand(project, ({shades}) => {
                    return shades.map((swatch, i) =>
                      index === i ? {...swatch, ...newSwatch} : swatch,
                    );
                  }),
                );
              },
            },
          ]}
        />

        <ColorSlider
          label="Desaturate"
          count={10}
          color={{
            default: formatHSL(project.shades[index].initColor),
          }}
          slider={[
            {
              label: "Step up %",
              min: 0,
              max: 50,
              step: 1,
              start: 0,
              connect: true,
              value: project.shades[index].desaturateUpAmount,
              onChange: (value: number | number[]) => {
                const newSwatch = {
                  desaturateUpAmount: typeof value === "number" ? value : 0,
                };
                service.execute(
                  updateProjectShadesCommand(project, ({shades}) => {
                    return shades.map((swatch, i) =>
                      index === i ? {...swatch, ...newSwatch} : swatch,
                    );
                  }),
                );
              },
            },
            {
              label: "Step down %",
              min: 0,
              max: 50,
              step: 1,
              start: 0,
              connect: true,
              value: project.shades[index].desaturateDownAmount,
              onChange: (value: number | number[]) => {
                const newSwatch = {
                  desaturateDownAmount: typeof value === "number" ? value : 0,
                };
                service.execute(
                  updateProjectShadesCommand(project, ({shades}) => {
                    return shades.map((swatch, i) =>
                      index === i ? {...swatch, ...newSwatch} : swatch,
                    );
                  }),
                );
              },
            },
          ]}
        />

        <ColorSlider
          centerMark={true}
          label="Hue"
          color={{
            default: formatHSL(project.shades[index].initColor),
          }}
          slider={[
            {
              label: "Hue shift",
              min: -20,
              max: 20,
              step: 1,
              start: 0,
              connect: true,
              value: project.shades[index].hueAmount,
              onChange: (value: number | number[]) => {
                const newSwatch = {
                  hueAmount: typeof value === "number" ? value : 0,
                };
                service.execute(
                  updateProjectShadesCommand(project, ({shades}) => {
                    return shades.map((swatch, i) =>
                      index === i ? {...swatch, ...newSwatch} : swatch,
                    );
                  }),
                );
              },
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ShadeControl;
