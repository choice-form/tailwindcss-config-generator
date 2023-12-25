import {Config, Contrast, CssVariables, ColorSpaces} from ".";

interface SidebarProps {}

const Sidebar = () => {
  return (
    <div className="container pointer-events-none fixed inset-x-0 bottom-8 top-24 mx-auto flex justify-end">
      <div className="pointer-events-auto hidden w-96 shrink-0 md:block">
        <div className="flex h-full min-h-0 flex-col gap-4">
          <ColorSpaces />
          <Contrast />
          <CssVariables />
          <Config />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
