import {RadioGroup} from "@headlessui/react";
import {useAtom} from "jotai";
import {colorSpacesAtom} from "../../atom";
import classNames from "classnames";

interface ColorSpacesProps {}

const colorSpacesOptions = ["hex", "hsl", "rgb"];

const ColorSpaces = ({}: ColorSpacesProps) => {
  const [colorSpaces, setColorSpaces] = useAtom(colorSpacesAtom);

  return (
    <div className="bg-black/5 dark:bg-white/10 p-4 rounded-lg flex flex-col gap-4">
      <h3 className="text-sm">Color Spaces</h3>
      <RadioGroup value={colorSpaces} onChange={setColorSpaces}>
        <RadioGroup.Label className="sr-only">WCAG2 Contrast</RadioGroup.Label>
        <div className="grid grid-cols-3 gap-4">
          {colorSpacesOptions.map((plan) => (
            <RadioGroup.Option
              key={plan}
              value={plan}
              className={({active, checked}) =>
                classNames(
                  "border p-2 rounded-lg text-center flex justify-center items-center cursor-pointer",
                  checked
                    ? "text-current border-gray-500 dark:border-gray-300"
                    : "text-gray-500 border-gray-200 dark:border-gray-700",
                )
              }
              onClick={() => {
                setColorSpaces(plan as "hex" | "hsl" | "rgb");
              }}
            >
              {({active, checked}) => (
                <RadioGroup.Label as="p" className="text-xs uppercase">
                  {plan}
                </RadioGroup.Label>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default ColorSpaces;
