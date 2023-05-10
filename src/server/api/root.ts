import { createTRPCRouter } from "@/server/api/trpc";
import { oranisationsRouter } from "@/server/api/routers/organisations";
import { usersRouter } from '@/server/api/routers/users'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    organisation: oranisationsRouter,
    user: usersRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter;
