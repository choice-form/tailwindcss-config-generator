import "./globals.css";

import type {Metadata} from "next";
import {auth} from "./auth";
import HeaderBar from "./header-bar";
import {initialState} from "./store/initial-state";
import {StoreProvider} from "./store/provider";
import ThemeProvider from "./theme/providers";

export const metadata: Metadata = {
  title: "Tailwindcss Config Generator",
  description: "Generate config file for tailwindcss",
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="dark:bg-black dark:text-white">
        <StoreProvider state={initialState}>
          <ThemeProvider>
            <main className="w-screen min-h-screen flex flex-col">
              <HeaderBar user={session?.user} />
              {children}
            </main>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
