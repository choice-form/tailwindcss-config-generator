import classNames from "classnames";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {UiDialog} from "./ui";
import Link from "next/link";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  const {theme, setTheme} = useTheme();
  const [isTauriApp, setIsTauriApp] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (window?.__TAURI__ !== undefined) {
      setIsTauriApp(true);
    }
  }, []);

  return (
    <header
      data-tauri-drag-region
      className={classNames(
        "sticky top-0 shrink-0 bg-white/80 dark:bg-gray-900/80 z-40 backdrop-blur border-b border-gray-200 dark:border-gray-900",
        isTauriApp ? "px-24" : "px-8",
      )}
    >
      <div data-tauri-drag-region className="container mx-auto flex items-center gap-4 h-16">
        <div data-tauri-drag-region className="flex-1 flex items-center gap-4">
          <div
            data-tauri-drag-region
            className="bg-black text-white rounded p-1 dark:bg-white dark:text-gray-900"
          >
            <div className="ic-[logo] w-7 h-7" />
          </div>
          <h2 className="text-xl font-medium">@Choiceform/tailwindcss-config-generator</h2>
        </div>
        <div data-tauri-drag-region className="flex items-center gap-4 flex-0">
          <div className="flex-0 flex items-center gap-4">
            <button className="p-2" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <div className={classNames(theme === "dark" ? "ic-[sun]" : "ic-[moon-stars]")} />
            </button>

            <Link
              href={"https://github.com/choice-form/tailwindcss-config-generator"}
              target="_blank"
            >
              <button className="p-2">
                <div className="ic-[logo-github]" />
              </button>
            </Link>

            <UiDialog
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-[500px] relative
            flex flex-col gap-4 justify-center items-center outline-none text-center"
              trigger={
                <button
                  className="flex items-center gap-2 rounded-lg bg-black text-white
                py-2 px-3 text-sm dark:bg-white dark:text-black"
                >
                  Sign in
                </button>
              }
            >
              <>
                <button className="absolute top-4 right-4" onClick={() => setIsOpen(false)}>
                  <div className="ic-[e-remove]" />
                </button>
                <h1 className="text-4xl font-bold">Sign in</h1>
                <p>Sign in to save and edit your custom color shades.</p>
                <button
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200
                dark:border-gray-600 rounded-lg hover:bg-gray-100 hover:dark:bg-gray-700"
                >
                  <div className="ic-[logo-github]" />
                  Sign in with Github
                </button>
                <span className="text-sm opacity-60">
                  By signing in, you ensure that your custom color shades are safely stored and can
                  be accessed and edited at any time.
                </span>
              </>
            </UiDialog>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
