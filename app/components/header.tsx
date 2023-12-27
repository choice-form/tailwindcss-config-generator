import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import classNames from "classnames";
import {useTheme} from "next-themes";
import Link from "next/link";

interface HeaderProps {
  onSignIn?: () => void;
  onSignOut?: () => void;
  user?: any;
}

const Header = ({onSignIn, onSignOut, user}: HeaderProps) => {
  const {theme, setTheme} = useTheme();

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

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

          <Button onPress={onOpen}>{user ? <Avatar src={user.image} /> : "Sign in"}</Button>

          <Modal
            backdrop="opaque"
            classNames={{
              backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
            }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    {user ? "Sign Out" : "Sign in"}
                  </ModalHeader>
                  <ModalBody className="py-4 gap-4">
                    <p>
                      {user
                        ? "Are you sure to sign out?"
                        : "Sign in to save and edit your custom color shades."}
                    </p>
                    <Button
                      className="self-center"
                      variant="bordered"
                      startContent={<div className="ic-[logo-github]" />}
                      onClick={user ? onSignOut : onSignIn}
                    >
                      {user ? "Sign out" : "Sign in with Github"}
                    </Button>

                    <span className="text-sm opacity-60">
                      By signing in, you ensure that your custom color shades are safely stored and
                      can be accessed and edited at any time.
                    </span>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </header>
  );
};

export default Header;
