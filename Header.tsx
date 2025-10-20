import React, { useState, useEffect, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { UserProfile } from './types'; 
import { GameMode } from './types';

interface HeaderProps {
    session: Session | null;
    userProfile: UserProfile | null;
    onLogout: () => void;
    onEditProfile: () => void;
    onUpgradeClick: () => void;
    analysisLimit: number;
    effectiveSubscriptionStatus: 'free' | 'premium';
    activeMode: GameMode;
    onSetMode: (mode: GameMode) => void;
    onLoginClick: () => void;
    onGoBackToLanding: (sectionId?: string) => void;
    onNavigateToFeatures: () => void;
}

const UserPanel: React.FC<Pick<HeaderProps, 'userProfile' | 'onLogout' | 'onEditProfile' | 'onUpgradeClick' | 'analysisLimit' | 'effectiveSubscriptionStatus'>> = 
({ userProfile, onLogout, onEditProfile, onUpgradeClick, analysisLimit, effectiveSubscriptionStatus }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const getInitials = (name: string) => {
        if (!name) return '?';
        const names = name.split(' ');
        const initials = names.map(n => n[0]).join('');
        return initials.slice(0, 2).toUpperCase();
    };

    const today = new Date().toISOString().split('T')[0];
    const lastAnalysisDate = userProfile?.last_analysis_at ? new Date(userProfile.last_analysis_at).toISOString().split('T')[0] : null;
    const analysesToday = lastAnalysisDate === today ? userProfile?.analysis_count || 0 : 0;
    const analysesRemaining = Math.max(0, analysisLimit - analysesToday);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!userProfile) return null;

    return (
        <div ref={menuRef} className="relative z-20">
            <div className="flex items-center gap-3">
                {effectiveSubscriptionStatus === 'premium' ? (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 p-1.5 rounded-full border border-amber-400/50 shadow-lg shadow-amber-500/20">
                        <div className="flex items-center gap-1.5 px-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-bold text-sm text-black">PREMIUM</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-sm p-1.5 rounded-full border border-slate-700">
                         <span className="text-xs font-mono text-slate-300 px-3 flex items-center gap-1.5 whitespace-nowrap" title="Análises restantes">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">{analysesRemaining}/{analysisLimit}</span>
                        </span>
                         <button onClick={onUpgradeClick} className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-3 py-1.5 rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            UPGRADE
                        </button>
                    </div>
                )}
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-sky-800 flex items-center justify-center font-bold text-sky-300 border-2 border-sky-600">
                        {getInitials(userProfile.username)}
                    </div>
                </button>
            </div>


            {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900/80 backdrop-blur-md rounded-lg shadow-lg border border-slate-700 p-3 modal-animation">
                    <div className="flex items-center gap-3 border-b border-slate-700 pb-3 mb-3">
                         <div className="w-12 h-12 rounded-full bg-sky-800 flex items-center justify-center font-bold text-sky-300 border-2 border-sky-600 flex-shrink-0">
                            {getInitials(userProfile.username)}
                        </div>
                        <div>
                             <p className="font-bold text-white text-left">{userProfile.username}</p>
                             <p className="text-xs text-slate-400 text-left">{userProfile.rank}</p>
                        </div>
                    </div>

                    {effectiveSubscriptionStatus === 'premium' && userProfile.subscription_expires_at && (
                        <div className="px-3 py-2 text-xs border-b border-slate-700 mb-2">
                            <p className="font-semibold text-amber-300">Plano Premium Ativo</p>
                            <p className="text-slate-400">Expira em: {new Date(userProfile.subscription_expires_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                    )}
                    
                    <button onClick={onEditProfile} className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 rounded-md transition-colors">Editar Perfil</button>
                    <button onClick={onUpgradeClick} className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 rounded-md transition-colors">Meus Planos</button>
                    <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-700 rounded-md transition-colors">Sair</button>
                </div>
            )}
        </div>
    );
};

interface AppNavigationBarProps {
    activeMode: GameMode;
    onSetMode: (mode: GameMode) => void;
    effectiveSubscriptionStatus: 'free' | 'premium';
}

const AppNavigationBar: React.FC<AppNavigationBarProps> = ({ activeMode, onSetMode, effectiveSubscriptionStatus }) => {
    const modes: { id: GameMode; label: string; icon: React.ReactNode; isPro?: boolean; isDisabled?: boolean }[] = [
        // Left Side
        { id: '1v1', label: 'Análise 1vs1', icon: <span className="font-black text-xl tracking-tighter">1vs1</span> },
        { id: 'synergy', label: 'Análise de Herói', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg> },
        { id: '5v5', label: 'Draft 5vs5', icon: <span className="font-black text-xl tracking-tighter">5vs5</span>, isPro: true },
        { id: 'history', label: 'Histórico', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>, isPro: true },
        
        // Center
        { id: 'dashboard', label: 'Painel', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },

        // Right Side
        { id: 'heroes', label: 'Heróis', icon: <span className="font-black text-3xl">H</span> },
        { id: 'item', label: 'Itens', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M19.5,6H17V4.5A1.5,1.5 0 0,0 15.5,3H8.5A1.5,1.5 0 0,0 7,4.5V6H4.5A1.5,1.5 0 0,0 3,7.5V11.25L5,13V19.5A1.5,1.5 0 0,0 6.5,21H17.5A1.5,1.5 0 0,0 19,19.5V13L21,11.25V7.5A1.5,1.5 0 0,0 19.5,6M15,6H9V4.5C9,4.22 9.22,4 9.5,4H14.5C14.78,4 15,4.22 15,4.5V6M12,17A2,2 0 0,1 10,15A2,2 0 0,1 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17Z" /></svg> },
        { id: 'ranking', label: 'Ranking', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg> },
        { id: 'teams', label: 'Times', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>, isPro: true, isDisabled: true },
    ];
    
    const centerIndex = 4;
    const leftModes = modes.slice(0, centerIndex);
    const centerMode = modes[centerIndex];
    const rightModes = modes.slice(centerIndex + 1);

    const renderButton = (mode: typeof modes[0], isCenter: boolean) => {
        const isActive = activeMode === mode.id;
        const isDisabled = mode.isDisabled;
        return (
            <button
                key={mode.id}
                onClick={() => !isDisabled && onSetMode(mode.id)}
                disabled={isDisabled}
                className={`relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:rounded-full p-1 transition-transform duration-300 ${isCenter ? 'my-[-20px]' : ''} ${isDisabled ? 'cursor-not-allowed' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                title={isDisabled ? `${mode.label} (Em breve)` : mode.label}
            >
                <div className={`flex flex-col items-center justify-center rounded-full transition-all duration-300
                    ${isCenter 
                        ? `h-24 w-24 border-2 shadow-lg shadow-black/50 group-hover:border-sky-400 group-hover:shadow-[var(--glow-primary)] ${isActive ? 'bg-sky-600 border-sky-400' : 'bg-[#1f1d31] border-slate-600'}`
                        : `h-14 w-28 ${isActive ? 'bg-sky-600 shadow-sm shadow-sky-500/30' : 'group-hover:bg-slate-700'}`
                    }
                    ${isDisabled ? 'opacity-50' : ''}`}
                >
                    <div className={`flex items-center justify-center transition-colors ${isCenter ? 'h-8 w-8' : 'h-7'} ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                        {mode.icon}
                    </div>
                    <div className={`text-center text-[10px] font-semibold mt-0.5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} ${isCenter ? 'leading-tight px-1' : 'whitespace-nowrap'}`}>
                        {mode.label}
                    </div>
                </div>

                {(mode.isPro || isDisabled) && !isCenter && effectiveSubscriptionStatus === 'free' && (
                     <span className={`absolute -top-0 -right-0 text-black text-[8px] font-bold px-1 py-0.5 rounded-full shadow-md ${isDisabled ? 'bg-slate-500' : 'bg-gradient-to-br from-amber-400 to-yellow-500 animate-soft-blink'}`}>
                        {isDisabled ? 'EM BREVE' : 'PREMIUM'}
                    </span>
                )}
            </button>
        );
    };

    return (
        <nav className="relative flex justify-center animated-entry z-10">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center bg-[#13121d] rounded-[32px] p-2 border border-slate-700 shadow-lg shadow-black/30 gap-5">
                <div className="flex justify-end gap-5">
                    {leftModes.map(mode => renderButton(mode, false))}
                </div>
                <div className="flex-shrink-0">
                    {renderButton(centerMode, true)}
                </div>
                <div className="flex justify-start gap-5">
                    {rightModes.map(mode => renderButton(mode, false))}
                </div>
            </div>
        </nav>
    );
};


const Header: React.FC<HeaderProps> = ({ activeMode, onSetMode, session, userProfile, onLogout, onEditProfile, onUpgradeClick, analysisLimit, effectiveSubscriptionStatus, onLoginClick, onGoBackToLanding, onNavigateToFeatures }) => {
    const descriptions: Record<GameMode, string> = {
        'dashboard': 'Seu centro de comando estratégico com insights do meta, desafios diários e acesso rápido às principais ferramentas.',
        'synergy': 'Selecione um herói para ver sugestões de ban, sinergias e uma análise estratégica completa da IA com build e estilo de jogo.',
        '1v1': 'Analise confrontos, descubra os melhores counters e domine sua lane com sugestões táticas baseadas em dados.',
        '5v5': 'Planeje o draft da sua equipe, selecione heróis para cada time e visualize a composição completa da partida.',
        'heroes': 'Explore a enciclopédia de heróis, visualize suas habilidades, e encontre o personagem perfeito para seu estilo de jogo.',
        'item': 'Navegue por todos os itens do jogo, filtrados por categoria, para entender seus atributos e habilidades.',
        'ranking': 'Explore as estatísticas de heróis, filtre por elo e período para descobrir os heróis mais fortes do meta atual.',
        'premium': 'Conheça os planos e desbloqueie o acesso ilimitado a todas as ferramentas da Mítica Estratégia.',
        'history': 'Acesse e reveja todas as suas análises de IA salvas. Disponível para assinantes Mítico e Glória Imortal.',
        'teams': 'Gerencie sua equipe, convide jogadores e analise drafts em grupo. (Em breve para assinantes Glória Imortal)'
    };

    return (
        <>
            <header className="sticky top-0 z-30 bg-black/50 backdrop-blur-md border-b border-slate-700/50 animated-entry">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative flex justify-between items-center h-16">
                        
                        {activeMode === 'premium' ? (
                             <button 
                                onClick={() => onSetMode('dashboard')} 
                                className="text-slate-300 hover:text-white font-semibold transition-colors text-lg p-2 rounded-lg flex items-center gap-2"
                                aria-label="Voltar"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span className="hidden sm:block">Voltar</span>
                            </button>
                        ) : (
                            <button onClick={() => onSetMode('dashboard')} className="flex items-center gap-2 cursor-pointer group">
                                <img src="https://i.postimg.cc/ZK4nFyHG/mitica-logo-Photoroom.png" alt="Logo" className="h-10 w-10 transition-transform group-hover:scale-110" />
                                <span className="font-bold text-lg text-white hidden sm:block transition-all group-hover:brightness-110 relative top-[2px]" style={{ fontFamily: "'Inter', sans-serif" }}>Mítica Estratégia MLBB</span>
                            </button>
                        )}

                        <nav className="hidden md:flex gap-6 items-center absolute left-1/2 -translate-x-1/2">
                            <button onClick={onNavigateToFeatures} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Funcionalidades</button>
                            <button onClick={() => onGoBackToLanding('testimonials')} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Depoimentos</button>
                            <button onClick={onUpgradeClick} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Planos</button>
                        </nav>
                        
                        <div className="flex items-center">
                            {session ? (
                                <UserPanel 
                                    userProfile={userProfile} 
                                    onLogout={onLogout} 
                                    onEditProfile={onEditProfile}
                                    onUpgradeClick={onUpgradeClick}
                                    analysisLimit={analysisLimit}
                                    effectiveSubscriptionStatus={effectiveSubscriptionStatus}
                                />
                            ) : (
                                <button
                                    onClick={onLoginClick}
                                    className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold py-2 px-5 rounded-lg text-sm hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
                                >
                                    Login / Cadastrar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            
            {activeMode !== 'premium' && (
                <div className="text-center mt-8 mb-4 animated-entry">
                     <AppNavigationBar
                        activeMode={activeMode}
                        onSetMode={onSetMode}
                        effectiveSubscriptionStatus={effectiveSubscriptionStatus}
                    />
                    
                    <p className="text-sm text-slate-400 mt-4 max-w-xl mx-auto flex items-center justify-center transition-opacity duration-300 min-h-[40px]">
                        {descriptions[activeMode]}
                    </p>
                </div>
            )}
        </>
    );
};

export default Header;