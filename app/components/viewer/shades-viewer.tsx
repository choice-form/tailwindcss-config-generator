"use client";
import {faker} from "@faker-js/faker";
import chroma from "chroma-js";
import classNames from "classnames";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {memo, useEffect, useRef} from "react";
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
import {useService, useStore} from "../../store/provider";
import {updateProjectCommand} from "../../store/commands/update-project";
import {ShadesGroup} from "./shades-group";

const MemoedShadesGroup = memo(ShadesGroup, (prevProps, nextProps) => {
  return (
    prevProps.project.shades[prevProps.i].initColor ===
    nextProps.project.shades[nextProps.i].initColor
  );
});

interface ShadesViewerProps {}

const ShadesViewer = ({}: ShadesViewerProps) => {
  // const [projects, setProjects] = useAtom(projectsAtom);
  const service = useService();
  const project = useStore((state) => state.project);
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
    shades: project?.shades.map((swatch) => swatch),
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
    service.execute(
      updateProjectCommand(project, {shades: [...project.shades, newShade] as ShadesProps[]}),
    );
    // setProjects((prevState) => ({
    //   ...prevState,
    //   shades: [...prevState.shades, newShade] as ShadesProps[],
    // }));
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
            {shades: project.shades, initial: false},
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
              DEFAULT: shadeSpaces(
                `var(--${colorName}-${correspondingShade})`,
                project.colorSpaces,
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
  }, [project.shades, project.colorSpaces]);

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
          return <MemoedShadesGroup key={i} i={i} project={project} shades={shades} />;
        })}
      </div>
    </div>
  );
};

export default ShadesViewer;
