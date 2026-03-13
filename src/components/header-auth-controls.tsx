import Link from "next/link";

import { signOutAction } from "~/app/actions";
import { auth } from "~/server/auth";

import { PendingButton } from "./pending-button";
import { Button } from "./ui/button";

export async function HeaderAuthControls() {
  const session = await auth();
  const memberLabel = session?.user?.name?.trim() ?? "Member";
  const isAdmin = session?.user?.role === "ADMIN";
  const initials =
    memberLabel
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "M";

  if (!session?.user) {
    return (
      <Button asChild size="sm">
        <Link href="/auth/login">Sign in</Link>
      </Button>
    );
  }

  return (
    <details className="group relative">
      <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full bg-[var(--color-cellar)] text-sm font-semibold text-[var(--color-foam)] marker:content-none">
        {initials}
      </summary>
      <div className="absolute right-0 mt-3 w-56 rounded-[1.25rem] border border-black/10 bg-white p-2 shadow-[0_18px_50px_rgba(61,31,10,0.12)]">
        <div className="border-b border-black/8 px-3 py-3">
          <p className="text-sm font-semibold text-[var(--color-cellar)]">
            {memberLabel}
          </p>
          <p className="text-xs text-black/55">{session.user.email}</p>
        </div>
        <div className="grid gap-1 px-1 py-2">
          <Link
            href="/club"
            className="rounded-xl px-3 py-2 text-sm font-medium text-[var(--color-cellar)] transition hover:bg-[var(--panel)]"
          >
            Account
          </Link>
          {isAdmin ? (
            <Link
              href="/admin"
              className="rounded-xl px-3 py-2 text-sm font-medium text-[var(--color-cellar)] transition hover:bg-[var(--panel)]"
            >
              Admin
            </Link>
          ) : null}
          <form action={signOutAction}>
            <PendingButton
              pendingLabel="Signing out..."
              className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-[var(--color-cellar)] transition hover:bg-[var(--panel)]"
              type="submit"
            >
              Sign out
            </PendingButton>
          </form>
        </div>
      </div>
    </details>
  );
}
