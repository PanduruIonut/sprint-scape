import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure,
} from '@/server/api/trpc'
import { Prisma } from '@prisma/client'

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, '1 m'),
    analytics: true,
})

export const facilitiesRouter = createTRPCRouter({
    getOne: publicProcedure
        .input(z.object({ facilityId: z.string() }))
        .query(({ ctx, input }) => {
            return ctx.prisma.facility.findUnique({
                where: {
                    id: input.facilityId,
                },
            })
        }),
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.facility.findMany()
    }),
    getAllByOrganizationId: publicProcedure
        .input(z.object({ organisationId: z.string() }))
        .query(({ ctx, input }) => {
            return ctx.prisma.facility.findMany({
                where: {
                    organisationId: input.organisationId,
                },
            })
        }),

    create: privateProcedure
        .input(
            z.object({
                content: z.object({
                    name: z.string(),
                    address: z.string(),
                    email: z.string().email(),
                    description: z.string().nullable(),
                    phone: z.string(),
                    latitude: z.any(),
                    longitude: z.any(),
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
                    phone: input.content.phone,
                    description: input.content.description,
                    latitude: new Prisma.Decimal(
                        input.content.latitude as string
                    ),
                    longitude: new Prisma.Decimal(
                        input.content.longitude as string
                    ),
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
