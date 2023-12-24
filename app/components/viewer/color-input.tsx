import {Popover, Transition} from "@headlessui/react";
import {Colorful} from "@uiw/react-color";
import chroma from "chroma-js";
import classNames from "classnames";
import {useAtom} from "jotai";
import {ChangeEvent, Fragment, useEffect, useId, useRef, useState} from "react";
import {projectsAtom} from "../../atom";
import {determineColorType, isValidColor} from "../../utilities";
import {UiPopover} from "../ui";

interface ColorInputProps {
  index: number;
}

const ColorInput = ({index}: ColorInputProps) => {
  const [projects, setProjects] = useAtom(projectsAtom);
  const [inputValue, setInputValue] = useState(projects.shades[index].initColor || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const uuid = useId();

  function handleColorChange(event: ChangeEvent<HTMLInputElement>) {
    const newColor = event.target.value;
    setInputValue(newColor);
    if (isValidColor(newColor)) {
      let colorHex = chroma(newColor).hex();
      const newSwatch = {initColor: colorHex};
      setProjects({
        ...projects,
        shades: projects.shades.map((swatch, i) =>
          index === i ? {...swatch, ...newSwatch} : swatch,
        ),
      });
    }
  }

  const isInputFocused = inputRef.current === document.activeElement;

  useEffect(() => {
    if (isInputFocused) return;
    setInputValue(projects.shades[index].initColor);
  }, [projects.shades, index]);

  return (
    <div className="shade-control-input flex-grow">
      <UiPopover
        placeOffset={16}
        placement="bottom-start"
        triggerClassName="flex items-center gap-1 justify-center"
        trigger={(isOpen) => (
          <>
            <button
              className="relative h-6 w-6 flex-shrink-0 place-self-center rounded-full hover:ring ring-primary-500/30"
              style={{
                backgroundColor: projects.shades[index].initColor,
              }}
            />
          </>
        )}
      >
        <Colorful
          disableAlpha={true}
          color={chroma(projects.shades[index].initColor).hex()}
          onChange={(e) => {
            const newSwatch = {
              initColor: e.hex,
            };
            setProjects({
              ...projects,
              shades: projects.shades.map((swatch, i) =>
                index === i ? {...swatch, ...newSwatch} : swatch,
              ),
            });
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
