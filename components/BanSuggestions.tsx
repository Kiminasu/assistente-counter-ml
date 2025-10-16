import React, { useState, useEffect, useMemo } from 'react';
import { BanSuggestion, RankCategory } from '../types';

interface BanSuggestionsProps {
    counterSuggestions: BanSuggestion[];
    metaSuggestions: BanSuggestion[];
    isLoading: boolean;
    variant: '1v1' | '5v5';
    activeMetaRank: RankCategory | null;
    onMetaRankChange: (rank: RankCategory) => void;
}

const RANK_LABELS: Record<RankCategory, string> = {
    all: "Todos", epic: "Épico", legend: "Lenda", mythic: "Mítico", honor: "Honra", glory: "Glória"
};
const META_RANKS_TO_DISPLAY: RankCategory[] = ['epic', 'legend', 'mythic', 'honor', 'glory'];

const BanSuggestions: React.FC<BanSuggestionsProps> = ({ 
    counterSuggestions, 
    metaSuggestions, 
    isLoading, 
    variant,
    activeMetaRank,
    onMetaRankChange
}) => {
    // userSelectedTab rastreia a escolha explícita do utilizador. Nulo significa que nenhuma escolha foi feita.
    const [userSelectedTab, setUserSelectedTab] = useState<'counter' | 'meta' | null>(null);

    const hasCounterSuggestions = counterSuggestions && counterSuggestions.length > 0;
    
    // Este efeito redefine a escolha do utilizador APENAS se ele estava no separador 'counter' e as sugestões de counter desaparecem.
    // Isso permite que o componente volte ao separador 'meta' por defeito de forma elegante.
    useEffect(() => {
        if (!hasCounterSuggestions && userSelectedTab === 'counter') {
            setUserSelectedTab(null);
        }
    }, [hasCounterSuggestions, userSelectedTab]);

    // Determina o separador ativo para renderização.
    // Prioridade: 1. Escolha explícita do utilizador. 2. Padrão para 'counter' se disponível. 3. Padrão para 'meta'.
    const activeTab = useMemo(() => {
        if (userSelectedTab) {
            return userSelectedTab;
        }
        if (hasCounterSuggestions) {
            return 'counter';
        }
        return 'meta';
    }, [userSelectedTab, hasCounterSuggestions]);

    const suggestions = activeTab === 'counter' ? counterSuggestions : metaSuggestions;

    const renderContent = () => {
        if (isLoading || !activeMetaRank) {
            return (
                <div className="flex justify-center items-center h-24">
                    <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-red-400"></div>
                </div>
            );
        }

        if (!suggestions || suggestions.length === 0) {
             return (
                 <div className="h-24 flex items-center justify-center text-center">
                     <p className="text-gray-400 text-sm">Nenhuma sugestão de banimento disponível para esta seleção.</p>
                 </div>
            );
        }

        const isCounterTab = activeTab === 'counter';
        const suggestionsToShow = suggestions;
        
        return (
             <div className="flex flex-wrap justify-center gap-4 py-2">
                {suggestionsToShow.map(({ hero, reason }, index) => {
                    const isPriority = index < 3;
                    return (
                        <div key={hero.id} className="group relative flex flex-col items-center text-center w-20">
                            {isPriority && activeTab === 'meta' && (
                                <div className="absolute -top-1.5 right-0 bg-yellow-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10 shadow-lg">
                                    PRIORIDADE
                                </div>
                            )}
                            <img
                                loading="lazy"
                                src={hero.imageUrl}
                                alt={hero.name}
                                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 group-hover:scale-110 transition-transform ${isPriority && activeTab === 'meta' ? 'border-yellow-400' : 'border-red-800'}`}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null; 
                                    target.src='https://placehold.co/64x64/2d0f0f/FFFFFF?text=?';
                                }}
                            />
                            <span className="text-xs mt-2 font-medium">{hero.name}</span>
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 w-48 p-2 bg-black text-white text-xs rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                                {reason}
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black"></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="glassmorphism p-4 rounded-2xl animated-entry min-h-[9rem] border-2 panel-glow-primary flex flex-col" style={{ animationDelay: '300ms' }}>
            <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 mb-2">
                 <h2 className="text-lg font-bold text-red-300">SUGESTÕES DE BANIMENTO</h2>
                 <div className="flex bg-black/30 p-0.5 rounded-lg">
                    <button 
                        onClick={() => setUserSelectedTab('counter')}
                        disabled={!hasCounterSuggestions}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${activeTab === 'counter' ? 'bg-red-700 text-white' : 'text-gray-400 hover:bg-gray-700/50 disabled:text-gray-600 disabled:cursor-not-allowed'}`}
                    >
                        Counter
                    </button>
                    <button 
                        onClick={() => setUserSelectedTab('meta')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${activeTab === 'meta' ? 'bg-red-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}
                    >
                        Meta
                    </button>
                 </div>
            </div>
            {activeTab === 'meta' && activeMetaRank && (
                <div className="flex-shrink-0 flex flex-wrap justify-center gap-1 mb-3 bg-black/20 p-1 rounded-lg">
                    {META_RANKS_TO_DISPLAY.map(rank => (
                        <button
                            key={rank}
                            onClick={() => onMetaRankChange(rank)}
                            className={`flex-1 text-xs font-semibold py-1 px-2 rounded-md transition-colors ${
                                activeMetaRank === rank
                                    ? 'bg-red-800 text-white'
                                    : 'text-gray-400 hover:bg-gray-700/50'
                            }`}
                        >
                            {RANK_LABELS[rank]}
                        </button>
                    ))}
                </div>
            )}
            <div className="flex-grow">
                {renderContent()}
            </div>
        </div>
    );
};

export default BanSuggestions;