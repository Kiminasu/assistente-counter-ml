import React from 'react';
import { BanSuggestion } from '../types';

interface BanSuggestionsProps {
    suggestions: BanSuggestion[];
    isLoading: boolean;
}

const BanSuggestions: React.FC<BanSuggestionsProps> = ({ suggestions, isLoading }) => {
    if (suggestions.length === 0 && !isLoading) {
        return (
             <div className="glassmorphism p-4 rounded-xl animated-entry min-h-[9rem] flex items-center justify-center text-center" style={{ animationDelay: '300ms' }}>
                 <p className="text-gray-400 text-sm">Selecione seu herói para receber sugestões de ban com base em suas fraquezas.</p>
             </div>
        );
    }

    return (
        <div className="glassmorphism p-4 rounded-xl animated-entry min-h-[9rem]" style={{ animationDelay: '300ms' }}>
            <h2 className="text-xl font-bold text-center mb-3 text-red-300">SUGESTÕES DE BAN</h2>
            {isLoading ? (
                <div className="flex justify-center items-center h-24">
                    <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-red-400"></div>
                </div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                    {suggestions.map(({ hero, reason }) => (
                        <div key={hero.id} className="group relative flex flex-col items-center text-center">
                            <img
                                src={hero.imageUrl}
                                alt={hero.name}
                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-red-800 group-hover:scale-110 transition-transform"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null; 
                                    target.src='https://placehold.co/64x64/2d0f0f/FFFFFF?text=?';
                                }}
                            />
                            <span className="text-xs mt-2 font-medium">{hero.name}</span>
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 w-48 p-2 bg-black text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                {reason}
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black"></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BanSuggestions;