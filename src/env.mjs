import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        DATABASE_URL: z.string().url(),
        NODE_ENV: z.enum(['development', 'test', 'production']),
        SECRET_ACCESS_KEY: z.string(),
        ACCESS_KEY: z.string(),
        REGION: z.string(),
        BUCKET_NAME: z.string(),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        NEXT_PUBLIC_GOOGLE_MAPS_API: z.string(),
        NEXT_PUBLIC_CLERK_WEBHOOK_SECRET: z.string(),
        // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_GOOGLE_MAPS_API: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API,
        NEXT_PUBLIC_CLERK_WEBHOOK_SECRET: process.env.NEXT_PUBLIC_CLERK_WEBHOOK_SECRET,
        SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
        ACCESS_KEY: process.env.ACCESS_KEY,
        REGION: process.env.REGION,
        BUCKET_NAME: process.env.BUCKET_NAME,
        // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    },
})
