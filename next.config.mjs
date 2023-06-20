/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
import withTmInitializer from 'next-transpile-modules'

const withTM = withTmInitializer([
    '@fullcalendar/react',
    '@fullcalendar/common',
    '@fullcalendar/daygrid',
    '@fullcalendar/timegrid',
    '@fullcalendar/interaction',
    '@babel/preset-react',
])

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,

    /**
     * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
     * out.
     *
     * @see https://github.com/vercel/next.js/issues/41980
     */
    i18n: {
        locales: ['en'],
        defaultLocale: 'en',
    },
}
export default withTM(config)
