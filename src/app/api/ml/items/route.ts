import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const accessToken = req.nextUrl.searchParams.get('access_token');

    const userRes = await fetch('https://api.mercadolibre.com/users/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    const user = await userRes.json();

    const itemsRes = await fetch(`https://api.mercadolibre.com/users/${user.id}/items/search`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    const items = await itemsRes.json();

    return NextResponse.json({ user, items });
}