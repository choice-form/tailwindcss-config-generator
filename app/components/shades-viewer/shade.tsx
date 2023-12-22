import classNames from "classnames";

interface ShadeProps {
  shadeName: string;
  shadeColorReadable: string;
  shadeColorHsl: string;
  shadeColorHex: string;
  defaultShade: boolean;
  luminanceWarning: boolean;
  darkenWarning: boolean;
  containerWidth: number;
}

const Shade = ({
  shadeName,
  shadeColorReadable,
  shadeColorHsl,
  shadeColorHex,
  defaultShade,
  luminanceWarning,
  darkenWarning,
  containerWidth,
}: ShadeProps) => {
  return (
    <div className="w-[calc(100%/11)] min-w-0 flex-0 p-1">
      <div
        className="flex aspect-[9/16] flex-col gap-2 items-center justify-end p-2 w-full relative whitespace-nowrap"
        style={{
          color: shadeColorReadable,
          backgroundColor: shadeColorHsl,
          backgroundImage: luminanceWarning
            ? "linear-gradient(135deg,rgba(0,0,0,0.2) 10%,#0000 0,#0000 50%,rgba(0,0,0,0.2) 0,rgba(0,0,0,0.2) 60%,#0000 0,#0000)"
            : darkenWarning
            ? "linear-gradient(135deg,rgba(255,255,255,0.3) 10%,#0000 0,#0000 50%,rgba(255,255,255,0.3) 0,rgba(255,255,255,0.3) 60%,#0000 0,#0000)"
            : "none",
          backgroundSize: "7.07px 7.07px",
          borderRadius: Math.round(containerWidth / 100),
          fontSize: Math.round(containerWidth / 50),
        }}
      >
        {defaultShade && <div className="ic-[lock]" />}
        <span
          className={classNames(
            "absolute right-2 top-2",
            luminanceWarning || darkenWarning ? "visible" : "invisible",
          )}
        >
          <div className="ic-[warning-sign]" />
        </span>
        {Math.round(containerWidth / 50) > 11 && <strong>{shadeName}</strong>}
        {Math.round(containerWidth / 11) > 64 && (
          <span className="text-xs truncate min-w-0">{shadeColorHex}</span>
        )}
      </div>
    </div>
  );
};

export default Shade;
