"use client";

import { RoutePlanner } from "~/components/route-planner";
import { api } from "~/trpc/react";

export function RoutesExperience({ signedIn }: { signedIn: boolean }) {
  const { data } = api.catalog.snapshot.useQuery();
  const { data: member } = api.member.me.useQuery(undefined, {
    enabled: signedIn,
    retry: false,
  });

  if (!data) {
    return (
      <div className="rounded-[2rem] border border-black/10 bg-white/60 p-8 text-sm text-black/60">
        Loading routes...
      </div>
    );
  }

  return (
    <RoutePlanner
      beers={data.beers}
      breweries={data.breweries}
      canSave={signedIn}
      routes={data.routes}
      savedRouteSlugs={member?.savedRoutes.map((route) => route.slug) ?? []}
    />
  );
}
