import {Button, Kbd} from "@nextui-org/react";
import {useState} from "react";
import {updateProject} from "../../store/commands/update-project";
import {useService, useStore} from "../../store/provider";
import {ContrastTabsType, W3cContrastType} from "../../type";
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
  const [contrastState, setContrastState] = useState(options[1]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <UiPopover
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        className="z-50 flex flex-col gap-2 rounded-lg bg-background p-2 shadow-xl ring-1 ring-black/5"
        placement="bottom-end"
        trigger={
          <Button
            variant="light"
            endContent={
              contrastState.label && <Kbd className="whitespace-nowrap">{contrastState.label}</Kbd>
            }
            onPress={() => setIsOpen(!isOpen)}
          >
            <span className="capitalize">{contrastState.contrastTab}</span>
          </Button>
        }
      >
        {options.map((option, index) => (
          <Button
            key={index}
            className="w-full justify-start px-2 text-left"
            variant={option.label === contrastState.label ? "solid" : "light"}
            size="sm"
            onPress={() => {
              const command = updateProject(project, (draft) => {
                draft.accessibility.wcag2Contrast = option.wcag2Contrast as W3cContrastType;
                draft.accessibility.apcaContrast = option.apcaContrast as W3cContrastType;
                draft.accessibility.luminanceWarning.brighten = option.brighten as boolean;
                draft.accessibility.luminanceWarning.darken = option.darken as boolean;
              });
              service.execute(command);
              service.patch({contrastTabs: option.contrastTab as ContrastTabsType});
              setContrastState(option);
              setIsOpen(false);
            }}
          >
            <div className="flex flex-1 items-center gap-2">
              <span className="w-24 flex-1 uppercase">{option.contrastTab}</span>
              {option.label && <Kbd className="m-px whitespace-nowrap text-xs">{option.label}</Kbd>}
            </div>
          </Button>
        ))}
      </UiPopover>
    </>
  );
};

export default ContrastPopover;
