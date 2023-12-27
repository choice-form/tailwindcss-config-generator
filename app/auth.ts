import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { prisma } from './prisma';

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.OAUTH_CLIENT_KEY as string,
      clientSecret: process.env.OAUTH_CLIENT_SECRET as string
    })
  ],
  // pages: {
  //   signIn: '/sign-in'
  // }
});

export async function getConfig() {
  const session = await auth();
  if (session && session.user && session.user.email) {
    const res = await prisma.config.findFirst({
      where: {
        email: session.user.email
      }
    });
    return res;
  }
}

export async function saveConfig(config: string) {
  const session = await auth();
  if (session && session.user && session.user.email) {
    const res = await prisma.config.create({
      data: {
        email: session.user.email,
        content: config 
      }
    })
    return res;
  }
}