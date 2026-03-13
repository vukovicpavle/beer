import Link from "next/link";
import { redirect } from "next/navigation";

import { resetPasswordAction } from "~/app/actions";
import { AuthShell } from "~/components/auth-shell";
import { PendingButton } from "~/components/pending-button";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { auth } from "~/server/auth";

const errorCopy: Record<string, string> = {
  "reset-invalid": "Use matching passwords with at least 8 characters.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();

  if (session?.user) {
    redirect("/club");
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const token =
    typeof resolvedSearchParams?.token === "string"
      ? resolvedSearchParams.token
      : "";
  const email =
    typeof resolvedSearchParams?.email === "string"
      ? resolvedSearchParams.email
      : undefined;
  const mode =
    typeof resolvedSearchParams?.mode === "string"
      ? resolvedSearchParams.mode
      : undefined;
  const errorCode = resolvedSearchParams?.error;
  const errorMessage =
    typeof errorCode === "string" ? errorCopy[errorCode] : undefined;

  return (
    <AuthShell
      eyebrow="Reset"
      title="Choose a new password"
      description="This reset flow uses a one-time token. Once the password is updated, the token is deleted and the next sign-in uses the new password immediately."
      helper={
        <Button asChild variant="ghost" size="sm">
          <Link href="/auth/forgot-password">Request a new reset link</Link>
        </Button>
      }
    >
      <div className="grid gap-6">
        {mode === "direct" ? (
          <div className="rounded-[1.25rem] border border-amber-900/10 bg-[var(--color-paper-strong)] px-4 py-3 text-sm font-medium text-[var(--color-cellar)]">
            Email delivery is not wired yet, so Hop Atlas opened the reset step
            directly for {email ?? "this account"}.
          </div>
        ) : null}
        {errorMessage ? (
          <div className="rounded-[1.25rem] border border-red-900/10 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
            {errorMessage}
          </div>
        ) : null}
        {token ? (
          <form action={resetPasswordAction} className="grid gap-4">
            <input type="hidden" name="token" value={token} />
            <input
              type="hidden"
              name="failureTo"
              value="/auth/reset-password"
            />
            <label className="grid gap-2 text-sm font-medium text-black/72">
              New password
              <Input
                name="password"
                type="password"
                placeholder="At least 8 characters"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-black/72">
              Confirm new password
              <Input
                name="passwordConfirm"
                type="password"
                placeholder="Repeat the password"
              />
            </label>
            <PendingButton
              pendingLabel="Updating password..."
              className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
              type="submit"
            >
              Save new password
            </PendingButton>
          </form>
        ) : (
          <div className="grid gap-4">
            <div className="rounded-[1.25rem] border border-black/10 bg-[var(--panel)] px-4 py-4 text-sm leading-7 text-black/66">
              No valid reset token was supplied. Request a new reset and start
              again.
            </div>
            <Button asChild>
              <Link href="/auth/forgot-password">Request reset</Link>
            </Button>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
