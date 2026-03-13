import "~/styles/globals.css";

import { type Metadata } from "next";
import { Bricolage_Grotesque, Fraunces } from "next/font/google";

import { SiteHeader } from "~/components/site-header";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Hop Atlas",
  description:
    "A T3 beer platform for discovering standout pours, plotting routes, and collecting trusted reviews.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces-display",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${fraunces.variable}`}>
      <body className="bg-[var(--paper)] text-[var(--ink)] antialiased">
        <TRPCReactProvider>
          <div className="relative min-h-screen overflow-x-hidden">
            <SiteHeader />
            {children}
            <footer className="border-t border-black/10 px-6 py-10">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 text-sm text-black/60 md:flex-row md:items-center md:justify-between">
                <p>
                  Hop Atlas is built for curious beer travelers and local
                  regulars.
                </p>
                <p>
                  App Router, tRPC, Prisma, Tailwind, NextAuth, and strong DX
                  defaults.
                </p>
              </div>
            </footer>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
