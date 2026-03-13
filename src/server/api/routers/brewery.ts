import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getCatalogSnapshot } from "~/server/services/catalog";

export const breweryRouter = createTRPCRouter({
  all: publicProcedure.query(async () => {
    const snapshot = await getCatalogSnapshot();
    return snapshot.breweries;
  }),
  mapPins: publicProcedure.query(async () => {
    const snapshot = await getCatalogSnapshot();
    return snapshot.breweries.map((brewery) => ({
      slug: brewery.slug,
      name: brewery.name,
      city: brewery.city,
      latitude: brewery.latitude,
      longitude: brewery.longitude,
      specialty: brewery.specialty,
    }));
  }),
});
