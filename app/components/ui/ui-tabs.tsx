import classNames from "classnames";

interface UiTabsProps {
  className?: string;
  tabs: {
    label: string;
    checked: boolean;
    onClick: () => void;
  }[];
}

const UiTabs = ({tabs, className}: UiTabsProps) => {
  return (
    <div
      role="tablist"
      className={classNames(className, "grid")}
      style={{
        gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
      }}
    >
      {tabs.map((tab) => (
        <div
          role="tab"
          key={tab.label}
          className={classNames(
            "flex cursor-pointer items-center justify-center p-2 text-center",
            tab.checked ? "font-bold opacity-100" : "opacity-60",
          )}
          onClick={tab.onClick}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default UiTabs;
