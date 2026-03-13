"use client";

import { useState } from "react";

import { saveRouteAction } from "~/app/actions";
import {
  cityOptions,
  routeVibes,
  type BeerSummary,
  type BrewerySummary,
  type RouteSummary,
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
import { Select } from "./ui/select";

type RoutePlannerProps = {
  beers: BeerSummary[];
  routes: RouteSummary[];
  breweries: BrewerySummary[];
  canSave?: boolean;
  savedRouteSlugs?: string[];
};

export function RoutePlanner({
  beers,
  routes,
  breweries,
  canSave = false,
  savedRouteSlugs = [],
}: RoutePlannerProps) {
  const [pace, setPace] = useState<string>("balanced");
  const [selectedCity, setSelectedCity] = useState<string>(
    cityOptions[0] ?? "",
  );
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  const [selectedVibe, setSelectedVibe] = useState<string>("all");
  const [maxStops, setMaxStops] = useState<number>(4);
  const styleOptions = Array.from(
    new Set(beers.map((beer) => beer.style)),
  ).sort();

  const routeCards = routes
    .filter((route) => !selectedCity || route.city === selectedCity)
    .filter((route) => selectedVibe === "all" || route.vibe === selectedVibe)
    .filter((route) => route.stopSlugs.length <= maxStops)
    .map((route) => {
      const routeBreweries = breweries.filter((brewery) =>
        route.stopSlugs.includes(brewery.slug),
      );
      const routeBeers = beers.filter((beer) =>
        routeBreweries.some((brewery) => brewery.slug === beer.brewerySlug),
      );
      const matchesStyle =
        selectedStyle === "all" ||
        routeBeers.some((beer) => beer.style === selectedStyle);
      const paceProfile =
        route.durationMinutes <= 190
          ? "quick"
          : route.durationMinutes >= 230
            ? "lingering"
            : "balanced";
      const matchesPace = pace === "all" || pace === paceProfile;
      const score =
        (matchesStyle ? 30 : 0) +
        (selectedVibe === "all" || route.vibe === selectedVibe ? 25 : 0) +
        (pace === "all" || paceProfile === pace ? 20 : 0) +
        Math.max(0, 20 - route.stopSlugs.length * 2) +
        route.highlights.length * 3;

      return {
        matchesPace,
        matchesStyle,
        paceProfile,
        route,
        score,
      };
    })
    .filter((entry) => entry.matchesStyle && entry.matchesPace)
    .sort((left, right) => right.score - left.score);

  const recommendation = routeCards[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.72fr_1fr]">
      <Card className="h-fit bg-[var(--panel)] lg:sticky lg:top-28">
        <CardHeader>
          <p className="text-sm font-semibold tracking-[0.18em] text-[var(--color-hop)] uppercase">
            Planner controls
          </p>
          <CardTitle>Tune the route before you scan it.</CardTitle>
          <CardDescription>
            Filter by city, style, pace, and number of stops.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm font-medium text-black/75">
              City
              <Select
                value={selectedCity}
                onChange={(event) => setSelectedCity(event.target.value)}
              >
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-black/75">
              Route vibe
              <Select
                value={selectedVibe}
                onChange={(event) => setSelectedVibe(event.target.value)}
              >
                <option value="all">All vibes</option>
                {routeVibes.map((vibe) => (
                  <option key={vibe} value={vibe}>
                    {vibe}
                  </option>
                ))}
              </Select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-black/75">
              Preferred style
              <Select
                value={selectedStyle}
                onChange={(event) => setSelectedStyle(event.target.value)}
              >
                <option value="all">Any style</option>
                {styleOptions.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </Select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-black/75">
              Pace
              <Select
                value={pace}
                onChange={(event) => setPace(event.target.value)}
              >
                <option value="all">Any pace</option>
                <option value="quick">Quick hit</option>
                <option value="balanced">Balanced evening</option>
                <option value="lingering">Long linger</option>
              </Select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-black/75">
              Max stops
              <input
                type="range"
                min={1}
                max={6}
                value={maxStops}
                onChange={(event) => setMaxStops(Number(event.target.value))}
              />
              <span className="text-xs tracking-[0.18em] text-black/45 uppercase">
                {maxStops} stops or fewer
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {recommendation ? (
          <Card className="bg-[var(--color-cellar)] text-[var(--color-foam)]">
            <CardHeader>
              <p className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
                Best current match
              </p>
              <CardTitle className="text-3xl text-[var(--color-foam)]">
                {recommendation.route.name}
              </CardTitle>
              <CardDescription className="text-white/78">
                {recommendation.route.summary}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 text-xs font-semibold tracking-[0.16em] text-white/70 uppercase">
                <Badge variant="inverse">{recommendation.route.city}</Badge>
                <Badge variant="inverse">{recommendation.route.vibe}</Badge>
                <Badge variant="inverse">{recommendation.paceProfile}</Badge>
                <Badge variant="inverse">
                  Match score {recommendation.score}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ) : null}
        {routeCards.length > 0 ? (
          routeCards.map(({ paceProfile, route, score }) => (
            <Card key={route.slug} id={route.slug}>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-malt)] uppercase">
                      {route.city} • {route.vibe} • {paceProfile}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-[var(--color-cellar)]">
                      {route.name}
                    </h3>
                  </div>
                  <div className="text-right text-sm font-medium text-black/55">
                    <p>Score {score}</p>
                    <p>{route.durationMinutes} min</p>
                    <p>{route.distanceKm.toFixed(1)} km</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-black/68">
                  {route.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {route.highlights.map((highlight) => (
                    <Badge key={highlight}>{highlight}</Badge>
                  ))}
                </div>
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {route.stopSlugs.map((stopSlug) => {
                    const brewery = breweries.find(
                      (entry) => entry.slug === stopSlug,
                    );
                    if (!brewery) return null;

                    return (
                      <div
                        key={stopSlug}
                        className="rounded-2xl border border-black/10 bg-[var(--panel)] p-4"
                      >
                        <p className="text-xs font-semibold tracking-[0.18em] text-black/45 uppercase">
                          {brewery.city}
                        </p>
                        <h4 className="mt-1 text-lg font-semibold text-[var(--color-cellar)]">
                          {brewery.name}
                        </h4>
                        <p className="mt-2 text-sm text-black/65">
                          {brewery.specialty}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {savedRouteSlugs.includes(route.slug) ? (
                    <span className="rounded-full bg-[var(--color-cellar)] px-4 py-2 text-sm font-semibold text-[var(--color-foam)]">
                      Saved to Account
                    </span>
                  ) : canSave ? (
                    <form action={saveRouteAction}>
                      <input
                        name="routeSlug"
                        type="hidden"
                        value={route.slug}
                      />
                      <PendingButton
                        pendingLabel="Saving..."
                        className="rounded-full bg-[var(--color-cellar)] px-4 py-2 text-sm font-semibold text-[var(--color-foam)] transition hover:bg-black"
                        type="submit"
                      >
                        Save route
                      </PendingButton>
                    </form>
                  ) : (
                    <span className="text-sm font-medium text-black/55">
                      Sign in to save routes.
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-black/20 bg-white/55 p-10 text-center text-black/60">
            No routes match the current filters. Loosen the stop count or switch
            the vibe.
          </div>
        )}
      </div>
    </div>
  );
}
