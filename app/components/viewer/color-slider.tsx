import {Popover, PopoverContent, PopoverTrigger, Slider} from "@nextui-org/react";
import classNames from "classnames";
import {Fragment, useState} from "react";

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
    onChange: (value: number | number[]) => void;
    onChangeEnd?: (value: number | number[]) => void;
    onPointerDown?: (event: React.PointerEvent) => void;
    onPointerUp?: (event: React.PointerEvent) => void;
    connect: boolean;
  }[];
}

const ColorSlider = ({className, label, slider, count, color, centerMark}: ColorSliderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const colorStyle = {
    "--color-default": color?.default,
  } as React.CSSProperties;

  return (
    <>
      <Popover
        isOpen={isOpen}
        onOpenChange={(open) => setIsOpen(open)}
        placement="bottom"
        classNames={{
          content: [
            "grid w-64 grid-cols-[auto_1fr] items-center gap-2",
            "rounded-lg p-4 text-xs",
            "ring-1 ring-black/5 shadow-xl",
          ],
        }}
      >
        <PopoverTrigger>
          <button
            className={classNames(
              className,
              "shade-control-input flex-1 text-sm",
              isOpen && "!border-primary !bg-white dark:!bg-neutral-900",
            )}
          >
            <span className="flex-1 text-left opacity-60 min-w-0 truncate">{label}:</span>
            <span className="shade-control-badge">
              {slider.map((s) => (s.value ?? s.start) / (count || 1)).join(", ")}
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent>
          {slider.map((s, i) => (
            <Fragment key={i}>
              <span className="whitespace-nowrap">{s.label}</span>
              <Slider
                color="foreground"
                hideThumb={true}
                step={s.step}
                maxValue={s.max}
                minValue={s.min}
                defaultValue={s.start}
                value={s.value}
                onChange={s.onChange}
                onChangeEnd={s.onChangeEnd}
                onPointerDown={s.onPointerDown}
                onPointerUp={s.onPointerUp}
              />
            </Fragment>
          ))}
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ColorSlider;
