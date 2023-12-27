"use client";
import {create} from "mutative";
import {useCallback, useEffect} from "react";
import {generateShades} from "../../generate-shades";
import {updateProjectShadesCommand} from "../../store/commands/update-project";
import {useService, useStore} from "../../store/provider";
import {generateShadeStyle} from "../../utilities";

import {ShadesGroup} from "./shades-group";

interface ShadesViewerProps {}

const ShadesViewer = ({}: ShadesViewerProps) => {
  const service = useService();
  const project = useStore((state) => state.project);
  const uiIsBusy = useStore((state) => state.uiIsBusy);

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
    shades: project.shades.map((swatch) => swatch),
  });

  const shadesMap = new Map(Object.entries(shadesObject));
  const shadesArray = Array.from(shadesMap);

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
    shadesArray
      .filter(([colorName]) => colorName !== "DEFAULT")
      .forEach(([colorName, shades]) => {
        const shadesStyle = generateShadeStyle(
          {shades: project.shades, initial: project.colorSpaces === "hsl" ? false : true},
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
            [shade]: shadeSpaces(`var(--${colorName}-${shade})`, project.colorSpaces),
            DEFAULT: shadeSpaces(`var(--${colorName}-${correspondingShade})`, project.colorSpaces),
          };
        }
        newShadesConfig = {
          ...newShadesConfig,
          [colorName]: config,
        };
      });

    service.shallowPatch({
      shadesCssVariables: newShadesCssVariables,
      shadesConfig: newShadesConfig,
    });
  }, [project.shades, project.colorSpaces]);

  const handleShadeChange = useCallback(
    (i: number) => (j: number, color: string) => {
      service.execute(
        updateProjectShadesCommand(project, ({shades}) => {
          const [draft, finalize] = create(shades);
          draft[i].initColor = color;
          draft[i].defaultIndex = draft[i].defaultIndex === j ? undefined : j;
          return finalize();
        }),
      );
    },
    [project],
  );

  return shadesArray.length > 0 ? (
    <div className="flex min-w-0 flex-grow flex-col gap-4 @container">
      <div className="flex flex-1 flex-col gap-8">
        {shadesArray.map(([_, shades], i) => {
          return (
            <ShadesGroup
              key={i}
              index={i}
              shades={shades}
              handleShadeChange={handleShadeChange(i)}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <div
      className="flex flex-1 items-center justify-center rounded-2xl
      border-2 border-dashed p-8 dark:border-neutral-800"
    >
      <div className="ic-[pantone] h-32 w-32 self-center text-neutral-200 dark:text-neutral-800" />
    </div>
  );
};

export default ShadesViewer;
