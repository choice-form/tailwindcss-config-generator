import {useAtom, useSetAtom} from "jotai";
import {UiSwitch} from "../ui";
import {
  apcaContrastAtom,
  darkenWarningAtom,
  luminanceWarningAtom,
  wcag2ContrastAtom,
  contrastTypeAtom,
} from "../../atom";
import {RadioGroup} from "@headlessui/react";
import {useState} from "react";
import classNames from "classnames";

interface ContrastProps {}

const typeOptions = [
  {
    name: "Luminance",
    value: "luminance",
  },
  {
    name: "WCAG2",
    value: "wcag2",
  },
  {
    name: "APCA",
    value: "apca",
  },
];

const W3COptions = [
  {
    name: "None",
    value: true,
  },
  {
    name: "AA",
    value: false,
  },
  {
    name: "AAA",
    value: false,
  },
];

const Contrast = ({}: ContrastProps) => {
  const [luminanceWarning, setLuminanceWarning] = useAtom(luminanceWarningAtom);
  const [darkenWarning, setDarkenWarning] = useAtom(darkenWarningAtom);
  const setWcag2Contrast = useSetAtom(wcag2ContrastAtom);
  const setApcaContrast = useSetAtom(apcaContrastAtom);
  const [wcag2Selected, setWcag2Selected] = useState(W3COptions[0]);
  const [apcaSelected, setApcaSelected] = useState(W3COptions[0]);
  const [typeSelected, setTypeSelected] = useState(typeOptions[0]);
  const [typeState, setTypeState] = useAtom(contrastTypeAtom);

  return (
    <div className="bg-black/5 dark:bg-white/10 p-4 rounded-lg flex flex-col gap-4">
      <h3 className="text-sm">Contrast checker</h3>
      <RadioGroup value={typeSelected} onChange={setTypeSelected}>
        <RadioGroup.Label className="sr-only">Type</RadioGroup.Label>
        <div className="grid grid-cols-3 gap-4">
          {typeOptions.map((plan) => (
            <RadioGroup.Option
              key={plan.name}
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
                setTypeState(plan.value as "luminance" | "wcag2" | "apca");
              }}
            >
              {({active, checked}) => (
                <RadioGroup.Label as="p" className="text-xs">
                  {plan.name}
                </RadioGroup.Label>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      {typeState === "luminance" && (
        <>
          <UiSwitch
            enabled={luminanceWarning}
            setEnabled={setLuminanceWarning}
            label="Luminance warning"
          />
          <UiSwitch enabled={darkenWarning} setEnabled={setDarkenWarning} label="Darken warning" />
        </>
      )}

      {typeState === "wcag2" && (
        <RadioGroup value={wcag2Selected} onChange={setWcag2Selected}>
          <RadioGroup.Label className="sr-only">WCAG2 Contrast</RadioGroup.Label>
          <div className="grid grid-cols-3 gap-4">
            {W3COptions.map((plan) => (
              <RadioGroup.Option
                key={plan.name}
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
                  setWcag2Contrast({
                    aa: plan.name === "AA" ? true : false,
                    aaa: plan.name === "AAA" ? true : false,
                  });
                }}
              >
                {({active, checked}) => (
                  <RadioGroup.Label as="p" className="text-xs">
                    {plan.name === "None" && "None"}
                    {plan.name === "AA" && "4.5+ (AA)"}
                    {plan.name === "AAA" && "7+ (AAA)"}
                  </RadioGroup.Label>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      )}

      {typeState === "apca" && (
        <RadioGroup value={apcaSelected} onChange={setApcaSelected}>
          <RadioGroup.Label className="sr-only">APCA Contrast</RadioGroup.Label>
          <div className="grid grid-cols-3 gap-4">
            {W3COptions.map((plan) => (
              <RadioGroup.Option
                key={plan.name}
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
                  setApcaContrast({
                    aa: plan.name === "AA" ? true : false,
                    aaa: plan.name === "AAA" ? true : false,
                  });
                }}
              >
                {({active, checked}) => (
                  <RadioGroup.Label as="p" className="text-xs">
                    {plan.name === "None" && "None"}
                    {plan.name === "AA" && " 60%+ (AA)"}
                    {plan.name === "AAA" && "80%+ (AAA)"}
                  </RadioGroup.Label>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      )}
    </div>
  );
};

export default Contrast;
