

import React from 'react';

const CheckmarkIcon = () => (
    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

const CrossIcon = () => (
    <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const PlanCard: React.FC<{
    title: string;
    price?: string;
    period?: string;
    features: { text: string; included: boolean }[];
    isRecommended?: boolean;
    isCurrent?: boolean;
}> = ({ title, price, period, features, isRecommended, isCurrent }) => {
    const handleSubscribe = () => {
        alert('O sistema de pagamento está em fase final de implementação. Agradecemos seu interesse!');
    };

    const borderColor = isRecommended ? 'border-amber-400 panel-glow-primary' : isCurrent ? 'border-gray-600' : 'border-violet-500 panel-glow-purple';
    const buttonClass = isRecommended 
        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-yellow-500/30' 
        : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-violet-500/40';

    return (
        <div className={`relative glassmorphism p-6 rounded-2xl border-2 flex flex-col ${borderColor}`}>
            {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    MAIS POPULAR
                </div>
            )}
            <h3 className="text-2xl font-bold text-center">{title}</h3>
            {price && (
                <div className="text-center my-4">
                    <span className="text-4xl font-black text-white">{price}</span>
                    <span className="text-slate-400">/{period}</span>
                </div>
            )}
            <ul className="space-y-3 mt-6 mb-8 flex-grow">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        {feature.included ? <CheckmarkIcon /> : <CrossIcon />}
                        <span className="text-slate-300 text-sm">{feature.text}</span>
                    </li>
                ))}
            </ul>
            {isCurrent ? (
                <button disabled className="w-full bg-gray-700 text-gray-400 font-bold py-3 rounded-xl cursor-not-allowed">
                    Seu Plano Atual
                </button>
            ) : (
                <button onClick={handleSubscribe} className={`w-full font-bold py-3 rounded-xl text-lg hover:opacity-90 transition-opacity duration-300 transform hover:scale-105 shadow-lg ${buttonClass}`}>
                    Assinar Agora
                </button>
            )}
        </div>
    );
};


const PremiumScreen: React.FC = () => {

    const plans = [
        {
            title: 'Plano Free',
            isCurrent: true,
            features: [
                { text: '5 Análises de IA por dia', included: true },
                { text: 'Análise de Herói (1v1 e Sinergia)', included: true },
                { text: 'Acesso ao Banco de Dados de Itens e Heróis', included: true },
                { text: 'Acesso ao Ranking de Heróis', included: true },
                { text: 'Acesso ao Draft 5vs5', included: false },
                { text: 'Acesso Antecipado a Novos Recursos', included: false },
            ],
        },
        {
            title: 'Lenda Mensal',
            price: 'R$19,90',
            period: 'mês',
            features: [
                { text: 'Análises de IA Ilimitadas', included: true },
                { text: 'Análise de Herói (1v1 e Sinergia)', included: true },
                { text: 'Acesso ao Banco de Dados de Itens e Heróis', included: true },
                { text: 'Acesso ao Ranking de Heróis', included: true },
                { text: 'Acesso Completo ao Draft 5vs5', included: true },
                { text: 'Acesso Antecipado a Novos Recursos', included: true },
            ],
        },
        {
            title: 'Mítico Trimestral',
            price: 'R$49,90',
            period: '3 meses',
            isRecommended: true,
            features: [
                { text: 'Análises de IA Ilimitadas', included: true },
                { text: 'Análise de Herói (1v1 e Sinergia)', included: true },
                { text: 'Acesso ao Banco de Dados de Itens e Heróis', included: true },
                { text: 'Acesso ao Ranking de Heróis', included: true },
                { text: 'Acesso Completo ao Draft 5vs5', included: true },
                { text: 'Acesso Antecipado a Novos Recursos', included: true },
            ],
        },
        {
            title: 'Glória Anual',
            price: 'R$99,90',
            period: 'ano',
            features: [
                { text: 'Análises de IA Ilimitadas', included: true },
                { text: 'Análise de Herói (1v1 e Sinergia)', included: true },
                { text: 'Acesso ao Banco de Dados de Itens e Heróis', included: true },
                { text: 'Acesso ao Ranking de Heróis', included: true },
                { text: 'Acesso Completo ao Draft 5vs5', included: true },
                { text: 'Acesso Antecipado a Novos Recursos', included: true },
            ],
        }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto animated-entry text-white">
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight title-main relative max-w-2xl mx-auto">
                    TORNE-SE MÍTICO
                </h1>
                <p className="text-lg text-slate-300 mt-4 max-w-2xl mx-auto">
                    Desbloqueie todo o potencial da Mítica Estratégia e domine o campo de batalha com acesso ilimitado às nossas ferramentas de IA mais poderosas.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {plans.map(plan => <PlanCard key={plan.title} {...plan} />)}
            </div>

            <div className="text-center mt-12">
                <div className="text-slate-400 text-sm">
                    <p>O pagamento é processado de forma segura. Você pode cancelar sua assinatura a qualquer momento.</p>
                    <p>Ao assinar, você apoia o desenvolvimento contínuo e a adição de novas funcionalidades à plataforma.</p>
                </div>
            </div>
        </div>
    );
};

export default PremiumScreen;