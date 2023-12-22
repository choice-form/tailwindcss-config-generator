import React from "react";
import {useAtom} from "jotai";
import {shadesAtom} from "../../atom";
import {UiSlider} from "..";
import {ColorInput} from ".";

interface ShadeControlProps {
  index: number;
}

const ShadeControl = ({index}: ShadeControlProps) => {
  const [shadesState, setShadesState] = useAtom(shadesAtom);

  const handleRemoveSwatch = (i: number) => {
    setShadesState((prevState) => {
      const newState = [...prevState];
      newState.splice(i, 1);
      return newState;
    });
  };

  // function isValidColorToHex(color: string) {
  //   if (chroma.valid(color)) {
  //     return chroma(color).hex();
  //   }
  //   return null;
  // }

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="inline-flex items-center gap-2 self-start">
        <div className="shade-control-input">
          <button
            className="bg-white dark:bg-gray-600 hover:bg-primary-default hover:text-primary-readable-color flex h-6 w-6 flex-shrink-0 items-center justify-center place-self-center rounded-full text-xs"
            onClick={() => handleRemoveSwatch(index)}
          >
            <div className="ic-[e-delete]" />
          </button>
          <input
            type="text"
            value={shadesState[index].name}
            onChange={(e) =>
              setShadesState(
                shadesState.map((swatch, i) =>
                  index === i ? {...swatch, name: e.target.value} : swatch,
                ),
              )
            }
            placeholder="Enter name"
          />
        </div>
        <ColorInput index={index} />
      </div>

      <div className="inline-flex h-10 items-center gap-2 self-start rounded-full border px-3 text-xs flex-grow whitespace-nowrap dark:border-gray-700">
        <span>Lighten amount</span>
        <UiSlider
          min={10}
          max={50}
          step={1}
          start={10}
          connect={true}
          value={shadesState[index].lightenAmount}
          onChange={(value: number | number[]) => {
            const newSwatch = {
              lightenAmount: typeof value === "number" ? value : 10,
            };
            setShadesState(
              shadesState.map((swatch, i) => (index === i ? {...swatch, ...newSwatch} : swatch)),
            );
          }}
        />
        <span className="shade-control-badge">{shadesState[index].lightenAmount / 10 || 1}</span>

        <span>Darken amount</span>
        <UiSlider
          min={10}
          max={50}
          step={1}
          start={10}
          connect={true}
          value={shadesState[index].darkenAmount}
          onChange={(value: number | number[]) => {
            const newSwatch = {
              darkenAmount: typeof value === "number" ? value : 10,
            };
            setShadesState(
              shadesState.map((swatch, i) => (index === i ? {...swatch, ...newSwatch} : swatch)),
            );
          }}
        />
        <span className="shade-control-badge">{shadesState[index].darkenAmount / 10 || 1}</span>

        <span>Adjust hue</span>
        <UiSlider
          min={0}
          max={360}
          step={1}
          start={1}
          connect={true}
          value={shadesState[index].adjustHue}
          onChange={(value: number | number[]) => {
            const newSwatch = {
              adjustHue: typeof value === "number" ? value : 10,
            };
            setShadesState(
              shadesState.map((swatch, i) => (index === i ? {...swatch, ...newSwatch} : swatch)),
            );
          }}
        />
        <span className="shade-control-badge">{shadesState[index].adjustHue ?? 0}</span>
      </div>
    </div>
  );
};

export default ShadeControl;
