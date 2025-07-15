import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';

export async function POST(req: NextRequest) {
    const cookies = parse(req.headers.get('cookie') || ''); const token = cookies.ml_access_token;
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { id, ...updates } = await req.json();

    const res = await fetch(`https://api.mercadolibre.com/items/${id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });

    if (!res.ok) {
        const err = await res.json();
        return NextResponse.json(err, { status: res.status });
    }

    return NextResponse.json({ success: true });
}
