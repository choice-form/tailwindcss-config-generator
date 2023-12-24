import chroma from "chroma-js";
import {formatHSL, formatHSV, formatLAB, formatLCH, formatRGB} from "../../utilities";
import {Fragment, useEffect, useRef, useState} from "react";
import classNames from "classnames";

interface ColorCodePopoverProps {
  color: string;
  style?: React.CSSProperties;
}

interface formats {
  [key: string]: string;
}

interface formatsRef {
  [key: string]: React.RefObject<HTMLPreElement>;
}

type CopiedState = {
  [key in "hex" | "hsl" | "hsv" | "rgb" | "lab" | "lch"]: boolean;
};

const ColorCodePopover = ({color, style}: ColorCodePopoverProps) => {
  const formatMap: formats = {
    hex: chroma(color).hex(),
    hsl: `hsl(${formatHSL(color)})`,
    hsv: `hsv(${formatHSV(color)})`,
    rgb: `rgb(${formatRGB(color)})`,
    lab: `lab(${formatLAB(color)})`,
    lch: `lch(${formatLCH(color)})`,
  };

  const initialCopiedState: CopiedState = {
    hex: false,
    hsl: false,
    hsv: false,
    rgb: false,
    lab: false,
    lch: false,
  };
  const [copied, setCopied] = useState(initialCopiedState);

  const refMap: formatsRef = {
    hex: useRef<HTMLPreElement>(null),
    hsl: useRef<HTMLPreElement>(null),
    hsv: useRef<HTMLPreElement>(null),
    rgb: useRef<HTMLPreElement>(null),
    lab: useRef<HTMLPreElement>(null),
    lch: useRef<HTMLPreElement>(null),
  };

  const copyToClipboard = async (type: keyof CopiedState) => {
    if (!refMap[type].current) return;
    const textToCopy = refMap[type].current!.innerText;
    await navigator.clipboard.writeText(textToCopy);
    setCopied({...initialCopiedState, [type]: true});
  };

  useEffect(() => {
    const timerIds: NodeJS.Timeout[] = [];

    for (const ref in refMap) {
      if (copied[ref as keyof CopiedState]) {
        const timerId = setTimeout(() => {
          setCopied((prevState) => ({...prevState, [ref]: false}));
        }, 3000);
        timerIds.push(timerId);
      }
    }

    return () => timerIds.forEach((timerId) => clearTimeout(timerId));
  }, [copied]);

  return (
    <code
      className="grid grid-cols-[auto_auto_1fr_auto] gap-2 text-xs p-4 rounded-lg shadow-md"
      style={style}
    >
      {Object.keys(formatMap).map((type) => (
        <Fragment key={type}>
          <button
            className="flex items-center gap-2 opacity-30 hover:opacity-100"
            onClick={() => copyToClipboard(type as keyof CopiedState)}
          >
            <div className="ic-[document-copy] w-3 h-3" />
          </button>
          <span>{type.toUpperCase()}</span>
          <pre ref={refMap[type]}>{formatMap[type]}</pre>
          <span
            className={classNames(
              "text-xs font-medium",
              copied[type as keyof CopiedState] ? "visible" : "invisible",
            )}
          >
            Copied!
          </span>
        </Fragment>
      ))}
    </code>
  );
};

export default ColorCodePopover;
