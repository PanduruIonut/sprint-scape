import type { WebhookEvent } from '@clerk/clerk-sdk-node'
import { type NextApiHandler } from 'next'
import { usersRouter } from '@/server/api/routers/users'

const handler: NextApiHandler = async (req, res) => {
    try {
        const evt = req.body as WebhookEvent
        const event = JSON.parse(evt) as WebhookEvent
        if (event.type !== 'user.created') {
            throw new Error(`Unsupported event type: ${event.type}`)
        }
        const { id, email_addresses } = event.data
        if (!id || !email_addresses?.[0]?.email_address) {
            throw new Error(`Invalid event data: ${JSON.stringify(event.data)}`)
        }
        const caller = usersRouter.createCaller({})
        const user = await caller.create({
            content: {
                id,
                email: email_addresses[0].email_address,
            },
        })
        res.status(200).json(user)
    } catch (error) {
        error instanceof Error
            ? res.status(400).json(error)
            : res.status(400).json(`Unknown error`)
    }
}

export default handler
