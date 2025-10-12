import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { UserProfile } from '../types';

const FeatureIcon: React.FC<{ icon: 'lightning' | 'book' | 'chart' | 'chess' | 'star' | 'group' | 'chat' }> = ({ icon }) => {
    const icons = {
        lightning: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>,
        book: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>,
        chart: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>,
        chess: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20,2H4A2,2 0 0,0 2,4V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V4A2,2 0 0,0 20,2M18,18H15V15H18V18M15,13H18V10H15V13M13,18H10V15H13V18M10,13H13V10H10V13M8,18H5V15H8V18M5,13H8V10H5V13M9,8H11L8,4H6L9,8M15,8H13L16,4H18L15,8Z" /></svg>,
        star: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
        group: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>,
        chat: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>
    };
    
    return (
        <div className="flex-shrink-0 text-green-400">
           {icons[icon]}
        </div>
    );
};

const PlanCard: React.FC<{
    planId?: string;
    title: string;
    subtitle: string;
    price?: number;
    period?: string;
    features: { text: string; included: boolean; icon: 'lightning' | 'book' | 'chart' | 'chess' | 'star' | 'group' | 'chat'; description?: string }[];
    isRecommended?: boolean;
    isTeamRecommended?: boolean;
    isCurrent?: boolean;
    expiresAt?: string | null;
    onClick?: (planId: string, price: number) => void;
    isLoading?: boolean;
    scaleClass?: string;
}> = ({ title, subtitle, price, period, features, isRecommended, isTeamRecommended, isCurrent, expiresAt, planId, onClick, isLoading, scaleClass = 'hover:scale-[1.02]' }) => {
    
    const borderColor = isCurrent ? 'border-cyan-400' : isTeamRecommended ? 'border-purple-400' : isRecommended ? 'border-amber-400' : 'border-violet-500/50';
    const glowShadow = isCurrent ? 'shadow-[0_0_25px_rgba(34,211,238,0.4)]' : isTeamRecommended ? 'shadow-[0_0_25px_rgba(192,132,252,0.4)]' : isRecommended ? 'shadow-[0_0_25px_rgba(251,191,36,0.4)]' : 'shadow-[0_0_25px_rgba(139,92,246,0.2)]';
    
    let buttonClass = 'bg-slate-700';
    if(isTeamRecommended) {
        buttonClass = 'bg-purple-500 hover:bg-purple-400 text-white';
    } else if (isRecommended) {
        buttonClass = 'bg-amber-400 hover:bg-amber-300 text-black';
    } else {
        buttonClass = 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600';
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
                        <div className={`${feature.included ? 'text-green-400' : 'text-red-500'}`}>
                           <FeatureIcon icon={feature.icon} />
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
                { text: '5 Análises de IA por dia', included: true, icon: 'lightning' as const },
                { text: 'Análise 1vs1 e de Herói', included: true, icon: 'star' as const },
                { text: 'Enciclopédia e Ranking', included: true, icon: 'book' as const },
                { text: 'Analisador de Draft 5vs5', included: false, icon: 'chess' as const },
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
                { text: 'Análises de IA Ilimitadas', included: true, icon: 'lightning' as const },
                { text: 'Análise 1vs1 e de Herói', included: true, icon: 'star' as const },
                { text: 'Enciclopédia e Ranking', included: true, icon: 'book' as const },
                { text: 'Analisador de Draft 5vs5', included: false, icon: 'chess' as const },
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
                { text: 'Análises de IA Ilimitadas', included: true, icon: 'lightning' as const },
                { text: 'Acesso Completo ao Analisador de Draft 5vs5', included: true, icon: 'chess' as const },
                { text: 'Acesso Antecipado a Novos Recursos', included: true, icon: 'star' as const },
                { text: 'Enciclopédia e Ranking completos', included: true, icon: 'book' as const },
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
                { text: 'Todos os benefícios do plano Mítico', included: true, icon: 'star' as const },
                { 
                  text: 'Gerenciamento de Time (em breve)',
                  included: true, 
                  icon: 'group' as const,
                  description: '(Crie e gerencie até 5 contas para os membros do seu time, analise drafts em grupo e receba insights de sinergia.)'
                },
                { text: 'Suporte Prioritário por Discord', included: true, icon: 'chat' as const },
                { text: 'Ajude a financiar novas funcionalidades', included: true, icon: 'lightning' as const },
            ],
             scaleClass: 'lg:scale-95 hover:scale-100',
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

            <div className="text-center mt-16">
                <div className="text-slate-400 text-sm max-w-2xl mx-auto">
                    <p>Pagamentos processados com segurança pelo Mercado Pago.</p>
                    <p className="mt-2">O plano é uma assinatura mensal com renovação automática, que pode ser cancelada a qualquer momento através da sua conta do Mercado Pago. Ao assinar, você apoia o desenvolvimento contínuo e a adição de novas funcionalidades à plataforma.</p>
                </div>
            </div>
        </div>
    );
};

export default PremiumScreen;