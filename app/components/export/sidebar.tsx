import classNames from "classnames";
import {useService, useStore} from "../../store/provider";

interface SidebarProps {}

const exportOptions = ["hex", "hsl", "rgb"] as const;

const Sidebar = ({}: SidebarProps) => {
  const service = useService();
  const colorSpaces = useStore((state) => state.project.colorSpaces);

  return (
    <ul className="flex min-h-0 flex-col gap-4 whitespace-nowrap border-r p-4 text-sm">
      {exportOptions.map((type, index) => (
        <li
          key={type}
          className={classNames(
            "flex cursor-pointer items-center gap-2",
            type === colorSpaces ? "font-bold" : "opacity-60",
          )}
          onClick={() => {
            const prevColorSpaces = colorSpaces;
            service.execute({
              prev: {
                project: {
                  colorSpaces: prevColorSpaces,
                },
              },
              next: {
                project: {
                  colorSpaces: type as typeof colorSpaces,
                },
              },
            });
          }}
        >
          Tailwind <span className="uppercase">{type}</span>
        </li>
      ))}
    </ul>
  );
};

export default Sidebar;
