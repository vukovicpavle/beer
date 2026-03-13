import Link from "next/link";

import { signOutAction } from "~/app/actions";
import { auth } from "~/server/auth";

import { PendingButton } from "./pending-button";
import { Button } from "./ui/button";

export async function HeaderAuthControls() {
  const session = await auth();
  const memberLabel = session?.user?.name?.split(" ")[0] ?? "Member";
  const isAdmin = session?.user?.role === "ADMIN";

  if (!session?.user) {
    return (
      <Button asChild size="sm">
        <Link href="/auth/login">Sign in</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        asChild
        size="sm"
        variant="outline"
        className="hidden md:inline-flex"
      >
        <Link href={isAdmin ? "/admin" : "/club"}>
          {isAdmin ? `${memberLabel} • Admin` : memberLabel}
        </Link>
      </Button>
      <form action={signOutAction}>
        <PendingButton
          pendingLabel="Signing out..."
          className="inline-flex rounded-full bg-[var(--color-cellar)] px-4 py-2.5 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
          type="submit"
        >
          Sign out
        </PendingButton>
      </form>
    </div>
  );
}
