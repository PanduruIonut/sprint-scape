    import { env } from '@/env.mjs';
    import crypto from 'crypto';
    import { type IncomingHttpHeaders } from 'http';

    export const config = {
    api: {
        bodyParser: false,
    },
    };

    interface MyHeaders extends IncomingHttpHeaders {
    'svix-signature'?: string;
    'svix-id'?: string;
    'svix-timestamp'?: string;
    }

    export default function isWebhookSecured(req: Request) {
    const headers = req.headers as unknown as MyHeaders;
    const svixSignatureHeader = headers['svix-signature'];
    const svixId = headers['svix-id'];
    const svixTimestamp = headers['svix-timestamp'];
    const secret = env.NEXT_PUBLIC_CLERK_WEBHOOK_SECRET;

    if (!svixSignatureHeader || !svixId || !svixTimestamp) {
        return false;
    }

    const signedContent = `${svixId}.${svixTimestamp}.${JSON.stringify(req.body)}`;
    const actualSecretLOL = secret.split('_')[1];

    if (!actualSecretLOL) {
        throw new Error('Clerk webhook secret is not properly configured');
    }

    // Need to base64 decode the secret
    const secretBytes = Buffer.from(actualSecretLOL, 'base64');
    const signature = crypto
        .createHmac('sha256', secretBytes)
        .update(signedContent)
        .digest('base64');

    const svixSignatures = svixSignatureHeader.split(' ');
    console.log('svixSignatures', svixSignatures);

    return svixSignatures.some((svixSignature) => {
        const signatureParts = svixSignature.split(',');
        const actualSignature = signatureParts[1];

        if (!actualSignature) {
        return false; // Invalid actualSignature, return false
        }

        console.log('actualSignature', actualSignature)
        console.log('signature', signature)
        return signature === actualSignature;
    });
    
}
