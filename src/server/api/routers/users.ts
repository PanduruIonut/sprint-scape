import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { prisma } from '@/server/db'
import { Ratelimit } from '@upstash/ratelimit' // for deno: see above
import { Redis } from '@upstash/redis'
import { TRPCError } from '@trpc/server'

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
    prefix: '@upstash/ratelimit',
})

export const usersRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.user.findMany()
    }),
    getOne: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.user.findFirst()
    }),
    create: publicProcedure
        .input(
            z.object({
                content: z.object({
                    id: z.string(),
                    email: z.string().email(),
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
            const user = await ctx.prisma.user.create({
                data: {
                    id: ctx.userId ? ctx.userId : input.content.id,
                    email: input.content.email,
                    type: 'USER',
                },
            })

            return user
        }),
    update: publicProcedure
        .input(
            z.object({
                content: z.object({
                    id: z.string(),
                    email: z.string().email(),
                }),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await prisma.user.upsert({
                where: {
                    id: ctx.userId ? ctx.userId : input.content.id,
                },
                update: {
                    email: input.content.email,
                },
                create: {
                    id: ctx.userId ? ctx.userId : input.content.id,
                    email: input.content.email,
                    type: 'USER',
                },
            })

            return user
        }),
})
