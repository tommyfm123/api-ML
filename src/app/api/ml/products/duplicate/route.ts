import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';

export async function POST(req: NextRequest) {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.ml_access_token;
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { id } = await req.json();

    // Obtener datos originales
    const originalRes = await fetch(`https://api.mercadolibre.com/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!originalRes.ok) {
        const err = await originalRes.json();
        return NextResponse.json(err, { status: originalRes.status });
    }

    const original = await originalRes.json();

    // Copiar propiedades permitidas y publicar nuevo producto
    const payload = {
        title: original.title,
        price: original.price,
        available_quantity: original.available_quantity,
        // ...otros campos relevantes...
    };

    const newRes = await fetch('https://api.mercadolibre.com/items', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!newRes.ok) {
        const err = await newRes.json();
        return NextResponse.json(err, { status: newRes.status });
    }

    const newItem = await newRes.json();
    return NextResponse.json({ newItem });
}
