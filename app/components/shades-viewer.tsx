"use client";
import chroma from "chroma-js";
import classNames from "classnames";
import { useAtom, useAtomValue } from "jotai";
import { Fragment, useState } from "react";
import { darkenWarningAtom, luminanceWarningAtom, shadesAtom } from "../atom";
import { SwatchProps } from "../swatch";
import { generateShades } from "../swatch/generateShades";
import readableColor from "../utilities/readable-color";
import ShadeControl from "./shade-control";

interface ShadesViewerProps {
  shadesObject: ReturnType<typeof generateShades>;
}

const ShadesViewer = ({ shadesObject }: ShadesViewerProps) => {
  const [name, setName] = useState("primary");
  const [shadesState, setShadesState] = useAtom(shadesAtom);
  const luminanceWarningState = useAtomValue(luminanceWarningAtom);
  const darkenWarningState = useAtomValue(darkenWarningAtom);

  const handleAddSwatch = () => {
    const newSwatch = {
      name: name,
      value: "#0055ff",
    };
    setShadesState(
      (prevState) => [...prevState, newSwatch] as SwatchProps["swatch"]
    );
    setName((prevState) => `${prevState}+`);
  };

  return (
    <div className="flex flex-grow flex-col gap-4 p-8">
      <header className="col-span-4 flex items-center gap-4 border-b px-4 py-2">
        <button
          className="bg-light-100 hover:bg-light-200 flex items-center gap-1 rounded px-3 py-2 text-xs"
          onClick={handleAddSwatch}
        >
          <div className="ic-[e-add]" />
          Add swatch
        </button>

        {Object.entries(shadesObject).map(
          ([_, shades]) =>
            shades.DEFAULT === undefined && (
              <span className="whitespace-nowrap text-xs">
                The DEFAULT color is out of range
              </span>
            )
        )}
      </header>
      <div className="flex flex-col gap-6 flex-1">
        {Object.entries(shadesObject).map(([_, shades], i) => {
          return (
            <Fragment key={i}>
              <ShadeControl index={i} />
              <div className="flex gap-2">
                {Object.entries(shades)
                  .filter(([shadeName]) => shadeName !== "DEFAULT")
                  .map(([shadeName, shadeValue], j) => {
                    const shadeValueColor = chroma(`hsl(${shadeValue})`);
                    const defaultShadeValue =
                      shadeValueColor.hex() === shadesState[i].value;

                    const luminanceWarning =
                      luminanceWarningState &&
                      shadeValueColor.luminance() > 0.9;

                    const darkenWarning =
                      darkenWarningState && shadeValueColor.luminance() < 0.01;

                    return (
                      <>
                        <div
                          className="relative flex h-32 w-24 flex-shrink-0 flex-col items-center justify-center gap-2 whitespace-nowrap rounded-lg p-2"
                          key={j}
                          style={{
                            color: readableColor(shadeValueColor).hex(),
                            backgroundColor: `hsl(${shadeValue})`,
                            backgroundImage: luminanceWarning
                              ? "linear-gradient(135deg,rgba(0,0,0,0.2) 10%,#0000 0,#0000 50%,rgba(0,0,0,0.2) 0,rgba(0,0,0,0.2) 60%,#0000 0,#0000)"
                              : darkenWarning
                              ? "linear-gradient(135deg,rgba(255,255,255,0.3) 10%,#0000 0,#0000 50%,rgba(255,255,255,0.3) 0,rgba(255,255,255,0.3) 60%,#0000 0,#0000)"
                              : "none",
                            backgroundSize: "7.07px 7.07px",
                          }}
                        >
                          {defaultShadeValue && <div className="ic-[lock]" />}
                          <span
                            className={classNames(
                              "absolute right-2 top-2",
                              luminanceWarning || darkenWarning
                                ? "visible"
                                : "invisible"
                            )}
                          >
                            <div className="ic-[warning-sign]" />
                          </span>
                          <strong>{shadeName}</strong>
                          <span className="text-xs">
                            {shadeValueColor.hex()}
                          </span>
                        </div>
                      </>
                    );
                  })}
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ShadesViewer;
