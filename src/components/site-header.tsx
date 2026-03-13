import Link from "next/link";
import { Suspense } from "react";

import { HeaderAuthControls } from "./header-auth-controls";
import { Skeleton } from "./ui/skeleton";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/beer-hopping", label: "Beer Hopping" },
  { href: "/blog", label: "Blog" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 px-4 py-4 backdrop-blur-xl md:px-6 md:py-5">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-[2rem] border border-black/10 bg-[var(--panel)] px-4 py-4 shadow-[0_8px_40px_rgba(61,31,10,0.08)] md:px-5">
        <div className="flex min-w-0 flex-1 items-center justify-start">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 text-[var(--color-cellar)]"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-cellar)] text-sm font-bold text-[var(--color-foam)]">
              HA
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold tracking-[0.22em] text-black/45 uppercase">
                Hop Atlas
              </span>
            </span>
          </Link>
        </div>
        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-[var(--color-cellar)] transition hover:text-black"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end">
          <Suspense fallback={<Skeleton className="h-10 w-10 rounded-full" />}>
            <HeaderAuthControls />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
