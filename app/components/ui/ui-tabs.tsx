import classNames from "classnames";

interface UiTabsProps {
  tabs: {
    label: string;
    checked: boolean;
    onClick: () => void;
  }[];
}

const UiTabs = ({tabs}: UiTabsProps) => {
  return (
    <div
      role="tablist"
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
      }}
    >
      {tabs.map((tab) => (
        <div
          role="tab"
          key={tab.label}
          className={classNames(
            "border p-2 rounded-lg text-center flex justify-center items-center cursor-pointer text-xs uppercase",
            tab.checked
              ? "text-current border-gray-500 dark:border-gray-300"
              : "border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800",
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
