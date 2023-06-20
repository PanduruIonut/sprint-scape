import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { z } from 'zod'
import { createTRPCRouter, privateProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, '1 m'),
    analytics: true,
})

export const bookingsRouter = createTRPCRouter({
    create: privateProcedure
        .input(
            z.object({
                content: z.object({
                    facilityId: z.string(),
                    venueId: z.string(),
                    startTime: z.date(),
                    endTime: z.date(),
                }),
            })
        )
        //check if it is available
        .mutation(async ({ ctx, input }) => {
            const { success } = await ratelimit.limit(ctx.userId)
            if (!success) {
                throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
            }
            const bookings = await ctx.prisma.booking.findMany({
                where: {
                    facilityId: input.content.facilityId,
                    venueId: input.content.venueId,
                },
            })
            const isAvailable = bookings.every(booking => {
                return (
                    input.content.endTime <= booking.startTime ||
                    input.content.startTime >= booking.endTime
                )
            })
            if (!isAvailable) {
                throw new Error('Booking is not available')
            }
            return ctx.prisma.booking.create({
                data: {
                    userId: ctx.userId,
                    facilityId: input.content.facilityId,
                    venueId: input.content.venueId,
                    startTime: input.content.startTime,
                    endTime: input.content.endTime,
                },
            })
        }),
    getAllBookingsForVenue: privateProcedure
        .input(
            z.object({
                venueId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            return ctx.prisma.booking.findMany({
                where: {
                    venueId: input.venueId,
                },
            })
        }),
})
