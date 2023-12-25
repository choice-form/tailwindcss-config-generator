import {useAtom} from "jotai";
import {UiSwitch} from "../ui";
import {contrastTabsAtom, projectsAtom} from "../../atom";
import {ContrastTabsType, W3cContrastType} from "../../type";
import {UiTabs} from "../ui";

interface ContrastProps {}

const typeOptions = ["luminance", "wcag2", "apca"];

const W3COptions = ["none", "aa", "aaa"];

const Contrast = ({}: ContrastProps) => {
  const [projects, setProjects] = useAtom(projectsAtom);
  const [contrastTabs, setContrastTabs] = useAtom(contrastTabsAtom);

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-black/5 p-4 dark:bg-white/10">
      <h3 className="text-sm">Contrast Checker</h3>
      <UiTabs
        tabs={typeOptions.map((type) => ({
          label: type,
          checked: type === contrastTabs,
          onClick: () => setContrastTabs(type as ContrastTabsType),
        }))}
      />

      {contrastTabs === "luminance" && (
        <>
          <UiSwitch
            enabled={projects.accessibility?.luminanceWarning?.brighten}
            setEnabled={() =>
              setProjects({
                ...projects,
                accessibility: {
                  ...projects.accessibility,
                  luminanceWarning: {
                    ...projects.accessibility?.luminanceWarning,
                    brighten: !projects.accessibility?.luminanceWarning?.brighten,
                  },
                },
              })
            }
            label="Luminance warning"
          />
          <UiSwitch
            enabled={projects.accessibility?.luminanceWarning?.darken}
            setEnabled={() =>
              setProjects({
                ...projects,
                accessibility: {
                  ...projects.accessibility,
                  luminanceWarning: {
                    ...projects.accessibility?.luminanceWarning,
                    darken: !projects.accessibility?.luminanceWarning?.darken,
                  },
                },
              })
            }
            label="Darken warning"
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
            checked: type === projects.accessibility.wcag2Contrast,
            onClick: () => {
              setProjects({
                ...projects,
                accessibility: {
                  ...projects.accessibility,
                  wcag2Contrast: type as W3cContrastType,
                },
              });
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
            checked: type === projects.accessibility.apcaContrast,
            onClick: () => {
              setProjects({
                ...projects,
                accessibility: {
                  ...projects.accessibility,
                  apcaContrast: type as W3cContrastType,
                },
              });
            },
          }))}
        />
      )}
    </div>
  );
};

export default Contrast;
