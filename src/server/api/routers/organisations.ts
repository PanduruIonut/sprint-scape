import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
    prefix: '@upstash/ratelimit',
})

export const oranisationsRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.text}`,
            }
        }),
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.organisation.findMany()
    }),
    create: publicProcedure
        .input(
            z.object({
                content: z.object({
                    id: z.string(),
                    name: z.string(),
                    created_by: z.string(),
                }),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { success } = await ratelimit.limit(
                ctx.userId ? ctx.userId : input.content.id
            )
            if (!success) {
                throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
            }
            const user = await ctx.prisma.organisation.create({
                data: {
                    id: input.content.id,
                    name: input.content.name,
                    created_by: input.content.created_by,
                },
            })

            return user
        }),
    update: publicProcedure
        .input(
            z.object({
                content: z.object({
                    id: z.string(),
                    name: z.string(),
                    created_by: z.string(),
                }),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const organisation = await ctx.prisma.organisation.upsert({
                where: {
                    id: input.content.id,
                },
                update: {
                    name: input.content.name,
                    created_by: input.content.created_by,
                },
                create: {
                    id: input.content.id,
                    name: input.content.name,
                    created_by: input.content.created_by,
                },
            })
            return organisation
        }),
})
