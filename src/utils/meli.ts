export const getOAuthUrl = () => {
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.MELI_CLIENT_ID!,
        redirect_uri: process.env.MELI_REDIRECT_URI!,
        scope: 'read'
    });
    return `https://auth.mercadolibre.com.ar/authorization?${params}`;
};
