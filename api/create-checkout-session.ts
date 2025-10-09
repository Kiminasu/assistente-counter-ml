// api/create-checkout-session.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from './_lib/stripe.js';
import { supabaseAdmin } from './_lib/supabaseAdmin.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método Não Permitido' });
    }

    try {
        const { priceId, returnUrl } = req.body;
        if (!priceId) {
            return res.status(400).json({ error: 'priceId é obrigatório.' });
        }

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Não autorizado: Token não fornecido.' });
        }

        // Get user from Supabase
        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
        if (userError || !user) {
            return res.status(401).json({ error: 'Não autorizado: Token inválido.' });
        }

        // Get or create a Stripe customer
        let { data: customerData, error: customerError } = await supabaseAdmin
            .from('customers')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .single();

        if (customerError && customerError.code !== 'PGRST116') { // 'PGRST116' means no rows found
            throw new Error('Falha ao buscar cliente no banco de dados.');
        }

        let stripeCustomerId: string;
        if (customerData?.stripe_customer_id) {
            stripeCustomerId = customerData.stripe_customer_id;
        } else {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: { supabaseUUID: user.id },
            });
            stripeCustomerId = customer.id;

            const { error: newCustomerError } = await supabaseAdmin
                .from('customers')
                .insert({ id: user.id, stripe_customer_id: stripeCustomerId });

            if (newCustomerError) {
                throw new Error('Falha ao criar cliente no banco de dados.');
            }
        }
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            customer: stripeCustomerId,
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: returnUrl,
            cancel_url: returnUrl,
        });

        if (session.id) {
            return res.status(200).json({ sessionId: session.id });
        } else {
            return res.status(500).json({ error: 'Falha ao criar sessão de checkout.' });
        }

    } catch (error: any) {
        console.error('Erro ao criar sessão de checkout:', error);
        res.status(500).json({ error: error.message || 'Erro interno do servidor.' });
    }
}
