// api/mercadopago-webhooks.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabaseAdmin } from './_lib/supabaseAdmin.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { MERCADOPAGO_ACCESS_TOKEN } = process.env;

    if (!MERCADOPAGO_ACCESS_TOKEN) {
        console.error("Webhook do Mercado Pago: Access token não configurado.");
        return res.status(500).json({ error: "Configuração do servidor incompleta." });
    }
    
    try {
        const { body } = req;
        
        if (body.type === 'payment') {
            const paymentId = body.data.id;
            
            const client = new MercadoPagoConfig({ accessToken: MERCADOPAGO_ACCESS_TOKEN });
            const payment = new Payment(client);
            
            const paymentInfo = await payment.get({ id: paymentId });

            if (paymentInfo && paymentInfo.status === 'approved' && paymentInfo.external_reference) {
                const userId = paymentInfo.external_reference;
                const planId = paymentInfo.items?.[0]?.id;

                if (!planId) {
                    console.error(`Webhook: planId não encontrado no pagamento ${paymentId} para o usuário ${userId}.`);
                    // Ainda assim, continuamos para pelo menos dar o status premium.
                }
                
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 30);

                const { error: updateError } = await supabaseAdmin
                    .from('profiles')
                    .update({ 
                        subscription_status: 'premium',
                        subscription_expires_at: expiresAt.toISOString(),
                        plan_id: planId // Salva o ID do plano
                    })
                    .eq('id', userId);

                if (updateError) {
                    console.error(`Erro ao atualizar perfil para premium para o usuário ${userId}:`, updateError.message);
                } else {
                    console.log(`Usuário ${userId} atualizado para o plano ${planId} com sucesso. Acesso expira em ${expiresAt.toISOString()}.`);
                }
            }
        }
        
        res.status(200).send('ok');

    } catch (error: any) {
        console.error("Erro no webhook do Mercado Pago:", error.message);
        res.status(500).json({ error: 'Erro interno ao processar o webhook.' });
    }
}