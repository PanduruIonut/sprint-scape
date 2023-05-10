import { createTRPCRouter } from "@/server/api/trpc";
import { oranisationsRouter } from "@/server/api/routers/organisations";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  organisation: oranisationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
