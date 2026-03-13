import { PageHero } from "~/components/page-hero";
import { RoutesExperience } from "~/components/routes-experience";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function BeerHoppingPage() {
  const session = await auth();
  void api.catalog.snapshot.prefetch();

  if (session?.user) {
    void api.member.me.prefetch();
  }

  const { routes } = await api.catalog.snapshot();
  const member = session?.user ? await api.member.me() : null;

  return (
    <HydrateClient>
      <main className="px-6 pt-6 pb-20 md:pt-10 md:pb-24">
        <div className="mx-auto grid w-full max-w-6xl gap-8">
          <PageHero
            eyebrow="Beer Hopping"
            title="Plan your next brewery crawl."
            description="Choose a city, filter the options, and save the routes you want to try."
            stats={[
              { label: "Routes", value: String(routes.length) },
              {
                label: "Saved",
                value: String(member?.savedRoutes.length ?? 0),
              },
            ]}
          />
          <RoutesExperience signedIn={Boolean(session?.user)} />
        </div>
      </main>
    </HydrateClient>
  );
}
