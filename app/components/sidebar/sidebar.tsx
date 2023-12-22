import {Config, Contrast, CssVar} from ".";
import {SwatchColorMap} from "../../swatch/generateShades";

interface SidebarProps {}

const Sidebar = () => {
  return (
    <div className="shrink-0 hidden w-80 md:block">
      <div className="flex-col flex gap-4">
        <Contrast />
        <CssVar />
        <Config />
      </div>
    </div>
  );
};

export default Sidebar;
