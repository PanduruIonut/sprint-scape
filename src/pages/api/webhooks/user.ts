/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { WebhookEvent } from '@clerk/clerk-sdk-node'
import { type NextApiHandler } from 'next'

const handler: NextApiHandler = (req) => {
    const evt = req.body.evt as WebhookEvent
    console.log(evt)
}

export default handler
