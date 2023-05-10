import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { prisma } from '@/server/db'

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
            console.log(ctx, input)
            const user = await prisma.user.create({
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
            console.log(ctx, input)
            const user = await prisma.user.update({
                where: {
                    id: ctx.userId ? ctx.userId : input.content.id,
                },
                data: {
                    email: input.content.email,
                },
            })

            return user
        }),
})
