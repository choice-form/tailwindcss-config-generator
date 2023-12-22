import React from "react";
import { useAtom } from "jotai";
import { shadesAtom } from "../atom";
import { UiSlider } from ".";
import { useState, Fragment } from "react";
import { Colorful } from "@uiw/react-color";
import { Popover, Transition } from "@headlessui/react";
import chroma from "chroma-js";

interface ShadeControlProps {
  index: number;
}

const ShadeControl = ({ index }: ShadeControlProps) => {
  const [shadesState, setShadesState] = useAtom(shadesAtom);

  const handleRemoveSwatch = (i: number) => {
    setShadesState((prevState) => {
      const newState = [...prevState];
      newState.splice(i, 1);
      return newState;
    });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="inline-flex h-10 items-center gap-2 self-start rounded-full border px-1">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className="relative h-8 w-8 flex-shrink-0 place-self-center rounded-full hover:ring"
                style={{
                  backgroundColor: shadesState[index].value,
                }}
              />
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Popover.Panel className="absolute z-50">
                  <Colorful
                    disableAlpha={true}
                    color={shadesState[index].value}
                    onChange={(e) => {
                      const newSwatch = {
                        value: e.hex,
                      };
                      setShadesState(
                        shadesState.map((swatch, i) =>
                          index === i ? { ...swatch, ...newSwatch } : swatch
                        )
                      );
                    }}
                  />
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>

        <input
          type="text"
          className="text hover:bg-light-100 flex h-8 items-center rounded-full px-3 text-center font-bold"
          value={shadesState[index].value}
          onChange={(e) => {
            const newSwatch = {
              value: chroma(e.target.value).hex(),
            };
            setShadesState(
              shadesState.map((swatch, i) =>
                index === i ? { ...swatch, ...newSwatch } : swatch
              )
            );
          }}
          placeholder="Enter hex"
        />

        <input
          className="text hover:bg-light-100 flex h-8 items-center rounded-full px-3 text-center font-bold"
          type="text"
          value={shadesState[index].name}
          onChange={(e) =>
            setShadesState(
              shadesState.map((swatch, i) =>
                index === i ? { ...swatch, name: e.target.value } : swatch
              )
            )
          }
          placeholder="Enter name"
        />
        <button
          className="bg-light-100 hover:bg-light-200 flex h-8 w-8 flex-shrink-0 items-center justify-center place-self-center rounded-full border text-xs"
          onClick={() => handleRemoveSwatch(index)}
        >
          <div className="ic-[e-delete]" />
        </button>
      </div>
      <div className="inline-flex h-10 items-center gap-2 self-start rounded-full border px-2 text-xs">
        <strong>Lighten amount</strong>
        <UiSlider
          min={0}
          max={100}
          step={1}
          start={0}
          connect={true}
          value={shadesState[index].lightenAmount}
          onChange={(value: number | number[]) => {
            const newSwatch = {
              lightenAmount: typeof value === "number" ? value : 0,
            };
            setShadesState(
              shadesState.map((swatch, i) =>
                index === i ? { ...swatch, ...newSwatch } : swatch
              )
            );
          }}
        />
        <span>{shadesState[index].lightenAmount ?? 18}</span>

        <strong>Darken amount</strong>
        <UiSlider
          min={0}
          max={100}
          step={1}
          start={0}
          connect={true}
          value={shadesState[index].darkenAmount}
          onChange={(value: number | number[]) => {
            const newSwatch = {
              darkenAmount: typeof value === "number" ? value : 0,
            };
            setShadesState(
              shadesState.map((swatch, i) =>
                index === i ? { ...swatch, ...newSwatch } : swatch
              )
            );
          }}
        />
        <span>{shadesState[index].darkenAmount ?? 18}</span>

        <strong>Adjust hue</strong>
        <UiSlider
          min={0}
          max={100}
          step={1}
          start={0}
          connect={true}
          value={shadesState[index].adjustHue}
          onChange={(value: number | number[]) => {
            const newSwatch = {
              adjustHue: typeof value === "number" ? value : 0,
            };
            setShadesState(
              shadesState.map((swatch, i) =>
                index === i ? { ...swatch, ...newSwatch } : swatch
              )
            );
          }}
        />
        <span>{shadesState[index].adjustHue ?? 0}</span>
      </div>
    </div>
  );
};

export default ShadeControl;
