import classNames from "classnames";
import {useTheme} from "next-themes";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  const {theme, setTheme} = useTheme();

  return (
    <header className="px-8 sticky top-0 shrink-0 bg-white/80 dark:bg-gray-900/80 z-40 backdrop-blur border-b border-gray-200 dark:border-gray-900">
      <div className="container mx-auto flex items-center gap-4 h-16">
        <div className="flex-1 flex items-center gap-4">
          <div className="bg-black text-white rounded p-1 dark:bg-white dark:text-gray-900">
            <div className="ic-[logo] w-7 h-7" />
          </div>
          <h2 className="text-xl font-medium">@Choiceform/tailwindcss-config-generator</h2>
        </div>
        <div className="flex-0 flex items-center gap-4">
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <div className={classNames(theme === "dark" ? "ic-[sun]" : "ic-[moon-stars]")} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
