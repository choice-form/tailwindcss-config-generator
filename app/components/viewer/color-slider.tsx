import {UiPopover, UiSlider} from "../ui";
import classNames from "classnames";
import {Fragment} from "react";
import {useState} from "react";

interface ColorSliderProps {
  className?: string;
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

const ColorSlider = ({className, label, slider, count, color, centerMark}: ColorSliderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const colorStyle = {
    "--color-default": color?.default,
  } as React.CSSProperties;

  return (
    <UiPopover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerClassName="flex-1 flex"
      className="grid w-64 grid-cols-[auto_1fr] items-center gap-2 rounded-lg
      bg-gray-900/80 p-4 text-xs text-white backdrop-blur dark:bg-white/80 dark:text-gray-900"
      style={colorStyle}
      trigger={
        <button
          className={classNames(
            className,
            "shade-control-input flex-1 text-sm",
            isOpen && "!border-primary !bg-white dark:!bg-gray-900",
          )}
        >
          <span className="flex-1 text-left opacity-60">{label}:</span>
          <span className="shade-control-badge">
            {slider.map((s) => (s.value ?? s.start) / (count || 1)).join(", ")}
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
                  "before:absolute before:left-1/2 before:top-1/2 before:h-full before:w-px before:-translate-x-1/2 before:-translate-y-1/2 before:transform before:bg-white",
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
