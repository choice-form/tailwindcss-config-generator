import {useState} from "react";
import {useStore} from "../../store/provider";
import Config from "../export/config";
import CssVariables from "../export/css-variables";
import Sidebar from "../export/sidebar";
import {UiDialog, UiTabs} from "../ui";

interface ExportPopoverProps {}

const ExportPopover = ({}: ExportPopoverProps) => {
  const project = useStore((state) => state.project);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [codeTabs, setCodeTabs] = useState<"config" | "css-variables">("css-variables");

  return (
    <UiDialog
      isOpen={isExportOpen}
      setIsOpen={setIsExportOpen}
      className="relative w-[768px] max-w-[90%] rounded-lg bg-white text-center text-gray-900 shadow-lg outline-none"
      triggerClassName="flex items-center gap-1 justify-center"
      trigger={<button>Export</button>}
    >
      <header className="flex items-center gap-4 border-b p-4 text-left">
        <h1 className="flex-1 font-bold">Export</h1>
        <button onClick={() => setIsExportOpen(false)}>
          <div className="ic-[e-remove]" />
        </button>
      </header>

      <div className="grid h-[512px] min-h-0 grid-cols-[200px_1fr]">
        <Sidebar />
        <div className="relative grid min-h-0 grid-cols-1">
          <div className="absolute inset-x-0 top-0 z-10 col-span-2 flex h-12 items-center border-b bg-white px-2">
            <UiTabs
              className="text-sm"
              tabs={[
                {
                  label: "CSS Variables",
                  checked: codeTabs === "css-variables",
                  onClick: () => {
                    setCodeTabs("css-variables");
                  },
                },
                {
                  label: "Config",
                  checked: codeTabs === "config",
                  onClick: () => {
                    setCodeTabs("config");
                  },
                },
              ]}
            />
          </div>
          {codeTabs === "css-variables" && <CssVariables />}
          {codeTabs === "config" && <Config />}

          {project.colorSpaces === "hex" && (
            <div className="col-span-2 flex border-t p-4 text-left leading-4">
              <span className="text-xs opacity-60">
                In the HEX color space, due to the lack of alpha channel support, it's not possible
                to directly represent transparency. For instance, when using HEX codes (like
                bg-blue-500/50), achieving a 50% transparency effect is unfeasible.
              </span>
            </div>
          )}
        </div>
      </div>
    </UiDialog>
  );
};

export default ExportPopover;
