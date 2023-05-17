import type { WebhookEvent } from '@clerk/clerk-sdk-node'
import { type NextApiHandler } from 'next'
import { oranisationsRouter } from '@/server/api/routers/organisations'
import { createTRPCContext } from '@/server/api/trpc'

const handler: NextApiHandler = async (req, res) => {
    try {
        const event = req.body as WebhookEvent
        console.log(typeof event)
        console.log(event)
        console.log(req.body)

        if (
            event.type !== 'organization.created' &&
            event.type !== 'organization.updated'
        ) {
            throw new Error(
                `Invalid event type: ${event.type} for user webhook`
            )
        }
        const { id, name, created_by } = event.data
        if (!id || !name) {
            throw new Error(`Invalid event data: ${JSON.stringify(event.data)}`)
        }
        const ctx = createTRPCContext({ req, res })
        const caller = oranisationsRouter.createCaller(ctx)
        let organization
        if (event.type === 'organization.created') {
            organization = await caller.create({
                content: {
                    id,
                    name,
                    created_by,
                },
            })
        } else {
            organization = await caller.update({
                content: {
                    id,
                    name,
                    created_by,
                },
            })
        }
        res.status(200).json(organization)
    } catch (error) {
        console.error(error)
        res.status(400).json(error instanceof Error ? error : 'Unknown error')
    }
}

export default handler
