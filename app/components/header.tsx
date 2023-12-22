import classNames from "classnames";
import { useTheme } from "next-themes";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-20 flex items-center px-8 gap-4 sticky top-0 shrink-0 bg-white/80 dark:bg-gray-900/80 z-40 backdrop-blur border-b">
      <div className="flex-1 flex items-center gap-4">
        <h2 className="text-xl font-medium">
          @Choiceform/tailwindcss-config-generator
        </h2>
      </div>
      <div className="flex-0 flex items-center gap-4">
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <div
            className={classNames(
              theme === "dark" ? "ic-[sun]" : "ic-[moon-stars]"
            )}
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
