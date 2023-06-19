import { createTRPCRouter } from "@/server/api/trpc";
import { oranisationsRouter } from "@/server/api/routers/organisations";
import { usersRouter } from '@/server/api/routers/users'
import { facilitiesRouter } from './routers/facilities'
import { venuesRouter } from './routers/venues'
import { awsRouter } from "./routers/aws";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
        aws: awsRouter,
        organisation: oranisationsRouter,
        user: usersRouter,
        facility: facilitiesRouter,
        venue: venuesRouter,
    })

// export type definition of API
export type AppRouter = typeof appRouter;
