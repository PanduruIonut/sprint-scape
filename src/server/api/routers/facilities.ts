import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure,
} from '@/server/api/trpc'

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, '1 m'),
    analytics: true,
})

export const facilitiesRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.facility.findMany()
    }),
    create: privateProcedure
        .input(
            z.object({
                content: z.object({
                    name: z.string(),
                    address: z.string(),
                    email: z.string().email(),
                    description: z.string(),
                    latitude: z.string(),
                    longitude: z.string(),
                    organisationId: z.string(),
                }),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { success } = await ratelimit.limit(ctx.userId)
            if (!success) {
                throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
            }
            const facility = await ctx.prisma.facility.create({
                data: {
                    name: input.content.name,
                    address: input.content.address,
                    email: input.content.email,
                    description: input.content.description,
                    latitude: input.content.latitude,
                    longitude: input.content.longitude,
                    organisation: {
                        connect: {
                            id: input.content.organisationId,
                        },
                    },
                },
            })

            return facility
        }),
})
