import type { WebhookEvent } from '@clerk/clerk-sdk-node'
import { type NextApiHandler } from 'next'
import { usersRouter } from '@/server/api/routers/users'
import { createTRPCContext } from '@/server/api/trpc'
import isWebhookSecured from './handler'

const handler: NextApiHandler = async (req, res) => {
    if (!(isWebhookSecured(req as unknown as Request))) {
        res.status(400).json('Invalid webhook')
        return
    }    
    try {
        const event = req.body as WebhookEvent
        console.log(typeof event)
        console.log(event)
        console.log(req.body)

        if (event.type !== 'user.created' && event.type !== 'user.updated') {
            throw new Error(
                `Invalid event type: ${event.type} for user webhook`
            )
        }
        const { id, email_addresses } = event.data
        if (!id || !email_addresses?.[0]?.email_address) {
            throw new Error(`Invalid event data: ${JSON.stringify(event.data)}`)
        }
        const ctx = createTRPCContext({ req, res })
        const caller = usersRouter.createCaller(ctx)
        let user
        if (event.type === 'user.created') {
            user = await caller.create({
                content: {
                    id,
                    email: email_addresses[0].email_address,
                },
            })
        } else {
            user = await caller.update({
                content: {
                    id,
                    email: email_addresses[0].email_address,
                },
            })
        }
        res.status(200).json(user)
    } catch (error) {
        console.error(error)
        res.status(400).json(error instanceof Error ? error : 'Unknown error')
    }
}

export default handler
