"use client";

import { useState } from "react";

import { createReviewAction } from "~/app/actions";
import type {
  BeerSummary,
  BrewerySummary,
  ReviewSummary,
} from "~/data/catalog";

import { PendingButton } from "./pending-button";

type ReviewsStudioProps = {
  beers: BeerSummary[];
  breweries: BrewerySummary[];
  canWrite: boolean;
  defaultAuthorName?: string | null;
  reviews: ReviewSummary[];
};

export function ReviewsStudio({
  beers,
  breweries,
  canWrite,
  defaultAuthorName,
  reviews,
}: ReviewsStudioProps) {
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const cityOptions = Array.from(
    new Set(breweries.map((brewery) => brewery.city)),
  );
  const styleOptions = Array.from(new Set(beers.map((beer) => beer.style)));

  const filteredReviews = reviews
    .filter((review) => {
      const beer = beers.find((entry) => entry.slug === review.beerSlug);
      const brewery = breweries.find(
        (entry) => entry.slug === beer?.brewerySlug,
      );

      if (selectedStyle !== "all" && beer?.style !== selectedStyle) {
        return false;
      }

      if (selectedCity !== "all" && brewery?.city !== selectedCity) {
        return false;
      }

      return true;
    })
    .sort((left, right) => {
      if (sortBy === "highest") {
        return right.rating - left.rating;
      }

      const leftDate = new Date(
        left.createdAt ?? left.visitedAt ?? 0,
      ).getTime();
      const rightDate = new Date(
        right.createdAt ?? right.visitedAt ?? 0,
      ).getTime();
      return rightDate - leftDate;
    });

  return (
    <div className="grid gap-8">
      <section className="grid gap-4 rounded-[2rem] border border-black/10 bg-[var(--panel)] p-6 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-[var(--color-hop)] uppercase">
            Review studio
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--color-cellar)]">
            Add precise tasting notes instead of empty scores.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/68">
            Great beer communities are built on useful signal. Leave notes that
            explain balance, finish, and whether a pour is destination-worthy.
          </p>
        </div>
        {canWrite ? (
          <form
            action={createReviewAction}
            className="grid gap-3 rounded-[1.5rem] bg-white/75 p-5"
          >
            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-black/72">
                Beer
                <select
                  name="beerSlug"
                  defaultValue={beers[0]?.slug}
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                >
                  {beers.map((beer) => (
                    <option key={beer.slug} value={beer.slug}>
                      {beer.name} • {beer.style}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-black/72">
                Rating
                <select
                  name="rating"
                  defaultValue="4"
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value}/5
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium text-black/72">
              Review title
              <input
                name="title"
                placeholder="Balanced enough to order twice"
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-black/72">
              Author label
              <input
                name="authorName"
                defaultValue={defaultAuthorName ?? ""}
                placeholder="How your review should appear"
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-black/72">
              Visit date
              <input
                name="visitedAt"
                type="date"
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-black/72">
              Tasting note
              <textarea
                name="body"
                rows={5}
                placeholder="Describe structure, finish, and whether this beer deserves route priority."
                className="rounded-[1.5rem] border border-black/10 bg-white px-4 py-3 outline-none"
              />
            </label>
            <PendingButton
              pendingLabel="Publishing review..."
              className="inline-flex rounded-full bg-[var(--color-cellar)] px-5 py-3 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
              type="submit"
            >
              Publish review
            </PendingButton>
          </form>
        ) : (
          <div className="rounded-[1.5rem] bg-white/75 p-5 text-sm leading-7 text-black/68">
            Save a guest pass in Club before publishing reviews. That keeps
            tasting notes attached to a member profile instead of floating as
            anonymous drive-by ratings.
          </div>
        )}
      </section>

      <section className="grid gap-4 rounded-[2rem] border border-black/10 bg-white/60 p-6 md:grid-cols-[repeat(3,minmax(0,1fr))]">
        <label className="grid gap-2 text-sm font-medium text-black/72">
          City
          <select
            value={selectedCity}
            onChange={(event) => setSelectedCity(event.target.value)}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
          >
            <option value="all">All cities</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-black/72">
          Style
          <select
            value={selectedStyle}
            onChange={(event) => setSelectedStyle(event.target.value)}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
          >
            <option value="all">All styles</option>
            {styleOptions.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-black/72">
          Sort
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest rated</option>
          </select>
        </label>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredReviews.map((review) => {
          const beer = beers.find((entry) => entry.slug === review.beerSlug);
          const brewery = breweries.find(
            (entry) => entry.slug === beer?.brewerySlug,
          );

          return (
            <article
              key={review.id}
              className="rounded-[1.75rem] border border-black/10 bg-white/70 p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-malt)] uppercase">
                    {beer?.style ?? "Featured pour"}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-[var(--color-cellar)]">
                    {review.title}
                  </h3>
                </div>
                <span className="rounded-full bg-[var(--color-paper-strong)] px-3 py-1 text-sm font-semibold text-[var(--color-malt-dark)]">
                  {review.rating}/5
                </span>
              </div>
              <p className="mt-3 text-sm font-medium text-black/55">
                {beer?.name} {brewery ? `• ${brewery.name}` : ""}
              </p>
              <p className="mt-4 text-sm leading-7 text-black/70">
                {review.body}
              </p>
              <div className="mt-6 flex items-center justify-between text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                <span>{review.authorName}</span>
                <span>
                  {new Date(
                    review.createdAt ?? review.visitedAt ?? Date.now(),
                  ).toLocaleDateString()}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
