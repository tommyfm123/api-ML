import { NextResponse } from 'next/server';

const { ML_CLIENT_ID, ML_REDIRECT_URI } = process.env;

export async function GET() {
    if (!ML_CLIENT_ID || !ML_REDIRECT_URI) {
        return NextResponse.json(
            { error: 'Faltan variables de entorno de MercadoLibre' },
            { status: 500 }
        );
    }

    const url =
        `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${encodeURIComponent(ML_CLIENT_ID)}&redirect_uri=${encodeURIComponent(ML_REDIRECT_URI)}`;
    return NextResponse.redirect(url);
}