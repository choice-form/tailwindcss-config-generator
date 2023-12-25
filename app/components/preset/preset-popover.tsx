import classNames from "classnames";
import {useState} from "react";
import preset from "../../../public/preset.json";
import {updateProjectCommand} from "../../store/commands/update-project";
import {useService, useStore} from "../../store/provider";
import {ProjectProps} from "../../type";
import {UiPopover} from "../ui";

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
        <button
          className={classNames(
            "hover:bg-light-200 flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm text-white ring ring-white/50 dark:bg-white dark:text-black dark:ring-black/50",
            isOpen && "ring ring-black/30 dark:ring-white/30",
          )}
        >
          <div className="ic-[shapes]" />
          Select Preset
        </button>
      }
    >
      <ul className="max-h-screen overflow-y-auto rounded-lg border bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
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
