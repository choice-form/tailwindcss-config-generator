import {useEffect, useState, useRef} from "react";
import {ColorInput, ColorSlider} from ".";
import {updateProjectShadesCommand} from "../../store/commands/update-project";
import {useService, useStore} from "../../store/provider";
import {create} from "mutative";
import {Button, Input, Kbd, Tooltip} from "@nextui-org/react";
import {UiPopover} from "../ui";
import classNames from "classnames";
import {scaleModeType} from "../../type";

interface ShadeControlProps {
  index: number;
}

const scaleModeOptions = [
  "rgb",
  "hsl",
  "hsv",
  "hsi",
  "lab",
  "oklab",
  "lch",
  "oklch",
  "hcl",
  "lrgb",
];

const ShadeControl = ({index}: ShadeControlProps) => {
  const service = useService();
  const project = useStore((state) => state.project);

  const [nameCheck, setNameCheck] = useState<string>("");

  const luminanceAmount = useRef<number[]>([0, 1]);
  const saturationAmount = useRef<number[]>([0, 1]);
  const desaturateAmount = useRef<number[]>([0, 1]);
  const hueStep = useRef<number>(0);
  const scaleMode = useRef<scaleModeType>("rgb");
  const scaleCorrectLightness = useRef<boolean>(false);

  const [isOpen, setIsOpen] = useState(false);

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

  const handleNameChange = (newName: string) => {
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

    service.execute(
      updateProjectShadesCommand(project, ({shades}) => {
        return shades.map((swatch, i) => (index === i ? {...swatch, name: newName} : swatch));
      }),
    );
  };

  return (
    <div className="mb-1 grid grid-cols-1 items-center gap-2 @5xl:grid-cols-[auto_1fr]">
      <div className="grid flex-wrap items-center gap-2 self-start @2xl:grid-cols-[auto_1fr]">
        <Input
          classNames={{
            mainWrapper: "relative",
            inputWrapper: "px-2",
            helperWrapper: "absolute h-0 -top-6 whitespace-nowrap left-0 text-xs text-danger-500",
          }}
          labelPlacement="outside"
          placeholder="Enter name"
          value={project.shades[index].name}
          onChange={(e) => {
            handleNameChange(e.target.value);
          }}
          startContent={
            <Tooltip content="Delete shade" delay={500}>
              <Button
                className="h-6 w-6 min-w-6"
                size="sm"
                isIconOnly
                startContent={<div className="ic-[e-delete]" />}
                onPress={() => handleRemoveSwatch(index)}
              />
            </Tooltip>
          }
          description={nameCheck}
        />

        <ColorInput index={index} />
      </div>

      <div
        className="grid flex-1 gap-2 @lg:grid-cols-1 @xl:w-full @xl:grid-cols-2 @2xl:grid-cols-[1fr_1fr_1fr_auto]
        "
      >
        <ColorSlider
          label="Lightness"
          slider={[
            {
              label: "Lightness",
              min: 0,
              max: 1,
              step: 0.01,
              defaultValue: [0.04, 0.98],
              value: project.shades[index].luminanceAmount,
              onPointerDown: () => {
                luminanceAmount.current = project.shades[index].luminanceAmount;
              },
              onPointerUp: () => {
                const [draft, finalize] = create(project.shades);
                draft[index].luminanceAmount = luminanceAmount.current!;
                service.execute({
                  prev: {project: {shades: finalize()}},
                  next: {project: {shades: project.shades}},
                });
              },
              onChange: (value: number | number[]) => {
                const [draft, finalize] = create(project.shades);
                draft[index].luminanceAmount = value as number[];
                service.patch({project: {shades: finalize()}});
              },
            },
          ]}
        />

        <UiPopover
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          placement="bottom"
          className={classNames([
            "z-50 bg-background",
            "grid w-64 grid-cols-4 gap-2",
            "rounded-lg p-4 text-xs",
            "shadow-xl ring-1 ring-black/5",
          ])}
          triggerClassName="w-full min-w-0"
          trigger={
            <Button
              className="w-full min-w-0 bg-default-100 pr-2"
              onPress={() => setIsOpen(!isOpen)}
            >
              <span className="min-w-0 flex-1 truncate text-left opacity-60">Mode:</span>
              <Kbd className="uppercase">{project.shades[index].scaleMode ?? "rgb"}</Kbd>
            </Button>
          }
        >
          {scaleModeOptions.map((mode, i) => (
            <Button
              key={i}
              className="w-full min-w-0 uppercase"
              size="sm"
              variant={mode === project.shades[index].scaleMode ? "solid" : "light"}
              onPointerDown={() => {
                scaleMode.current = project.shades[index].scaleMode;
              }}
              onPointerUp={() => {
                const [draft, finalize] = create(project.shades);
                draft[index].scaleMode = scaleMode.current!;
                service.execute({
                  prev: {project: {shades: finalize()}},
                  next: {project: {shades: project.shades}},
                });
              }}
              onPress={() => {
                {
                  const [draft, finalize] = create(project.shades);
                  draft[index].scaleMode = mode as scaleModeType;
                  service.patch({project: {shades: finalize()}});
                }
                setIsOpen(false);
              }}
            >
              {mode}
            </Button>
          ))}
        </UiPopover>

        <Button
          className="w-full min-w-0 bg-default-100 pr-2"
          onPress={() => {
            const [draft, finalize] = create(project.shades);
            draft[index].scaleCorrectLightness = !project.shades[index].scaleCorrectLightness;
            service.execute({
              prev: {project: {shades: project.shades}},
              next: {project: {shades: finalize()}},
            });
          }}
        >
          <span className="min-w-0 flex-1 truncate text-left opacity-60">Correct lightness:</span>
          <Kbd
            className={classNames(
              "uppercase",
              project.shades[index].scaleCorrectLightness && "text-success-500",
            )}
          >
            {project.shades[index].scaleCorrectLightness ? "true" : "false"}
          </Kbd>
        </Button>

        <ColorSlider
          centerMark={true}
          label="Hue"
          slider={[
            {
              label: "Hue shift",
              min: -45,
              max: 45,
              step: 1,
              defaultValue: 0,
              fillOffset: 0,
              value: project.shades[index].hueAmount,
              onPointerDown: () => {
                hueStep.current = project.shades[index].hueAmount;
              },
              onPointerUp: () => {
                const [draft, finalize] = create(project.shades);
                draft[index].hueAmount = hueStep.current!;
                service.execute({
                  prev: {project: {shades: finalize()}},
                  next: {project: {shades: project.shades}},
                });
              },
              onChange: (value: number | number[]) => {
                const [draft, finalize] = create(project.shades);
                draft[index].hueAmount = value as number;
                service.patch({project: {shades: finalize()}});
              },
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ShadeControl;
