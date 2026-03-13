import { RoutePlanner } from "~/components/route-planner";
import { auth } from "~/server/auth";
import { getCatalogSnapshot } from "~/server/services/catalog";
import { getMemberSnapshot } from "~/server/services/member";

export default async function RoutesPage() {
  const session = await auth();
  const member = session?.user?.id
    ? await getMemberSnapshot(session.user.id)
    : null;
  const { beers, breweries, routes } = await getCatalogSnapshot();

  return (
    <main className="px-6 pt-6 pb-20 md:pt-10 md:pb-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.22em] text-[var(--color-hop)] uppercase">
            Route planner
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-[var(--color-cellar)]">
            Turn scattered beer ideas into a route with a point of view.
          </h1>
          <p className="mt-5 text-lg leading-8 text-black/68">
            Pick the city, set the vibe, cap the number of stops, and keep the
            plan grounded in actual drinking energy instead of checkbox tourism.
          </p>
        </div>
        <RoutePlanner
          beers={beers}
          routes={routes}
          breweries={breweries}
          canSave={Boolean(session?.user)}
          savedRouteSlugs={member?.savedRoutes.map((route) => route.slug) ?? []}
        />
      </div>
    </main>
  );
}
