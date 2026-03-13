import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getCatalogSnapshot } from "~/server/services/catalog";

export const reviewRouter = createTRPCRouter({
  recent: publicProcedure.query(async () => {
    const snapshot = await getCatalogSnapshot();
    return snapshot.reviews.slice(0, 6);
  }),
});
