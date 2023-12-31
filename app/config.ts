"use server";

import {Session} from "next-auth";
import {auth} from "./auth";
import {prisma} from "./prisma";

export async function getConfig(session: Session | null) {
  if (session && session.user && session.user.email) {
    const res = await prisma.config.findFirst({
      where: {
        email: session.user.email,
      },
    });
    return res;
  }
}

export async function saveConfig(config: string) {
  const session = await auth();
  let res = null;
  if (session && session.user && session.user.email) {
    const content = await getConfig(session);
    if (content) {
      res = await prisma.config.update({
        data: {
          content: config,
        },
        where: {
          id: content.id,
          email: session.user.email,
        },
      });
    } else {
      res = await prisma.config.create({
        data: {
          email: session.user.email,
          content: config,
        },
      });
    }
  }
  return res;
}
