import type {Metadata} from "next";
import "./globals.css";
import Providers from "./theme/providers";
import { auth } from './auth';
import HeaderBar from "./header-bar";

export const metadata: Metadata = {
  title: "Tailwindcss Config Generator",
  description: "Generate config file for tailwindcss",
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="dark:bg-gray-900 dark:text-white">
        <Providers>
          <main className="w-screen min-h-screen flex flex-col">
            <HeaderBar user={session?.user} />;
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
