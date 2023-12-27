import "./globals.css";

import type {Metadata} from "next";
import {auth} from "./auth";
import {Header} from "./components/header";
import {initialState} from "./store/initial-state";
import {StoreProvider} from "./store/provider";
import {Providers} from "./theme/providers";
import {Footer} from "./footer";

export const metadata: Metadata = {
  title: "Tailwindcss Config Generator",
  description: "Generate config file for tailwindcss",
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StoreProvider state={initialState}>
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
