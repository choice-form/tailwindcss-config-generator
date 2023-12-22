import {Popover, Transition} from "@headlessui/react";
import {Colorful} from "@uiw/react-color";
import chroma from "chroma-js";
import classNames from "classnames";
import {ChangeEvent, Fragment, useRef, useState, useEffect, useId} from "react";
import {useAtom} from "jotai";
import {shadesAtom} from "../../atom";
import {isValidColor, determineColorType} from "../../utilities";

interface ColorInputProps {
  index: number;
}

const ColorInput = ({index}: ColorInputProps) => {
  const [shadesState, setShadesState] = useAtom(shadesAtom);
  const [inputValue, setInputValue] = useState(shadesState[index].value || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const uuid = useId();

  function handleColorChange(event: ChangeEvent<HTMLInputElement>) {
    const newColor = event.target.value;
    setInputValue(newColor);
    if (isValidColor(newColor)) {
      let colorHex = chroma(newColor).hex();
      const newSwatch = {value: colorHex};
      setShadesState(
        shadesState.map((swatch, i) => (index === i ? {...swatch, ...newSwatch} : swatch)),
      );
    }
  }

  const isInputFocused = inputRef.current === document.activeElement;

  useEffect(() => {
    if (isInputFocused) return;
    setInputValue(shadesState[index].value);
  }, [shadesState, index]);
  return (
    <div className="flex items-center gap-2">
      <div className="shade-control-input">
        <Popover className="flex">
          {({open}) => (
            <>
              <Popover.Button
                className="relative h-6 w-6 flex-shrink-0 place-self-center rounded-full hover:ring ring-primary-500/30"
                style={{
                  backgroundColor: shadesState[index].value,
                }}
              />
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Popover.Panel className="absolute mt-8 z-50">
                  <Colorful
                    disableAlpha={true}
                    color={chroma(shadesState[index].value).hex()}
                    onChange={(e) => {
                      const newSwatch = {
                        value: e.hex,
                      };
                      setShadesState(
                        shadesState.map((swatch, i) =>
                          index === i ? {...swatch, ...newSwatch} : swatch,
                        ),
                      );
                    }}
                  />
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
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
    </div>
  );
};

export default ColorInput;
