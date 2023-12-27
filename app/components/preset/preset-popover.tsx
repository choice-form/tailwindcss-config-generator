import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import preset from "../../../public/preset.json";
import {updateProjectCommand} from "../../store/commands/update-project";
import {useService, useStore} from "../../store/provider";
import {ProjectProps} from "../../type";

interface PresetPopoverProps {}

export const PresetPopover = ({}: PresetPopoverProps) => {
  const service = useService();
  const project = useStore((state) => state.project);

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  return (
    <>
      <Button startContent={<div className="ic-[shapes]" />} onPress={onOpen}>
        Select Preset
      </Button>

      <Modal
        size="3xl"
        backdrop="opaque"
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Shades Preset</ModalHeader>
              <ModalBody className="pb-4">
                <ul className="grid h-[512px] grid-cols-3 gap-4 overflow-y-auto">
                  {preset.map((preset, i) => (
                    <li
                      key={i}
                      className="rounded-xl p-2 hover:bg-black/5 dark:hover:bg-white/5"
                      onClick={() => {
                        service.execute(
                          updateProjectCommand(project, {
                            shades: preset.shades as ProjectProps["shades"],
                          }),
                        );

                        onClose();
                      }}
                    >
                      <div
                        className="grid cursor-pointer items-center overflow-hidden rounded-lg"
                        style={{
                          gridTemplateColumns: `repeat(${preset.shades.length}, 1fr)`,
                        }}
                      >
                        {preset.shades.slice(0, 8).map((shade, j) => (
                          <div
                            key={j}
                            className="flex aspect-square items-center gap-2"
                            style={{
                              backgroundColor: shade.initColor,
                            }}
                          />
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
