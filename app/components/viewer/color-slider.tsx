import {UiPopover, UiSlider} from "../ui";
import classNames from "classnames";
import {Fragment} from "react";
import {useState} from "react";

interface ColorSliderProps {
  label?: string;
  count?: number;
  color?: {
    default: string;
  };
  centerMark?: boolean;
  slider: {
    label?: string;
    min: number;
    max: number;
    step: number;
    start: number;
    value: number;
    onChange: any;
    connect: boolean;
  }[];
}

const ColorSlider = ({label, slider, count, color, centerMark}: ColorSliderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const colorStyle = {
    "--color-default": color?.default,
  } as React.CSSProperties;

  return (
    <UiPopover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerClassName="flex-1 flex"
      className="w-64 bg-gray-900/80 text-white dark:bg-white/80 dark:text-gray-900 backdrop-blur
      p-4 rounded-lg grid grid-cols-[auto_1fr] text-xs gap-2 items-center"
      style={colorStyle}
      trigger={
        <button
          className={classNames(
            "shade-control-input flex-1 text-sm",
            isOpen && "!border-primary !bg-white dark:!bg-gray-900",
          )}
        >
          <span className="opacity-60 flex-1 text-left">{label}:</span>
          <span
            className="whitespace-nowrap"
            style={{
              width: `calc(2rem * ${slider.length})`,
            }}
          >
            {slider.length > 1
              ? `[${slider.map((s) => (s.value ?? s.start) / (count || 1)).join(", ")}]`
              : slider.map((s) => (s.value ?? s.start) / (count || 1)).join(", ")}
          </span>
        </button>
      }
    >
      <>
        {slider.map((s, i) => (
          <Fragment key={i}>
            <span className="whitespace-nowrap">{s.label}</span>
            <UiSlider
              className={classNames(
                "min-w-10",
                centerMark &&
                  "before:w-px before:h-full before:bg-white before:absolute before:top-1/2 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2",
              )}
              customClassNames={{
                track: "bg-white/20 dark:bg-black/20 overflow-hidden rounded-full",
                thumb:
                  "cursor-pointer rounded-full bg-gray-800 dark:bg-white shadow ring-2 absolute top-0 h-[var(--slider-thumb)] w-[var(--slider-thumb)]",
              }}
              min={s.min}
              max={s.max}
              step={s.step}
              start={s.start}
              connect={s.connect}
              value={s.value}
              onChange={s.onChange}
            />
          </Fragment>
        ))}
      </>
    </UiPopover>
  );
};

export default ColorSlider;
