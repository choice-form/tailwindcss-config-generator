import classNames from "classnames";
import {useTheme} from "next-themes";
import {UiDialog} from "./ui";
import {useState} from "react";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  onSignIn?: () => void;
  onSignOut?: () => void;
  user?: any;
}

const Header = ({onSignIn, onSignOut, user}: HeaderProps) => {
  const {theme, setTheme} = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 shrink-0 bg-white/80 px-8 backdrop-blur dark:bg-gray-900/80">
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
              !user ? (
                <button
                  className="flex items-center gap-2 rounded-lg bg-black text-white
                py-2 px-3 text-sm dark:bg-white dark:text-black"
                >
                  Sign in
                </button>
              ) : (
                <Image
                  className="h-8 w-8 rounded-full cursor-pointer"
                  src={user.image}
                  height={32}
                  width={32}
                  alt={`${user.name} avatar`}
                />
              )
            }
          >
            {user ? (
              <>
                <button className="absolute top-4 right-4" onClick={() => setIsOpen(false)}>
                  <div className="ic-[e-remove]" />
                </button>
                <h1 className="text-4xl font-bold">Sign Out</h1>
                <p>Are you sure to sign out?</p>
                <button
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200
                dark:border-gray-600 rounded-lg hover:bg-gray-100 hover:dark:bg-gray-700"
                  onClick={onSignOut}
                >
                  <div className="ic-[logo-github]" />
                  Sign out
                </button>
                <span className="text-sm opacity-60">
                  By signing in, you ensure that your custom color shades are safely stored and can
                  be accessed and edited at any time.
                </span>
              </>
            ) : (
              <>
                <button className="absolute top-4 right-4" onClick={() => setIsOpen(false)}>
                  <div className="ic-[e-remove]" />
                </button>
                <h1 className="text-4xl font-bold">Sign in</h1>
                <p>Sign in to save and edit your custom color shades.</p>
                <button
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200
                dark:border-gray-600 rounded-lg hover:bg-gray-100 hover:dark:bg-gray-700"
                  onClick={onSignIn}
                >
                  <div className="ic-[logo-github]" />
                  Sign in with Github
                </button>
                <span className="text-sm opacity-60">
                  By signing in, you ensure that your custom color shades are safely stored and can
                  be accessed and edited at any time.
                </span>
              </>
            )}
          </UiDialog>
        </div>
      </div>
    </header>
  );
};

export default Header;
