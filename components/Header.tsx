


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

    return (
        <header className="text-center mb-8 animated-entry">
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight title-main">
                Mítica Estratégia MLBB
            </h1>
             <p className="text-base sm:text-lg text-slate-300 mt-4 max-w-3xl mx-auto tracking-wide">
                Seu Guia de Counters, Builds e Estratégias para Mobile Legends: Bang Bang.
            </p>
            
            <div className="mt-8">
                <div className="inline-flex bg-black bg-opacity-30 p-1 rounded-lg space-x-1 border border-slate-700">
                    <button 
                        onClick={() => onSetMode('1v1')}
                        className={`px-6 py-2 text-sm font-bold rounded-md transition-colors ${activeMode === '1v1' ? 'bg-violet-600 text-white shadow' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                        1 vs 1
                    </button>
                    <button 
                        onClick={() => onSetMode('5v5')}
                        className={`px-6 py-2 text-sm font-bold rounded-md transition-colors ${activeMode === '5v5' ? 'bg-violet-600 text-white shadow' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                        5 vs 5
                    </button>
                     <button 
                        onClick={() => onSetMode('item')}
                        className={`px-6 py-2 text-sm font-bold rounded-md transition-colors ${activeMode === 'item' ? 'bg-violet-600 text-white shadow' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                        Item
                    </button>
                    <button 
                        onClick={() => onSetMode('ranking')}
                        className={`px-6 py-2 text-sm font-bold rounded-md transition-colors ${activeMode === 'ranking' ? 'bg-violet-600 text-white shadow' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                        Ranking
                    </button>
                </div>
            </div>
            <p key={activeMode} className="text-sm sm:text-base text-gray-400 mt-6 max-w-3xl mx-auto animated-entry">
                {descriptions[activeMode]}
            </p>
        </header>
    );
};

export default Header;