import classNames from "classnames";

interface UiSwitchProps {
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  label?: string;
}

const UiSwitch = ({enabled, setEnabled, label}: UiSwitchProps) => {
  return (
    <div
      className="flex cursor-pointer select-none items-center gap-2 text-xs"
      onClick={() => setEnabled(!enabled)}
    >
      <div
        className={classNames(
          enabled ? "bg-black dark:bg-white" : "bg-black/20 dark:bg-white/30",
          "relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
          "transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75",
        )}
      >
        <span className="sr-only">Luminance warning</span>
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? "translate-x-3" : "translate-x-0",
            "pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-lg dark:bg-gray-900",
            "ring-0 transition duration-200 ease-in-out",
          )}
        />
      </div>
      {label && <span>{label}</span>}
    </div>
  );
};

export default UiSwitch;
