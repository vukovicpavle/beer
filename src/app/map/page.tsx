import { BeerMap } from "~/components/beer-map";
import { getCatalogSnapshot } from "~/server/services/catalog";

export default async function MapPage() {
  const { breweries } = await getCatalogSnapshot();

  return (
    <main className="px-6 pt-6 pb-20 md:pt-10 md:pb-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.22em] text-[var(--color-hop)] uppercase">
            Beer map
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-[var(--color-cellar)]">
            Scout standout breweries before you commit the night.
          </h1>
          <p className="mt-5 text-lg leading-8 text-black/68">
            The map favors signal over volume: where it is, what it does best,
            and whether it belongs in a casual crawl or a destination detour.
          </p>
        </div>
        <BeerMap breweries={breweries} />
      </div>
    </main>
  );
}
