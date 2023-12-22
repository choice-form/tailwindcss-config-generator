import { SwatchColorMap } from "../../swatch/generateShades";
import CodeViewer from "./code-viewer";
import Contrast from "./contrast";

interface CodeViewerProps {
  shadesObject: SwatchColorMap;
}

const Sidebar = ({ shadesObject }: CodeViewerProps) => {
  return (
    <div className="flex flex-col gap-4 absolute py-20 right-8 top-0 bottom-0 w-80 pointer-events-none z-50">
      <Contrast />
      <CodeViewer shadesObject={shadesObject} />
    </div>
  );
};

export default Sidebar;
