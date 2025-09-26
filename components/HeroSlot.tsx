import React from 'react';
import { Hero, Team } from '../types';

interface HeroSlotProps {
    type: Team | 'synergy';
    heroId: string | null;
    heroes: Record<string, Hero>;
    onClick: () => void;
    onClear?: () => void;
    label?: string;
}

const HeroSlot: React.FC<HeroSlotProps> = ({ type, heroId, heroes, onClick, onClear, label }) => {
    const hero = heroId ? heroes[heroId] : null;
    const teamClass = type === 'synergy' ? 'ally' : type;

    return (
        <div 
            onClick={onClick}
            className={`hero-slot relative flex flex-col items-center justify-center text-center gap-2 p-2 rounded-lg cursor-pointer ${hero ? `${teamClass} filled` : 'empty'}`}
        >
            {hero && onClear && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onClear(); }}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full text-white/70 hover:text-white hover:bg-black/80 flex items-center justify-center z-10 transition-colors"
                    aria-label="Limpar herói"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
            {hero ? (
                <>
                    <img 
                        loading="lazy"
                        src={hero.imageUrl} 
                        alt={hero.name} 
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-md object-cover" 
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; 
                            target.src='https://placehold.co/64x64/1a1c29/FFFFFF?text=?';
                        }}
                    />
                    <p className="font-bold text-sm leading-tight">{hero.name}</p>
                </>
            ) : (
                <>
                    <span className="text-3xl text-gray-600">+</span>
                    {label && <span className="text-sm text-gray-500 mt-1">{label}</span>}
                </>
            )}
        </div>
    );
};

export default React.memo(HeroSlot);