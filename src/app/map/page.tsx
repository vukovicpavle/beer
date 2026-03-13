import { BeerMap } from "~/components/beer-map";
import { PageHero } from "~/components/page-hero";
import { getCatalogSnapshot } from "~/server/services/catalog";

export default async function MapPage() {
  const { beers, breweries, reviews, routes } = await getCatalogSnapshot();

  return (
    <main className="px-6 pt-6 pb-20 md:pt-10 md:pb-24">
      <div className="mx-auto grid w-full max-w-6xl gap-8">
        <PageHero
          eyebrow="Beer map"
          title="Scout standout breweries before you commit the night."
          description="The map now favors quicker scanning: fewer competing surfaces, clearer brewery signal, and a steadier transition from search to selection."
          stats={[
            { label: "Breweries", value: String(breweries.length) },
            { label: "Routes", value: String(routes.length) },
          ]}
        />
        <BeerMap
          beers={beers}
          breweries={breweries}
          reviews={reviews}
          routes={routes}
        />
      </div>
    </main>
  );
}
