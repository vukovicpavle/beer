import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  createBeerAction,
  createBreweryAction,
  createRouteAction,
  toggleBeerFeaturedAction,
  toggleReviewVisibilityAction,
  updateUserRoleAction,
} from "~/app/actions";
import { PendingButton } from "~/components/pending-button";
import { auth } from "~/server/auth";
import { getAdminSnapshot, isAdminUser } from "~/server/services/admin";

const errorCopy: Record<string, string> = {
  "beer-featured": "Beer spotlight update failed. Refresh and try again.",
  "beer-invalid":
    "Beer creation needs a valid brewery, style, ABV, and description.",
  "brewery-invalid":
    "Brewery creation needs complete location, description, and tag details.",
  "brewery-missing": "Choose an existing brewery before creating a beer.",
  "review-invalid": "Review moderation request was incomplete.",
  "route-invalid":
    "Route creation needs valid route details and at least two brewery slugs.",
  "route-stops":
    "One or more route stop slugs do not match existing breweries.",
  "self-demote": "The current admin session cannot demote itself.",
  "user-role":
    "Role update failed because the submitted member or role value was invalid.",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();

  if (!isAdminUser(session?.user)) {
    redirect("/club?error=admin-only");
  }

  const snapshot = await getAdminSnapshot();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const errorCode = resolvedSearchParams?.error;
  const errorMessage =
    typeof errorCode === "string" ? errorCopy[errorCode] : undefined;

  return (
    <main className="px-6 pt-6 pb-20 md:pt-10 md:pb-24">
      <div className="mx-auto grid w-full max-w-6xl gap-8">
        <section className="grid gap-5 rounded-[2rem] border border-black/10 bg-[var(--panel)] p-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-[var(--color-hop)] uppercase">
              Admin
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-[var(--color-cellar)]">
              Run the beer platform, not just the landing page.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-black/68">
              Add breweries and beers, ship fresh tasting routes, moderate
              published reviews, and control who can operate the system.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-[var(--color-cellar)] px-6 py-5 text-[var(--color-foam)]">
            <p className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
              Operator
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {session?.user?.name ?? session?.user?.email ?? "Admin"}
            </p>
            <p className="mt-2 text-sm text-white/70">
              The first permanent email account becomes the initial admin, and
              addresses listed in ADMIN_EMAILS are elevated automatically.
            </p>
          </div>
        </section>

        {errorMessage ? (
          <section className="rounded-[1.5rem] border border-amber-900/10 bg-[var(--color-paper-strong)] px-6 py-4 text-sm font-medium text-[var(--color-cellar)]">
            {errorMessage}
          </section>
        ) : null}

        <section className="grid gap-4 md:grid-cols-4 xl:grid-cols-7">
          {[
            ["Members", snapshot.metrics.members],
            ["Breweries", snapshot.metrics.breweries],
            ["Beers", snapshot.metrics.beers],
            ["Routes", snapshot.metrics.routes],
            ["Published reviews", snapshot.metrics.publishedReviews],
            ["Hidden reviews", snapshot.metrics.hiddenReviews],
            ["Saved routes", snapshot.metrics.savedRoutes],
          ].map(([label, value]) => (
            <article
              key={label}
              className="rounded-[1.5rem] border border-black/10 bg-white/70 p-5"
            >
              <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                {label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-[var(--color-cellar)]">
                {value}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <article className="rounded-[1.75rem] border border-black/10 bg-white/70 p-6">
            <p className="text-sm font-semibold tracking-[0.18em] text-[var(--color-hop)] uppercase">
              Add brewery
            </p>
            <form action={createBreweryAction} className="mt-5 grid gap-4">
              <input
                name="name"
                placeholder="Brewery name"
                className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
              />
              <input
                name="slug"
                placeholder="slug-name"
                className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="city"
                  placeholder="City"
                  className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
                />
                <input
                  name="country"
                  placeholder="Country"
                  className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="latitude"
                  type="number"
                  step="0.000001"
                  placeholder="Latitude"
                  className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
                />
                <input
                  name="longitude"
                  type="number"
                  step="0.000001"
                  placeholder="Longitude"
                  className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
                />
              </div>
              <input
                name="specialty"
                placeholder="Specialty"
                className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
              />
              <input
                name="heroBeer"
                placeholder="Hero beer"
                className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
              />
              <input
                name="tags"
                placeholder="neo-lager, rooftop, sour-forward"
                className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
              />
              <input
                name="website"
                type="url"
                placeholder="https://example.com"
                className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
              />
              <textarea
                name="description"
                placeholder="Why people should go there"
                rows={4}
                className="rounded-[1.5rem] border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
              />
              <PendingButton
                pendingLabel="Adding brewery..."
                className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
                type="submit"
              >
                Publish brewery
              </PendingButton>
            </form>
          </article>

          <article className="rounded-[1.75rem] border border-black/10 bg-white/70 p-6">
            <p className="text-sm font-semibold tracking-[0.18em] text-[var(--color-hop)] uppercase">
              Add beer
            </p>
            <form action={createBeerAction} className="mt-5 grid gap-4">
              <input
                name="name"
                placeholder="Beer name"
                className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
              />
              <input
                name="slug"
                placeholder="beer-slug"
                className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
              />
              <select
                name="brewerySlug"
                className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
              >
                <option value="">Pick brewery</option>
                {snapshot.breweries.map((brewery) => (
                  <option key={brewery.id} value={brewery.slug}>
                    {brewery.name}
                  </option>
                ))}
              </select>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="style"
                  placeholder="Style"
                  className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
                />
                <input
                  name="abv"
                  type="number"
                  step="0.1"
                  placeholder="ABV"
                  className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
                />
              </div>
              <input
                name="ibu"
                type="number"
                step="1"
                placeholder="IBU (optional)"
                className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
              />
              <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 text-sm font-medium text-black/72">
                <input name="featured" type="checkbox" className="h-4 w-4" />
                Feature on discovery surfaces
              </label>
              <textarea
                name="description"
                placeholder="Beer story, flavor, texture"
                rows={4}
                className="rounded-[1.5rem] border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
              />
              <PendingButton
                pendingLabel="Adding beer..."
                className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
                type="submit"
              >
                Publish beer
              </PendingButton>
            </form>
          </article>

          <article className="rounded-[1.75rem] border border-black/10 bg-white/70 p-6">
            <p className="text-sm font-semibold tracking-[0.18em] text-[var(--color-hop)] uppercase">
              Add route
            </p>
            <form action={createRouteAction} className="mt-5 grid gap-4">
              <input
                name="name"
                placeholder="Route name"
                className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
              />
              <input
                name="slug"
                placeholder="route-slug"
                className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="city"
                  placeholder="City"
                  className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
                />
                <input
                  name="vibe"
                  placeholder="sessionable, scenic, late-night"
                  className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="durationMinutes"
                  type="number"
                  step="5"
                  placeholder="Duration minutes"
                  className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
                />
                <input
                  name="distanceKm"
                  type="number"
                  step="0.1"
                  placeholder="Distance km"
                  className="rounded-2xl border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
                />
              </div>
              <textarea
                name="summary"
                placeholder="Why this crawl works"
                rows={3}
                className="rounded-[1.5rem] border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
              />
              <textarea
                name="stopSlugs"
                placeholder="brewery-one, brewery-two, brewery-three"
                rows={3}
                className="rounded-[1.5rem] border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
              />
              <textarea
                name="highlights"
                placeholder="First pour\nSecond pour\nThird pour"
                rows={3}
                className="rounded-[1.5rem] border border-black/10 bg-[var(--panel)] px-4 py-3 outline-none"
              />
              <PendingButton
                pendingLabel="Adding route..."
                className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
                type="submit"
              >
                Publish route
              </PendingButton>
            </form>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[1.75rem] border border-black/10 bg-white/70 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-[0.18em] text-[var(--color-hop)] uppercase">
                  Review moderation
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-[var(--color-cellar)]">
                  Control what stays visible.
                </h2>
              </div>
              <Link
                href="/reviews"
                className="text-sm font-semibold text-[var(--color-malt-dark)]"
              >
                Open reviews
              </Link>
            </div>
            <div className="mt-6 grid gap-3">
              {snapshot.reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-[1.25rem] border border-black/10 bg-[var(--panel)] p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                        {review.beerName} • {review.breweryName}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-[var(--color-cellar)]">
                        {review.title}
                      </h3>
                      <p className="mt-2 text-sm text-black/60">
                        {review.authorName}
                        {review.userName ? ` (${review.userName})` : ""} •{" "}
                        {review.rating}/5 •{" "}
                        {formatDistanceToNow(new Date(review.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <form
                      action={toggleReviewVisibilityAction}
                      className="flex items-center gap-3"
                    >
                      <input type="hidden" name="reviewId" value={review.id} />
                      <input
                        type="hidden"
                        name="published"
                        value={review.published ? "false" : "true"}
                      />
                      <PendingButton
                        pendingLabel="Saving..."
                        className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[var(--color-cellar)] transition hover:bg-black hover:text-[var(--color-foam)]"
                        type="submit"
                      >
                        {review.published ? "Hide review" : "Publish review"}
                      </PendingButton>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <div className="grid gap-6">
            <article className="rounded-[1.75rem] border border-black/10 bg-white/70 p-6">
              <p className="text-sm font-semibold tracking-[0.18em] text-[var(--color-hop)] uppercase">
                Feature control
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--color-cellar)]">
                Curate beer discovery.
              </h2>
              <div className="mt-6 grid gap-3">
                {snapshot.featuredBeers.map((beer) => (
                  <div
                    key={beer.id}
                    className="rounded-[1.25rem] border border-black/10 bg-[var(--panel)] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                          {beer.breweryName} • {beer.style}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-[var(--color-cellar)]">
                          {beer.name}
                        </h3>
                      </div>
                      <form action={toggleBeerFeaturedAction}>
                        <input type="hidden" name="beerId" value={beer.id} />
                        <input
                          type="hidden"
                          name="featured"
                          value={beer.featured ? "false" : "true"}
                        />
                        <PendingButton
                          pendingLabel="Saving..."
                          className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[var(--color-cellar)] transition hover:bg-black hover:text-[var(--color-foam)]"
                          type="submit"
                        >
                          {beer.featured ? "Unfeature" : "Feature"}
                        </PendingButton>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-black/10 bg-white/70 p-6">
              <p className="text-sm font-semibold tracking-[0.18em] text-[var(--color-hop)] uppercase">
                Member roles
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--color-cellar)]">
                Control operator access.
              </h2>
              <div className="mt-6 grid gap-3">
                {snapshot.users.map((user) => (
                  <form
                    key={user.id}
                    action={updateUserRoleAction}
                    className="grid gap-4 rounded-[1.25rem] border border-black/10 bg-[var(--panel)] p-4 md:grid-cols-[1fr_auto_auto] md:items-center"
                  >
                    <div>
                      <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                        {user.email ?? "Guest pass member"}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-[var(--color-cellar)]">
                        {user.name ?? "Unnamed member"}
                      </h3>
                      <p className="mt-2 text-sm text-black/60">
                        {user.city ?? "No city"} • {user.reviewCount} reviews •{" "}
                        {user.savedRouteCount} saved routes
                      </p>
                    </div>
                    <input type="hidden" name="userId" value={user.id} />
                    <select
                      name="role"
                      defaultValue={user.role}
                      className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm font-medium text-[var(--color-cellar)] outline-none"
                    >
                      <option value="MEMBER">Member</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <PendingButton
                      pendingLabel="Updating..."
                      className="inline-flex rounded-full bg-[var(--color-cellar)] px-4 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
                      type="submit"
                    >
                      Save role
                    </PendingButton>
                  </form>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {snapshot.routes.map((route) => (
            <article
              key={route.id}
              className="rounded-[1.5rem] border border-black/10 bg-white/70 p-5"
            >
              <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                {route.city} • {route.vibe}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--color-cellar)]">
                {route.name}
              </h2>
              <p className="mt-3 text-sm leading-7 text-black/65">
                {route.summary}
              </p>
              <p className="mt-4 text-sm font-semibold text-[var(--color-malt-dark)]">
                {route.stopCount} planned stops
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
