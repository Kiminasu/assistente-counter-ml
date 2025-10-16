import React, { useState, useEffect, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { UserProfile } from '../types'; 
import { GameMode } from '../types';

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
        <div ref={menuRef} className="absolute top-4 right-0 text-right z-20">
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


const Header: React.FC<HeaderProps> = ({ activeMode, onSetMode, session, userProfile, onLogout, onEditProfile, onUpgradeClick, analysisLimit, effectiveSubscriptionStatus }) => {
    
    const showHeaderContent = activeMode !== 'premium';

    return (
        <header className="relative text-center mb-8 animated-entry">
            {activeMode === 'premium' && (
                 <button 
                    onClick={() => onSetMode('dashboard')} 
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
                    effectiveSubscriptionStatus={effectiveSubscriptionStatus}
                />
            )}
            
            {showHeaderContent ? (
                <>
                    <img src="https://i.postimg.cc/ZK4nFyHG/mitica-logo-Photoroom.png" alt="Mítica Estratégia MLBB Logo" className="h-24 sm:h-32 mx-auto -mb-4 sm:-mb-6" />
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white relative max-w-sm sm:max-w-none mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Mítica Estratégia MLBB
                    </h1>
                </>
            ) : (
                <>
                    <img src="https://i.postimg.cc/ZK4nFyHG/mitica-logo-Photoroom.png" alt="Mítica Estratégia MLBB Logo" className="h-40 sm:h-48 mx-auto -mb-6 sm:-mb-8" />
                     <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white relative max-w-sm sm:max-w-none mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Mítica Estratégia MLBB
                    </h1>
                </>
            )}

        </header>
    );
};

export default Header;