import {useAtom} from "jotai";
import {UiSwitch} from "../ui";
import {contrastTabsAtom, projectsAtom} from "../../atom";
import {RadioGroup} from "@headlessui/react";
import classNames from "classnames";
import {ContrastTabsType, W3cContrastType} from "../../type";

interface ContrastProps {}

const typeOptions = ["luminance", "wcag2", "apca"];

const W3COptions = ["none", "aa", "aaa"];

const Contrast = ({}: ContrastProps) => {
  const [projects, setProjects] = useAtom(projectsAtom);
  const [contrastTabs, setContrastTabs] = useAtom(contrastTabsAtom);

  return (
    <div className="bg-black/5 dark:bg-white/10 p-4 rounded-lg flex flex-col gap-4">
      <h3 className="text-sm">Contrast Checker</h3>
      <RadioGroup value={contrastTabs}>
        <RadioGroup.Label className="sr-only">Contrast Tabs</RadioGroup.Label>
        <div className="grid grid-cols-3 gap-4">
          {typeOptions.map((plan) => (
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
                setContrastTabs(plan as ContrastTabsType);
              }}
            >
              <RadioGroup.Label as="p" className="text-xs uppercase">
                {plan}
              </RadioGroup.Label>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>

      {contrastTabs === "luminance" && (
        <>
          <UiSwitch
            enabled={projects.accessibility.luminanceWarning.brighten}
            setEnabled={() =>
              setProjects({
                ...projects,
                accessibility: {
                  ...projects.accessibility,
                  luminanceWarning: {
                    ...projects.accessibility.luminanceWarning,
                    brighten: !projects.accessibility.luminanceWarning.brighten,
                  },
                },
              })
            }
            label="Luminance warning"
          />
          <UiSwitch
            enabled={projects.accessibility.luminanceWarning.darken}
            setEnabled={() =>
              setProjects({
                ...projects,
                accessibility: {
                  ...projects.accessibility,
                  luminanceWarning: {
                    ...projects.accessibility.luminanceWarning,
                    darken: !projects.accessibility.luminanceWarning.darken,
                  },
                },
              })
            }
            label="Darken warning"
          />
        </>
      )}

      {contrastTabs === "wcag2" && (
        <RadioGroup value={projects.accessibility.wcag2Contrast}>
          <RadioGroup.Label className="sr-only">WCAG2 Contrast</RadioGroup.Label>
          <div className="grid grid-cols-3 gap-4">
            {W3COptions.map((plan) => (
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
                  setProjects({
                    ...projects,
                    accessibility: {
                      ...projects.accessibility,
                      wcag2Contrast: plan as W3cContrastType,
                    },
                  });
                }}
              >
                <RadioGroup.Label as="p" className="text-xs">
                  {plan === "none" && "None"}
                  {plan === "aa" && "4.5+ (AA)"}
                  {plan === "aaa" && "7+ (AAA)"}
                </RadioGroup.Label>
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      )}

      {contrastTabs === "apca" && (
        <RadioGroup value={projects.accessibility.apcaContrast}>
          <RadioGroup.Label className="sr-only">APCA Contrast</RadioGroup.Label>
          <div className="grid grid-cols-3 gap-4">
            {W3COptions.map((plan) => (
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
                  setProjects({
                    ...projects,
                    accessibility: {
                      ...projects.accessibility,
                      apcaContrast: plan as W3cContrastType,
                    },
                  });
                }}
              >
                <RadioGroup.Label as="p" className="text-xs">
                  {plan === "none" && "None"}
                  {plan === "aa" && " 60%+ (AA)"}
                  {plan === "aaa" && "80%+ (AAA)"}
                </RadioGroup.Label>
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      )}
    </div>
  );
};

export default Contrast;
