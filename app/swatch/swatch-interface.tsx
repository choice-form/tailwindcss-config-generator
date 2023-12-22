import { faker } from "@faker-js/faker";
import { getLuminance, readableColor, toHex } from "color2k";
import { Fragment, useState } from "react";

import { SwatchProps } from ".";
import { tcx } from "../utilities";
import { generateShades, generateShadesProps } from "./generateShades";

interface SwatchInterfaceProps {}

const SwatchInterface = ({}: SwatchInterfaceProps) => {
  const [swatchState, setSwatchState] = useState<SwatchProps["swatch"]>([]);
  const [name, setName] = useState("primary");

  const [luminanceWarningState, setLuminanceWarningState] = useState(true);
  const [darkenWarningState, setDarkenWarningState] = useState(true);

  const handleAddSwatch = () => {
    const newSwatch = {
      name: name,
      value: "#0055ff",
    };
    setSwatchState(
      (prevState) => [...prevState, newSwatch] as SwatchProps["swatch"]
    );
    setName(faker.lorem.word());
  };

  const handleRemoveSwatch = (i: number) => {
    setSwatchState((prevState) => {
      const newState = [...prevState];
      newState.splice(i, 1);
      return newState;
    });
  };

  // const {swatchObject, swatchJson} = swatch({
  //   swatch: swatchState.map((swatch) => swatch),
  // } as SwatchProps);

  const shadesObject = generateShades({
    swatches: swatchState.map((swatch) => swatch),
  } as generateShadesProps);
  console.log(
    "🚀 ~ file: swatch-interface.tsx:43 ~ SwatchInterface ~ outputJson:",
    shadesObject
  );

  let swatchJson = JSON.stringify(shadesObject).replace(/"(\w+)"\s*:/g, "$1:");

  function formatCode(code: string) {
    let indentLevel = 0;
    let formattedCode = "";
    let insideQuotes = false;
    for (let char of code) {
      switch (char) {
        case "{":
        case "[":
          formattedCode += char + "\n" + "  ".repeat(++indentLevel);
          break;
        case "}":
        case "]":
          formattedCode += "\n" + "  ".repeat(--indentLevel) + char;
          break;
        case ",":
          formattedCode += insideQuotes
            ? ","
            : ",\n" + "  ".repeat(indentLevel);
          break;
        case ":":
          formattedCode += insideQuotes ? ":" : ": ";
          break;
        case '"':
          insideQuotes = !insideQuotes;
          formattedCode += char;
          break;
        default:
          formattedCode += char;
      }
    }
    return formattedCode;
  }

  return (
    <div className="grid h-screen w-screen grid-cols-4 grid-rows-[auto_1fr] place-content-stretch">
      <header className="col-span-4 flex items-center gap-4 border-b px-4 py-2">
        <button
          className="flex items-center gap-1 rounded bg-light-100 px-3 py-2 text-xs hover:bg-light-200"
          onClick={handleAddSwatch}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <g>
              <path d="M11.5,7H9V4.5A.5.5,0,0,0,8.5,4h-1a.5.5,0,0,0-.5.5V7H4.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H7v2.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V9h2.5a.5.5,0,0,0,.5-.5v-1A.5.5,0,0,0,11.5,7Z"></path>
            </g>
          </svg>
          Add swatch
        </button>

        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="luminanceWarning">Luminance warning</label>
          <input
            id="luminanceWarning"
            type="checkbox"
            checked={luminanceWarningState}
            value={luminanceWarningState as unknown as string}
            onChange={() => {
              setLuminanceWarningState(!luminanceWarningState);
            }}
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="darkenWarning">Darken warning</label>
          <input
            id="darkenWarning"
            type="checkbox"
            checked={darkenWarningState}
            value={darkenWarningState as unknown as string}
            onChange={() => {
              setDarkenWarningState(!darkenWarningState);
            }}
          />
        </div>

        {Object.entries(shadesObject).map(
          ([_, shades]) =>
            shades.DEFAULT === undefined && (
              <span className="whitespace-nowrap text-xs">
                The DEFAULT color is out of range
              </span>
            )
        )}
      </header>

      <div className="col-span-3 flex flex-grow flex-col gap-4 overflow-auto p-4">
        <div className="flex flex-col gap-6">
          {Object.entries(shadesObject).map(([_, shades], i) => {
            return (
              <Fragment key={i}>
                <div className="flex items-center gap-4">
                  <div className="inline-flex h-10 items-center gap-2 self-start rounded-full border px-1">
                    <div
                      className="relative h-8 w-8 flex-shrink-0 place-self-center rounded-full hover:ring"
                      style={{
                        backgroundColor: swatchState[i].value,
                      }}
                    >
                      <input
                        className="absolute appearance-none bg-light-100 opacity-0 outline-none"
                        type="color"
                        value={swatchState[i].value}
                        onChange={(e) => {
                          const newSwatch = {
                            value: e.target.value,
                          };
                          setSwatchState(
                            swatchState.map((swatch, index) =>
                              index === i ? { ...swatch, ...newSwatch } : swatch
                            )
                          );
                        }}
                      />
                    </div>
                    <input
                      className="text flex h-8 items-center rounded-full px-3 text-center font-bold hover:bg-light-100"
                      type="text"
                      value={swatchState[i].name}
                      onChange={(e) =>
                        setSwatchState(
                          swatchState.map((swatch, index) =>
                            index === i
                              ? { ...swatch, name: e.target.value }
                              : swatch
                          )
                        )
                      }
                      placeholder="Enter name"
                    />
                    <button
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center place-self-center rounded-full border bg-light-100 text-xs hover:bg-light-200"
                      onClick={() => handleRemoveSwatch(i)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                      >
                        <g>
                          <path d="M11.146,5.546l-.692-.692a.5.5,0,0,0-.708,0L8,6.6,6.254,4.854a.5.5,0,0,0-.708,0l-.692.692a.5.5,0,0,0,0,.708L6.6,8,4.854,9.746a.5.5,0,0,0,0,.708l.692.692a.5.5,0,0,0,.708,0L8,9.4l1.746,1.746a.5.5,0,0,0,.708,0l.692-.692a.5.5,0,0,0,0-.708L9.4,8l1.746-1.746A.5.5,0,0,0,11.146,5.546Z"></path>
                        </g>
                      </svg>
                    </button>
                  </div>
                  <div className="inline-flex h-10 items-center gap-2 self-start rounded-full border px-2 text-xs">
                    <strong>Lighten amount</strong>
                    <input
                      min={0}
                      max={1}
                      step={0.01}
                      defaultValue={0}
                      type="range"
                      value={swatchState[i].lightenAmount}
                      onChange={(e) => {
                        const newSwatch = {
                          lightenAmount: Number(e.target.value),
                        };
                        setSwatchState(
                          swatchState.map((swatch, index) =>
                            index === i ? { ...swatch, ...newSwatch } : swatch
                          )
                        );
                      }}
                    />
                    <span>{swatchState[i].lightenAmount ?? 18}</span>
                    <strong>Darken amount</strong>
                    <input
                      min={0}
                      max={1}
                      step={0.01}
                      defaultValue={0}
                      type="range"
                      value={swatchState[i].darkenAmount}
                      onChange={(e) => {
                        const newSwatch = {
                          darkenAmount: Number(e.target.value),
                        };
                        setSwatchState(
                          swatchState.map((swatch, index) =>
                            index === i ? { ...swatch, ...newSwatch } : swatch
                          )
                        );
                      }}
                    />
                    <span>{swatchState[i].darkenAmount ?? 18}</span>
                    <strong>Adjust hue</strong>
                    <input
                      min={-10}
                      max={10}
                      defaultValue={0}
                      type="range"
                      value={swatchState[i].adjustHue}
                      onChange={(e) => {
                        const newSwatch = {
                          adjustHue: Number(e.target.value),
                        };
                        setSwatchState(
                          swatchState.map((swatch, index) =>
                            index === i ? { ...swatch, ...newSwatch } : swatch
                          )
                        );
                      }}
                    />
                    <span>{swatchState[i].adjustHue ?? 0}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {Object.entries(shades)
                    .filter(([shadeName]) => shadeName !== "DEFAULT")
                    .map(([shadeName, shadeValue], j) => {
                      const defaultShadeValue =
                        toHex(`hsl(${shadeValue})`) === swatchState[i].value;
                      const luminanceWarning =
                        luminanceWarningState &&
                        getLuminance(`hsl(${shadeValue})`) > 0.9;
                      const darkenWarning =
                        darkenWarningState &&
                        getLuminance(`hsl(${shadeValue})`) < 0.01;

                      return (
                        <>
                          <div
                            className="relative flex h-24 w-24 flex-shrink-0 flex-col items-center justify-center gap-2 whitespace-nowrap rounded-lg p-2"
                            key={j}
                            style={{
                              color: readableColor(`hsl(${shadeValue})`),
                              backgroundColor: `hsl(${shadeValue})`,
                              backgroundImage: luminanceWarning
                                ? "linear-gradient(135deg,rgba(0,0,0,0.2) 10%,#0000 0,#0000 50%,rgba(0,0,0,0.2) 0,rgba(0,0,0,0.2) 60%,#0000 0,#0000)"
                                : darkenWarning
                                ? "linear-gradient(135deg,rgba(255,255,255,0.3) 10%,#0000 0,#0000 50%,rgba(255,255,255,0.3) 0,rgba(255,255,255,0.3) 60%,#0000 0,#0000)"
                                : "none",
                              backgroundSize: "7.07px 7.07px",
                            }}
                          >
                            {defaultShadeValue && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                              >
                                <g fill="currentColor">
                                  <path d="M12,6H10V4A2,2,0,0,0,6,4V6H4V4a4,4,0,0,1,8,0Z"></path>
                                  <path d="M14,7H2A1,1,0,0,0,1,8v7a1,1,0,0,0,1,1H14a1,1,0,0,0,1-1V8A1,1,0,0,0,14,7ZM8,13a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,8,13Z"></path>
                                </g>
                              </svg>
                            )}
                            <span
                              className={tcx(
                                "absolute right-2 top-2",
                                luminanceWarning || darkenWarning
                                  ? "visible"
                                  : "invisible"
                              )}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                              >
                                <g fill="currentColor">
                                  <path d="M15.8,12.526,9.483.88A1.668,1.668,0,0,0,8.8.2,1.693,1.693,0,0,0,6.516.88L.2,12.526A1.678,1.678,0,0,0,1.686,15H14.314a1.7,1.7,0,0,0,.8-.2,1.673,1.673,0,0,0,.687-2.274ZM8,13a1,1,0,1,1,1-1A1,1,0,0,1,8,13ZM9,9.5a.5.5,0,0,1-.5.5h-1A.5.5,0,0,1,7,9.5v-4A.5.5,0,0,1,7.5,5h1a.5.5,0,0,1,.5.5Z"></path>
                                </g>
                              </svg>
                            </span>
                            <strong>{shadeName}</strong>
                            <span className="text-xs">
                              {toHex(`hsl(${shadeValue})`)}
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

      <div className="h-full flex-shrink-0 overflow-y-auto border-l bg-light-100 p-4">
        <code className="text-xs">
          <pre>{formatCode(swatchJson)}</pre>
        </code>
      </div>
    </div>
  );
};

export default SwatchInterface;
