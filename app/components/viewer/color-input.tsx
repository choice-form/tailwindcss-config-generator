import {Colorful} from "@uiw/react-color";
import chroma from "chroma-js";
import classNames from "classnames";
import {ChangeEvent, useEffect, useId, useRef, useState} from "react";
import {updateProjectShadesCommand} from "../../store/commands/update-project";
import {useService, useStore} from "../../store/provider";
import {determineColorType, isValidColor} from "../../utilities";
import {UiPopover} from "../ui";

interface ColorInputProps {
  index: number;
}

const ColorInput = ({index}: ColorInputProps) => {
  const service = useService();
  const project = useStore((state) => state.project);
  const [inputValue, setInputValue] = useState(project.shades[index].initColor || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const uuid = useId();

  function handleColorChange(event: ChangeEvent<HTMLInputElement>) {
    const newColor = event.target.value;
    setInputValue(newColor);
    if (isValidColor(newColor)) {
      let colorHex = chroma(newColor).hex();
      const newSwatch = {initColor: colorHex};

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
  }, [project.shades, index]);

  return (
    <div className="shade-control-input flex-grow">
      <UiPopover
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        placeOffset={16}
        placement="bottom-start"
        triggerClassName="flex items-center gap-1 justify-center"
        trigger={
          <button
            className="relative h-6 w-6 flex-shrink-0 place-self-center rounded-full ring-primary-500/30 hover:ring"
            style={{
              backgroundColor: project.shades[index].initColor,
            }}
          />
        }
      >
        <Colorful
          disableAlpha={true}
          color={chroma(project.shades[index].initColor).hex()}
          onChange={(e) => {
            const newSwatch = {
              initColor: e.hex,
            };
            service.execute(
              updateProjectShadesCommand(project, ({shades}) => {
                return shades.map((swatch, i) =>
                  index === i ? {...swatch, ...newSwatch} : swatch,
                );
              }),
            );
          }}
        />
      </UiPopover>
      <input
        id={uuid}
        ref={inputRef}
        type="text"
        placeholder="Enter hex"
        className={classNames(!isValidColor(inputValue) && "text-red-500")}
        value={inputValue}
        onChange={handleColorChange}
      />
      <label htmlFor={uuid} className="shade-control-badge">
        {determineColorType(inputValue)}
      </label>
    </div>
  );
};

export default ColorInput;
