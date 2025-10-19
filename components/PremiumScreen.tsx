import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { UserProfile } from '../types';

const PlanCard: React.FC<{
    planId?: string;
    title: string;
    subtitle: string;
    price?: number;
    period?: string;
    features: { text: string; included: boolean; description?: string }[];
    isRecommended?: boolean;
    isTeamRecommended?: boolean;
    isCurrent?: boolean;
    expiresAt?: string | null;
    onClick?: (planId: string, price: number) => void;
    isLoading?: boolean;
    scaleClass?: string;
}> = ({ title, subtitle, price, period, features, isRecommended, isTeamRecommended, isCurrent, expiresAt, planId, onClick, isLoading, scaleClass = 'hover:scale-[1.02]' }) => {
    
    const borderColor = isCurrent ? 'border-cyan-400' : isTeamRecommended ? 'border-purple-400' : isRecommended ? 'border-amber-400' : 'border-sky-500/50';
    const glowShadow = isCurrent ? 'shadow-[0_0_25px_rgba(34,211,238,0.4)]' : isTeamRecommended ? 'shadow-[0_0_25px_rgba(192,132,252,0.4)]' : isRecommended ? 'shadow-[0_0_25px_rgba(251,191,36,0.4)]' : 'shadow-[0_0_25px_rgba(56,182,255,0.2)]';
    
    let buttonClass = 'bg-slate-700';
    if(isTeamRecommended) {
        buttonClass = 'bg-purple-500 hover:bg-purple-400 text-white';
    } else if (isRecommended) {
        buttonClass = 'bg-amber-400 hover:bg-amber-300 text-black';
    } else {
        buttonClass = 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white hover:from-sky-600 hover:to-cyan-600';
    }


    return (
        <div className={`relative bg-[#1c1a2e] p-6 rounded-2xl border-2 flex flex-col ${borderColor} ${glowShadow} transform transition-all duration-300 ${scaleClass}`}>
            {isRecommended && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    MAIS POPULAR
                </div>
            )}
            {isTeamRecommended && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    PARA TIMES
                </div>
            )}
            {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    PLANO ATUAL
                </div>
            )}
            <div className="text-center">
                 <h3 className="text-2xl font-bold">{title}</h3>
                 <p className="text-sm text-slate-400">{subtitle}</p>
            </div>
            {price !== undefined ? (
                <div className="text-center my-4">
                    <span className="text-xs">R$</span>
                    <span className="text-4xl font-black text-white">{price.toFixed(2).replace('.', ',')}</span>
                    <span className="text-slate-400">/{period}</span>
                </div>
            ) : (
                <div className="text-center my-4">
                    <span className="text-4xl font-black text-white">Grátis</span>
                </div>
            )}
            <ul className="space-y-3 mt-6 mb-8 flex-grow">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 mt-0.5 ${feature.included ? 'text-green-400' : 'text-red-500'}`}>
                            {feature.included ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <span className={`text-sm ${feature.included ? 'text-slate-200' : 'text-slate-500 line-through'}`}>{feature.text}</span>
                            {feature.description && (
                                <p className="text-xs text-slate-400 mt-1 italic">{feature.description}</p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt-auto pt-4">
                {isCurrent ? (
                    <div className="text-center">
                        <button disabled className="w-full bg-slate-700 text-slate-400 font-bold py-3 rounded-xl cursor-not-allowed">
                            Seu Plano Atual
                        </button>
                        {expiresAt && (
                            <p className="text-xs text-amber-300 mt-2">
                                Acesso expira em: {new Date(expiresAt).toLocaleDateString('pt-BR')}
                            </p>
                        )}
                    </div>
                ) : price !== undefined && planId && onClick ? (
                    <button
                        onClick={() => onClick(planId, price)}
                        disabled={isLoading}
                        className={`w-full font-bold py-3 rounded-xl text-lg transition-all duration-300 transform shadow-lg ${buttonClass} disabled:opacity-50 disabled:cursor-wait`}
                    >
                        {isLoading ? 'Aguarde...' : 'Assinar Agora'}
                    </button>
                ) : null}
            </div>
        </div>
    );
};

interface PremiumScreenProps {
    userProfile: UserProfile | null;
}

const PremiumScreen: React.FC<PremiumScreenProps> = ({ userProfile }) => {
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const isEffectivelyPremium = userProfile?.subscription_status === 'premium' && userProfile.subscription_expires_at && new Date(userProfile.subscription_expires_at) > new Date();

    const handleSubscribeClick = async (planId: string, price: number) => {
        setLoadingPlan(planId);
        setError(null);

        if (!supabase) {
            setError("Cliente Supabase não configurado.");
            setLoadingPlan(null);
            return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setError('Você precisa estar logado para assinar.');
            setLoadingPlan(null);
            return;
        }
        
        try {
            const response = await fetch('/api/create-mercadopago-preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ planId, price }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao criar a preferência de pagamento.');
            }

            const { init_point } = await response.json();
            window.location.href = init_point;

        } catch (err: any) {
            setError(err.message);
            setLoadingPlan(null);
        }
    };

    // Estrutura completa dos planos
    const plans = [
        {
            title: 'Gratuito',
            subtitle: 'Para Jogadores Casuais',
            isCurrent: !isEffectivelyPremium,
            features: [
                { text: '5 Análises de IA por dia', included: true },
                { text: 'Análise 1vs1 e de Herói', included: true },
                { text: 'Enciclopédia e Ranking', included: true },
                { text: 'Analisador de Draft 5vs5', included: false },
                { text: 'Histórico de Análises', included: false },
            ],
            scaleClass: 'lg:scale-95 hover:scale-100',
        },
        {
            planId: 'monthly_legendary',
            title: 'Lendário',
            subtitle: 'Estrategista Dedicado',
            price: 9.90,
            period: 'mês',
            features: [
                { text: 'Análises de IA Ilimitadas', included: true },
                { text: 'Análise 1vs1 e de Herói', included: true },
                { text: 'Enciclopédia e Ranking', included: true },
                { text: 'Analisador de Draft 5vs5', included: false },
                { text: 'Histórico de Análises', included: false },
            ],
        },
        {
            planId: 'monthly_mythic',
            title: 'Mítico',
            subtitle: 'Estrategista de Equipe',
            price: 19.90,
            period: 'mês',
            isRecommended: true,
            isCurrent: isEffectivelyPremium, // Assumimos que a assinatura premium é a Mítica por padrão
            expiresAt: userProfile?.subscription_expires_at,
            features: [
                { text: 'Análises de IA Ilimitadas', included: true },
                { text: 'Acesso Completo ao Analisador de Draft 5vs5', included: true },
                { text: 'Histórico de Análises Salvas', included: true },
                { text: 'Acesso Antecipado a Novos Recursos', included: true },
                { text: 'Enciclopédia e Ranking completos', included: true },
            ],
            scaleClass: 'lg:scale-110',
        },
        {
            planId: 'monthly_glory',
            title: 'Glória Imortal',
            subtitle: 'Apoiador Visionário',
            price: 59.90,
            period: 'mês',
            isTeamRecommended: true,
            features: [
                { text: 'Todos os benefícios do plano Mítico', included: true },
                { 
                  text: 'Gerenciamento de Time (em breve)',
                  included: true, 
                  description: '(Crie e gerencie até 5 contas para os membros do seu time, analise drafts em grupo e receba insights de sinergia.)'
                },
                { text: 'Suporte Prioritário por Discord', included: true },
                { text: 'Ajude a financiar novas funcionalidades', included: true },
            ],
             scaleClass: 'lg:scale-95 hover:scale-100',
        }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto animated-entry text-white">
            <div className="text-center pt-8 mb-12">
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-amber-300 [text-shadow:0_0_15px_rgba(245,158,11,0.6)] relative max-w-2xl mx-auto mt-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                    TORNE-SE PREMIUM
                </h1>
                <p className="text-lg text-slate-300 mt-4 max-w-2xl mx-auto">
                    Desbloqueie todo o potencial da Mítica Estratégia e domine o campo de batalha com acesso ilimitado às nossas ferramentas de IA mais poderosas.
                </p>
                {error && <p className="bg-red-500/30 text-red-300 text-center p-3 rounded-lg mt-4 text-sm max-w-md mx-auto">{error}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto items-center">
                {plans.map(plan => (
                    <PlanCard
                        key={plan.title}
                        {...plan}
                        onClick={handleSubscribeClick}
                        isLoading={loadingPlan === plan.planId}
                    />
                ))}
            </div>

            <div className="text-center mt-16 mb-8">
                <div className="text-slate-400 text-sm max-w-2xl mx-auto">
                    <p>Pagamentos processados com segurança pelo Mercado Pago.</p>
                    <p className="mt-2">O plano é uma assinatura mensal com renovação automática, que pode ser cancelada a qualquer momento através da sua conta do Mercado Pago. Ao assinar, você apoia o desenvolvimento contínuo e a adição de novas funcionalidades à plataforma.</p>
                </div>
            </div>
        </div>
    );
};

export default PremiumScreen;