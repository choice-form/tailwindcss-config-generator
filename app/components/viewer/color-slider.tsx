import {Button, Kbd, Slider} from "@nextui-org/react";
import classNames from "classnames";
import {Fragment, useState} from "react";
import {UiPopover} from "../ui";

interface ColorSliderProps {
  className?: string;
  label?: string;
  count?: number;
  centerMark?: boolean;
  slider: {
    label?: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number | number[];
    value: number | number[];
    fillOffset?: number;
    onChange: (value: number | number[]) => void;
    onChangeEnd?: (value: number | number[]) => void;
    onPointerDown?: (event: React.PointerEvent) => void;
    onPointerUp?: (event: React.PointerEvent) => void;
  }[];
}

const ColorSlider = ({className, label, slider}: ColorSliderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <UiPopover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      placement="bottom"
      className={classNames(
        [
          "bg-background",
          "grid w-64 grid-cols-[auto_1fr] items-center gap-2",
          "rounded-lg p-4 text-xs",
          "shadow-xl ring-1 ring-black/5",
        ],
        className,
      )}
      triggerClassName="w-full min-w-0"
      trigger={
        <Button
          className="w-full min-w-0 bg-default-100 px-2"
          endContent={<Kbd>{slider.map((s) => s.value ?? s.defaultValue).join(" - ")}</Kbd>}
          onPress={() => setIsOpen(!isOpen)}
        >
          <span title={label} className="min-w-0 flex-1 truncate text-left opacity-60">
            {label}:
          </span>
        </Button>
      }
    >
      {slider.map((s, i) => (
        <Fragment key={i}>
          <span className="whitespace-nowrap">{s.label}</span>
          <Slider
            size="sm"
            color="foreground"
            showOutline={true}
            step={s.step}
            maxValue={s.max}
            minValue={s.min}
            defaultValue={s.defaultValue}
            fillOffset={s.fillOffset}
            value={s.value}
            onChange={s.onChange}
            onChangeEnd={s.onChangeEnd}
            onPointerDown={s.onPointerDown}
            onPointerUp={s.onPointerUp}
          />
        </Fragment>
      ))}
    </UiPopover>
  );
};

export default ColorSlider;
