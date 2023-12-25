import {updateProjectCommand} from "../../store/commands/update-project";
import {useService, useStore} from "../../store/provider";
import {W3cContrastType} from "../../type";
import {UiSwitch, UiTabs} from "../ui";

interface ContrastProps {}

const typeOptions = ["luminance", "wcag2", "apca"] as const;
const W3COptions = ["none", "aa", "aaa"] as const;

const Contrast = ({}: ContrastProps) => {
  const service = useService();
  const project = useStore((state) => state.project);
  const contrastTabs = useStore((state) => state.contrastTabs);

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-black/5 p-4 dark:bg-white/10">
      <h3 className="text-sm">Contrast Checker</h3>
      <UiTabs
        tabs={typeOptions.map((type) => ({
          label: type,
          checked: type === contrastTabs,
          onClick: () => {
            service.patch({contrastTabs: type});
          },
        }))}
      />

      {contrastTabs === "luminance" && (
        <>
          <UiSwitch
            label="Luminance warning"
            enabled={project.accessibility?.luminanceWarning?.brighten}
            setEnabled={() => {
              service.execute(
                updateProjectCommand(project, {
                  accessibility: {
                    ...project.accessibility,
                    luminanceWarning: {
                      ...project.accessibility?.luminanceWarning,
                      brighten: !project.accessibility?.luminanceWarning?.brighten,
                    },
                  },
                }),
              );
            }}
          />
          <UiSwitch
            label="Darken warning"
            enabled={project.accessibility?.luminanceWarning?.darken}
            setEnabled={() => {
              service.execute(
                updateProjectCommand(project, {
                  accessibility: {
                    ...project.accessibility,
                    luminanceWarning: {
                      ...project.accessibility?.luminanceWarning,
                      darken: !project.accessibility?.luminanceWarning?.darken,
                    },
                  },
                }),
              );
            }}
          />
        </>
      )}

      {contrastTabs === "wcag2" && (
        <UiTabs
          tabs={W3COptions.map((type) => ({
            label: {
              none: "None",
              aa: "4.5+ (AA)",
              aaa: "7+ (AAA)",
            }[type as W3cContrastType],
            checked: type === project.accessibility.wcag2Contrast,
            onClick: () => {
              service.execute(
                updateProjectCommand(project, {
                  accessibility: {
                    ...project.accessibility,
                    wcag2Contrast: type,
                  },
                }),
              );
            },
          }))}
        />
      )}

      {contrastTabs === "apca" && (
        <UiTabs
          tabs={W3COptions.map((type) => ({
            label: {
              none: "None",
              aa: "60%+ (AA)",
              aaa: "80%+ (AAA)",
            }[type as W3cContrastType],
            checked: type === project.accessibility.apcaContrast,
            onClick: () => {
              service.execute(
                updateProjectCommand(project, {
                  accessibility: {
                    ...project.accessibility,
                    apcaContrast: type,
                  },
                }),
              );
            },
          }))}
        />
      )}
    </div>
  );
};

export default Contrast;
