import React from "react";
import {useAtom} from "jotai";
import {shadesAtom} from "../../atom";
import {UiSlider} from "..";
import {ColorInput} from ".";
import classNames from "classnames";

interface ShadeControlProps {
  index: number;
  isMobile: boolean;
}

const ShadeControl = ({index, isMobile}: ShadeControlProps) => {
  const [shadesState, setShadesState] = useAtom(shadesAtom);

  const handleRemoveSwatch = (i: number) => {
    setShadesState((prevState) => {
      const newState = [...prevState];
      newState.splice(i, 1);
      return newState;
    });
  };

  return (
    <div className={classNames("flex items-center flex-wrap", isMobile ? "gap-2" : "gap-4")}>
      <div className="inline-flex items-center gap-2 self-start flex-wrap">
        <div className="shade-control-input flex-grow">
          <button
            className="bg-white border dark:bg-gray-600 hover:bg-primary hover:text-primary-readable-color flex h-6 w-6 flex-shrink-0 items-center justify-center place-self-center rounded-full text-xs"
            onClick={() => handleRemoveSwatch(index)}
          >
            <div className="ic-[e-delete]" />
          </button>
          <input
            className="flex-grow"
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

      <div
        className={classNames(
          "inline-flex min-h-10 gap-3 self-start py-2 text-xs flex-grow whitespace-nowrap dark:border-gray-700",
          isMobile ? "flex-col items-stretch" : "rounded-full border px-3 flex-wrap items-center",
        )}
      >
        <div className="flex items-center gap-2 flex-grow">
          <span>Lighten amount</span>
          <UiSlider
            className="min-w-10"
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
        </div>

        <div className="flex items-center gap-2 flex-grow">
          <span>Darken amount</span>
          <UiSlider
            className="min-w-10"
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
        </div>

        <div className="flex items-center gap-2 flex-grow">
          <span>Adjust hue</span>
          <UiSlider
            className="min-w-10"
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
    </div>
  );
};

export default ShadeControl;
