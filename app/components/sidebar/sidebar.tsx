import {Config, Contrast, CssVariables} from ".";
import {SwatchColorMap} from "../../generate-shades/generate-shades";

interface SidebarProps {}

const Sidebar = () => {
  return (
    <div className="fixed top-24 inset-x-0 bottom-8 pointer-events-none container mx-auto flex justify-end">
      <div className="shrink-0 hidden w-96 md:block pointer-events-auto">
        <div className="flex-col flex gap-4 min-h-0 h-full">
          <Contrast />
          <CssVariables />
          <Config />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
