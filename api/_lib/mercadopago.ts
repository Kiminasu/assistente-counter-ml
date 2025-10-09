// api/_lib/mercadopago.ts
import { MercadoPagoConfig } from 'mercadopago';

// Carrega o Access Token das variáveis de ambiente.
// Este é o método seguro para manusear chaves secretas no backend.
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken) {
  // Lança um erro no servidor se a variável de ambiente não estiver configurada.
  // Isso impede que a aplicação tente operar sem a devida autenticação.
  console.error("MERCADOPAGO_ACCESS_TOKEN não está definido nas variáveis de ambiente.");
  throw new Error('A configuração do servidor para pagamentos está incompleta.');
}

// Inicializa o cliente do Mercado Pago com o Access Token.
export const mercadopagoClient = new MercadoPagoConfig({ accessToken, options: { timeout: 5000 } });
