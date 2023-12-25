import {useEffect, useState} from "react";
import {ColorInput, ColorSlider} from ".";
import {updateProjectShadesCommand} from "../../store/commands/update-project";
import {useService, useStore} from "../../store/provider";
import {formatHSL} from "../../utilities";

interface ShadeControlProps {
  index: number;
}

const ShadeControl = ({index}: ShadeControlProps) => {
  const service = useService();
  const project = useStore((state) => state.project);

  const [tempName, setTempName] = useState(project.shades[index].name);
  const [nameCheck, setNameCheck] = useState<string>("");

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
    <div className="mb-1 grid grid-cols-1 items-center gap-2 @5xl:grid-cols-[auto_1fr]">
      <div className="grid flex-wrap items-center gap-2 self-start @2xl:grid-cols-2">
        <div className="shade-control-input flex-grow">
          <button
            className="flex h-6 w-6 flex-shrink-0 items-center
            justify-center place-self-center rounded-full border border-gray-200 bg-white text-xs hover:bg-primary
            hover:text-primary-readable-color dark:border-gray-600 dark:bg-gray-600"
            onClick={() => handleRemoveSwatch(index)}
          >
            <div className="ic-[e-delete]" />
          </button>
          <div className="relative flex flex-grow">
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

      <div className="grid flex-1 gap-2 @lg:grid-cols-1 @xl:w-full @xl:grid-cols-2 @2xl:grid-cols-4">
        <ColorSlider
          label="Lightness"
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
