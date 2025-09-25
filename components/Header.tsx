import React from 'react';

type GameMode = '1v1' | '5v5' | 'ranking' | 'item' | 'synergy' | 'heroes';

interface HeaderProps {
    activeMode: GameMode;
    onSetMode: (mode: GameMode) => void;
}

const Header: React.FC<HeaderProps> = ({ activeMode, onSetMode }) => {
    const descriptions: Record<GameMode, string> = {
        '1v1': 'Analise confrontos, descubra os melhores counters e domine sua lane com sugestões táticas baseadas em dados.',
        '5v5': 'Planeje o draft da sua equipe, selecione heróis para cada time e visualize a composição completa da partida.',
        'ranking': 'Explore as estatísticas de heróis, filtre por elo e período para descobrir os heróis mais fortes do meta atual.',
        'item': 'Navegue por todos os itens do jogo, filtrados por categoria, para entender seus atributos e habilidades.',
        'synergy': 'Selecione um herói e explore suas sinergias, counters e uma análise estratégica completa com build de itens.',
        'heroes': 'Explore a enciclopédia de heróis, visualize suas habilidades, e encontre o personagem perfeito para seu estilo de jogo.'
    };

    const modes: { id: GameMode; label: string }[] = [
        { id: '1v1', label: 'Análise 1vs1' },
        { id: '5v5', label: 'Draft 5vs5' },
        { id: 'heroes', label: 'Heróis' },
        { id: 'synergy', label: 'Sinergias' },
        { id: 'ranking', label: 'Ranking' },
        { id: 'item', label: 'Itens' },
    ];

    return (
        <header className="text-center mb-8 animated-entry">
            <img src="https://i.postimg.cc/ZK4nFyHG/mitica-logo-Photoroom.png" alt="Mítica Estratégia MLBB Logo" className="h-56 sm:h-80 lg:h-[27rem] mx-auto -mt-4 sm:-mt-10 lg:-mt-12 animated-logo" />
            <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tight title-main -mt-12 sm:-mt-20 lg:-mt-24 relative animated-logo max-w-sm sm:max-w-none mx-auto">
                MÍTICA ESTRATÉGIA MLBB
            </h1>
             <p className="text-base sm:text-lg text-slate-300 mt-4 max-w-3xl mx-auto tracking-wide">
                Seu Guia de Counters, Builds e Estratégias para Mobile Legends: Bang Bang.
            </p>
            
            <div className="mt-8">
                <div className="inline-flex flex-wrap justify-center bg-black bg-opacity-30 p-1 rounded-lg gap-1">
                    {modes.map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => onSetMode(mode.id)}
                            className={`px-3 sm:px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
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

// FIX: The original file was incomplete and was missing the export statement.
// This completes the component and adds the default export to resolve the import error.
export default Header;