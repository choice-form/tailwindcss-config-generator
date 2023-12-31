import chroma from "chroma-js";
import type {SwatchColorProps} from "../../type";
import {readableColor} from "../../utilities";
import ColorCodePopover from "./color-code-popover";
import ShadeBlock from "./shade-block";
import ShadeControl from "./shade-control";

type Props = {
  index: number;
  shades: SwatchColorProps;
  handleShadeChange: (j: number, color: chroma.Color) => void;
};

export function ShadesGroup({index, shades, handleShadeChange}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <ShadeControl index={index} />

      <div className="-m-1 flex flex-col @2xl:flex-row">
        {Object.entries(shades)
          .filter(([shadeName]) => shadeName !== "DEFAULT")
          .map(([shadeName, shadeValue], j) => {
            const shadeColor = chroma(shadeValue);
            const shadeColorHex = shadeColor.hex();
            const shadeColorReadable = readableColor(shadeColor).hex();
            const defaultShade = shadeValue === shades.DEFAULT;

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
                shadeValue={shadeValue}
                shadeName={shadeName}
                // shadeColorReadable={shadeColorReadable}
                // shadeColorHsl={shadeValue}
                // shadeColorHex={shadeColorHex}
                defaultShade={shades.DEFAULT}
                handleClick={() => {
                  handleShadeChange(j, shadeValue);
                }}
              />
            );
          })}
      </div>
    </div>
  );
}
