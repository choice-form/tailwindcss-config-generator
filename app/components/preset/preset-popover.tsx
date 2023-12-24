import {UiPopover} from "../ui";
import preset from "../../../public/preset.json";
import {projectsAtom} from "../../atom";
import {useAtom} from "jotai";
import {ProjectProps} from "../../type";
import {useState} from "react";
import classNames from "classnames";

interface PresetPopoverProps {}

const PresetPopover = ({}: PresetPopoverProps) => {
  const [projects, setProjects] = useAtom(projectsAtom);
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
            "bg-black text-white hover:bg-light-200 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ring ring-white/50 dark:ring-black/50 dark:bg-white dark:text-black",
            isOpen && "ring ring-black/30 dark:ring-white/30",
          )}
        >
          <div className="ic-[shapes]" />
          Select Preset
        </button>
      }
    >
      <ul className="bg-white dark:bg-gray-800 shadow-lg rounded-lg max-h-screen border p-2 dark:border-gray-700 overflow-y-auto">
        {preset.map((preset, i) => (
          <li
            key={i}
            className="p-2 rounded hover:bg-black/5 dark:hover:bg-white/5"
            onClick={() => {
              setProjects({
                ...projects,
                shades: preset.shades,
              } as ProjectProps);

              setIsOpen(false);
            }}
          >
            <div className="flex items-center rounded overflow-hidden cursor-pointer">
              {preset.shades.map((shade, j) => (
                <div
                  key={j}
                  className="flex items-center gap-2 w-8 h-8"
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
