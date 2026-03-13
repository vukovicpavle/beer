import Link from "next/link";
import { redirect } from "next/navigation";

import { requestPasswordResetAction } from "~/app/actions";
import { AuthShell } from "~/components/auth-shell";
import { PendingButton } from "~/components/pending-button";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { auth } from "~/server/auth";

const errorCopy: Record<string, string> = {
  "forgot-invalid": "Enter a valid email address to start the reset flow.",
  "reset-expired":
    "That reset link is expired or invalid. Request a fresh one.",
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();

  if (session?.user) {
    redirect("/club");
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const errorCode = resolvedSearchParams?.error;
  const sentCode = resolvedSearchParams?.sent;
  const errorMessage =
    typeof errorCode === "string" ? errorCopy[errorCode] : undefined;
  const sentMessage =
    sentCode === "1"
      ? "If that account exists, the next reset step is ready."
      : undefined;

  return (
    <AuthShell
      eyebrow="Recovery"
      title="Start a password reset"
      description="Email delivery is not wired yet, so Hop Atlas will move you directly into the reset step after you request it."
      helper={
        <Button asChild variant="ghost" size="sm">
          <Link href="/auth/login">Back to sign in</Link>
        </Button>
      }
    >
      <div className="grid gap-6">
        {errorMessage ? (
          <div className="rounded-[1.25rem] border border-red-900/10 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
            {errorMessage}
          </div>
        ) : null}
        {sentMessage ? (
          <div className="rounded-[1.25rem] border border-emerald-900/10 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
            {sentMessage}
          </div>
        ) : null}
        <form action={requestPasswordResetAction} className="grid gap-4">
          <input type="hidden" name="failureTo" value="/auth/forgot-password" />
          <label className="grid gap-2 text-sm font-medium text-black/72">
            Email
            <Input name="email" type="email" placeholder="name@example.com" />
          </label>
          <PendingButton
            pendingLabel="Preparing reset..."
            className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
            type="submit"
          >
            Continue to reset
          </PendingButton>
        </form>
      </div>
    </AuthShell>
  );
}
