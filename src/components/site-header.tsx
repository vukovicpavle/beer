import Link from "next/link";

import { signOutAction } from "~/app/actions";
import { auth } from "~/server/auth";

import { PendingButton } from "./pending-button";

const navItems = [
  { href: "/club", label: "Club" },
  { href: "/map", label: "Map" },
  { href: "/reviews", label: "Reviews" },
  { href: "/routes", label: "Routes" },
  { href: "/journal", label: "Journal" },
] as const;

export async function SiteHeader() {
  const session = await auth();
  const memberLabel = session?.user?.name?.split(" ")[0] ?? "Member";
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 px-6 py-5 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-black/10 bg-[var(--panel)] px-5 py-3 shadow-[0_8px_40px_rgba(61,31,10,0.08)]">
        <Link
          href="/"
          className="flex items-center gap-3 text-[var(--color-cellar)]"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-cellar)] text-sm font-bold text-[var(--color-foam)]">
            HA
          </span>
          <span>
            <span className="block text-xs font-semibold tracking-[0.22em] text-black/45 uppercase">
              Hop Atlas
            </span>
            <span className="block text-base font-semibold">
              Beer discovery for people with taste
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-black/65 transition hover:text-[var(--color-cellar)]"
              >
                {item.label}
              </Link>
            ))}
            {isAdmin ? (
              <Link
                href="/admin"
                className="text-sm font-semibold text-[var(--color-hop)] transition hover:text-[var(--color-cellar)]"
              >
                Admin
              </Link>
            ) : null}
          </nav>
          {session?.user ? (
            <>
              <Link
                href={isAdmin ? "/admin" : "/club"}
                className="hidden rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--color-cellar)] transition hover:bg-white md:inline-flex"
              >
                {isAdmin ? `${memberLabel} • Admin` : memberLabel}
              </Link>
              <form action={signOutAction}>
                <PendingButton
                  pendingLabel="Signing out..."
                  className="inline-flex rounded-full bg-[var(--color-cellar)] px-4 py-2 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
                  type="submit"
                >
                  Sign out
                </PendingButton>
              </form>
            </>
          ) : (
            <Link
              href="/club"
              className="inline-flex rounded-full bg-[var(--color-cellar)] px-4 py-2 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
            >
              Join the club
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
