import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure,
} from '@/server/api/trpc'

import { type ActivityType, VenueType } from '@prisma/client'

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, '1 m'),
    analytics: true,
})

export const venuesRouter = createTRPCRouter({
    getAllByFacilityId: publicProcedure
        .input(z.object({ facilityId: z.string() }))
        .query(({ ctx, input }) => {
            return ctx.prisma.venue.findMany({
                where: {
                    facilityId: input.facilityId,
                },
            })
        }),
    create: privateProcedure
        .input(
            z.object({
                content: z.object({
                    name: z.string(),
                    address: z.string().nullable(),
                    description: z.string().nullable(),
                    activities: z.array(z.string()),
                    maxPlayersCapacity: z.number().nullable(),
                    facilityId: z.string(),
                    type: z.nativeEnum(VenueType),
                }),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { success } = await ratelimit.limit(ctx.userId)
            if (!success) {
                throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
            }

            const activitiesConnectOrCreate = input.content.activities.map(
                activity => ({
                    where: { id: activity },
                    create: { type: activity as ActivityType },
                }) 
            )
            return ctx.prisma.venue.create({
                data: {
                    name: input.content.name,
                    address: input.content.address,
                    description: input.content.description,
                    type: input.content.type,
                    activities: {
                        connectOrCreate: activitiesConnectOrCreate,
                    },
                    maxPlayersCapacity: input.content.maxPlayersCapacity,
                    facility: {
                        connect: {
                            id: input.content.facilityId,
                        },
                    },
                },
            })
        }),
})
