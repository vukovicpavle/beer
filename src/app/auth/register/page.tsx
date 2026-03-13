import Link from "next/link";
import { redirect } from "next/navigation";

import { signUpWithEmailPassword } from "~/app/actions";
import { AuthShell } from "~/components/auth-shell";
import { PendingButton } from "~/components/pending-button";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { auth } from "~/server/auth";

const errorCopy: Record<string, string> = {
  "signin-failed":
    "The account was created, but the first sign-in did not complete.",
  "signup-invalid":
    "Enter a display name, a valid email address, and an 8+ character password.",
  "signup-taken": "That email is already attached to a Hop Atlas account.",
};

export default async function RegisterPage({
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
  const redirectToValue = resolvedSearchParams?.redirectTo;
  const redirectTo =
    typeof redirectToValue === "string" && redirectToValue.startsWith("/")
      ? redirectToValue
      : "/club";
  const errorMessage =
    typeof errorCode === "string" ? errorCopy[errorCode] : undefined;

  return (
    <AuthShell
      eyebrow="Register"
      title="Create a permanent Hop Atlas account"
      description="Permanent accounts give you email sign-in, password recovery, and a clean path into admin access when your role allows it."
      helper={
        <Button asChild variant="ghost" size="sm">
          <Link
            href={`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`}
          >
            Already have an account?
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6">
        {errorMessage ? (
          <div className="rounded-[1.25rem] border border-red-900/10 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
            {errorMessage}
          </div>
        ) : null}

        <form action={signUpWithEmailPassword} className="grid gap-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <input type="hidden" name="failureTo" value="/auth/register" />
          <label className="grid gap-2 text-sm font-medium text-black/72">
            Display name
            <Input name="displayName" placeholder="Pavle Hop Atlas" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-black/72">
            Email
            <Input name="email" type="email" placeholder="name@example.com" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-black/72">
            Password
            <Input
              name="password"
              type="password"
              placeholder="At least 8 characters"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-black/72">
            Home city
            <Input name="city" placeholder="Belgrade, Munich, Portland" />
          </label>
          <PendingButton
            pendingLabel="Creating account..."
            className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
            type="submit"
          >
            Create account
          </PendingButton>
        </form>
      </div>
    </AuthShell>
  );
}
