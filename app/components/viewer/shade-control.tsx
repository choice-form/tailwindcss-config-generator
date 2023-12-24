import classNames from "classnames";
import {useAtom, useAtomValue} from "jotai";
import {ColorInput} from ".";
import {containerWidthAtom, projectsAtom} from "../../atom";
import {UiPopover, UiSlider} from "../ui";
import {useState, useEffect, Fragment} from "react";
import {formatHSL} from "../../utilities";

interface ShadeControlProps {
  index: number;
}

const Slider = ({
  label,
  slider,
  count,
  color,
  centerMark,
}: {
  label?: string;
  count?: number;
  color?: {
    default: string;
  };
  centerMark?: boolean;
  slider: {
    label?: string;
    min: number;
    max: number;
    step: number;
    start: number;
    value: number;
    onChange: any;
    connect: boolean;
  }[];
}) => {
  const colorStyle = {
    "--color-default": color?.default,
  } as React.CSSProperties;

  return (
    <UiPopover
      triggerClassName="flex-1 flex"
      className="w-64 bg-gray-900/80 text-white dark:bg-white/80 dark:text-gray-900 backdrop-blur
      p-4 rounded-lg grid grid-cols-[auto_1fr] text-xs gap-2 items-center"
      style={colorStyle}
      trigger={(isOpen) => (
        <>
          <button
            className={classNames(
              "shade-control-input flex-1 text-sm",
              isOpen && "!border-primary !bg-white dark:!bg-gray-900",
            )}
          >
            <span className="opacity-60 flex-1 text-left">{label}:</span>
            <span
              className="whitespace-nowrap"
              style={{
                width: `calc(2rem * ${slider.length})`,
              }}
            >
              {slider.length > 1
                ? `[${slider.map((s) => (s.value ?? s.start) / (count || 1)).join(", ")}]`
                : slider.map((s) => (s.value ?? s.start) / (count || 1)).join(", ")}
            </span>
          </button>
        </>
      )}
    >
      <>
        {slider.map((s, i) => (
          <Fragment key={i}>
            <span className="whitespace-nowrap">{s.label}</span>
            <UiSlider
              className={classNames(
                "min-w-10",
                centerMark &&
                  "before:w-px before:h-full before:bg-white before:absolute before:top-1/2 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2",
              )}
              customClassNames={{
                track: "bg-white/20 dark:bg-black/20 overflow-hidden rounded-full",
                thumb:
                  "cursor-pointer rounded-full bg-white shadow ring-2 absolute top-0 h-[var(--slider-thumb)] w-[var(--slider-thumb)]",
              }}
              min={s.min}
              max={s.max}
              step={s.step}
              start={s.start}
              connect={s.connect}
              value={s.value}
              onChange={s.onChange}
            />
          </Fragment>
        ))}
      </>
    </UiPopover>
  );
};

