"use server";

import { auth } from "./auth";
import { prisma } from "./prisma";

export async function getConfig() {
  const session = await auth();
  if (session && session.user && session.user.email) {
    const res = await prisma.config.findFirst({
      where: {
        email: session.user.email,
      },
    });
    return res?.content;
  }
}

export async function saveConfig(config: string) {
  const session = await auth();

  if (session && session.user && session.user.email) {
    const res = await prisma.config.create({
      data: {
        email: session.user.email,
        content: config,
      },
    });
    return res;
  }
}