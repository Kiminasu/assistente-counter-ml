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
        
        // Foco no evento de pagamento atualizado, que é o mais comum para confirmações.
        if (body.type === 'payment' && body.action === 'payment.updated') {
            const paymentId = body.data.id;
            
            const client = new MercadoPagoConfig({ accessToken: MERCADOPAGO_ACCESS_TOKEN });
            const payment = new Payment(client);
            
            const paymentInfo = await payment.get({ id: paymentId });

            if (paymentInfo && paymentInfo.status === 'approved' && paymentInfo.external_reference) {
                const userId = paymentInfo.external_reference;
                
                // Calcula a data de expiração para 30 dias a partir de agora
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 30);

                // Atualiza o perfil do usuário no Supabase para 'premium' e define a data de expiração
                const { error: updateError } = await supabaseAdmin
                    .from('profiles')
                    .update({ 
                        subscription_status: 'premium',
                        subscription_expires_at: expiresAt.toISOString() 
                    })
                    .eq('id', userId);

                if (updateError) {
                    console.error(`Erro ao atualizar perfil para premium para o usuário ${userId}:`, updateError);
                    // Não retorna erro para o MP, mas loga o problema.
                } else {
                    console.log(`Usuário ${userId} atualizado para premium com sucesso. Acesso expira em ${expiresAt.toISOString()}.`);
                }
            }
        }
        
        // Responde ao Mercado Pago para confirmar o recebimento do webhook
        res.status(200).send('ok');

    } catch (error: any) {
        console.error("Erro no webhook do Mercado Pago:", error.message);
        res.status(500).json({ error: 'Erro interno ao processar o webhook.' });
    }
}