import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');

    const tokenRes = await fetch('https://api.mercadolibre.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.ML_CLIENT_ID!,
            client_secret: process.env.ML_CLIENT_SECRET!,
            code: code!,
            redirect_uri: process.env.ML_REDIRECT_URI!
        })
    });

    const data = await tokenRes.json();
    console.log('TOKENS:', data);

    // ⚠️ Para este ejemplo lo pasamos por query (NO recomendado en producción)
    return NextResponse.redirect(`/api/ml/items?access_token=${data.access_token}`);
}