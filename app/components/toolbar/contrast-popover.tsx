import {updateProject} from "../../store/commands/update-project";
import {useService, useStore} from "../../store/provider";
import {ContrastTabsType, W3cContrastType} from "../../type";
import classNames from "classnames";
import {useState} from "react";
import {UiPopover} from "../ui";

interface ContrastPopoverProps {}

const staticFields = {
  luminanceWarning: {brighten: false, darken: false},
  wcag2Contrast: {wcag2Contrast: "none", apcaContrast: "none"},
  apcaContrast: {wcag2Contrast: "none", apcaContrast: "none"},
};

const options = [
  {
    label: undefined,
    contrastTab: "None",
    ...staticFields.luminanceWarning,
    ...staticFields.wcag2Contrast,
    ...staticFields.apcaContrast,
  },
  {label: "1%", contrastTab: "luminance", brighten: true, darken: true},
  {label: "4.5+ (AA)", contrastTab: "wcag2", wcag2Contrast: "aa"},
  {label: "7+ (AAA)", contrastTab: "wcag2", wcag2Contrast: "aaa"},
  {label: "60%+ (AA)", contrastTab: "apca", apcaContrast: "aa"},
  {label: "80%+ (AAA)", contrastTab: "apca", apcaContrast: "aaa"},
];

const ContrastPopover = ({}: ContrastPopoverProps) => {
  const service = useService();
  const project = useStore((state) => state.project);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [contrastState, setContrastState] = useState(options[1]);

  return (
    <UiPopover
      isOpen={isAccessibilityOpen}
      setIsOpen={setIsAccessibilityOpen}
      placeOffset={16}
      placement="bottom-end"
      className="z-50"
      triggerClassName="flex items-center gap-1 justify-center"
      trigger={
        <button className="flex items-center gap-1 whitespace-nowrap">
          <span className="capitalize">{contrastState.contrastTab}</span>
          {contrastState.label && <span className="opacity-50">{contrastState.label}</span>}
        </button>
      }
    >
      <ul className="w-64 rounded-lg border bg-white p-2 text-sm text-gray-900 shadow-xl">
        <li className="p-2 text-xs text-gray-300">Web Content Accessibility</li>
        {options.map((option, index) => (
          <li
            key={index}
            className="flex cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
            onClick={() => {
              const command = updateProject(project, (draft) => {
                draft.accessibility.wcag2Contrast = option.wcag2Contrast as W3cContrastType;
                draft.accessibility.apcaContrast = option.apcaContrast as W3cContrastType;
                draft.accessibility.luminanceWarning.brighten = option.brighten as boolean;
                draft.accessibility.luminanceWarning.darken = option.darken as boolean;
              });
              service.execute(command);
              service.patch({contrastTabs: option.contrastTab as ContrastTabsType});
              setContrastState(option);
              setIsAccessibilityOpen(false);
            }}
          >
            <div
              className={classNames(
                contrastState === option
                  ? "ic-[radio-btn-checked]"
                  : "ic-[radio-btn] text-gray-300",
              )}
            />
            <span className="flex-1 uppercase">{option.contrastTab}</span>
            {option.label && (
              <span className="shade-control-badge">
                <span className="text-xs">{option.label}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </UiPopover>
  );
};

export default ContrastPopover;
