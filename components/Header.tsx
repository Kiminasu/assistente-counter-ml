import React, { useState, useEffect, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { UserProfile } from '../App'; 

type GameMode = '1v1' | '5v5' | 'ranking' | 'item' | 'synergy' | 'heroes' | 'premium';

interface HeaderProps {
    activeMode: GameMode;
    onSetMode: (mode: GameMode) => void;
    session: Session | null;
    userProfile: UserProfile | null;
    onLogout: () => void;
    onEditProfile: () => void;
    onUpgradeClick: () => void;
    analysisLimit: number;
}

const UserPanel: React.FC<Pick<HeaderProps, 'userProfile' | 'onLogout' | 'onEditProfile' | 'onUpgradeClick' | 'analysisLimit'>> = 
({ userProfile, onLogout, onEditProfile, onUpgradeClick, analysisLimit }) => {
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
        <div ref={menuRef} className="absolute top-4 right-0 text-right z-20">
            <div className="flex items-center gap-3">
                {userProfile.subscription_status === 'premium' ? (
                    <div className="flex items-center gap-3 bg-amber-900/30 backdrop-blur-sm p-1.5 rounded-full border border-amber-600/50">
                        <div className="flex items-center gap-2 px-3">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-bold text-sm text-amber-300 truncate max-w-[150px]">{userProfile.username}</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-sm p-1.5 rounded-full border border-slate-700">
                         <span className="text-xs font-mono text-slate-300 px-3 flex items-center gap-1.5 whitespace-nowrap" title="Análises restantes">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
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
                    <div className="w-10 h-10 rounded-full bg-violet-800 flex items-center justify-center font-bold text-violet-300 border-2 border-violet-600">
                        {getInitials(userProfile.username)}
                    </div>
                </button>
            </div>


            {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900/80 backdrop-blur-md rounded-lg shadow-lg border border-slate-700 p-3 modal-animation">
                    <div className="flex items-center gap-3 border-b border-slate-700 pb-3 mb-3">
                         <div className="w-12 h-12 rounded-full bg-violet-800 flex items-center justify-center font-bold text-violet-300 border-2 border-violet-600 flex-shrink-0">
                            {getInitials(userProfile.username)}
                        </div>
                        <div>
                             <p className="font-bold text-white text-left">{userProfile.username}</p>
                             <p className="text-xs text-slate-400 text-left">{userProfile.rank}</p>
                        </div>
                    </div>
                    
                    <button onClick={onEditProfile} className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 rounded-md transition-colors">Editar Perfil</button>
                    <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-700 rounded-md transition-colors">Sair</button>
                </div>
            )}
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ activeMode, onSetMode, session, userProfile, onLogout, onEditProfile, onUpgradeClick, analysisLimit }) => {
    const descriptions: Record<GameMode, string> = {
        'synergy': 'Selecione um herói para ver sugestões de ban, sinergias e uma análise estratégica completa da IA com build e estilo de jogo.',
        '1v1': 'Analise confrontos, descubra os melhores counters e domine sua lane com sugestões táticas baseadas em dados.',
        '5v5': 'Planeje o draft da sua equipe, selecione heróis para cada time e visualize a composição completa da partida.',
        'heroes': 'Explore a enciclopédia de heróis, visualize suas habilidades, e encontre o personagem perfeito para seu estilo de jogo.',
        'item': 'Navegue por todos os itens do jogo, filtrados por categoria, para entender seus atributos e habilidades.',
        'ranking': 'Explore as estatísticas de heróis, filtre por elo e período para descobrir os heróis mais fortes do meta atual.',
        'premium': 'Conheça os planos e desbloqueie o acesso ilimitado a todas as ferramentas da Mítica Estratégia.'
    };

    const modes: { id: GameMode; label: string, isPro?: boolean }[] = [
        { id: 'synergy', label: 'Análise de Herói' },
        { id: '1v1', label: 'Análise 1vs1' },
        { id: '5v5', label: 'Draft 5vs5', isPro: true },
        { id: 'heroes', label: 'Heróis' },
        { id: 'item', label: 'Itens' },
        { id: 'ranking', label: 'Ranking' },
    ];
    
    // Não mostra a barra de navegação na tela premium
    const showNavBar = activeMode !== 'premium';

    return (
        <header className="relative text-center mb-8 animated-entry">
            {activeMode === 'premium' && (
                 <button 
                    onClick={() => onSetMode('synergy')} 
                    className="absolute top-4 left-0 text-slate-300 hover:text-white font-semibold transition-colors text-lg p-2 rounded-lg flex items-center gap-2 z-30"
                    aria-label="Voltar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Voltar
                </button>
            )}
            {session && (
                 <UserPanel 
                    userProfile={userProfile} 
                    onLogout={onLogout} 
                    onEditProfile={onEditProfile}
                    onUpgradeClick={onUpgradeClick}
                    analysisLimit={analysisLimit}
                />
            )}

            <img src="https://i.postimg.cc/ZK4nFyHG/mitica-logo-Photoroom.png" alt="Mítica Estratégia MLBB Logo" className={`h-56 sm:h-80 lg:h-[27rem] mx-auto -mt-4 sm:-mt-10 lg:-mt-12 ${activeMode !== 'premium' ? 'animated-logo' : ''}`} />
            <h1 className={`text-4xl sm:text-7xl lg:text-8xl font-black tracking-tight title-main -mt-12 sm:-mt-20 lg:-mt-24 relative max-w-sm sm:max-w-none mx-auto ${activeMode !== 'premium' ? 'animated-logo' : ''}`}>
                MÍTICA ESTRATÉGIA MLBB
            </h1>
            
            {showNavBar && (
                <>
                    <p className="text-base sm:text-lg text-slate-300 mt-4 max-w-3xl mx-auto tracking-wide">
                        Seu Guia de Counters, Builds e Estratégias para Mobile Legends: Bang Bang.
                    </p>
                    <div className="mt-8">
                        <div className="inline-flex flex-wrap justify-center bg-black bg-opacity-30 p-1 rounded-xl gap-1">
                            {modes.map((mode) => {
                                const isProFeature = mode.isPro && userProfile?.subscription_status !== 'premium';
                                return (
                                    <button
                                        key={mode.id}
                                        onClick={() => onSetMode(mode.id)}
                                        className={`relative px-3 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                                            activeMode === mode.id
                                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                                                : 'text-gray-300 hover:bg-gray-700/50'
                                        }`}
                                    >
                                        {mode.label}
                                        {isProFeature && (
                                             <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-amber-400 to-yellow-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-lg animate-pulse">
                                                PRO
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-sm text-slate-400 mt-4 max-w-xl mx-auto h-10 flex items-center justify-center transition-opacity duration-300">
                            {descriptions[activeMode]}
                        </p>
                    </div>
                </>
            )}
        </header>
    );
};

export default Header;
