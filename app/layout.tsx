import "./globals.css";

import type {Metadata} from "next";
import {auth} from "./auth";
import {Header} from "./components/header";
import {initialState} from "./store/initial-state";
import {StoreProvider} from "./store/provider";
import {Providers} from "./theme/providers";
import {Footer} from "./footer";
import {getConfig} from "./config";
import {Inter} from "next/font/google";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Tailwindcss Config Generator",
  description: "Generate config file for tailwindcss",
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const session = await auth();
  const config = await getConfig(session);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <StoreProvider state={config?.content ? JSON.parse(config.content) : initialState}>
          <Providers>
            <main className="flex min-h-screen flex-col bg-background text-foreground">
              <Header user={session?.user} />
              {children}
              <Footer />
            </main>
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
