import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import {
  signInWithDiscord,
  signInWithEmailPassword,
  signInWithGuestPass,
  signUpWithEmailPassword,
} from "~/app/actions";
import { PendingButton } from "~/components/pending-button";
import { env } from "~/env";
import { auth } from "~/server/auth";
import { getMemberSnapshot } from "~/server/services/member";

const errorCopy: Record<string, string> = {
  "admin-only":
    "Admin access is restricted to members with elevated permissions.",
  "discord-unavailable":
    "Discord sign-in is wired, but the provider credentials are not configured yet.",
  "guest-pass":
    "Guest pass needs at least a display name so the profile can be created.",
  "signin-failed":
    "The email or password did not match an existing Hop Atlas account.",
  "signin-invalid":
    "Email sign-in needs a valid email address and an 8+ character password.",
  "signup-invalid":
    "Sign-up requires a display name, email address, and secure password.",
  "signup-taken": "That email is already attached to a Hop Atlas account.",
};

export default async function ClubPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const errorCode = resolvedSearchParams?.error;
  const errorMessage =
    typeof errorCode === "string" ? errorCopy[errorCode] : undefined;
  const session = await auth();
  const member = session?.user?.id
    ? await getMemberSnapshot(session.user.id)
    : null;
  const hasDiscord = Boolean(env.AUTH_DISCORD_ID && env.AUTH_DISCORD_SECRET);

  return (
    <main className="px-6 pt-6 pb-20 md:pt-10 md:pb-24">
      <div className="mx-auto grid w-full max-w-6xl gap-8">
        <section className="grid gap-5 rounded-[2rem] border border-black/10 bg-[var(--panel)] p-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-[var(--color-hop)] uppercase">
              Club
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-[var(--color-cellar)]">
              Keep routes, reviews, and brewery ideas attached to a real member
              profile.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-black/68">
              Hop Atlas Club is where discovery becomes habit. Save route ideas,
              publish tasting notes, and keep a clear record of what deserves a
              second visit.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-[var(--color-cellar)] px-6 py-5 text-[var(--color-foam)]">
            <p className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
              Status
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {session?.user
                ? `Signed in as ${session.user.name ?? "member"}`
                : "Guest access ready"}
            </p>
          </div>
        </section>

        {errorMessage ? (
          <section className="rounded-[1.5rem] border border-amber-900/10 bg-[var(--color-paper-strong)] px-6 py-4 text-sm font-medium text-[var(--color-cellar)]">
            {errorMessage}
          </section>
        ) : null}

        {session?.user ? (
          <>
            <section className="grid gap-4 md:grid-cols-4">
              <article className="rounded-[1.75rem] border border-black/10 bg-white/70 p-6">
                <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                  Saved routes
                </p>
                <p className="mt-3 text-4xl font-semibold text-[var(--color-cellar)]">
                  {member?.savedRoutes.length ?? 0}
                </p>
              </article>
              <article className="rounded-[1.75rem] border border-black/10 bg-white/70 p-6">
                <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                  Authored reviews
                </p>
                <p className="mt-3 text-4xl font-semibold text-[var(--color-cellar)]">
                  {member?.authoredReviews.length ?? 0}
                </p>
              </article>
              <article className="rounded-[1.75rem] border border-black/10 bg-white/70 p-6">
                <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                  Home city
                </p>
                <p className="mt-3 text-4xl font-semibold text-[var(--color-cellar)]">
                  {member?.city ?? "Open"}
                </p>
              </article>
              <article className="rounded-[1.75rem] border border-black/10 bg-white/70 p-6">
                <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                  Passport spread
                </p>
                <p className="mt-3 text-4xl font-semibold text-[var(--color-cellar)]">
                  {member?.styleCount ?? 0}
                </p>
                <p className="mt-2 text-sm text-black/60">
                  {member?.cityCount ?? 0} cities, avg{" "}
                  {member?.averageRating ?? "-"}/5
                </p>
              </article>
            </section>

            {member?.nextRoute ? (
              <section className="rounded-[1.75rem] border border-black/10 bg-[var(--color-cellar)] p-6 text-[var(--color-foam)]">
                <p className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
                  Next layer
                </p>
                <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-3xl font-semibold">
                      Try {member.nextRoute.name} next.
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/76">
                      Based on your home city, the next best unsaved run is a{" "}
                      {member.nextRoute.vibe} crawl through{" "}
                      {member.nextRoute.city}.
                    </p>
                  </div>
                  <Link
                    href={`/routes#${member.nextRoute.slug}`}
                    className="inline-flex rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-white/20"
                  >
                    Open recommendation
                  </Link>
                </div>
              </section>
            ) : null}

            <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <article className="rounded-[1.75rem] border border-black/10 bg-white/70 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold tracking-[0.18em] text-[var(--color-hop)] uppercase">
                      Saved routes
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-[var(--color-cellar)]">
                      Route ideas worth keeping.
                    </h2>
                  </div>
                  <Link
                    href="/routes"
                    className="text-sm font-semibold text-[var(--color-malt-dark)]"
                  >
                    Open planner
                  </Link>
                </div>
                <div className="mt-6 grid gap-3">
                  {member?.savedRoutes.length ? (
                    member.savedRoutes.map((route) => (
                      <div
                        key={route.id}
                        className="rounded-[1.25rem] border border-black/10 bg-[var(--panel)] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                              {route.city} • {route.vibe}
                            </p>
                            <h3 className="mt-2 text-xl font-semibold text-[var(--color-cellar)]">
                              {route.name}
                            </h3>
                          </div>
                          <span className="text-xs font-semibold tracking-[0.16em] text-black/45 uppercase">
                            {route.stopCount} stops
                          </span>
                        </div>
                        <p className="mt-4 text-sm text-black/60">
                          Saved{" "}
                          {formatDistanceToNow(new Date(route.savedAt), {
                            addSuffix: true,
                          })}
                        </p>
                        {route.note ? (
                          <p className="mt-3 text-sm leading-7 text-black/68">
                            {route.note}
                          </p>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.25rem] border border-dashed border-black/15 bg-[var(--panel)] p-6 text-sm leading-7 text-black/65">
                      Nothing saved yet. Use the route planner to pin the best
                      tasting runs to your profile.
                    </div>
                  )}
                </div>
              </article>

              <article className="rounded-[1.75rem] border border-black/10 bg-white/70 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold tracking-[0.18em] text-[var(--color-hop)] uppercase">
                      Your reviews
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-[var(--color-cellar)]">
                      Published tasting notes.
                    </h2>
                  </div>
                  <Link
                    href="/reviews"
                    className="text-sm font-semibold text-[var(--color-malt-dark)]"
                  >
                    Write a review
                  </Link>
                </div>
                <div className="mt-6 grid gap-3">
                  {member?.authoredReviews.length ? (
                    member.authoredReviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-[1.25rem] border border-black/10 bg-[var(--panel)] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                              {review.beerName} • {review.breweryName}
                            </p>
                            <h3 className="mt-2 text-xl font-semibold text-[var(--color-cellar)]">
                              {review.title}
                            </h3>
                          </div>
                          <span className="rounded-full bg-[var(--color-paper-strong)] px-3 py-1 text-sm font-semibold text-[var(--color-malt-dark)]">
                            {review.rating}/5
                          </span>
                        </div>
                        <p className="mt-4 text-sm text-black/60">
                          Published{" "}
                          {formatDistanceToNow(new Date(review.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.25rem] border border-dashed border-black/15 bg-[var(--panel)] p-6 text-sm leading-7 text-black/65">
                      You have not published a tasting note yet. The review
                      studio is ready once you find a beer worth explaining.
                    </div>
                  )}
                </div>
              </article>
            </section>

            {session.user.role === "ADMIN" ? (
              <section className="rounded-[1.75rem] border border-black/10 bg-[var(--color-paper-strong)] p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-semibold tracking-[0.18em] text-[var(--color-hop)] uppercase">
                      Admin access
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-[var(--color-cellar)]">
                      Manage breweries, reviews, and member roles.
                    </h2>
                  </div>
                  <Link
                    href="/admin"
                    className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
                  >
                    Open admin panel
                  </Link>
                </div>
              </section>
            ) : null}
          </>
        ) : (
          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr_0.85fr]">
            <article className="rounded-[1.75rem] border border-black/10 bg-white/70 p-6">
              <p className="text-sm font-semibold tracking-[0.18em] text-[var(--color-hop)] uppercase">
                Email membership
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--color-cellar)]">
                Build a permanent account for routes, reviews, and admin access.
              </h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <form action={signUpWithEmailPassword} className="grid gap-4">
                  <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                    Sign up
                  </p>
                  <label className="grid gap-2 text-sm font-medium text-black/72">
                    Display name
                    <input
                      name="displayName"
                      placeholder="Pavle Hop Atlas"
                      className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-black/72">
                    Email
                    <input
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-black/72">
                    Password
                    <input
                      name="password"
                      type="password"
                      placeholder="At least 8 characters"
                      className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-black/72">
                    Home city
                    <input
                      name="city"
                      placeholder="Belgrade, Munich, Portland"
                      className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
                    />
                  </label>
                  <PendingButton
                    pendingLabel="Creating account..."
                    className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
                    type="submit"
                  >
                    Create account
                  </PendingButton>
                </form>

                <form
                  action={signInWithEmailPassword}
                  className="grid gap-4 rounded-[1.5rem] border border-black/10 bg-[var(--panel)] p-5"
                >
                  <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                    Sign in
                  </p>
                  <label className="grid gap-2 text-sm font-medium text-black/72">
                    Email
                    <input
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-black/72">
                    Password
                    <input
                      name="password"
                      type="password"
                      placeholder="Password"
                      className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 outline-none"
                    />
                  </label>
                  <div className="rounded-[1rem] bg-white/80 px-4 py-3 text-sm leading-7 text-black/65">
                    Permanent accounts unlock email login, role-based access,
                    and a clean path into the admin console.
                  </div>
                  <PendingButton
                    pendingLabel="Signing in..."
                    className="inline-flex rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[var(--color-cellar)] transition hover:bg-black hover:text-[var(--color-foam)]"
                    type="submit"
                  >
                    Sign in with email
                  </PendingButton>
                </form>
              </div>
            </article>
            <article className="rounded-[1.75rem] border border-black/10 bg-white/70 p-6">
              <p className="text-sm font-semibold tracking-[0.18em] text-[var(--color-hop)] uppercase">
                Guest pass
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--color-cellar)]">
                Enter immediately and keep building your profile.
              </h2>
              <form action={signInWithGuestPass} className="mt-6 grid gap-4">
                <label className="grid gap-2 text-sm font-medium text-black/72">
                  Display name
                  <input
                    name="displayName"
                    placeholder="Pavle, Mila, Hop Seeker"
                    className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-black/72">
                  Home city
                  <input
                    name="city"
                    placeholder="Belgrade, Munich, Portland"
                    className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
                  />
                </label>
                <PendingButton
                  pendingLabel="Creating pass..."
                  className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
                  type="submit"
                >
                  Start with guest pass
                </PendingButton>
              </form>
            </article>
            <article className="rounded-[1.75rem] border border-black/10 bg-[var(--color-cellar)] p-6 text-[var(--color-foam)]">
              <p className="text-sm font-semibold tracking-[0.18em] text-white/60 uppercase">
                Provider sign-in
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                Connect a richer account when OAuth is ready.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/76">
                Guest pass gives you a working membership flow immediately.
                Discord can sit alongside it for a fuller identity layer.
              </p>
              {hasDiscord ? (
                <form action={signInWithDiscord} className="mt-6">
                  <PendingButton
                    pendingLabel="Redirecting..."
                    className="inline-flex rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-white/20"
                    type="submit"
                  >
                    Continue with Discord
                  </PendingButton>
                </form>
              ) : (
                <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-white/8 p-4 text-sm leading-7 text-white/72">
                  Discord credentials are not configured yet, so guest pass is
                  the active live auth path right now.
                </div>
              )}
            </article>
          </section>
        )}
      </div>
    </main>
  );
}
