
import React from 'react';
import { Session } from '@supabase/supabase-js';

type GameMode = '1v1' | '5v5' | 'ranking' | 'item' | 'synergy' | 'heroes';

interface HeaderProps {
    activeMode: GameMode;
    onSetMode: (mode: GameMode) => void;
    session: Session | null;
    userProfile: { username: string; rank: string } | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeMode, onSetMode, session, userProfile, onLogout }) => {
    const descriptions: Record<GameMode, string> = {
        'synergy': 'Selecione um herói para ver sugestões de ban, sinergias e uma análise estratégica completa da IA com build e estilo de jogo.',
        '1v1': 'Analise confrontos, descubra os melhores counters e domine sua lane com sugestões táticas baseadas em dados.',
        '5v5': 'Planeje o draft da sua equipe, selecione heróis para cada time e visualize a composição completa da partida.',
        'heroes': 'Explore a enciclopédia de heróis, visualize suas habilidades, e encontre o personagem perfeito para seu estilo de jogo.',
        'item': 'Navegue por todos os itens do jogo, filtrados por categoria, para entender seus atributos e habilidades.',
        'ranking': 'Explore as estatísticas de heróis, filtre por elo e período para descobrir os heróis mais fortes do meta atual.',
    };

    const modes: { id: GameMode; label: string }[] = [
        { id: 'synergy', label: 'Análise de Herói' },
        { id: '1v1', label: 'Análise 1vs1' },
        { id: '5v5', label: 'Draft 5vs5' },
        { id: 'heroes', label: 'Heróis' },
        { id: 'item', label: 'Itens' },
        { id: 'ranking', label: 'Ranking' },
    ];

    return (
        <header className="relative text-center mb-8 animated-entry">
             {session && (
                <div className="absolute top-0 right-0 text-right bg-black/20 p-2 rounded-lg z-10">
                    <p className="text-xs text-gray-300 truncate max-w-[200px]">
                       Bem-vindo, <span className="font-bold">{userProfile?.username || session.user.email}</span>!
                    </p>
                    <button 
                        onClick={onLogout} 
                        className="text-xs font-semibold text-violet-400 hover:underline transition-colors"
                    >
                        Sair
                    </button>
                </div>
            )}

            <img src="https://i.postimg.cc/ZK4nFyHG/mitica-logo-Photoroom.png" alt="Mítica Estratégia MLBB Logo" className="h-56 sm:h-80 lg:h-[27rem] mx-auto -mt-4 sm:-mt-10 lg:-mt-12 animated-logo" />
            <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tight title-main -mt-12 sm:-mt-20 lg:-mt-24 relative animated-logo max-w-sm sm:max-w-none mx-auto">
                MÍTICA ESTRATÉGIA MLBB
            </h1>
             <p className="text-base sm:text-lg text-slate-300 mt-4 max-w-3xl mx-auto tracking-wide">
                Seu Guia de Counters, Builds e Estratégias para Mobile Legends: Bang Bang.
            </p>
            
            <div className="mt-8">
                <div className="inline-flex flex-wrap justify-center bg-black bg-opacity-30 p-1 rounded-xl gap-1">
                    {modes.map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => onSetMode(mode.id)}
                            className={`px-3 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                                activeMode === mode.id
                                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                                    : 'text-gray-300 hover:bg-gray-700/50'
                            }`}
                        >
                            {mode.label}
                        </button>
                    ))}
                </div>
                <p className="text-sm text-slate-400 mt-4 max-w-xl mx-auto h-10 flex items-center justify-center transition-opacity duration-300">
                    {descriptions[activeMode]}
                </p>
            </div>
        </header>
    );
};

export default Header;
