"use client";

import {Button} from "@nextui-org/react";
import classNames from "classnames";
import type {DefaultSession} from "next-auth";
import {useTheme} from "next-themes";
import Link from "next/link";
import {SignInModal} from ".";

interface HeaderContainerProps {
  onSignIn?: () => void;
  onSignOut?: () => void;
  user?: DefaultSession["user"];
}

export const HeaderContainer = ({onSignIn, onSignOut, user}: HeaderContainerProps) => {
  const {theme, setTheme} = useTheme();

  return (
    <header className="sticky top-0 z-40 shrink-0 bg-white/80 px-8 backdrop-blur dark:bg-black/80">
      <div className="container mx-auto flex h-16 items-center gap-4">
        <div className="flex flex-1 items-center gap-4">
          <div className="rounded bg-black p-1 text-white dark:bg-white dark:text-neutral-900">
            <div className="ic-[logo] h-7 w-7" />
          </div>
          <h2 className="text-xl font-medium">@Choiceform/tailwindcss-config-generator</h2>
        </div>

        <div className="flex-0 flex items-center gap-4">
          <Button
            variant="light"
            startContent={
              <div className={classNames(theme === "dark" ? "ic-[sun]" : "ic-[moon-stars]")} />
            }
            isIconOnly
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          />

          <Button
            variant="light"
            startContent={<div className="ic-[logo-github]" />}
            isIconOnly
            as={Link}
            href={"https://github.com/choice-form/tailwindcss-config-generator"}
          />

          <SignInModal user={user} onSignIn={onSignIn} onSignOut={onSignOut} />
        </div>
      </div>
    </header>
  );
};
