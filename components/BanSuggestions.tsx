import React from 'react';
import { BanSuggestion } from '../types';

interface BanSuggestionsProps {
    suggestions: BanSuggestion[];
    isLoading: boolean;
    variant: '1v1' | '5v5';
}

const BanSuggestions: React.FC<BanSuggestionsProps> = ({ suggestions, isLoading, variant }) => {
    if (suggestions.length === 0 && !isLoading) {
        return (
             <div className="glassmorphism p-4 rounded-xl animated-entry min-h-[9rem] flex items-center justify-center text-center border-2 panel-glow-primary" style={{ animationDelay: '300ms' }}>
                 <p className="text-gray-400 text-sm">As sugestões são baseadas nos heróis com maior taxa de banimento. Ajuste os filtros na aba "Ranking de Heróis" para refinar.</p>
             </div>
        );
    }

    const containerClasses = variant === '1v1'
        ? "flex flex-wrap items-start justify-center gap-x-6 gap-y-3 sm:gap-x-8 py-2"
        : "flex flex-wrap items-start justify-center gap-x-2 gap-y-2 sm:gap-x-4 py-2";

    const imageClasses = variant === '1v1'
        ? "w-16 h-16 sm:w-20 sm:h-20"
        : "w-12 h-12 sm:w-14 sm:h-14";

    return (
        <div className="glassmorphism p-4 rounded-xl animated-entry min-h-[9rem] border-2 panel-glow-primary" style={{ animationDelay: '300ms' }}>
            <h2 className="text-lg font-bold text-center mb-2 text-red-300">SUGESTÕES DE BANIMENTO</h2>
            {isLoading ? (
                <div className="flex justify-center items-center h-24">
                    <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-red-400"></div>
                </div>
            ) : (
                <div className={containerClasses}>
                    {suggestions.map(({ hero, reason }, index) => {
                        const isPriority = index < 3; // Highlight first few suggestions
                        return (
                            <div key={hero.id} className="group relative flex flex-col items-center text-center">
                                {isPriority && (
                                    <div className="absolute -top-1.5 right-0 bg-yellow-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10 shadow-lg">
                                        PRIORIDADE
                                    </div>
                                )}
                                <img
                                    src={hero.imageUrl}
                                    alt={hero.name}
                                    className={`${imageClasses} rounded-full object-cover border-2 group-hover:scale-110 transition-transform ${isPriority ? 'border-yellow-400' : 'border-red-800'}`}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null; 
                                        target.src='https://placehold.co/64x64/2d0f0f/FFFFFF?text=?';
                                    }}
                                />
                                <span className="text-xs mt-2 font-medium">{hero.name}</span>
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 w-48 p-2 bg-black text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                                    {reason}
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black"></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BanSuggestions;