import {Input, Kbd} from "@nextui-org/react";
import {Colorful} from "@uiw/react-color";
import chroma from "chroma-js";
import classNames from "classnames";
import {create} from "mutative";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {updateProjectShadesCommand} from "../../store/commands/update-project";
import {useService, useStore} from "../../store/provider";
import {determineColorType, isValidColor, normalizeColorfulValue} from "../../utilities";
import {UiPopover} from "../ui";

interface ColorInputProps {
  index: number;
}

const ColorInput = ({index}: ColorInputProps) => {
  const service = useService();
  const project = useStore((state) => state.project);

  const [inputValue, setInputValue] = useState<string>(project.shades[index].initColor);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  function handleColorChange(event: ChangeEvent<HTMLInputElement>) {
    const newColor = event.target.value;
    setInputValue(newColor);
    if (isValidColor(newColor)) {
      const newSwatch = {initColor: newColor};

      service.execute(
        updateProjectShadesCommand(project, ({shades}) => {
          return shades.map((swatch, i) => (index === i ? {...swatch, ...newSwatch} : swatch));
        }),
      );
    }
  }

  const isInputFocused = inputRef.current === document.activeElement;

  useEffect(() => {
    if (isInputFocused) return;
    setInputValue(project.shades[index].initColor);
  }, [project.shades]);

  const initColorRef = useRef<string | null>(null);

  return (
    <Input
      ref={inputRef}
      classNames={{
        inputWrapper: "px-2",
      }}
      labelPlacement="outside"
      placeholder="Enter color"
      value={inputValue}
      onChange={handleColorChange}
      startContent={
        <UiPopover
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          placement="bottom-start"
          placeOffset={16}
          className="rounded-lg shadow-xl ring-1 ring-black/10"
          triggerClassName="flex"
          trigger={
            <button
              className={classNames(
                "relative h-6 w-6 flex-shrink-0 place-self-center rounded-small border !opacity-100",
                isValidColor(inputValue) && chroma(inputValue).luminance() > 0.5
                  ? "border-black/30 dark:border-transparent"
                  : "border-transparent dark:border-white/30",
              )}
              style={{
                backgroundColor: chroma(project.shades[index].initColor).hex(),
              }}
            />
          }
        >
          <Colorful
            disableAlpha={true}
            color={normalizeColorfulValue(chroma(project.shades[index].initColor).hex())}
            onPointerDown={() => {
              initColorRef.current = project.shades[index].initColor;
            }}
            onPointerUp={() => {
              const [draft, finalize] = create(project.shades);
              draft[index].initColor = initColorRef.current!;
              service.execute({
                prev: {project: {shades: finalize()}},
                next: {project: {shades: project.shades}},
              });
            }}
            onChange={(e) => {
              const [draft, finalize] = create(project.shades);
              draft[index].initColor = e.hex;
              service.patch({project: {shades: finalize()}});
            }}
          />
        </UiPopover>
      }
      endContent={<Kbd className="uppercase">{determineColorType(inputValue)}</Kbd>}
    />
  );
};

export default ColorInput;
