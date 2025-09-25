import React from 'react';

type GameMode = '1v1' | '5v5' | 'ranking' | 'item';

interface HeaderProps {
    activeMode: GameMode;
    onSetMode: (mode: GameMode) => void;
}

const Header: React.FC<HeaderProps> = ({ activeMode, onSetMode }) => {
    const descriptions: Record<GameMode, string> = {
        '1v1': 'Analise confrontos, descubra os melhores counters e domine sua lane com sugestões táticas baseadas em dados.',
        '5v5': 'Planeje o draft da sua equipe, selecione heróis para cada time e visualize a composição completa da partida.',
        'ranking': 'Explore as estatísticas de heróis, filtre por elo e período para descobrir os heróis mais fortes do meta atual.',
        'item': 'Navegue por todos os itens do jogo, filtrados por categoria, para entender seus atributos e habilidades.'
    };

    const modes: { id: GameMode; label: string }[] = [
        { id: '1v1', label: 'Análise 1vs1' },
        { id: '5v5', label: 'Draft 5vs5' },
        { id: 'ranking', label: 'Ranking' },
        { id: 'item', label: 'Itens' },
    ];

    return (
        <header className="text-center mb-8 animated-entry">
            <img src="https://i.postimg.cc/ZK4nFyHG/mitica-logo-Photoroom.png" alt="Mítica Estratégia MLBB Logo" className="h-64 sm:h-80 lg:h-[27rem] mx-auto -mt-8 sm:-mt-10 lg:-mt-12 animated-logo" />
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight title-main -mt-14 sm:-mt-20 lg:-mt-24 relative animated-logo max-w-sm sm:max-w-none mx-auto">
                MÍTICA ESTRATÉGIA MLBB
            </h1>
             <p className="text-base sm:text-lg text-slate-300 mt-4 max-w-3xl mx-auto tracking-wide">
                Seu Guia de Counters, Builds e Estratégias para Mobile Legends: Bang Bang.
            </p>
            
            <div className="mt-8">
                <div className="inline-flex bg-black bg-opacity-30 p-1 rounded-lg space-x-1">
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