import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'Código de autorización faltante' }, { status: 400 });
    }

    const tokenRes = await fetch('https://api.mercadolibre.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.ML_CLIENT_ID!,
            client_secret: process.env.ML_CLIENT_SECRET!,
            code,
            redirect_uri: process.env.ML_REDIRECT_URI!,
        }),
    });

    if (!tokenRes.ok) {
        return NextResponse.json({ error: 'Error al obtener token de MercadoLibre' }, { status: 500 });
    }

    const data = await tokenRes.json();

    const res = NextResponse.redirect('https://api-ml-pink.vercel.app'); // ✅ URL absoluta obligatoria

    res.headers.append(
        'Set-Cookie',
        serialize('ml_access_token', data.access_token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: data.expires_in,
        })
    );

    return res;
}
