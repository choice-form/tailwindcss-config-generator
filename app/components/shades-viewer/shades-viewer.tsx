"use client";
import chroma from "chroma-js";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {useEffect, useRef, useState} from "react";
import {
  darkenWarningAtom,
  luminanceWarningAtom,
  shadesAtom,
  shadesConfigAtom,
  shadesCssVarsAtom,
} from "../../atom";
import {SwatchProps} from "../../swatch";
import {generateShades} from "../../swatch/generateShades";
import readableColor from "../../utilities/readable-color";
import {Shade, ShadeControl} from ".";
import {generateShadeStyle, isValidColor} from "../../utilities";
import {faker} from "@faker-js/faker";

interface ShadesViewerProps {
  shadesObject: ReturnType<typeof generateShades>;
}

const ShadesViewer = ({shadesObject}: ShadesViewerProps) => {
  const setShadesCssVars = useSetAtom(shadesCssVarsAtom);
  const setShadesConfig = useSetAtom(shadesConfigAtom);
  const [name, setName] = useState("primary");
  const [shadesState, setShadesState] = useAtom(shadesAtom);
  const luminanceWarningState = useAtomValue(luminanceWarningAtom);
  const darkenWarningState = useAtomValue(darkenWarningAtom);

  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [containerRef.current]);

  const handleAddSwatch = () => {
    let formattedColorName;
    do {
      let colorName = faker.color.human();
      formattedColorName = colorName.toLowerCase().replace(/ /g, "-");
    } while (
      Object.keys(shadesObject).includes(formattedColorName) ||
      formattedColorName === "white" ||
      formattedColorName === "black"
    );
    const newSwatch = {
      name: formattedColorName,
      value: isValidColor(formattedColorName) ? formattedColorName : chroma.random().hex(),
    };
    setShadesState((prevState) => [...prevState, newSwatch] as SwatchProps["swatch"]);
    setName(formattedColorName);
  };

  useEffect(() => {
    let newShadesCssVars = {};
    let newShadesConfig = {};
    Object.entries(shadesObject)
      .filter(([colorName]) => colorName !== "DEFAULT")
      .forEach(([colorName, shades]) => {
        const shadesStyle = generateShadeStyle({swatches: shadesState}, colorName);
        newShadesCssVars = {
          ...newShadesCssVars,
          ...shadesStyle,
        };
        let config = {};
        for (let shade in shades) {
          config = {
            ...config,
            [shade]: `hsla(var(--${colorName}-${shade}), <alpha-value>)`,
          };
        }

        newShadesConfig = {
          ...newShadesConfig,
          [colorName]: config,
        };
      });
    setShadesCssVars(newShadesCssVars); // Set new state, replacing the old one.
    setShadesConfig(newShadesConfig);
  }, [shadesState]);

  return (
    <div className="flex flex-grow flex-col gap-4 min-w-0">
      {/* <header className="col-span-4 flex items-center gap-4 border-b px-4 py-2">


        {Object.entries(shadesObject).map(
          ([_, shades]) =>
            shades.DEFAULT === undefined && (
              <span className="whitespace-nowrap text-xs">The DEFAULT color is out of range</span>
            ),
        )}
      </header> */}

      <button
        className="bg-light-100 hover:bg-light-200 flex items-center gap-1 rounded px-3 py-2 text-xs"
        onClick={handleAddSwatch}
      >
        <div className="ic-[e-add]" />
        Add swatch
      </button>

      <div className="flex flex-col gap-6 flex-1" ref={containerRef}>
        {Object.entries(shadesObject).map(([_, shades], i) => {
          const shadesStyle = generateShadeStyle({swatches: shadesState}, "color", i);

          return (
            <div
              key={i}
              className="flex flex-col gap-2"
              style={
                {
                  ...shadesStyle,
                  "--color-default": shades.DEFAULT,
                  "--readable-color": readableColor(chroma(`hsl(${shades.DEFAULT})`)).hex(),
                } as React.CSSProperties
              }
            >
              <ShadeControl index={i} />

              <div className="flex -m-1">
                {Object.entries(shades)
                  .filter(([shadeName]) => shadeName !== "DEFAULT")
                  .map(([shadeName, shadeValue], j) => {
                    const shadeColor = chroma(`hsl(${shadeValue})`);
                    const shadeColorHex = shadeColor.hex();
                    const shadeColorReadable = readableColor(shadeColor).hex();
                    const defaultShade = shadeValue === shades.DEFAULT;
                    const luminanceWarning = luminanceWarningState && shadeColor.luminance() > 0.9;
                    const darkenWarning = darkenWarningState && shadeColor.luminance() < 0.01;
                    return (
                      <Shade
                        key={j}
                        shadeName={shadeName}
                        shadeColorReadable={shadeColorReadable}
                        shadeColorHsl={`hsl(${shadeValue})`}
                        shadeColorHex={shadeColorHex}
                        defaultShade={defaultShade}
                        luminanceWarning={luminanceWarning}
                        darkenWarning={darkenWarning}
                        containerWidth={containerWidth ?? 0}
                      />
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShadesViewer;
