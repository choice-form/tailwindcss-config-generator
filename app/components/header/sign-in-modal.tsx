"use client";

import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import type {DefaultSession} from "next-auth";

interface SignInModalProps {
  user?: DefaultSession["user"];
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export const SignInModal = ({user, onSignIn, onSignOut}: SignInModalProps) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} isIconOnly={user ? true : false} radius={user ? "full" : "md"}>
        {user ? <Avatar src={user?.image ?? ""} name={user?.name ?? ""} /> : "Sign in"}
      </Button>

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
              <ModalBody className="gap-4 py-4">
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
                  By signing in, you ensure that your custom color shades are safely stored and can
                  be accessed and edited at any time.
                </span>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
