"use client";

import { useDeferredValue, useState } from "react";

import { createReviewAction } from "~/app/actions";
import type {
  BeerSummary,
  BrewerySummary,
  ReviewSummary,
} from "~/data/catalog";

import { PendingButton } from "./pending-button";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Textarea } from "./ui/textarea";

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
  const deferredCity = useDeferredValue(selectedCity);
  const deferredStyle = useDeferredValue(selectedStyle);

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

      if (deferredStyle !== "all" && beer?.style !== deferredStyle) {
        return false;
      }

      if (deferredCity !== "all" && brewery?.city !== deferredCity) {
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
      <section className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-[var(--panel)]">
          <CardHeader>
            <p className="text-sm font-semibold tracking-[0.18em] text-[var(--color-hop)] uppercase">
              Review studio
            </p>
            <CardTitle className="mt-1 text-3xl">
              Add precise tasting notes instead of empty scores.
            </CardTitle>
            <CardDescription>
              Great beer communities are built on useful signal. Leave notes
              that explain balance, finish, and whether a pour is
              destination-worthy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.25rem] bg-white/75 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-black/45 uppercase">
                  Published
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--color-cellar)]">
                  {reviews.length}
                </p>
              </div>
              <div className="rounded-[1.25rem] bg-white/75 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-black/45 uppercase">
                  Cities
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--color-cellar)]">
                  {cityOptions.length}
                </p>
              </div>
              <div className="rounded-[1.25rem] bg-white/75 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-black/45 uppercase">
                  Styles
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--color-cellar)]">
                  {styleOptions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        {canWrite ? (
          <Card className="bg-white/75">
            <CardHeader>
              <CardTitle className="text-2xl">Write a review</CardTitle>
              <CardDescription>
                Keep it short, specific, and useful to someone planning a pour.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createReviewAction} className="grid gap-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-black/72">
                    Beer
                    <Select name="beerSlug" defaultValue={beers[0]?.slug}>
                      {beers.map((beer) => (
                        <option key={beer.slug} value={beer.slug}>
                          {beer.name} • {beer.style}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-black/72">
                    Rating
                    <Select name="rating" defaultValue="4">
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>
                          {value}/5
                        </option>
                      ))}
                    </Select>
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-medium text-black/72">
                  Review title
                  <Input
                    name="title"
                    placeholder="Balanced enough to order twice"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-black/72">
                  Author label
                  <Input
                    name="authorName"
                    defaultValue={defaultAuthorName ?? ""}
                    placeholder="How your review should appear"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-black/72">
                  Visit date
                  <Input name="visitedAt" type="date" />
                </label>
                <label className="grid gap-2 text-sm font-medium text-black/72">
                  Tasting note
                  <Textarea
                    name="body"
                    rows={5}
                    placeholder="Describe structure, finish, and whether this beer deserves route priority."
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
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/75">
            <CardContent className="p-5 text-sm leading-7 text-black/68">
              Save a guest pass in Club before publishing reviews. That keeps
              tasting notes attached to a member profile instead of floating as
              anonymous drive-by ratings.
            </CardContent>
          </Card>
        )}
      </section>

      <section className="grid gap-4 rounded-[2rem] border border-black/10 bg-white/60 p-6 md:grid-cols-[repeat(3,minmax(0,1fr))]">
        <label className="grid gap-2 text-sm font-medium text-black/72">
          City
          <Select
            value={selectedCity}
            onChange={(event) => setSelectedCity(event.target.value)}
          >
            <option value="all">All cities</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-black/72">
          Style
          <Select
            value={selectedStyle}
            onChange={(event) => setSelectedStyle(event.target.value)}
          >
            <option value="all">All styles</option>
            {styleOptions.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </Select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-black/72">
          Sort
          <Select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest rated</option>
          </Select>
        </label>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredReviews.map((review) => {
          const beer = beers.find((entry) => entry.slug === review.beerSlug);
          const brewery = breweries.find(
            (entry) => entry.slug === beer?.brewerySlug,
          );

          return (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge className="w-fit">
                      {beer?.style ?? "Featured pour"}
                    </Badge>
                    <h3 className="mt-3 text-2xl font-semibold text-[var(--color-cellar)]">
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
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
