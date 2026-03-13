import { z } from "zod";

import { routeVibes } from "~/data/catalog";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  getCatalogSnapshot,
  getPlannedRoutes,
} from "~/server/services/catalog";

export const routeRouter = createTRPCRouter({
  all: publicProcedure.query(async () => {
    const snapshot = await getCatalogSnapshot();
    return snapshot.routes;
  }),
  plan: publicProcedure
    .input(
      z.object({
        city: z.string().optional(),
        maxStops: z.number().int().min(1).max(6).optional(),
        vibe: z.enum(routeVibes).optional(),
      }),
    )
    .query(async ({ input }) => {
      return getPlannedRoutes(input);
    }),
});
