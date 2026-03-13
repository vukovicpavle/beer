"use client";

import { useEffect, useRef, useState } from "react";
import Map, {
  Marker,
  NavigationControl,
  Popup,
  type MapRef,
} from "react-map-gl/maplibre";

import type {
  BeerSummary,
  BrewerySummary,
  ReviewSummary,
  RouteSummary,
} from "~/data/catalog";

type BeerMapProps = {
  beers: BeerSummary[];
  breweries: BrewerySummary[];
  reviews: ReviewSummary[];
  routes: RouteSummary[];
};

const defaultCenter = { latitude: 50.1109, longitude: 10.6821, zoom: 3.4 };

export function BeerMap({ beers, breweries, reviews, routes }: BeerMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    breweries[0]?.slug ?? null,
  );
  const [selectedStyle, setSelectedStyle] = useState("all");

  const cityOptions = Array.from(
    new Set(breweries.map((brewery) => brewery.city)),
  ).sort();
  const styleOptions = Array.from(
    new Set(beers.map((beer) => beer.style)),
  ).sort();
  const visibleBreweries = breweries.filter((brewery) => {
    const matchesQuery =
      query.length === 0 ||
      `${brewery.name} ${brewery.city} ${brewery.specialty} ${brewery.tags.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase());
    const matchesCity = selectedCity === "all" || brewery.city === selectedCity;
    const matchesStyle =
      selectedStyle === "all" ||
      beers.some(
        (beer) =>
          beer.brewerySlug === brewery.slug && beer.style === selectedStyle,
      );

    return matchesQuery && matchesCity && matchesStyle;
  });
  const selected =
    visibleBreweries.find((brewery) => brewery.slug === selectedSlug) ??
    visibleBreweries[0] ??
    breweries[0];
  const selectedBeers = beers.filter(
    (beer) => beer.brewerySlug === selected?.slug,
  );
  const selectedReviews = reviews.filter((review) =>
    selectedBeers.some((beer) => beer.slug === review.beerSlug),
  );
  const selectedRoutes = routes.filter((route) =>
    selected ? route.stopSlugs.includes(selected.slug) : false,
  );
  const averageRating = selectedReviews.length
    ? selectedReviews.reduce((total, review) => total + review.rating, 0) /
      selectedReviews.length
    : null;

  useEffect(() => {
    if (
      selectedSlug &&
      visibleBreweries.some((brewery) => brewery.slug === selectedSlug)
    ) {
      return;
    }

    setSelectedSlug(visibleBreweries[0]?.slug ?? null);
  }, [selectedSlug, visibleBreweries]);

  useEffect(() => {
    if (!selected) {
      return;
    }

    mapRef.current?.flyTo({
      center: [selected.longitude, selected.latitude],
      duration: 1400,
      zoom: 4.8,
    });
  }, [selected]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.22fr_0.78fr]">
      <div className="grid gap-5">
        <div className="grid gap-4 rounded-[1.75rem] border border-black/10 bg-[var(--panel)] p-5 md:grid-cols-[1.3fr_repeat(2,minmax(0,1fr))]">
          <label className="grid gap-2 text-sm font-medium text-black/72">
            Search breweries
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by brewery, city, or specialty"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
            />
          </label>
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
            Beer style
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
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/50 shadow-[0_12px_50px_rgba(61,31,10,0.08)]">
          <Map
            ref={mapRef}
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
            {visibleBreweries.map((brewery) => (
              <Marker
                key={brewery.slug}
                latitude={brewery.latitude}
                longitude={brewery.longitude}
                anchor="bottom"
              >
                <button
                  type="button"
                  onClick={() => setSelectedSlug(brewery.slug)}
                  className={`h-5 w-5 rounded-full border-2 border-[var(--color-foam)] shadow ${selectedSlug === brewery.slug ? "bg-[var(--color-cellar)]" : "bg-[var(--color-accent)]"}`}
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
      </div>

      <div className="grid gap-4">
        {selected ? (
          <article className="rounded-[1.75rem] border border-black/10 bg-[var(--color-cellar)] p-6 text-[var(--color-foam)]">
            <p className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
              {selected.city} • {selected.country}
            </p>
            <h3 className="mt-3 text-3xl font-semibold">{selected.name}</h3>
            <p className="mt-4 text-sm leading-7 text-white/78">
              {selected.description}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.25rem] bg-white/10 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-white/55 uppercase">
                  Specialty
                </p>
                <p className="mt-2 text-sm font-semibold">
                  {selected.specialty}
                </p>
              </div>
              <div className="rounded-[1.25rem] bg-white/10 p-4">
                <p className="text-xs font-semibold tracking-[0.16em] text-white/55 uppercase">
                  Signal
                </p>
                <p className="mt-2 text-sm font-semibold">
                  {averageRating
                    ? `${averageRating.toFixed(1)}/5 avg from ${selectedReviews.length} reviews`
                    : "Fresh scouting stop"}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {selected.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-white/75 uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 grid gap-3">
              {selectedBeers.slice(0, 3).map((beer) => (
                <div
                  key={beer.slug}
                  className="rounded-[1.25rem] bg-white/8 p-4"
                >
                  <p className="text-xs font-semibold tracking-[0.16em] text-white/55 uppercase">
                    {beer.style}
                  </p>
                  <p className="mt-2 text-lg font-semibold">{beer.name}</p>
                  <p className="mt-2 text-sm text-white/72">
                    {beer.description}
                  </p>
                </div>
              ))}
            </div>
            {selectedRoutes.length > 0 ? (
              <div className="mt-6">
                <p className="text-xs font-semibold tracking-[0.16em] text-white/55 uppercase">
                  Shows up in routes
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedRoutes.map((route) => (
                    <span
                      key={route.slug}
                      className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white/78"
                    >
                      {route.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        ) : null}
        <div className="grid gap-4">
          {visibleBreweries.map((brewery) => (
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
        {visibleBreweries.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-black/20 bg-white/60 p-8 text-center text-sm text-black/60">
            No breweries match the current filters. Broaden the city or style to
            reopen the map.
          </div>
        ) : null}
      </div>
    </div>
  );
}
