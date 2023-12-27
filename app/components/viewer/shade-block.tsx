import chroma from "chroma-js";
import classNames from "classnames";
import {useState} from "react";
import {useStore} from "../../store/provider";
import {contrastAPCA} from "../../utilities";
import {UiPopover} from "../ui";

interface ShadeBlockProps {
  shadeName: string;
  shadeColorReadable: string;
  shadeColorHsl: string;
  shadeColorHex: string;
  defaultShade: boolean;
  handleClick: () => void;
  colorCodePopover?: React.ReactNode;
}

const ShadeBlock = ({
  shadeName,
  shadeColorReadable,
  shadeColorHsl,
  shadeColorHex,
  defaultShade,

  handleClick,
  colorCodePopover,
}: ShadeBlockProps) => {
  const wcag2Contrast = useStore((state) => state.project.accessibility.wcag2Contrast);
  const apcaContrast = useStore((state) => state.project.accessibility.apcaContrast);
  const contrastTabs = useStore((state) => state.contrastTabs);
  const [isOpen, setIsOpen] = useState(false);

  const luminanceWarning = chroma(shadeColorHsl).luminance() > 0.9;
  const darkenWarning = chroma(shadeColorHsl).luminance() < 0.01;

  const WCAG2 = chroma.contrast(shadeColorReadable, shadeColorHsl).toFixed(1);
  const APCA = contrastAPCA(shadeColorReadable, shadeColorHsl);

  const isWCAG2 = contrastTabs === "wcag2" && wcag2Contrast !== "none";
  const isAPCA = contrastTabs === "apca" && apcaContrast !== "none";
  const isLuminance = contrastTabs === "luminance" && (luminanceWarning || darkenWarning);

  /** WCAG2 stands for Web Content Accessibility Guidelines 2.
   * It is a set of guidelines developed by the World Wide Web Consortium (W3C) to ensure that web content is accessible to people with disabilities.
   * These guidelines provide recommendations for making web content perceivable, operable, understandable, and robust.
   */
  const WCAGContrast =
    (isWCAG2 && wcag2Contrast === "aa" && Number(WCAG2) < 4.5) ||
    (isWCAG2 && wcag2Contrast === "aaa" && Number(WCAG2) < 7);

  /** APCA stands for Average Picture Complexity Analysis.
   * It is a method used to measure the visual complexity of an image.
   * APCA calculates the average complexity of an image by analyzing its pixel values and determining the level of detail and variation present.
   */
  const APCAContrast =
    (isAPCA && apcaContrast === "aa" && Math.abs(Number(APCA)) < 60) ||
    (isAPCA && apcaContrast === "aaa" && Math.abs(Number(APCA)) < 80);

  const warningClass = (color: string) =>
    `linear-gradient(135deg,${color} 10%,#0000 0,#0000 50%,${color} 0,${color} 60%,#0000 0,#0000)`;

  return (
    <div className="flex-0 w-full min-w-0 p-1 @2xl:w-[calc(100%/11)]">
      <div
        className="relative grid w-full min-w-0 select-none grid-cols-4 items-center gap-4 whitespace-nowrap rounded-lg px-4 py-2
        @2xl:aspect-[9/18] @2xl:grid-cols-1 @2xl:grid-rows-3 @2xl:place-content-center @2xl:gap-0 @2xl:p-2"
        style={{
          color: shadeColorReadable,
          backgroundColor: shadeColorHsl,
          backgroundImage:
            WCAGContrast || APCAContrast
              ? warningClass(chroma(shadeColorHsl).brighten(1).alpha(0.8).css())
              : contrastTabs === "luminance" && luminanceWarning
              ? warningClass(chroma(shadeColorHsl).darken(1).alpha(0.8).css())
              : contrastTabs === "luminance" && darkenWarning
              ? warningClass(chroma(shadeColorHsl).brighten(1).alpha(0.8).css())
              : "none",
          backgroundSize: "7.07px 7.07px",
        }}
      >
        <div
          className="order-3 flex flex-row-reverse items-center gap-2
          @2xl:order-1 @2xl:flex-col"
        >
          {isWCAG2 && <span className="font-mono text-xs">{WCAG2}</span>}
          {isAPCA && <span className="font-mono text-xs">{APCA}%</span>}
          {contrastTabs === "luminance" && (
            <span className="font-mono text-xs">
              {chroma(shadeColorHsl).luminance().toFixed(2)}
            </span>
          )}

          <div
            className={classNames(
              "ic-[warning-sign]",
              isLuminance || WCAGContrast || APCAContrast ? "visible" : "invisible",
            )}
          />
        </div>

        <button
          onClick={handleClick}
          className="group/default relative order-2 flex w-full flex-1 items-center justify-center @2xl:h-12"
        >
          {defaultShade && (
            <div className="ic-[lock] absolute inset-0 m-auto group-hover/default:invisible" />
          )}
          <span className="invisible text-xs group-hover/default:visible">
            {defaultShade ? "Unlock" : "Lock"}
          </span>
        </button>

        <div
          className="group/info relative order-1 col-span-2 flex min-w-0 items-center gap-4
          @2xl:order-3 @2xl:col-span-1 @2xl:flex-col @2xl:gap-1"
        >
          <div className="font-mono font-light @2xl:text-xl">{shadeName}</div>

          <UiPopover
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            triggerClassName="flex items-center gap-4 justify-center @2xl:gap-1"
            trigger={
              <>
                <span
                  className={classNames(
                    "pointer-events-none visible min-w-0 truncate font-mono text-xs uppercase @2xl:absolute @2xl:bottom-0 @2xl:leading-4",
                    isOpen ? "invisible" : "@2xl:group-hover/info:invisible",
                  )}
                >
                  {shadeColorHex}
                </span>
                <button
                  className={classNames(isOpen ? "visible" : "invisible group-hover/info:visible")}
                >
                  <div className="ic-[c-info-e]" />
                </button>
              </>
            }
          >
            {colorCodePopover}
          </UiPopover>
        </div>
      </div>
    </div>
  );
};

export default ShadeBlock;
