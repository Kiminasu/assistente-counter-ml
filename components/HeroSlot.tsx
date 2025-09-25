import React from 'react';
import { Hero, Team } from '../types';

interface HeroSlotProps {
    type: Team;
    heroId: string | null;
    heroes: Record<string, Hero>;
    onClick: () => void;
    label?: string;
}

const HeroSlot: React.FC<HeroSlotProps> = ({ type, heroId, heroes, onClick, label }) => {
    const hero = heroId ? heroes[heroId] : null;
    const teamClass = type;

    return (
        <div 
            onClick={onClick}
            className={`hero-slot flex flex-col items-center justify-center text-center gap-2 p-2 rounded-lg cursor-pointer ${hero ? `${teamClass} filled` : 'empty'}`}
        >
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