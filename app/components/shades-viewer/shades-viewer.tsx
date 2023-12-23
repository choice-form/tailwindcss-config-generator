"use client";
import chroma from "chroma-js";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {useEffect, useRef, useState} from "react";
import {
  colorSpacesAtom,
  darkenWarningAtom,
  luminanceWarningAtom,
  shadesAtom,
  shadesConfigAtom,
  shadesCssVariablesAtom,
  sliderIsDraggingAtom,
} from "../../atom";
import readableColor from "../../utilities/readable-color";
import {Shade, ShadeControl} from ".";
import {generateShadeStyle, isValidColor} from "../../utilities";
import {faker} from "@faker-js/faker";
import {generateShades, generateShadesProps} from "../../generate-shades";
import classNames from "classnames";

interface ShadesViewerProps {
  shadesObject: ReturnType<typeof generateShades>;
}

const ShadesViewer = ({shadesObject}: ShadesViewerProps) => {
  const colorSpaces = useAtomValue(colorSpacesAtom);
  const setShadesCssVariables = useSetAtom(shadesCssVariablesAtom);
  const setShadesConfig = useSetAtom(shadesConfigAtom);
  const [name, setName] = useState("primary");
  const [shadesState, setShadesState] = useAtom(shadesAtom);
  const luminanceWarningState = useAtomValue(luminanceWarningAtom);
  const darkenWarningState = useAtomValue(darkenWarningAtom);
  const sliderIsDragging = useAtomValue(sliderIsDraggingAtom);
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
    setShadesState((prevState) => [...prevState, newSwatch] as generateShadesProps["swatches"]);
    setName(formattedColorName);
  };

  const shadeSpaces = (color: string, colorSpaces: string) => {
    switch (colorSpaces) {
      case "rgb":
        return `rgba(${color}, <alpha-value>)`;
      case "hsl":
        return `hsla(${color}, <alpha-value>)`;
      default:
        return color;
    }
  };

  useEffect(() => {
    let newShadesCssVariables = {};
    let newShadesConfig = {};
    if (!sliderIsDragging) {
      Object.entries(shadesObject)
        .filter(([colorName]) => colorName !== "DEFAULT")
        .forEach(([colorName, shades], i) => {
          const shadesStyle = generateShadeStyle({swatches: shadesState}, colorName);
          newShadesCssVariables = {
            ...newShadesCssVariables,
            ...shadesStyle,
          };
          let config = {};
          const correspondingShade = Object.keys(shades).find(
            (shadeName) => shades[shadeName] === shades.DEFAULT,
          );
          for (let shade in shades) {
            config = {
              ...config,
              [shade]: shadeSpaces(`var(--${colorName}-${shade})`, colorSpaces),
              DEFAULT: shadeSpaces(`var(--${colorName}-${correspondingShade})`, colorSpaces),
            };
          }
          newShadesConfig = {
            ...newShadesConfig,
            [colorName]: config,
          };
        });

      setShadesCssVariables(newShadesCssVariables);
      setShadesConfig(newShadesConfig);
    }
  }, [shadesState, colorSpaces]);

  const isMobile = containerWidth && containerWidth < 641;

  return (
    <div className="flex flex-grow flex-col gap-4 min-w-0">
      <div className="sticky top-16 py-8 z-40">
        <button
          className="bg-black text-white hover:bg-light-200 flex items-center gap-1 rounded-lg px-3 py-2 text-sm ring ring-white/50 dark:ring-black/50 dark:bg-white dark:text-black"
          onClick={handleAddSwatch}
        >
          <div className="ic-[e-add]" />
          Add shade
        </button>
      </div>

      <div className="flex flex-col gap-8 flex-1" ref={containerRef}>
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
              <ShadeControl index={i} isMobile={isMobile as boolean} />
              <div className={classNames("flex -m-1", isMobile && "flex-col")}>
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
                        isMobile={isMobile as boolean}
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
