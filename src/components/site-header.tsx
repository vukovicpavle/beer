import Link from "next/link";
import { Suspense } from "react";

import { HeaderAuthControls } from "./header-auth-controls";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const navItems = [
  { href: "/club", label: "Club" },
  { href: "/map", label: "Map" },
  { href: "/reviews", label: "Reviews" },
  { href: "/routes", label: "Routes" },
  { href: "/journal", label: "Journal" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 px-4 py-4 backdrop-blur-xl md:px-6 md:py-5">
      <div className="mx-auto grid w-full max-w-6xl gap-3 rounded-[2rem] border border-black/10 bg-[var(--panel)] px-4 py-4 shadow-[0_8px_40px_rgba(61,31,10,0.08)] md:px-5">
        <div className="flex items-center justify-between gap-4">
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
              <span className="block truncate text-sm font-semibold md:text-base">
                Beer discovery for people with taste
              </span>
            </span>
          </Link>
          <Suspense fallback={<Skeleton className="h-10 w-28 rounded-full" />}>
            <HeaderAuthControls />
          </Suspense>
        </div>

        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 md:justify-between md:pb-0">
          <div className="hidden md:flex md:items-center md:gap-2">
            <Badge variant="muted">Fast routes</Badge>
            <Badge variant="muted">Quiet UI</Badge>
            <Badge variant="muted">Useful reviews</Badge>
          </div>
          <nav className="flex flex-nowrap items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                asChild
                size="sm"
                variant="ghost"
                className="px-3 whitespace-nowrap"
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="px-3 whitespace-nowrap"
            >
              <Link href="/admin">Admin</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
