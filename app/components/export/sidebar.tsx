import {Button} from "@nextui-org/react";
import {useService, useStore} from "../../store/provider";

interface SidebarProps {}

const exportOptions = ["hex", "hsl", "rgb"] as const;

const Sidebar = ({}: SidebarProps) => {
  const service = useService();
  const colorSpaces = useStore((state) => state.project.colorSpaces);

  return (
    <ul className="flex min-h-0 flex-col gap-4 whitespace-nowrap border-r p-4 text-sm">
      {exportOptions.map((type, index) => (
        <Button
          key={type}
          size="sm"
          className="justify-start text-left"
          variant={type === colorSpaces ? "solid" : "light"}
          onPress={() => {
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
        </Button>
      ))}
    </ul>
  );
};

export default Sidebar;
