"use client";

import Header from "./components/header";
import {signIn, signOut} from "next-auth/react";

export default function HeaderBar({user}: {user: any}) {
  return <Header onSignIn={() => signIn("github")} onSignOut={() => signOut()} user={user} />;
}
