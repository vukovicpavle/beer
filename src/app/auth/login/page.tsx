import Link from "next/link";
import { redirect } from "next/navigation";

import {
  signInWithDiscord,
  signInWithEmailPassword,
  signInWithGuestPass,
} from "~/app/actions";
import { AuthShell } from "~/components/auth-shell";
import { PendingButton } from "~/components/pending-button";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { auth } from "~/server/auth";

const errorCopy: Record<string, string> = {
  "discord-unavailable": "Discord sign-in is not configured yet.",
  "guest-pass": "Guest pass needs at least a display name.",
  "signin-failed": "The email or password did not match an existing account.",
  "signin-invalid": "Enter a valid email address and an 8+ character password.",
};

const successCopy: Record<string, string> = {
  "password-reset":
    "Password updated. You can sign in with the new password now.",
};

export default async function LoginPage({
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
  const successCode = resolvedSearchParams?.success;
  const redirectToValue = resolvedSearchParams?.redirectTo;
  const redirectTo =
    typeof redirectToValue === "string" && redirectToValue.startsWith("/")
      ? redirectToValue
      : "/club";
  const errorMessage =
    typeof errorCode === "string" ? errorCopy[errorCode] : undefined;
  const successMessage =
    typeof successCode === "string" ? successCopy[successCode] : undefined;

  return (
    <AuthShell
      eyebrow="Auth"
      title="Sign in to your Hop Atlas account"
      description="Use your permanent email account, take a guest pass for instant access, or continue with Discord when OAuth is wired."
      helper={
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" size="sm">
            <Link
              href={`/auth/register?redirectTo=${encodeURIComponent(redirectTo)}`}
            >
              Create account
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/auth/forgot-password">Forgot password</Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-6">
        {errorMessage ? (
          <div className="rounded-[1.25rem] border border-red-900/10 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
            {errorMessage}
          </div>
        ) : null}
        {successMessage ? (
          <div className="rounded-[1.25rem] border border-emerald-900/10 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
            {successMessage}
          </div>
        ) : null}

        <form action={signInWithEmailPassword} className="grid gap-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <input type="hidden" name="failureTo" value="/auth/login" />
          <label className="grid gap-2 text-sm font-medium text-black/72">
            Email
            <Input name="email" type="email" placeholder="name@example.com" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-black/72">
            Password
            <Input name="password" type="password" placeholder="Password" />
          </label>
          <PendingButton
            pendingLabel="Signing in..."
            className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
            type="submit"
          >
            Sign in
          </PendingButton>
        </form>

        <div className="grid gap-3 rounded-[1.5rem] border border-black/10 bg-[var(--panel)] p-5">
          <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
            Guest pass
          </p>
          <form action={signInWithGuestPass} className="grid gap-4">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <input type="hidden" name="failureTo" value="/auth/login" />
            <label className="grid gap-2 text-sm font-medium text-black/72">
              Display name
              <Input name="displayName" placeholder="Pavle, Mila, Hop Seeker" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-black/72">
              Home city
              <Input name="city" placeholder="Belgrade, Munich, Portland" />
            </label>
            <PendingButton
              pendingLabel="Creating pass..."
              className="inline-flex rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[var(--color-cellar)] transition hover:bg-black hover:text-[var(--color-foam)]"
              type="submit"
            >
              Continue with guest pass
            </PendingButton>
          </form>
        </div>

        <form action={signInWithDiscord}>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <input type="hidden" name="failureTo" value="/auth/login" />
          <PendingButton
            pendingLabel="Redirecting..."
            className="inline-flex rounded-full border border-black/10 bg-[var(--color-paper-strong)] px-5 py-3 text-sm font-semibold text-[var(--color-malt-dark)] transition hover:bg-[var(--color-paper)]"
            type="submit"
          >
            Continue with Discord
          </PendingButton>
        </form>
      </div>
    </AuthShell>
  );
}
