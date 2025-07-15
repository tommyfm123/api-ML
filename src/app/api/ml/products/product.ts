import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.ml_access_token;

    if (!accessToken) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    try {
        const profile = await axios.get('https://api.mercadolibre.com/users/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const sellerId = profile.data.id;

        const response = await axios.get(`https://api.mercadolibre.com/users/${sellerId}/items/search`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const items = response.data.results;

        const promises = items.map((id: string) =>
            axios.get(`https://api.mercadolibre.com/items/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            }).then(r => r.data)
        );

        const products = await Promise.all(promises);

        res.status(200).json({ results: products });
    } catch (error: any) {
        console.error(error.response?.data || error.message);
        return res.status(500).json({ error: 'Error al obtener productos' });
    }
}
