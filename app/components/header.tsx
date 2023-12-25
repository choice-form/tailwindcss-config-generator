import classNames from "classnames";
import {useTheme} from "next-themes";
import {UiDialog} from "./ui";
import {useState} from "react";
import Link from "next/link";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  const {theme, setTheme} = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 shrink-0 border-b
      border-gray-200 bg-white/80 px-8 backdrop-blur dark:border-gray-900 dark:bg-gray-900/80"
    >
      <div className="container mx-auto flex h-16 items-center gap-4">
        <div className="flex flex-1 items-center gap-4">
          <div className="rounded bg-black p-1 text-white dark:bg-white dark:text-gray-900">
            <div className="ic-[logo] h-7 w-7" />
          </div>
          <h2 className="text-xl font-medium">@Choiceform/tailwindcss-config-generator</h2>
        </div>
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
            className="relative flex w-[500px] flex-col items-center justify-center gap-4
            rounded-lg bg-white p-8 text-center shadow-lg outline-none dark:bg-gray-900"
            trigger={
              <button
                className="flex items-center gap-2 rounded-lg bg-black px-3
                py-2 text-sm text-white dark:bg-white dark:text-black"
              >
                Sign in
              </button>
            }
          >
            <>
              <button className="absolute right-4 top-4" onClick={() => setIsOpen(false)}>
                <div className="ic-[e-remove]" />
              </button>
              <h1 className="text-4xl font-bold">Sign in</h1>
              <p>Sign in to save and edit your custom color shades.</p>
              <button
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3
                py-2 hover:bg-gray-100 dark:border-gray-600 hover:dark:bg-gray-700"
              >
                <div className="ic-[logo-github]" />
                Sign in with Github
              </button>
              <span className="text-sm opacity-60">
                By signing in, you ensure that your custom color shades are safely stored and can be
                accessed and edited at any time.
              </span>
            </>
          </UiDialog>
        </div>
      </div>
    </header>
  );
};

export default Header;
