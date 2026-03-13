import Link from "next/link";
import type { getAdminSnapshot } from "~/server/services/admin";

import {
  createBeerAction,
  createBreweryAction,
  createRouteAction,
  deleteBeerAction,
  deleteBreweryAction,
  deleteReviewAction,
  deleteRouteAction,
  deleteUserAction,
  updateBeerAction,
  updateBreweryAction,
  updateReviewAction,
  updateRouteAction,
  updateUserAction,
} from "~/app/actions";
import { PageHero } from "~/components/page-hero";
import { PendingButton } from "~/components/pending-button";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";

type AdminSnapshot = Awaited<ReturnType<typeof getAdminSnapshot>>;

export function AdminWorkbench({
  errorMessage,
  snapshot,
}: {
  errorMessage?: string;
  snapshot: AdminSnapshot;
}) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8">
      <PageHero
        eyebrow="Admin"
        title="Operate breweries, beers, routes, reviews, and members from one workbench."
        description="This panel now covers the full lifecycle: create, inspect, update, and delete the core records that shape the Hop Atlas product."
        stats={[
          { label: "Members", value: String(snapshot.metrics.members) },
          { label: "Breweries", value: String(snapshot.metrics.breweries) },
          { label: "Beers", value: String(snapshot.metrics.beers) },
          { label: "Routes", value: String(snapshot.metrics.routes) },
        ]}
      />

      {errorMessage ? (
        <Card className="bg-[var(--color-paper-strong)]">
          <CardContent className="p-5 text-sm font-medium text-[var(--color-cellar)]">
            {errorMessage}
          </CardContent>
        </Card>
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
          <Card key={label}>
            <CardContent className="p-5">
              <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                {label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-[var(--color-cellar)]">
                {value}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <Badge className="w-fit">Create brewery</Badge>
            <CardTitle>New brewery</CardTitle>
            <CardDescription>
              Add a new destination with geographic data, tags, and editorial
              context.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createBreweryAction} className="grid gap-4">
              <Input name="name" placeholder="Brewery name" />
              <Input name="slug" placeholder="slug-name" />
              <div className="grid gap-4 md:grid-cols-2">
                <Input name="city" placeholder="City" />
                <Input name="country" placeholder="Country" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  name="latitude"
                  type="number"
                  step="0.000001"
                  placeholder="Latitude"
                />
                <Input
                  name="longitude"
                  type="number"
                  step="0.000001"
                  placeholder="Longitude"
                />
              </div>
              <Input name="specialty" placeholder="Specialty" />
              <Input name="heroBeer" placeholder="Hero beer" />
              <Input
                name="tags"
                placeholder="neo-lager, rooftop, sour-forward"
              />
              <Input
                name="website"
                type="url"
                placeholder="https://example.com"
              />
              <Textarea
                name="description"
                placeholder="Why people should go there"
                rows={4}
              />
              <PendingButton
                pendingLabel="Adding brewery..."
                className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
                type="submit"
              >
                Create brewery
              </PendingButton>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Badge className="w-fit">Create beer</Badge>
            <CardTitle>New beer</CardTitle>
            <CardDescription>
              Attach a beer to an existing brewery and decide whether it belongs
              on discovery surfaces.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createBeerAction} className="grid gap-4">
              <Input name="name" placeholder="Beer name" />
              <Input name="slug" placeholder="beer-slug" />
              <Select name="brewerySlug" defaultValue="">
                <option value="">Pick brewery</option>
                {snapshot.breweries.map((brewery) => (
                  <option key={brewery.id} value={brewery.slug}>
                    {brewery.name}
                  </option>
                ))}
              </Select>
              <div className="grid gap-4 md:grid-cols-2">
                <Input name="style" placeholder="Style" />
                <Input name="abv" type="number" step="0.1" placeholder="ABV" />
              </div>
              <Input
                name="ibu"
                type="number"
                step="1"
                placeholder="IBU (optional)"
              />
              <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/88 px-4 py-3 text-sm font-medium text-black/72">
                <input name="featured" type="checkbox" className="h-4 w-4" />
                Feature on discovery surfaces
              </label>
              <Textarea
                name="description"
                placeholder="Beer story, flavor, texture"
                rows={4}
              />
              <PendingButton
                pendingLabel="Adding beer..."
                className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
                type="submit"
              >
                Create beer
              </PendingButton>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Badge className="w-fit">Create route</Badge>
            <CardTitle>New route</CardTitle>
            <CardDescription>
              Build a crawl from brewery slugs and recommended pours, then
              publish it to the planner and map.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createRouteAction} className="grid gap-4">
              <Input name="name" placeholder="Route name" />
              <Input name="slug" placeholder="route-slug" />
              <div className="grid gap-4 md:grid-cols-2">
                <Input name="city" placeholder="City" />
                <Input
                  name="vibe"
                  placeholder="sessionable, scenic, late-night"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  name="durationMinutes"
                  type="number"
                  step="5"
                  placeholder="Duration minutes"
                />
                <Input
                  name="distanceKm"
                  type="number"
                  step="0.1"
                  placeholder="Distance km"
                />
              </div>
              <Textarea
                name="summary"
                placeholder="Why this crawl works"
                rows={3}
              />
              <Textarea
                name="stopSlugs"
                placeholder="brewery-one, brewery-two, brewery-three"
                rows={3}
              />
              <Textarea
                name="highlights"
                placeholder={"First pour\nSecond pour\nThird pour"}
                rows={3}
              />
              <PendingButton
                pendingLabel="Adding route..."
                className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
                type="submit"
              >
                Create route
              </PendingButton>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <Badge variant="muted" className="w-fit">
              Breweries
            </Badge>
            <CardTitle>Edit breweries</CardTitle>
            <CardDescription>
              Update any brewery record or delete it entirely from the catalog.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {snapshot.breweries.map((brewery) => (
              <details
                key={brewery.id}
                className="rounded-[1.25rem] border border-black/10 bg-[var(--panel)] p-4"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                      {brewery.city} • {brewery.country}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[var(--color-cellar)]">
                      {brewery.name}
                    </h3>
                  </div>
                  <div className="text-right text-sm text-black/58">
                    <p>{brewery.beerCount} beers</p>
                    <p>{brewery.stopCount} route stops</p>
                  </div>
                </summary>
                <form action={updateBreweryAction} className="mt-4 grid gap-4">
                  <input type="hidden" name="breweryId" value={brewery.id} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input name="name" defaultValue={brewery.name} />
                    <Input name="slug" defaultValue={brewery.slug} />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input name="city" defaultValue={brewery.city} />
                    <Input name="country" defaultValue={brewery.country} />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      name="latitude"
                      type="number"
                      step="0.000001"
                      defaultValue={brewery.latitude}
                    />
                    <Input
                      name="longitude"
                      type="number"
                      step="0.000001"
                      defaultValue={brewery.longitude}
                    />
                  </div>
                  <Input name="specialty" defaultValue={brewery.specialty} />
                  <Input
                    name="heroBeer"
                    defaultValue={brewery.heroBeer ?? ""}
                  />
                  <Input
                    name="website"
                    type="url"
                    defaultValue={brewery.website ?? ""}
                  />
                  <Input name="tags" defaultValue={brewery.tags.join(", ")} />
                  <Textarea
                    name="description"
                    rows={4}
                    defaultValue={brewery.description}
                  />
                  <PendingButton
                    pendingLabel="Saving brewery..."
                    className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
                    type="submit"
                  >
                    Save brewery
                  </PendingButton>
                </form>
                <form action={deleteBreweryAction} className="mt-3">
                  <input type="hidden" name="breweryId" value={brewery.id} />
                  <PendingButton
                    pendingLabel="Deleting brewery..."
                    className="inline-flex rounded-full border border-red-900/15 bg-red-50 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-100"
                    type="submit"
                  >
                    Delete brewery
                  </PendingButton>
                </form>
              </details>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Badge variant="muted" className="w-fit">
              Beers
            </Badge>
            <CardTitle>Edit beers</CardTitle>
            <CardDescription>
              Reassign beers, change featured status, update details, or remove
              them from the product.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {snapshot.beers.map((beer) => (
              <details
                key={beer.id}
                className="rounded-[1.25rem] border border-black/10 bg-[var(--panel)] p-4"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                      {beer.breweryName} • {beer.style}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[var(--color-cellar)]">
                      {beer.name}
                    </h3>
                  </div>
                  <div className="text-right text-sm text-black/58">
                    <p>{beer.abv.toFixed(1)}% ABV</p>
                    <p>{beer.featured ? "Featured" : "Standard"}</p>
                  </div>
                </summary>
                <form action={updateBeerAction} className="mt-4 grid gap-4">
                  <input type="hidden" name="beerId" value={beer.id} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input name="name" defaultValue={beer.name} />
                    <Input name="slug" defaultValue={beer.slug} />
                  </div>
                  <Select name="brewerySlug" defaultValue={beer.brewerySlug}>
                    {snapshot.breweries.map((brewery) => (
                      <option key={brewery.id} value={brewery.slug}>
                        {brewery.name}
                      </option>
                    ))}
                  </Select>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input name="style" defaultValue={beer.style} />
                    <Input
                      name="abv"
                      type="number"
                      step="0.1"
                      defaultValue={beer.abv}
                    />
                  </div>
                  <Input
                    name="ibu"
                    type="number"
                    step="1"
                    defaultValue={beer.ibu ?? ""}
                  />
                  <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/88 px-4 py-3 text-sm font-medium text-black/72">
                    <input
                      name="featured"
                      type="checkbox"
                      className="h-4 w-4"
                      defaultChecked={beer.featured}
                    />
                    Feature on discovery surfaces
                  </label>
                  <Textarea
                    name="description"
                    rows={4}
                    defaultValue={beer.description}
                  />
                  <PendingButton
                    pendingLabel="Saving beer..."
                    className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
                    type="submit"
                  >
                    Save beer
                  </PendingButton>
                </form>
                <form action={deleteBeerAction} className="mt-3">
                  <input type="hidden" name="beerId" value={beer.id} />
                  <PendingButton
                    pendingLabel="Deleting beer..."
                    className="inline-flex rounded-full border border-red-900/15 bg-red-50 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-100"
                    type="submit"
                  >
                    Delete beer
                  </PendingButton>
                </form>
              </details>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <Badge variant="muted" className="w-fit">
              Routes
            </Badge>
            <CardTitle>Edit routes</CardTitle>
            <CardDescription>
              Update route planning logic, stop order, and recommended pours
              from one place.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {snapshot.routes.map((route) => (
              <details
                key={route.id}
                className="rounded-[1.25rem] border border-black/10 bg-[var(--panel)] p-4"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                      {route.city} • {route.vibe}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[var(--color-cellar)]">
                      {route.name}
                    </h3>
                  </div>
                  <div className="text-right text-sm text-black/58">
                    <p>{route.durationMinutes} min</p>
                    <p>{route.stopCount} stops</p>
                  </div>
                </summary>
                <form action={updateRouteAction} className="mt-4 grid gap-4">
                  <input type="hidden" name="routeId" value={route.id} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input name="name" defaultValue={route.name} />
                    <Input name="slug" defaultValue={route.slug} />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input name="city" defaultValue={route.city} />
                    <Input name="vibe" defaultValue={route.vibe} />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      name="durationMinutes"
                      type="number"
                      step="5"
                      defaultValue={route.durationMinutes}
                    />
                    <Input
                      name="distanceKm"
                      type="number"
                      step="0.1"
                      defaultValue={route.distanceKm}
                    />
                  </div>
                  <Textarea
                    name="summary"
                    rows={3}
                    defaultValue={route.summary}
                  />
                  <Textarea
                    name="stopSlugs"
                    rows={3}
                    defaultValue={route.stopSlugs.join(", ")}
                  />
                  <Textarea
                    name="highlights"
                    rows={3}
                    defaultValue={route.highlights.join("\n")}
                  />
                  <PendingButton
                    pendingLabel="Saving route..."
                    className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
                    type="submit"
                  >
                    Save route
                  </PendingButton>
                </form>
                <form action={deleteRouteAction} className="mt-3">
                  <input type="hidden" name="routeId" value={route.id} />
                  <PendingButton
                    pendingLabel="Deleting route..."
                    className="inline-flex rounded-full border border-red-900/15 bg-red-50 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-100"
                    type="submit"
                  >
                    Delete route
                  </PendingButton>
                </form>
              </details>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Badge variant="muted" className="w-fit">
              Reviews
            </Badge>
            <CardTitle>Edit reviews</CardTitle>
            <CardDescription>
              Moderate visibility, improve metadata, or delete reviews that
              should leave the system.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {snapshot.reviews.map((review) => (
              <details
                key={review.id}
                className="rounded-[1.25rem] border border-black/10 bg-[var(--panel)] p-4"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                      {review.beerName} • {review.breweryName}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[var(--color-cellar)]">
                      {review.title}
                    </h3>
                  </div>
                  <div className="text-right text-sm text-black/58">
                    <p>{review.rating}/5</p>
                    <p>{review.published ? "Published" : "Hidden"}</p>
                  </div>
                </summary>
                <form action={updateReviewAction} className="mt-4 grid gap-4">
                  <input type="hidden" name="reviewId" value={review.id} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input name="title" defaultValue={review.title} />
                    <Input name="authorName" defaultValue={review.authorName} />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Select name="rating" defaultValue={String(review.rating)}>
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>
                          {value}/5
                        </option>
                      ))}
                    </Select>
                    <Select
                      name="published"
                      defaultValue={review.published ? "true" : "false"}
                    >
                      <option value="true">Published</option>
                      <option value="false">Hidden</option>
                    </Select>
                  </div>
                  <Input
                    name="visitedAt"
                    type="date"
                    defaultValue={review.visitedAt?.slice(0, 10) ?? ""}
                  />
                  <Textarea name="body" rows={5} defaultValue={review.body} />
                  <PendingButton
                    pendingLabel="Saving review..."
                    className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
                    type="submit"
                  >
                    Save review
                  </PendingButton>
                </form>
                <form action={deleteReviewAction} className="mt-3">
                  <input type="hidden" name="reviewId" value={review.id} />
                  <PendingButton
                    pendingLabel="Deleting review..."
                    className="inline-flex rounded-full border border-red-900/15 bg-red-50 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-100"
                    type="submit"
                  >
                    Delete review
                  </PendingButton>
                </form>
              </details>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <Badge variant="muted" className="w-fit">
            Members
          </Badge>
          <CardTitle>Edit members</CardTitle>
          <CardDescription>
            Update member profile metadata, change operator access, or remove
            accounts while protecting the final admin.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {snapshot.users.map((user) => (
            <details
              key={user.id}
              className="rounded-[1.25rem] border border-black/10 bg-[var(--panel)] p-4"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                    {user.email ?? "Guest pass member"}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[var(--color-cellar)]">
                    {user.name ?? "Unnamed member"}
                  </h3>
                </div>
                <div className="text-right text-sm text-black/58">
                  <p>{user.role}</p>
                  <p>{user.savedRouteCount} saved routes</p>
                </div>
              </summary>
              <form
                action={updateUserAction}
                className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_13rem_auto] md:items-end"
              >
                <input type="hidden" name="userId" value={user.id} />
                <Input
                  name="name"
                  defaultValue={user.name ?? ""}
                  placeholder="Display name"
                />
                <Input
                  name="city"
                  defaultValue={user.city ?? ""}
                  placeholder="Home city"
                />
                <Select name="role" defaultValue={user.role}>
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </Select>
                <PendingButton
                  pendingLabel="Saving member..."
                  className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
                  type="submit"
                >
                  Save member
                </PendingButton>
              </form>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-black/60">
                <span>{user.reviewCount} reviews</span>
                <span>{user.savedRouteCount} saved routes</span>
              </div>
              <form action={deleteUserAction} className="mt-3">
                <input type="hidden" name="userId" value={user.id} />
                <PendingButton
                  pendingLabel="Deleting member..."
                  className="inline-flex rounded-full border border-red-900/15 bg-red-50 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-100"
                  type="submit"
                >
                  Delete member
                </PendingButton>
              </form>
            </details>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link href="/club">Back to club</Link>
        </Button>
      </div>
    </div>
  );
}
