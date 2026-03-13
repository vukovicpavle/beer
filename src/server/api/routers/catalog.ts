import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getCatalogSnapshot } from "~/server/services/catalog";

export const catalogRouter = createTRPCRouter({
  snapshot: publicProcedure.query(async () => {
    return getCatalogSnapshot();
  }),
});
