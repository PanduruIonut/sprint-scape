import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner'
import {
    createTRPCRouter,
    privateProcedure,
    publicProcedure,
} from '@/server/api/trpc'
import { env } from '@/env.mjs'
import {
    DeleteObjectCommand,
    GetObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3'

const s3 = new S3Client({
    region: env.REGION,
    credentials: {
        accessKeyId: env.ACCESS_KEY,
        secretAccessKey: env.SECRET_ACCESS_KEY,
    },
})

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, '1 m'),
    analytics: true,
})

export const awsRouter = createTRPCRouter({
    createPresignedUrl: privateProcedure
        .input(
            z.object({
                venueId: z.string().nullable(),
                fileType: z.string(),
                fileName: z.string(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { success } = await ratelimit.limit(ctx.userId)
            if (!success) {
                throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
            }
            const picture = await ctx.prisma.picture.create({
                data: {
                    venueId: input?.venueId,
                    fileName: input.fileName,
                    fileType: input.fileType,
                },
            })
            const url = `https://${env.BUCKET_NAME}.s3.${env.REGION}.amazonaws.com/${picture.id}`
            await ctx.prisma.picture.update({
                where: { id: picture.id },
                data: { url },
            })

            try {
                const signedPost = await createPresignedPost(s3, {
                    Bucket: env.BUCKET_NAME,
                    Key: picture.id,
                    Conditions: [
                        ['content-length-range', 0, 10 * 1024 * 1024], // up to 10 MB
                        ['starts-with', '$Content-Type', 'image/'],
                    ],
                    Fields: {
                        key: picture.id,
                        'Content-Type': input.fileType,
                    },
                    Expires: 60, // seconds
                })
                return signedPost
            } catch (error) {
                console.error(error)
            }
        }),
    getSignedUrl: publicProcedure
        .input(z.object({ pictureKey: z.string() }))
        .query(async ({ input }) => {
            if (!env.BUCKET_NAME) throw new Error('No bucket name set')

            const command = new GetObjectCommand({
                Bucket: env.BUCKET_NAME,
                Key: input.pictureKey,
            })
            const url = await awsGetSignedUrl(s3, command, {
                expiresIn: 15 * 60,
            }) // expires in seconds

            return url
        }),

    deleteFromS3: privateProcedure
        .input(z.object({ key: z.string() }))
        .mutation(async ({ input }) => {
            const command = new DeleteObjectCommand({
                Bucket: env.BUCKET_NAME,
                Key: input.key,
            })
            await s3.send(command)
        }),
    getAllFacilityVenuesPicturesSignedUrls: publicProcedure
        .input(z.object({ facilityId: z.string() }))
        .query(async ({ input, ctx }) => {
            const pictures = await ctx.prisma.picture.findMany({
                where: {
                    venue: {
                        facilityId: input.facilityId,
                    },
                },
            })
            const urls = await Promise.all(
                pictures.map(async picture => {
                    const command = new GetObjectCommand({
                        Bucket: env.BUCKET_NAME,
                        Key: picture.id,
                    })
                    const url = await awsGetSignedUrl(s3, command, {
                        expiresIn: 15 * 60,
                    }) // expires in seconds
                    return url
                })
            )
            return urls
        }),
})
