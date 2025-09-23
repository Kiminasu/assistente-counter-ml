import React from 'react';
import { Hero, SlotType } from '../types';

interface HeroSlotProps {
    type: SlotType;
    heroId: string | null;
    heroes: Record<string, Hero>;
    onClick: (type: SlotType) => void;
}

const HeroSlot: React.FC<HeroSlotProps> = ({ type, heroId, heroes, onClick }) => {
    const hero = heroId ? heroes[heroId] : null;
    const teamClass = type === 'yourPick' ? 'ally' : 'enemy';
    const label = type === 'yourPick' ? 'Seu Herói' : 'Inimigo';

    return (
        <div 
            onClick={() => onClick(type)}
            className={`hero-slot flex flex-col items-center justify-center text-center gap-2 p-2 rounded-lg cursor-pointer ${hero ? `${teamClass} filled` : 'empty'}`}
        >
            {hero ? (
                <>
                    <img 
                        src={hero.imageUrl} 
                        alt={hero.name} 
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-md object-cover" 
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; 
                            target.src='https://placehold.co/64x64/1a1c29/FFFFFF?text=?';
                        }}
                    />
                    <p className="font-bold text-sm sm:text-md leading-tight">{hero.name}</p>
                </>
            ) : (
                <>
                    <span className="text-3xl text-gray-600">+</span>
                    <span className="text-sm text-gray-500 mt-1">{label}</span>
                </>
            )}
        </div>
    );
};

export default HeroSlot;