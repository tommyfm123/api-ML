import { NextRequest, NextResponse } from 'next/server';

const { ML_CLIENT_ID, ML_CLIENT_SECRET, ML_REDIRECT_URI } = process.env;

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');

    if (!ML_CLIENT_ID || !ML_CLIENT_SECRET || !ML_REDIRECT_URI) {
        return NextResponse.json(
            { error: 'Faltan variables de entorno de MercadoLibre' },
            { status: 500 }
        );
    }

    const tokenRes = await fetch('https://api.mercadolibre.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: ML_CLIENT_ID,
            client_secret: ML_CLIENT_SECRET,
            code: code!,
            redirect_uri: ML_REDIRECT_URI
        })
    });

    const data = await tokenRes.json();
    console.log('TOKENS:', data);

    // ⚠️ Para este ejemplo lo pasamos por query (NO recomendado en producción)
    return NextResponse.redirect(`/items?access_token=${data.access_token}`);
}