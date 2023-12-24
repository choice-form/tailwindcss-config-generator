import classNames from "classnames";
import {projectsAtom, contrastTabsAtom} from "../../atom";
import {useAtomValue} from "jotai";
import chroma from "chroma-js";
import {contrastAPCA} from "../../utilities";
import {UiPopover} from "../ui";

interface ShadeProps {
  shadeName: string;
  shadeColorReadable: string;
  shadeColorHsl: string;
  shadeColorHex: string;
  defaultShade: boolean;
  luminanceWarning: boolean;
  darkenWarning: boolean;
  isMobile: boolean;
  handleClick: () => void;
  colorCodePopover?: React.ReactNode;
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
  handleClick,
  colorCodePopover,
}: ShadeProps) => {
  const projects = useAtomValue(projectsAtom);
  const contrastTabs = useAtomValue(contrastTabsAtom);

  const WCAG2 = chroma.contrast(shadeColorReadable, shadeColorHsl).toFixed(1);
  const APCA = contrastAPCA(shadeColorReadable, shadeColorHsl);

  const isWCAG2 = contrastTabs === "wcag2" && projects.accessibility.wcag2Contrast !== "none";
  const isAPCA = contrastTabs === "apca" && projects.accessibility.apcaContrast !== "none";
  const isLuminance = contrastTabs === "luminance" && (luminanceWarning || darkenWarning);

  /** WCAG2 stands for Web Content Accessibility Guidelines 2.
   * It is a set of guidelines developed by the World Wide Web Consortium (W3C) to ensure that web content is accessible to people with disabilities.
   * These guidelines provide recommendations for making web content perceivable, operable, understandable, and robust.
   */
  const WCAGContrast =
    (isWCAG2 && projects.accessibility.wcag2Contrast === "aa" && Number(WCAG2) < 4.5) ||
    (isWCAG2 && projects.accessibility.wcag2Contrast === "aaa" && Number(WCAG2) < 7);

  /** APCA stands for Average Picture Complexity Analysis.
   * It is a method used to measure the visual complexity of an image.
   * APCA calculates the average complexity of an image by analyzing its pixel values and determining the level of detail and variation present.
   */
  const APCAContrast =
    (isAPCA && projects.accessibility.apcaContrast === "aa" && Math.abs(Number(APCA)) < 60) ||
    (isAPCA && projects.accessibility.apcaContrast === "aaa" && Math.abs(Number(APCA)) < 80);

  const warningClass = (color: string) =>
    `linear-gradient(135deg,${color} 10%,#0000 0,#0000 50%,${color} 0,${color} 60%,#0000 0,#0000)`;

  return (
    <div className={classNames("min-w-0 flex-0 p-1", isMobile ? "w-full" : "w-[calc(100%/11)]")}>
      <div
        className={classNames(
          "items-center w-full relative whitespace-nowrap rounded-lg grid min-w-0 select-none",
          isMobile
            ? "flex-row gap-4 py-2 pr-4 pl-2 grid-cols-4"
            : "aspect-[9/18] p-2 grid-rows-3 place-content-center",
        )}
        style={{
          color: shadeColorReadable,
          backgroundColor: shadeColorHsl,
          backgroundImage:
            WCAGContrast || APCAContrast
              ? warningClass("rgba(255,255,255,0.5)")
              : contrastTabs === "luminance" && luminanceWarning
              ? warningClass("rgba(0,0,0,0.2)")
              : contrastTabs === "luminance" && darkenWarning
              ? warningClass("rgba(255,255,255,0.3)")
              : "none",
          backgroundSize: "7.07px 7.07px",
        }}
      >
        <div
          className={classNames(
            "flex items-center",
            isMobile ? "order-5 gap-4 flex-row-reverse" : "gap-2 flex-col",
          )}
        >
          {isWCAG2 && <span className="text-xs px-1 rounded">{WCAG2}</span>}
          {isAPCA && <span className="text-xs px-1 rounded">{APCA}%</span>}

          <div
            className={classNames(
              "ic-[warning-sign]",
              isLuminance || WCAGContrast || APCAContrast ? "visible" : "invisible",
            )}
          />
        </div>

        <button
          onClick={handleClick}
          className={classNames(
            "group/default w-full flex items-center justify-center relative",
            isMobile ? "order-4 flex-1" : "h-12",
          )}
        >
          {defaultShade && (
            <div className="ic-[lock] group-hover/default:invisible absolute inset-0 m-auto" />
          )}
          <span className="text-xs invisible group-hover/default:visible">
            {defaultShade ? "Unlock" : "Lock"}
          </span>
        </button>

        <div
          className={classNames(
            "flex min-w-0 items-center relative group/info",
            isMobile ? "col-span-2 gap-2" : "flex-col gap-1",
          )}
        >
          <strong>{shadeName}</strong>

          <UiPopover
            triggerClassName="flex items-center gap-1 justify-center"
            trigger={(isOpen) => (
              <>
                <span
                  className={classNames(
                    "text-xs truncate min-w-0 pointer-events-none",
                    isMobile
                      ? "visible"
                      : classNames(
                          "absolute bottom-0 leading-4",
                          isOpen ? "invisible" : "group-hover/info:invisible",
                        ),
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
            )}
          >
            {colorCodePopover}
          </UiPopover>
        </div>
      </div>
    </div>
  );
};

export default Shade;
