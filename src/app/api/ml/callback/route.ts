import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

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
            redirect_uri: process.env.ML_REDIRECT_URI!,
        }),
    });

    const data = await tokenRes.json();

    // Guardar el token en una cookie segura (httponly)
    const res = NextResponse.redirect('/');

    res.headers.append(
        'Set-Cookie',
        serialize('ml_access_token', data.access_token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: data.expires_in,
        }),
    );

    return res;
}
