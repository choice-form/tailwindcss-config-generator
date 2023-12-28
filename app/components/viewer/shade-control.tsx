import {useEffect, useState, useRef} from "react";
import {ColorInput, ColorSlider} from ".";
import {updateProjectShadesCommand} from "../../store/commands/update-project";
import {useService, useStore} from "../../store/provider";
import {create} from "mutative";
import {Button, Input, Tooltip} from "@nextui-org/react";

interface ShadeControlProps {
  index: number;
}

const ShadeControl = ({index}: ShadeControlProps) => {
  const service = useService();
  const project = useStore((state) => state.project);

  const [nameCheck, setNameCheck] = useState<string>("");

  const luminanceAmount = useRef<number[]>([0, 1]);
  const saturationAmount = useRef<number[]>([0, 1]);
  const desaturateAmount = useRef<number[]>([0, 1]);
  const hueStep = useRef<number>(0);

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
            inputWrapper: "px-2",
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

      <div className="grid flex-1 gap-2 @lg:grid-cols-1 @xl:w-full @xl:grid-cols-2 @2xl:grid-cols-4">
        <ColorSlider
          label="Lightness"
          slider={[
            {
              label: "Lightness",
              min: 0,
              max: 1,
              step: 0.01,
              defaultValue: [0, 1],
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

        <ColorSlider
          label="Saturation"
          slider={[
            {
              label: "Saturation",
              min: 0,
              max: 1,
              step: 0.01,
              defaultValue: [0, 1],
              value: project.shades[index].saturationAmount,
              onPointerDown: () => {
                saturationAmount.current = project.shades[index].saturationAmount;
              },
              onPointerUp: () => {
                const [draft, finalize] = create(project.shades);
                draft[index].saturationAmount = saturationAmount.current!;
                service.execute({
                  prev: {project: {shades: finalize()}},
                  next: {project: {shades: project.shades}},
                });
              },
              onChange: (value: number | number[]) => {
                const [draft, finalize] = create(project.shades);
                draft[index].saturationAmount = value as number[];
                service.patch({project: {shades: finalize()}});
              },
            },
          ]}
        />

        <ColorSlider
          label="Desaturate"
          slider={[
            {
              label: "Desaturate",
              min: 0,
              max: 1,
              step: 0.01,
              defaultValue: [0, 1],
              value: project.shades[index].desaturateAmount,
              onPointerDown: () => {
                desaturateAmount.current = project.shades[index].desaturateAmount;
              },
              onPointerUp: () => {
                const [draft, finalize] = create(project.shades);
                draft[index].desaturateAmount = desaturateAmount.current!;
                service.execute({
                  prev: {project: {shades: finalize()}},
                  next: {project: {shades: project.shades}},
                });
              },
              onChange: (value: number | number[]) => {
                const [draft, finalize] = create(project.shades);
                draft[index].desaturateAmount = value as number[];
                service.patch({project: {shades: finalize()}});
              },
            },
          ]}
        />

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
