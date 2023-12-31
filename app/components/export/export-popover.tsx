import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import {useState} from "react";
import {useStore} from "../../store/provider";
import Config from "../export/config";
import CssVariables from "../export/css-variables";
import Sidebar from "../export/sidebar";

interface ExportPopoverProps {}

type CodeTabsType = "config" | "css-variables";

const ExportPopover = ({}: ExportPopoverProps) => {
  const project = useStore((state) => state.project);
  const [codeTabs, setCodeTabs] = useState<CodeTabsType>("css-variables");
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <Button variant="light" isDisabled={project.shades.length === 0} onPress={onOpen}>
        Export
      </Button>

      <Modal
        size="5xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="opaque"
        className="light"
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Export</ModalHeader>
              <ModalBody className="border-t p-0">
                <div className="grid h-[512px] min-h-0 grid-cols-[200px_1fr]">
                  <Sidebar />
                  <div className="relative grid min-h-0 grid-cols-1">
                    <div className="absolute inset-x-0 top-0 z-10 col-span-2 flex h-16 items-center border-b bg-white px-2">
                      <Tabs
                        size="sm"
                        variant="light"
                        aria-label="Code Tabs"
                        selectedKey={codeTabs}
                        onSelectionChange={setCodeTabs as any}
                      >
                        <Tab key="css-variables" title="CSS Variables" />
                        <Tab key="config" title="Config" />
                      </Tabs>
                    </div>
                    {codeTabs === "css-variables" && <CssVariables />}
                    {codeTabs === "config" && <Config />}

                    {project.colorSpaces === "hex" && (
                      <div className="col-span-2 flex border-t p-4 text-left leading-4">
                        <span className="text-xs opacity-60">
                          In the HEX color space, due to the lack of alpha channel support, it's not
                          possible to directly represent transparency. For instance, when using HEX
                          codes (like bg-blue-500/50), achieving a 50% transparency effect is
                          unfeasible.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ExportPopover;
