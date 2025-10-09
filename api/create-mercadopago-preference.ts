// api/create-mercadopago-preference.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Define a estrutura dos planos para validação no backend
const PLANS: { [key: string]: { title: string; price: number } } = {
    'monthly_legendary': { title: 'Plano Lendário Mensal', price: 9.90 },
    'monthly_mythic': { title: 'Plano Mítico Mensal', price: 19.90 },
    'monthly_glory': { title: 'Plano Glória Imortal Mensal', price: 59.90 },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { MERCADOPAGO_ACCESS_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_KEY, NEXT_PUBLIC_APP_URL } = process.env;

    if (!MERCADOPAGO_ACCESS_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_KEY || !NEXT_PUBLIC_APP_URL) {
        return res.status(500).json({ error: "Variáveis de ambiente do servidor não configuradas corretamente." });
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
        }
        
        const token = authHeader.split(' ')[1];
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user) {
            return res.status(401).json({ error: 'Token inválido ou expirado.' });
        }

        const { planId } = req.body;
        const plan = PLANS[planId];

        if (!plan) {
            return res.status(400).json({ error: 'Plano inválido selecionado.' });
        }

        const client = new MercadoPagoConfig({ accessToken: MERCADOPAGO_ACCESS_TOKEN });
        const preference = new Preference(client);

        const preferenceData = {
            items: [
                {
                    id: planId,
                    title: plan.title,
                    unit_price: plan.price,
                    quantity: 1,
                    currency_id: 'BRL',
                },
            ],
            payer: {
                email: user.email,
            },
            back_urls: {
                success: `${NEXT_PUBLIC_APP_URL}?payment=success`,
                failure: `${NEXT_PUBLIC_APP_URL}?payment=failure`,
                pending: `${NEXT_PUBLIC_APP_URL}?payment=pending`,
            },
            auto_return: 'approved',
            notification_url: `${NEXT_PUBLIC_APP_URL}/api/mercadopago-webhooks`,
            external_reference: user.id, // Vincula a compra ao ID do usuário no Supabase
        };

        const result = await preference.create({ body: preferenceData });
        
        return res.status(200).json({ init_point: result.init_point });

    } catch (error: any) {
        console.error("Erro ao criar preferência do Mercado Pago:", error);
        return res.status(500).json({ error: error.message || "Erro interno do servidor ao processar o pagamento." });
    }
}