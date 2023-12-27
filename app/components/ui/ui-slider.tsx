import classNames from "classnames";
import {CSSProperties, createRef, useEffect, useRef, useState} from "react";

import {useService, useStore} from "../../store/provider";
export interface UiSliderProps {
  className?: string;
  min: number;
  max: number;
  step?: number;
  start: number | number[]; // 默认值，如果是数组，则为范围选择默认值
  range?: {
    min: number;
    max: number;
  };
  value?: number | number[];
  onChange?: (value: number | number[]) => void;
  onPointerDown?: (event: React.PointerEvent) => void;
  onPointerUp?: (event: React.PointerEvent) => void;
  tooltip?: "always" | "drag";
  connect?: boolean;
  disabled?: boolean;
  overflowLabelVisible?: boolean;
  customClassNames?: {
    slider?: string;
    track?: string;
    connect?: string;
    thumb?: string;
    thumbSize?: string; // 滑动条把手的大小 (rem)
    tooltip?: string;
  };
}

const UiSlider = ({
  className,
  min,
  max,
  step = 1,
  start,
  range,
  value,
  tooltip,
  connect = false,
  disabled = false,
  customClassNames,
  overflowLabelVisible = false,
  onChange,
  onPointerDown,
  onPointerUp,
}: UiSliderProps) => {
  // 创建引用来存储滑动条和滑动条的值
  const connectRef = useRef<HTMLDivElement>(null);
  const connectValueRef = useRef<HTMLDivElement>(null);
  // 判断 start 是否为数组，从而确定是否为范围选择器
  const isRange = Array.isArray(start);
  // 创建状态来存储滑动条的值
  const [values, setValues] = useState<number[]>(isRange ? (start as number[]) : [start as number]);
  // 创建一个引用数组来存储滑动条的把手
  const handleRefs = useRef(
    Array(values.length)
      .fill(0)
      .map(() => createRef<HTMLDivElement>()),
  );
  // 创建一个引用来存储滑动条的 DOM 元素
  const sliderRef = useRef<HTMLDivElement>(null);
  // 创建一个状态来存储滑动条是否正在拖动

  const service = useService();
  const uiIsBusy = useStore((state) => state.uiIsBusy);

  // 处理鼠标按下事件，这将启动滑动条的拖动功能
  const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    service.patch({uiIsBusy: true});
    const handleMouseMove = (e: MouseEvent) => {
      if (!sliderRef.current) return;
      const sliderStart = sliderRef.current.getBoundingClientRect().left;
      const newLeft = e.clientX - sliderStart;
      const newValue = calculateValue(newLeft, sliderRef.current.offsetWidth);
      setValues((prevValues) => {
        const newValues = [...prevValues];
        if (index === 0 && newValue > values[1]) {
          newValues[0] = values[1];
        } else if (index === 1 && newValue < values[0]) {
          newValues[1] = values[0];
        } else {
          newValues[index] = newValue;
        }
        setTimeout(() => {
          if (isRange) {
            onChange && onChange(newValues as number[]);
          } else {
            onChange && onChange(newValues[0]);
          }
        }, 0);
        return newValues;
      });
    };

    const handleMouseUp = () => {
      if (disabled) return;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      service.patch({uiIsBusy: false});
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // 根据鼠标的位置计算滑动条的值
  const calculateValue = (newLeft: number, sliderWidth: number) => {
    let newValue = Math.round(
      (newLeft / sliderWidth) * ((range?.max || max) - (range?.min || min)) + (range?.min || min),
    );
    newValue = Math.round(newValue / step) * step;
    if (newValue < (range?.min || min)) {
      return range?.min || min;
    }
    if (newValue > (range?.max || max)) {
      return range?.max || max;
    }
    return newValue;
  };

  // 更新滑动条的把手的引用
  useEffect(() => {
    handleRefs.current = handleRefs.current.slice(0, values.length);
    for (let i = 0; i < values.length; i++) {
      if (!handleRefs.current[i]) {
        handleRefs.current[i] = createRef<HTMLDivElement>();
      }
    }
  }, [values.length]);

  // 更新滑动条的把手的位置
  useEffect(() => {
    handleRefs.current.forEach((handleRef, index) => {
      if (!handleRef.current || !sliderRef.current) return;
      handleRef.current.style.left = `calc(${
        (values[index] - (range?.min || min)) / ((range?.max || max) - (range?.min || min))
      } * 100% - var(--slider-thumb) / 2)`;
    });
  }, [values, min, max, range]);

  // 更新滑动条的连接部分（如果存在）的位置和宽度
  useEffect(() => {
    if (connectRef.current) {
      if (range) {
        // 只有在 range 存在时，才计算并显示 connect 的值
        const connectValue = Math.abs(values[0] - values[1]);
        if (connectValueRef.current) {
          connectValueRef.current.textContent = connectValue.toString();
        }
      }

      if (isRange) {
        const handle1Pos =
          ((values[0] - (range?.min || min)) / ((range?.max || max) - (range?.min || min))) * 100;
        const handle2Pos =
          ((values[1] - (range?.min || min)) / ((range?.max || max) - (range?.min || min))) * 100;
        connectRef.current.style.left = Math.min(handle1Pos, handle2Pos) + "%";
        connectRef.current.style.width = Math.abs(handle1Pos - handle2Pos) + "%";
      } else if (handleRefs.current.length === 1) {
        const handlePos =
          ((values[0] - (range?.min || min)) / ((range?.max || max) - (range?.min || min))) * 100;
        connectRef.current.style.left = "0%";
        connectRef.current.style.width = handlePos + "%";
      }
    }
  }, [values, min, max, range]);

  // 更新滑动条的值
  useEffect(() => {
    if (value !== undefined) {
      setValues(Array.isArray(value) ? value : [value]);
    }
  }, [value]);

  // 处理鼠标点击事件，这将移动最接近点击位置的滑动条的把手
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    if (!sliderRef.current) return;
    const sliderStart = sliderRef.current.getBoundingClientRect().left;
    const clickPosition = e.clientX - sliderStart;
    const clickValue = calculateValue(clickPosition, sliderRef.current.offsetWidth);
    const closestHandleIndex = getClosestHandle(clickValue);
    setValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[closestHandleIndex] = clickValue;
      setTimeout(() => {
        if (isRange) {
          onChange && onChange(newValues as number[]);
        } else {
          onChange && onChange(newValues[0]);
        }
      }, 0);
      return newValues;
    });
  };

  // 获取最接近给定值的滑动条的把手的索引
  const getClosestHandle = (value: number) => {
    if (values.length === 1) return 0;
    const distances = values.map((v) => Math.abs(v - value));
    return distances.indexOf(Math.min(...distances));
  };

  return (
    <div
      role="slider"
      style={
        {
          "--slider-thumb": "0.75rem",
        } as CSSProperties
      }
      className={classNames(
        "relative w-full pl-[calc(var(--slider-thumb)/2)] pr-[calc(var(--slider-thumb)/2)]",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* 值超出最大限制时，给一个超出的提示 */}
      {overflowLabelVisible && <div className="-top-6.5 absolute right-0">{max}+</div>}
      <div
        className={classNames(
          customClassNames?.slider,
          "relative h-[var(--slider-thumb)] w-full text-primary",
        )}
        ref={sliderRef}
        onClick={handleClick}
      >
        <div
          className={classNames(
            customClassNames?.track ||
              "overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700",
            "absolute inset-x-[calc(var(--slider-thumb)/-2)] top-[calc(var(--slider-thumb)/4)] h-[calc(var(--slider-thumb)/2)]",
          )}
        >
          {connect && (
            <div
              className={classNames(customClassNames?.connect || "bg-current", "absolute h-full")}
              ref={connectRef}
            />
          )}
        </div>
        {handleRefs.current.map((handleRef, index) => (
          <div
            key={index}
            className={classNames(
              customClassNames?.thumb ||
                "cursor-pointer rounded-full bg-white shadow ring-2 dark:bg-neutral-800",
              "absolute top-0 h-[var(--slider-thumb)] w-[var(--slider-thumb)]",
              disabled ? "ring-secondary cursor-not-allowed" : "ring-current",
            )}
            ref={handleRef}
            onMouseDown={handleMouseDown(index)}
          >
            {(tooltip === "always" || (tooltip === "drag" && uiIsBusy)) && (
              <div
                className={classNames(
                  customClassNames?.tooltip ||
                    "rounded-xs absolute bottom-full mb-2 ml-[50%] flex -translate-x-1/2 bg-current px-2 py-1 leading-4",
                )}
              >
                <span className="text-body text-xs">{values[index]}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UiSlider;
