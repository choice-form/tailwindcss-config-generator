import classNames from "classnames";
import {calculateWCAG2, contrastAPCA} from "../../utilities/calculate-contrast";
import {wcag2ContrastAtom, apcaContrastAtom, contrastTypeAtom} from "../../atom";
import {useAtomValue} from "jotai";

interface ShadeProps {
  shadeName: string;
  shadeColorReadable: string;
  shadeColorHsl: string;
  shadeColorHex: string;
  defaultShade: boolean;
  luminanceWarning: boolean;
  darkenWarning: boolean;
  isMobile: boolean;
}

const Shade = ({
  shadeName,
  shadeColorReadable,
  shadeColorHsl,
  shadeColorHex,
  defaultShade,
  luminanceWarning,
  darkenWarning,
  isMobile,
}: ShadeProps) => {
  const wcag2Contrast = useAtomValue(wcag2ContrastAtom);
  const apcaContrast = useAtomValue(apcaContrastAtom);
  const contrastType = useAtomValue(contrastTypeAtom);

  const WCAG2 = calculateWCAG2(shadeColorReadable, shadeColorHsl);
  const APCA = contrastAPCA(shadeColorReadable, shadeColorHsl);

  const isWCAG2 = contrastType === "wcag2" && (wcag2Contrast.aa || wcag2Contrast.aaa);
  const isAPCA = contrastType === "apca" && (apcaContrast.aa || apcaContrast.aaa);
  const isLuminance = contrastType === "luminance" && (luminanceWarning || darkenWarning);

  const WCAGContrast =
    (isWCAG2 && wcag2Contrast.aa && Number(WCAG2) < 4.5) ||
    (wcag2Contrast.aaa && Number(WCAG2) < 7);
  const APCAContrast =
    (isAPCA && apcaContrast.aa && Math.abs(Number(APCA)) < 60) ||
    (apcaContrast.aaa && Math.abs(Number(APCA)) < 80);

  return (
    <div className={classNames("min-w-0 flex-0 p-1", isMobile ? "w-full" : "w-[calc(100%/11)]")}>
      <div
        className={classNames(
          "flex gap-2 items-center p-2 w-full relative whitespace-nowrap rounded-lg",
          isMobile ? "flex-row" : "aspect-[9/18] flex-col justify-end",
        )}
        style={{
          color: shadeColorReadable,
          backgroundColor: shadeColorHsl,
          backgroundImage:
            WCAGContrast || APCAContrast
              ? "linear-gradient(135deg,rgba(255,255,255,0.5) 10%,#0000 0,#0000 50%,rgba(255,255,255,0.5) 0,rgba(255,255,255,0.5) 60%,#0000 0,#0000)"
              : contrastType === "luminance" && luminanceWarning
              ? "linear-gradient(135deg,rgba(0,0,0,0.2) 10%,#0000 0,#0000 50%,rgba(0,0,0,0.2) 0,rgba(0,0,0,0.2) 60%,#0000 0,#0000)"
              : contrastType === "luminance" && darkenWarning
              ? "linear-gradient(135deg,rgba(255,255,255,0.3) 10%,#0000 0,#0000 50%,rgba(255,255,255,0.3) 0,rgba(255,255,255,0.3) 60%,#0000 0,#0000)"
              : "none",
          backgroundSize: "7.07px 7.07px",
        }}
      >
        {isWCAG2 && (
          <span
            className={classNames("text-xs px-1 rounded", isMobile ? "order-4" : "mb-auto")}
            style={{
              backgroundColor: shadeColorReadable,
              color: shadeColorHsl,
            }}
          >
            {WCAG2}
          </span>
        )}

        {isAPCA && (
          <span
            className={classNames("text-xs px-1 rounded", isMobile ? "order-4" : "mb-auto")}
            style={{
              backgroundColor: shadeColorReadable,
              color: shadeColorHsl,
            }}
          >
            {APCA}%
          </span>
        )}

        {defaultShade && <div className={classNames("ic-[lock]", isMobile ? "order-2" : "")} />}
        {(isLuminance || WCAGContrast || APCAContrast) && (
          <div className={classNames("ic-[warning-sign]", isMobile ? "order-3" : "")} />
        )}
        <strong className={classNames(isMobile ? "order-1" : "")}>{shadeName}</strong>
        <span className={classNames("text-xs truncate min-w-0", isMobile ? "order-6 ml-auto" : "")}>
          {shadeColorHex}
        </span>
      </div>
    </div>
  );
};

export default Shade;
