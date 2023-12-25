import classNames from "classnames";
import {useTheme} from "next-themes";
import { useEffect, useState } from "react";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  const {theme, setTheme} = useTheme();
  const [isTauriApp, setIsTauriApp] = useState<boolean>(false)

  useEffect(() => {
    if(window?.__TAURI__ !== undefined) {
      setIsTauriApp(true)
    }
  }, [])

  return (
    <header data-tauri-drag-region className={classNames("sticky top-0 shrink-0 bg-white/80 dark:bg-gray-900/80 z-40 backdrop-blur border-b border-gray-200 dark:border-gray-900", isTauriApp ? "px-24" : "px-8")}>
      <div data-tauri-drag-region className="container mx-auto flex items-center gap-4 h-16">
        <div data-tauri-drag-region className="flex-1 flex items-center gap-4">
          <div data-tauri-drag-region className="bg-black text-white rounded p-1 dark:bg-white dark:text-gray-900">
            <div className="ic-[logo] w-7 h-7" />
          </div>
          <h2 className="text-xl font-medium">@Choiceform/tailwindcss-config-generator</h2>
        </div>
        <div data-tauri-drag-region className="flex items-center gap-4 flex-0">
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <div className={classNames(theme === "dark" ? "ic-[sun]" : "ic-[moon-stars]")} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