const ShadeControl = ({index}: ShadeControlProps) => {
  const [projects, setProjects] = useAtom(projectsAtom);
  const [tempName, setTempName] = useState(projects.shades[index].name);
  const [nameCheck, setNameCheck] = useState<string>("");
  const containerWidth = useAtomValue(containerWidthAtom);

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
    <div
      className={classNames(
        "flex items-center flex-wrap",
        containerWidth === "md" ? "gap-2 flex-col" : "gap-4",
      )}
    >
      <div
        className={classNames(
          "items-center gap-2 self-start flex-wrap",
          containerWidth === "md" ? "grid grid-cols-2 w-full" : "inline-flex",
          containerWidth === "sm" ? "grid w-full" : "inline-flex",
        )}
      >
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
          "flex-1 gap-2",
          containerWidth === "md" ? "grid grid-cols-2 w-full" : "flex",
          containerWidth === "sm" ? "grid w-full" : "flex",
        )}
      >
        <Slider
          label="lightness"
          count={10}
          color={{
            default: formatHSL(projects.shades[index].initColor),
          }}
          slider={[
            {
              label: "Step up %",
              min: 10,
              max: 50,
              step: 1,
              start: 10,
              connect: true,
              value: projects.shades[index].lightenAmount,
              onChange: (value: number | number[]) => {
                const newSwatch = {
                  lightenAmount: typeof value === "number" ? value : 10,
                };
                setProjects({
                  ...projects,
                  shades: projects.shades.map((swatch, i) =>
                    index === i ? {...swatch, ...newSwatch} : swatch,
                  ),
                });
              },
            },
            {
              label: "Step down %",
              min: 10,
              max: 50,
              step: 1,
              start: 10,
              connect: true,
              value: projects.shades[index].darkenAmount,
              onChange: (value: number | number[]) => {
                const newSwatch = {
                  darkenAmount: typeof value === "number" ? value : 10,
                };
                setProjects({
                  ...projects,
                  shades: projects.shades.map((swatch, i) =>
                    index === i ? {...swatch, ...newSwatch} : swatch,
                  ),
                });
              },
            },
          ]}
        />

        <Slider
          label="Saturation"
          count={10}
          color={{
            default: formatHSL(projects.shades[index].initColor),
          }}
          slider={[
            {
              label: "Step up %",
              min: 0,
              max: 50,
              step: 1,
              start: 0,
              connect: true,
              value: projects.shades[index].saturationUpAmount,
              onChange: (value: number | number[]) => {
                const newSwatch = {
                  saturationUpAmount: typeof value === "number" ? value : 0,
                };
                setProjects({
                  ...projects,
                  shades: projects.shades.map((swatch, i) =>
                    index === i ? {...swatch, ...newSwatch} : swatch,
                  ),
                });
              },
            },
            {
              label: "Step down %",
              min: 0,
              max: 50,
              step: 1,
              start: 0,
              connect: true,
              value: projects.shades[index].saturationDownAmount,
              onChange: (value: number | number[]) => {
                const newSwatch = {
                  saturationDownAmount: typeof value === "number" ? value : 0,
                };
                setProjects({
                  ...projects,
                  shades: projects.shades.map((swatch, i) =>
                    index === i ? {...swatch, ...newSwatch} : swatch,
                  ),
                });
              },
            },
          ]}
        />

        <Slider
          label="Desaturate"
          count={10}
          color={{
            default: formatHSL(projects.shades[index].initColor),
          }}
          slider={[
            {
              label: "Step up %",
              min: 0,
              max: 50,
              step: 1,
              start: 0,
              connect: true,
              value: projects.shades[index].desaturateUpAmount,
              onChange: (value: number | number[]) => {
                const newSwatch = {
                  desaturateUpAmount: typeof value === "number" ? value : 0,
                };
                setProjects({
                  ...projects,
                  shades: projects.shades.map((swatch, i) =>
                    index === i ? {...swatch, ...newSwatch} : swatch,
                  ),
                });
              },
            },
            {
              label: "Step down %",
              min: 0,
              max: 50,
              step: 1,
              start: 0,
              connect: true,
              value: projects.shades[index].desaturateDownAmount,
              onChange: (value: number | number[]) => {
                const newSwatch = {
                  desaturateDownAmount: typeof value === "number" ? value : 0,
                };
                setProjects({
                  ...projects,
                  shades: projects.shades.map((swatch, i) =>
                    index === i ? {...swatch, ...newSwatch} : swatch,
                  ),
                });
              },
            },
          ]}
        />

        <Slider
          label="Hue"
          color={{
            default: formatHSL(projects.shades[index].initColor),
          }}
          slider={[
            {
              label: "Hue shift",
              min: -20,
              max: 20,
              step: 1,
              start: 0,
              connect: true,
              value: projects.shades[index].hueAmount,
              onChange: (value: number | number[]) => {
                const newSwatch = {
                  hueAmount: typeof value === "number" ? value : 0,
                };
                setProjects({
                  ...projects,
                  shades: projects.shades.map((swatch, i) =>
                    index === i ? {...swatch, ...newSwatch} : swatch,
                  ),
                });
              },
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ShadeControl;
