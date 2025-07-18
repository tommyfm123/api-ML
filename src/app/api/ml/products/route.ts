import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { applyLocalChanges, Product } from '@/data/localStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const cookies = parse(req.headers.get('cookie') || '');
        const token = cookies.ml_access_token;

        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const userRes = await fetch('https://api.mercadolibre.com/users/me', {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!userRes.ok) {
            return NextResponse.json({ error: 'Error al obtener usuario' }, { status: userRes.status });
        }
        const user = await userRes.json();

        const itemsRes = await fetch(`https://api.mercadolibre.com/users/${user.id}/items/search`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!itemsRes.ok) {
            return NextResponse.json({ error: 'Error al obtener items' }, { status: itemsRes.status });
        }
        const { results: itemIds } = await itemsRes.json();

        const products: Product[] = await Promise.all(
            itemIds.map(async (id: string) => {
                const itemRes = await fetch(`https://api.mercadolibre.com/items/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const item = await itemRes.json();

                const descRes = await fetch(`https://api.mercadolibre.com/items/${id}/description`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                let description = '';
                if (descRes.ok) {
                    const descData = await descRes.json();
                    description = descData.plain_text || descData.text || '';
                }

                return { ...item, description };
            })
        );

        const merged = await applyLocalChanges(products);
        return NextResponse.json({ results: merged });
    } catch (err) {
        console.error('products error', err);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}