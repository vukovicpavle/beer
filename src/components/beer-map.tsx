"use client";

import { useState } from "react";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/maplibre";

import type { BrewerySummary } from "~/data/catalog";

type BeerMapProps = {
  breweries: BrewerySummary[];
};

const defaultCenter = { latitude: 50.1109, longitude: 10.6821, zoom: 3.4 };

export function BeerMap({ breweries }: BeerMapProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    breweries[0]?.slug ?? null,
  );
  const selected =
    breweries.find((brewery) => brewery.slug === selectedSlug) ?? breweries[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/50 shadow-[0_12px_50px_rgba(61,31,10,0.08)]">
        <Map
          initialViewState={
            selected
              ? {
                  latitude: selected.latitude,
                  longitude: selected.longitude,
                  zoom: 4.2,
                }
              : defaultCenter
          }
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          style={{ width: "100%", minHeight: 520 }}
        >
          <NavigationControl position="top-right" />
          {breweries.map((brewery) => (
            <Marker
              key={brewery.slug}
              latitude={brewery.latitude}
              longitude={brewery.longitude}
              anchor="bottom"
            >
              <button
                type="button"
                onClick={() => setSelectedSlug(brewery.slug)}
                className="h-5 w-5 rounded-full border-2 border-[var(--color-foam)] bg-[var(--color-accent)] shadow"
                aria-label={`View ${brewery.name}`}
              />
            </Marker>
          ))}
          {selected ? (
            <Popup
              latitude={selected.latitude}
              longitude={selected.longitude}
              anchor="top"
              closeButton={false}
              offset={18}
              className="text-[var(--color-cellar)]"
            >
              <div className="min-w-52">
                <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-malt)] uppercase">
                  {selected.city}
                </p>
                <h3 className="mt-1 text-base font-semibold">
                  {selected.name}
                </h3>
                <p className="mt-1 text-sm text-black/65">
                  {selected.specialty}
                </p>
              </div>
            </Popup>
          ) : null}
        </Map>
      </div>

      <div className="grid gap-4">
        {breweries.map((brewery) => (
          <button
            key={brewery.slug}
            type="button"
            onClick={() => setSelectedSlug(brewery.slug)}
            className={`rounded-[1.5rem] border p-5 text-left transition ${selectedSlug === brewery.slug ? "border-[var(--color-cellar)] bg-[var(--color-cellar)] text-[var(--color-foam)]" : "border-black/10 bg-white/60 text-[var(--color-cellar)] hover:bg-white"}`}
          >
            <p className="text-xs font-semibold tracking-[0.18em] uppercase opacity-70">
              {brewery.city}
            </p>
            <h3 className="mt-2 text-xl font-semibold">{brewery.name}</h3>
            <p className="mt-3 text-sm leading-7 opacity-80">
              {brewery.description}
            </p>
            <p className="mt-4 text-sm font-medium">{brewery.specialty}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
