"use client";

import type {DefaultSession} from "next-auth";
import {HeaderContainer} from ".";
import {signIn, signOut} from "next-auth/react";

export function Header({user}: {user: DefaultSession["user"]}) {
  return (
    <HeaderContainer onSignIn={() => signIn("github")} onSignOut={() => signOut()} user={user} />
  );
}
