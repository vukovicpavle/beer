import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getMemberSnapshot } from "~/server/services/member";

export const memberRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    return getMemberSnapshot(ctx.session.user.id);
  }),
});
