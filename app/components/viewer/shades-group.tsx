import chroma from "chroma-js";
import classNames from "classnames";
import {useCallback} from "react";
import {updateProjectShadesCommand} from "../../store/commands/update-project";
import {useService, useStore} from "../../store/provider";
import type {SwatchColorProps} from "../../type";
import {generateShadeStyle, readableColor} from "../../utilities";
import ColorCodePopover from "./color-code-popover";
import ShadeBlock from "./shade-block";
import ShadeControl from "./shade-control";
import {create, original} from "mutative";

type Props = {i: number; _color: string; shades: SwatchColorProps};

export function ShadesGroup({i, shades}: Props) {
  const service = useService();
  const project = useStore((state) => state.project);
  const containerWidth = useStore((state) => state.containerWidth);
  const containerWidthState = containerWidth === "md" || containerWidth === "sm";

  const shadesStyle = generateShadeStyle({shades: project.shades, initial: false}, "color", i);

  const handleShadeChange = useCallback((j: number, color: string) => {
    service.execute(
      updateProjectShadesCommand(project, ({shades}) => {
        const [draft, finalize] = create(shades);
        draft[i].initColor = color;
        draft[i].defaultIndex = draft[i].defaultIndex === j ? undefined : j;
        return finalize();
      }),
    );
  }, []);

  return (
    <div
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
              project?.accessibility?.luminanceWarning?.brighten && shadeColor.luminance() > 0.9;
            const darkenWarning =
              project?.accessibility?.luminanceWarning?.darken && shadeColor.luminance() < 0.01;

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
                handleClick={() => {
                  handleShadeChange(j, shadeColorHex);
                }}
              />
            );
          })}
      </div>
    </div>
  );
}
