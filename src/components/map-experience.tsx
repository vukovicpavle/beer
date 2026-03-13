"use client";

import { BeerMap } from "~/components/beer-map";
import { api } from "~/trpc/react";

export function MapExperience() {
  const { data } = api.catalog.snapshot.useQuery();

  if (!data) {
    return (
      <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 text-sm text-black/60">
        Loading map...
      </div>
    );
  }

  return (
    <BeerMap
      beers={data.beers}
      breweries={data.breweries}
      reviews={data.reviews}
      routes={data.routes}
    />
  );
}
