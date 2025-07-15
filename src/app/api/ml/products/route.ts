import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';


export async function GET(req: NextRequest) {
    const cookies = parse(req.headers.get('cookie') || ''); const token = cookies.ml_access_token;

    if (!token) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener usuario autenticado
    const userRes = await fetch('https://api.mercadolibre.com/users/me', {
        headers: { Authorization: `Bearer ${token}` },
    });
    const user = await userRes.json();

    // Obtener lista de productos
    const itemsRes = await fetch(
        `https://api.mercadolibre.com/users/${user.id}/items/search`,
        { headers: { Authorization: `Bearer ${token}` } },
    );

    const { results: itemIds } = await itemsRes.json();

    // Detalle de productos
    const products = await Promise.all(
        itemIds.map((id: string) =>
            fetch(`https://api.mercadolibre.com/items/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then((r) => r.json()),
        ),
    );

    return NextResponse.json({ results: products });
}
