"use client";

import { useState } from "react";

import {
  cityOptions,
  routeVibes,
  type BrewerySummary,
  type RouteSummary,
} from "~/data/catalog";

type RoutePlannerProps = {
  routes: RouteSummary[];
  breweries: BrewerySummary[];
};

export function RoutePlanner({ routes, breweries }: RoutePlannerProps) {
  const [selectedCity, setSelectedCity] = useState<string>(
    cityOptions[0] ?? "",
  );
  const [selectedVibe, setSelectedVibe] = useState<string>("all");
  const [maxStops, setMaxStops] = useState<number>(4);

  const visibleRoutes = routes
    .filter((route) => !selectedCity || route.city === selectedCity)
    .filter((route) => selectedVibe === "all" || route.vibe === selectedVibe)
    .filter((route) => route.stopSlugs.length <= maxStops);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.72fr_1fr]">
      <aside className="rounded-[1.75rem] border border-black/10 bg-[var(--panel)] p-6">
        <p className="text-sm font-semibold tracking-[0.18em] text-[var(--color-hop)] uppercase">
          Planner controls
        </p>
        <div className="mt-6 grid gap-5">
          <label className="grid gap-2 text-sm font-medium text-black/75">
            City
            <select
              value={selectedCity}
              onChange={(event) => setSelectedCity(event.target.value)}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
            >
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-black/75">
            Route vibe
            <select
              value={selectedVibe}
              onChange={(event) => setSelectedVibe(event.target.value)}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
            >
              <option value="all">All vibes</option>
              {routeVibes.map((vibe) => (
                <option key={vibe} value={vibe}>
                  {vibe}
                </option>
              ))}
            </select>
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
      </aside>

      <div className="grid gap-4">
        {visibleRoutes.length > 0 ? (
          visibleRoutes.map((route) => (
            <article
              key={route.slug}
              className="rounded-[1.75rem] border border-black/10 bg-white/70 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-malt)] uppercase">
                    {route.city} • {route.vibe}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-[var(--color-cellar)]">
                    {route.name}
                  </h3>
                </div>
                <div className="text-right text-sm font-medium text-black/55">
                  <p>{route.durationMinutes} min</p>
                  <p>{route.distanceKm.toFixed(1)} km</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-black/68">
                {route.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {route.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full bg-[var(--color-paper-strong)] px-3 py-1 text-xs font-semibold tracking-[0.12em] text-[var(--color-malt-dark)] uppercase"
                  >
                    {highlight}
                  </span>
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
            </article>
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
