import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { UserProfile } from '../App';

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
    title: string;
    subtitle: string;
    price?: string;
    period?: string;
    features: { text: string; included: boolean; icon: 'lightning' | 'book' | 'chart' | 'chess' | 'star' | 'group' | 'chat' }[];
    isRecommended?: boolean;
    isCurrent?: boolean;
}> = ({ title, subtitle, price, period, features, isRecommended, isCurrent }) => {
    
    const borderColor = isRecommended ? 'border-amber-400' : isCurrent ? 'border-gray-600' : 'border-violet-500/50';
    const glowShadow = isRecommended ? 'shadow-[0_0_25px_rgba(251,191,36,0.4)]' : isCurrent ? '' : 'shadow-[0_0_25px_rgba(167,139,250,0.2)]';
    const buttonClass = isRecommended 
        ? 'bg-amber-400 hover:bg-amber-300 text-black' 
        : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600';
    const cardScale = isRecommended ? 'scale-105' : 'hover:scale-105';

    return (
        <div className={`relative bg-[#1a1c29] p-6 rounded-2xl border-2 flex flex-col ${borderColor} ${glowShadow} transform transition-transform duration-300 ${cardScale}`}>
            {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    MAIS POPULAR
                </div>
            )}
            <div className="text-center">
                 <h3 className="text-2xl font-bold">{title}</h3>
                 <p className="text-sm text-slate-400">{subtitle}</p>
            </div>
            {price ? (
                <div className="text-center my-4">
                    <span className="text-xs">R$</span>
                    <span className="text-4xl font-black text-white">{price}</span>
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
                        <span className={`text-sm ${feature.included ? 'text-slate-200' : 'text-slate-500 line-through'}`}>{feature.text}</span>
                    </li>
                ))}
            </ul>
            {isCurrent ? (
                <button disabled className="w-full bg-slate-700 text-slate-400 font-bold py-3 rounded-xl cursor-not-allowed">
                    Seu Plano Atual
                </button>
            ) : price ? (
                <button disabled title="O sistema de pagamento está sendo atualizado. Em breve: Mercado Pago!" className={`w-full font-bold py-3 rounded-xl text-lg transition-all duration-300 transform shadow-lg ${buttonClass} opacity-50 cursor-not-allowed`}>
                    Em Breve
                </button>
            ) : null}
        </div>
    );
};

interface PremiumScreenProps {
    userProfile: UserProfile | null;
}

const PremiumScreen: React.FC<PremiumScreenProps> = ({ userProfile }) => {

    const plans = [
        {
            title: 'Gratuito',
            subtitle: 'Para Jogadores Casuais',
            isCurrent: userProfile?.subscription_status === 'free',
            features: [
                { text: '5 Análises de IA por dia', included: true, icon: 'lightning' as const },
                { text: 'Análise de Herói e 1vs1', included: true, icon: 'star' as const },
                { text: 'Enciclopédia e Ranking', included: true, icon: 'book' as const },
                { text: 'Analisador de Draft 5vs5', included: false, icon: 'chess' as const },
                { text: 'Gerenciamento de Time', included: false, icon: 'group' as const },
                { text: 'Suporte Prioritário', included: false, icon: 'chat' as const },
            ],
        },
        {
            title: 'Lendário',
            subtitle: 'Jogador Dedicado',
            price: '9,90',
            period: 'mês',
            isCurrent: userProfile?.subscription_status === 'premium', // Simplificado, ideal seria checar o plano exato
            features: [
                { text: 'Análises de IA Ilimitadas', included: true, icon: 'lightning' as const },
                { text: 'Histórico de Análises (em breve)', included: true, icon: 'star' as const },
                { text: 'Listas de Builds Personalizadas (em breve)', included: true, icon: 'star' as const },
                { text: 'Enciclopédia e Ranking completos', included: true, icon: 'book' as const },
                { text: 'Analisador de Draft 5vs5', included: false, icon: 'chess' as const },
                { text: 'Acesso Antecipado a Novos Recursos', included: true, icon: 'star' as const },
            ],
        },
        {
            title: 'Mítico',
            subtitle: 'Estrategista de Equipe',
            price: '19,90',
            period: 'mês',
            isRecommended: true,
            isCurrent: userProfile?.subscription_status === 'premium',
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
            price: '59,90',
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

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {plans.map(plan => <PlanCard key={plan.title} {...plan} />)}
            </div>

            <div className="text-center mt-12">
                <div className="text-slate-400 text-sm">
                    <p>O sistema de pagamento está sendo atualizado. Em breve: integração com Mercado Pago!</p>
                    <p>Ao assinar, você apoia o desenvolvimento contínuo e a adição de novas funcionalidades à plataforma.</p>
                </div>
            </div>
        </div>
    );
};

export default PremiumScreen;