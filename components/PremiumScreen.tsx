import React from 'react';

const FeatureIcon: React.FC<{ included: boolean; icon: 'lightning' | 'book' | 'chart' | 'chess' | 'star' | 'group' | 'chat' }> = ({ included, icon }) => {
    const iconColor = included ? 'text-green-400' : 'text-red-400';
    const icons = {
        lightning: <path d="M13 10V3L4 14h7v7l9-11h-7z" />,
        book: <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm2 0v12h12V6H6zm2 4h8v2H8v-2zm0 4h8v2H8v-2z" />,
        chart: <path d="M3 12v7a2 2 0 002 2h14a2 2 0 002-2v-7H3zm4-10v5h2V2h-2zm4 0v9h2V2h-2zm4 0v3h2V2h-2z" />,
        chess: <path d="M17 2H7C5.9 2 5 2.9 5 4v16l7-3 7 3V4c0-1.1-.9-2-2-2z" />,
        star: <path d="M10 1l2.5 5.5L18 7l-4 4.5 1 6-5-3.5-5 3.5 1-6-4-4.5 5.5-.5L10 1z" />,
        group: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />,
        chat: <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
    };

    return (
        <svg className={`w-5 h-5 ${iconColor} flex-shrink-0`} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {icons[icon]}
        </svg>
    );
};


const PlanCard: React.FC<{
    title: string;
    subtitle: string;
    price?: string;
    period?: string;
    features: { text: string; included: boolean; icon: 'lightning' | 'book' | 'chart' | 'chess' | 'star' | 'group' | 'chat' }[];
    isRecommended?: boolean;
    isCurrent?: boolean;
}> = ({ title, subtitle, price, period, features, isRecommended, isCurrent }) => {
    const handleSubscribe = () => {
        alert('O sistema de pagamento está em fase final de implementação. Agradecemos seu interesse!');
    };

    const borderColor = isRecommended ? 'border-amber-400' : isCurrent ? 'border-gray-600' : 'border-violet-500';
    const glowShadow = isRecommended ? 'shadow-[0_0_25px_rgba(251,191,36,0.4)]' : 'shadow-[0_0_25px_rgba(167,139,250,0.3)]';
    const buttonClass = isRecommended 
        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-yellow-500/30' 
        : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-violet-500/40';

    return (
        <div className={`relative glassmorphism p-6 rounded-2xl border-2 flex flex-col ${borderColor} ${glowShadow} transform transition-transform hover:scale-105`}>
            {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    MAIS POPULAR
                </div>
            )}
            <div className="text-center">
                 <h3 className="text-2xl font-bold">{title}</h3>
                 <p className="text-sm text-slate-400">{subtitle}</p>
            </div>
            {price && (
                <div className="text-center my-4">
                    <span className="text-4xl font-black text-white">{price}</span>
                    <span className="text-slate-400">/{period}</span>
                </div>
            )}
            <ul className="space-y-3 mt-6 mb-8 flex-grow">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <FeatureIcon included={feature.included} icon={feature.icon} />
                        <span className={`text-sm ${feature.included ? 'text-slate-200' : 'text-slate-500 line-through'}`}>{feature.text}</span>
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
            title: 'Épico Gratuito',
            subtitle: 'Estrategista Casual',
            isCurrent: true,
            features: [
                { text: '5 Análises de IA por dia', included: true, icon: 'lightning' as const },
                { text: 'Análise de Herói e 1vs1', included: true, icon: 'lightning' as const },
                { text: 'Enciclopédia de Heróis e Itens', included: true, icon: 'book' as const },
                { text: 'Ranking de Heróis', included: true, icon: 'chart' as const },
                { text: 'Analisador de Draft 5vs5', included: false, icon: 'chess' as const },
                { text: 'Acesso Antecipado a Novos Recursos', included: false, icon: 'star' as const },
            ],
        },
        {
            title: 'Lendário',
            subtitle: 'Jogador Dedicado',
            price: 'R$9,90',
            period: 'mês',
            features: [
                { text: 'Análises de IA Ilimitadas', included: true, icon: 'lightning' as const },
                { text: 'Histórico de Análises (em breve)', included: true, icon: 'star' as const },
                { text: 'Listas de Builds Personalizadas (em breve)', included: true, icon: 'star' as const },
                { text: 'Enciclopédia e Ranking completos', included: true, icon: 'book' as const },
                { text: 'Analisador de Draft 5vs5', included: false, icon: 'chess' as const },
                { text: 'Acesso Antecipado a Novos Recursos', included: false, icon: 'star' as const },
            ],
        },
        {
            title: 'Mítico',
            subtitle: 'Estrategista de Equipe',
            price: 'R$19,90',
            period: 'mês',
            isRecommended: true,
            features: [
                { text: 'Tudo do plano Lendário', included: true, icon: 'star' as const },
                { text: 'Acesso Completo ao Analisador de Draft 5vs5', included: true, icon: 'chess' as const },
                { text: 'Salvar e Compartilhar Drafts (em breve)', included: true, icon: 'star' as const },
                { text: 'Acesso Antecipado a Novas Ferramentas', included: true, icon: 'star' as const },
                { text: 'Sem Anúncios (futuramente)', included: true, icon: 'star' as const },
                { text: 'Análises de IA Ilimitadas', included: true, icon: 'lightning' as const },
            ],
        },
        {
            title: 'Glória Imortal',
            subtitle: 'Técnico / Profissional',
            price: 'R$59,90',
            period: 'mês',
            features: [
                { text: 'Tudo do plano Mítico', included: true, icon: 'star' as const },
                { text: 'Gerenciamento de Time (Até 6 Contas)', included: true, icon: 'group' as const },
                { text: 'Dashboard do Técnico (em breve)', included: true, icon: 'star' as const },
                { text: 'Suporte Prioritário Direto', included: true, icon: 'chat' as const },
                { text: 'Acesso Beta a Novas Ferramentas', included: true, icon: 'star' as const },
                { text: 'Análises de IA Ilimitadas', included: true, icon: 'lightning' as const },
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
