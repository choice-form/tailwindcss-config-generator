import classNames from "classnames";
import {useState} from "react";
import preset from "../../../public/preset.json";
import {updateProjectCommand} from "../../store/commands/update-project";
import {useService, useStore} from "../../store/provider";
import {ProjectProps} from "../../type";
import {UiPopover} from "../ui";
import {Button} from "@nextui-org/react";

interface PresetPopoverProps {}

const PresetPopover = ({}: PresetPopoverProps) => {
  const service = useService();
  const project = useStore((state) => state.project);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <UiPopover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      placement="bottom-start"
      className="z-50"
      trigger={
        <Button startContent={<div className="ic-[shapes]" />} onClick={() => setIsOpen(true)}>
          Select Preset
        </Button>
      }
    >
      <ul className="max-h-screen overflow-y-auto rounded-lg border bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
        {preset.map((preset, i) => (
          <li
            key={i}
            className="rounded p-2 hover:bg-black/5 dark:hover:bg-white/5"
            onClick={() => {
              service.execute(
                updateProjectCommand(project, {shades: preset.shades as ProjectProps["shades"]}),
              );

              setIsOpen(false);
            }}
          >
            <div className="flex cursor-pointer items-center overflow-hidden rounded">
              {preset.shades.map((shade, j) => (
                <div
                  key={j}
                  className="flex h-8 w-8 items-center gap-2"
                  style={{
                    backgroundColor: shade.initColor,
                  }}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </UiPopover>
  );
};

export default PresetPopover;
