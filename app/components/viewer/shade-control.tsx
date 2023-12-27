import {useEffect, useState, useRef} from "react";
import {ColorInput, ColorSlider} from ".";
import {updateProjectShadesCommand} from "../../store/commands/update-project";
import {useService, useStore} from "../../store/provider";
import {create} from "mutative";

interface ShadeControlProps {
  index: number;
}

const ShadeControl = ({index}: ShadeControlProps) => {
  const service = useService();
  const project = useStore((state) => state.project);

  const [nameCheck, setNameCheck] = useState<string>("");

  const lightnessStepUp = useRef<number>(20);
  const lightnessStepDown = useRef<number>(20);
  const saturationStepUp = useRef<number>(0);
  const saturationStepDown = useRef<number>(0);
  const desaturatedStepUp = useRef<number>(0);
  const desaturatedStepDown = useRef<number>(0);
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
              value={project.shades[index].name}
              onBlur={(e) => {
                handleNameChange(e.target.value);
              }}
              onChange={(e) => {
                handleNameChange(e.target.value);
              }}
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
          slider={[
            {
              label: "Step up %",
              min: 10,
              max: 50,
              step: 1,
              start: 20,
              connect: true,
              value: project.shades[index].lightenAmount,
              onPointerDown: () => {
                lightnessStepUp.current = project.shades[index].lightenAmount;
              },
              onPointerUp: () => {
                const [draft, finalize] = create(project.shades);
                draft[index].lightenAmount = lightnessStepUp.current!;
                service.execute({
                  prev: {project: {shades: finalize()}},
                  next: {project: {shades: project.shades}},
                });
              },
              onChange: (value: number | number[]) => {
                const [draft, finalize] = create(project.shades);
                draft[index].lightenAmount = typeof value === "number" ? value : 20;
                service.patch({project: {shades: finalize()}});
              },
            },
            {
              label: "Step down %",
              min: 10,
              max: 50,
              step: 1,
              start: 20,
              connect: true,
              value: project.shades[index].darkenAmount,
              onPointerDown: () => {
                lightnessStepDown.current = project.shades[index].darkenAmount;
              },
              onPointerUp: () => {
                const [draft, finalize] = create(project.shades);
                draft[index].darkenAmount = lightnessStepDown.current!;
                service.execute({
                  prev: {project: {shades: finalize()}},
                  next: {project: {shades: project.shades}},
                });
              },
              onChange: (value: number | number[]) => {
                const [draft, finalize] = create(project.shades);
                draft[index].darkenAmount = typeof value === "number" ? value : 20;
                service.patch({project: {shades: finalize()}});
              },
            },
          ]}
        />

        <ColorSlider
          label="Saturation"
          count={10}
          slider={[
            {
              label: "Step up %",
              min: 0,
              max: 50,
              step: 1,
              start: 0,
              connect: true,
              value: project.shades[index].saturationUpAmount,
              onPointerDown: () => {
                saturationStepUp.current = project.shades[index].saturationUpAmount;
              },
              onPointerUp: () => {
                const [draft, finalize] = create(project.shades);
                draft[index].saturationUpAmount = saturationStepUp.current!;
                service.execute({
                  prev: {project: {shades: finalize()}},
                  next: {project: {shades: project.shades}},
                });
              },
              onChange: (value: number | number[]) => {
                const [draft, finalize] = create(project.shades);
                draft[index].saturationUpAmount = typeof value === "number" ? value : 0;
                service.patch({project: {shades: finalize()}});
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
              onPointerDown: () => {
                saturationStepDown.current = project.shades[index].saturationDownAmount;
              },
              onPointerUp: () => {
                const [draft, finalize] = create(project.shades);
                draft[index].saturationDownAmount = saturationStepDown.current!;
                service.execute({
                  prev: {project: {shades: finalize()}},
                  next: {project: {shades: project.shades}},
                });
              },
              onChange: (value: number | number[]) => {
                const [draft, finalize] = create(project.shades);
                draft[index].saturationDownAmount = typeof value === "number" ? value : 0;
                service.patch({project: {shades: finalize()}});
              },
            },
          ]}
        />

        <ColorSlider
          label="Desaturate"
          count={10}
          slider={[
            {
              label: "Step up %",
              min: 0,
              max: 50,
              step: 1,
              start: 0,
              connect: true,
              value: project.shades[index].desaturateUpAmount,
              onPointerDown: () => {
                desaturatedStepUp.current = project.shades[index].desaturateUpAmount;
              },
              onPointerUp: () => {
                const [draft, finalize] = create(project.shades);
                draft[index].desaturateUpAmount = desaturatedStepUp.current!;
                service.execute({
                  prev: {project: {shades: finalize()}},
                  next: {project: {shades: project.shades}},
                });
              },
              onChange: (value: number | number[]) => {
                const [draft, finalize] = create(project.shades);
                draft[index].desaturateUpAmount = typeof value === "number" ? value : 0;
                service.patch({project: {shades: finalize()}});
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
              onPointerDown: () => {
                desaturatedStepDown.current = project.shades[index].desaturateDownAmount;
              },
              onPointerUp: () => {
                const [draft, finalize] = create(project.shades);
                draft[index].desaturateDownAmount = desaturatedStepDown.current!;
                service.execute({
                  prev: {project: {shades: finalize()}},
                  next: {project: {shades: project.shades}},
                });
              },
              onChange: (value: number | number[]) => {
                const [draft, finalize] = create(project.shades);
                draft[index].desaturateDownAmount = typeof value === "number" ? value : 0;
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
              min: -20,
              max: 20,
              step: 1,
              start: 0,
              connect: true,
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
                draft[index].hueAmount = typeof value === "number" ? value : 0;
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
