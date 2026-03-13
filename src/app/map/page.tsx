import { MapExperience } from "~/components/map-experience";
import { PageHero } from "~/components/page-hero";
import { api, HydrateClient } from "~/trpc/server";

export default async function MapPage() {
  void api.catalog.snapshot.prefetch();
  const { breweries, routes } = await api.catalog.snapshot();

  return (
    <HydrateClient>
      <main className="px-6 pt-6 pb-20 md:pt-10 md:pb-24">
        <div className="mx-auto grid w-full max-w-6xl gap-8">
          <PageHero
            eyebrow="Beer map"
            title="Scout standout breweries before you commit the night."
            description="Search breweries by city or style and compare them on one map."
            stats={[
              { label: "Breweries", value: String(breweries.length) },
              { label: "Routes", value: String(routes.length) },
            ]}
          />
          <MapExperience />
        </div>
      </main>
    </HydrateClient>
  );
}
