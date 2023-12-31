"use client";
import {create} from "mutative";
import {Fragment, useCallback, useEffect} from "react";
import {generateShades} from "../../generate-shades";
import {updateProjectShadesCommand} from "../../store/commands/update-project";
import {useService, useStore} from "../../store/provider";
import {generateShadeStyle} from "../../utilities";

import {ShadesGroup} from "./shades-group";
import chroma from "chroma-js";

interface ShadesViewerProps {}

const ShadesViewer = ({}: ShadesViewerProps) => {
  const service = useService();
  const project = useStore((state) => state.project);

  /** Example of shadesObject:
   *  raw data
   *  {
      violet: {
        50: [ 306.31578947368416, 0.9047619047619051, 0.9588235294117646, 1 ],
        100: [ 303.2432432432433, 0.8604651162790702, 0.915686274509804, 1 ],
        200: [ 302.1818181818182, 0.8208955223880599, 0.8686274509803922, 1 ],
        300: [ 301.66666666666663, 0.8000000000000003, 0.8235294117647058, 1 ],
        400: [ 300.6666666666667, 0.7758620689655171, 0.7725490196078431, 1 ],
        500: [ 300, 0.7605633802816902, 0.7215686274509804, 1 ],
        600: [ 300, 0.41346153846153844, 0.592156862745098, 1 ],
        700: [ 300, 0.27731092436974786, 0.4666666666666667, 1 ],
        800: [ 300, 0.26553672316384186, 0.34705882352941175, 1 ],
        900: [ 300, 0.24369747899159666, 0.23333333333333334, 1 ],
        950: [ 304.2857142857143, 0.21212121212121215, 0.12941176470588234, 1 ],
        DEFAULT: [ 300, 0.7605633802816902, 0.7215686274509804, 1 ]
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
        const shadesStyle = generateShadeStyle({shades: project.shades}, colorName);
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
    (i: number) => (j: number, color: chroma.Color) => {
      service.execute(
        updateProjectShadesCommand(project, ({shades}) => {
          const [draft, finalize] = create(shades);
          draft[i].initColor = chroma(color).hex();
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
