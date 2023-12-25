"use client";
import {faker} from "@faker-js/faker";
import chroma from "chroma-js";
import classNames from "classnames";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {useEffect, useRef} from "react";
import {ShadeBlock, ShadeControl, ColorCodePopover} from ".";
import {
  containerWidthAtom,
  projectsAtom,
  shadesConfigAtom,
  shadesCssVariablesAtom,
  uiIsBusyAtom,
} from "../../atom";
import {generateShades} from "../../generate-shades";
import {generateShadeStyle, isValidColor} from "../../utilities";
import readableColor from "../../utilities/readable-color";
import {ProjectProps, ShadesProps} from "../../type";
import preset from "../../../public/preset.json";
import {PresetPopover} from "../preset";

interface ShadesViewerProps {}

const ShadesViewer = ({}: ShadesViewerProps) => {
  const [projects, setProjects] = useAtom(projectsAtom);
  const setShadesCssVariables = useSetAtom(shadesCssVariablesAtom);
  const setShadesConfig = useSetAtom(shadesConfigAtom);
  const uiIsBusy = useAtomValue(uiIsBusyAtom);
  const [containerWidth, setContainerWidth] = useAtom(containerWidthAtom);
  const containerRef = useRef<HTMLDivElement>(null);

  /** Example of shadesObject:
    {
      blue: {
        50: '255,100%,63%',
        100: '251,100%,61%',
        200: '248,100%,58%',
        300: '246,100%,56%',
        400: '243,100%,54%',
        500: '240,100%,50%',
        600: '240,100%,49%',
        700: '240,100%,47%',
        800: '240,100%,45%',
        900: '240,100%,43%',
        950: '240,100%,42%',
        DEFAULT: '240,100%,50%'
      }
    }
  */
  const shadesObject = generateShades({
    shades: projects?.shades.map((swatch) => swatch),
  });

  const shadesMap = new Map(Object.entries(shadesObject));
  const shadesArray = Array.from(shadesMap);

  // Container width observer
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (!containerRef.current) return;
      let sm = entries[0].contentRect.width < 361;
      let md = entries[0].contentRect.width < 641;
      let lg = entries[0].contentRect.width < 1025;
      setContainerWidth(sm ? "sm" : md ? "md" : lg ? "lg" : null);
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

  // Create a new shade
  const handleAddShade = () => {
    let formattedColorName;
    do {
      // Generate a random color name
      let colorName = faker.color.human();
      // Remove spaces and make it lowercase
      formattedColorName = colorName.toLowerCase().replace(/ /g, "-");
    } while (
      // Check if the color name already exists
      Object.keys(shadesObject).includes(formattedColorName) ||
      // Filter out the following names
      formattedColorName === "white" ||
      formattedColorName === "black"
    );
    const newShade = {
      name: formattedColorName,
      // If the name is a legal color name, the color name is used to generate the color.
      // If it is not legal, the color is randomly generated.
      initColor: isValidColor(formattedColorName) ? formattedColorName : chroma.random().hex(),
    };
    setProjects((prevState) => ({
      ...prevState,
      shades: [...prevState.shades, newShade] as ShadesProps[],
    }));
  };

  // Convert the color to the corresponding color space
  const shadeSpaces = (color: string, colorSpaces: string) => {
    switch (colorSpaces) {
      case "rgb":
        return `rgba(${color}, <alpha-value>)`;
      case "hsl":
        return `hsla(${color}, <alpha-value>)`;
      default:
        return color; // hex
    }
  };

  // Generate shades css variables and shades config
  useEffect(() => {
    let newShadesCssVariables = {};
    let newShadesConfig = {};
    if (!uiIsBusy) {
      shadesArray
        .filter(([colorName]) => colorName !== "DEFAULT")
        .forEach(([colorName, shades]) => {
          const shadesStyle = generateShadeStyle(
            {shades: projects.shades, initial: false},
            colorName,
          );
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
              [shade]: shadeSpaces(`var(--${colorName}-${shade})`, projects.colorSpaces),
              DEFAULT: shadeSpaces(
                `var(--${colorName}-${correspondingShade})`,
                projects.colorSpaces,
              ),
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
  }, [projects.shades, projects.colorSpaces]);

  const containerWidthState = containerWidth === "md" || containerWidth === "sm";

  return (
    <div className="flex min-w-0 flex-grow flex-col gap-4">
      <div className="sticky top-16 z-40 flex gap-4 py-8">
        <button
          className="hover:bg-light-200 flex items-center gap-1 rounded-lg bg-black px-3 py-2 text-sm
          text-white ring ring-white/50 dark:bg-white dark:text-black dark:ring-black/50"
          onClick={handleAddShade}
        >
          <div className="ic-[e-add]" />
          Add shade
        </button>

        <PresetPopover />
      </div>

      <div className="flex flex-1 flex-col gap-8" ref={containerRef}>
        {shadesArray.map(([_, shades], i) => {
          const shadesStyle = generateShadeStyle(
            {shades: projects.shades, initial: false},
            "color",
            i,
          );

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

              <div className={classNames("-m-1 flex", containerWidthState && "flex-col")}>
                {Object.entries(shades)
                  .filter(([shadeName]) => shadeName !== "DEFAULT")
                  .map(([shadeName, shadeValue], j) => {
                    const shadeColor = chroma(`hsl(${shadeValue})`);
                    const shadeColorHex = shadeColor.hex();
                    const shadeColorReadable = readableColor(shadeColor).hex();
                    const defaultShade = shadeValue === shades.DEFAULT;

                    const luminanceWarning =
                      projects?.accessibility?.luminanceWarning?.brighten &&
                      shadeColor.luminance() > 0.9;
                    const darkenWarning =
                      projects?.accessibility?.luminanceWarning?.darken &&
                      shadeColor.luminance() < 0.01;
                    return (
                      <ShadeBlock
                        key={j}
                        colorCodePopover={
                          <ColorCodePopover
                            color={shadeColorHex}
                            style={{
                              backgroundColor: shadeColorHex,
                            }}
                          />
                        }
                        shadeName={shadeName}
                        shadeColorReadable={shadeColorReadable}
                        shadeColorHsl={`hsl(${shadeValue})`}
                        shadeColorHex={shadeColorHex}
                        defaultShade={defaultShade}
                        luminanceWarning={luminanceWarning}
                        darkenWarning={darkenWarning}
                        handleClick={() =>
                          setProjects((prevState) => {
                            const newShades = [...prevState.shades];
                            if (newShades[i].defaultIndex === j) {
                              newShades[i] = {
                                ...newShades[i],
                                initColor: shadeColorHex,
                                defaultIndex: undefined,
                              };
                            } else {
                              newShades[i] = {
                                ...newShades[i],
                                initColor: shadeColorHex,
                                defaultIndex: j,
                              };
                            }
                            return {
                              ...prevState,
                              shades: newShades,
                            };
                          })
                        }
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
