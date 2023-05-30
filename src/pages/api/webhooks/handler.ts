import { Webhook } from 'svix'
import { buffer } from 'micro'

const secret = 'whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw'

export default async function isWebhookSecured(req, _res): Promise<boolean> {
    const payload = (await buffer(req)).toString()
    const headers = req.headers

    const wh = new Webhook(secret)
    let msg
    try {
        msg = wh.verify(payload, headers)
        return !!msg
    } catch (err) {
        console.error(err)
        return false
    }
}
