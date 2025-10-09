// api/stripe-webhooks.ts
// Este arquivo está obsoleto e foi limpo como parte do processo de remoção do Stripe.
// Pode ser excluído com segurança do seu projeto.

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.status(404).json({ error: 'Endpoint desativado.' });
}
