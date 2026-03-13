import { PageHero } from "~/components/page-hero";
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
      <div className="mx-auto grid w-full max-w-6xl gap-8">
        <PageHero
          eyebrow="Route planner"
          title="Turn scattered beer ideas into a route with a point of view."
          description="Choose a city, filter the options, and save the routes you want to try."
          stats={[
            { label: "Routes", value: String(routes.length) },
            { label: "Saved", value: String(member?.savedRoutes.length ?? 0) },
          ]}
        />
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
