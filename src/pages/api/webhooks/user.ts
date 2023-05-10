/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { WebhookEvent } from '@clerk/clerk-sdk-node'
import { type NextApiHandler } from 'next'

const handler: NextApiHandler = (req, res) => {
    const evt = req.body.evt as WebhookEvent
    console.log(evt)
    res.status(200).json(evt.data)
}

export default handler
