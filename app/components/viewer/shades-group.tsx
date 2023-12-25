import chroma from "chroma-js";
import {create} from "mutative";
import {useCallback} from "react";
import {updateProjectShadesCommand} from "../../store/commands/update-project";
import {useService} from "../../store/provider";
import type {ProjectProps, SwatchColorProps} from "../../type";
import {generateShadeStyle, readableColor} from "../../utilities";
import ColorCodePopover from "./color-code-popover";
import ShadeBlock from "./shade-block";
import ShadeControl from "./shade-control";

type Props = {
  index: number;
  _initColor: string;
  _lightenAmount: number;
  _darkenAmount: number;
  _hueAmount: number;
  _desaturateUpAmount: number;
  _desaturateDownAmount: number;
  _saturationUpAmount: number;
  _saturationDownAmount: number;
  shades: SwatchColorProps;
  project: ProjectProps;
};

export function ShadesGroup({index, shades, project}: Props) {
  const service = useService();
  const shadesStyle = generateShadeStyle({shades: project.shades, initial: false}, "color", index);

  const handleShadeChange = useCallback((j: number, color: string) => {
    service.execute(
      updateProjectShadesCommand(project, ({shades}) => {
        const [draft, finalize] = create(shades);
        draft[index].initColor = color;
        draft[index].defaultIndex = draft[index].defaultIndex === j ? undefined : j;
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
      <ShadeControl index={index} />

      <div className="-m-1 flex flex-col @2xl:flex-row">
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
