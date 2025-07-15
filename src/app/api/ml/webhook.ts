// pages/api/ml/webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body;

    console.log("Webhook recibido:", body);

    res.status(200).end();
}
