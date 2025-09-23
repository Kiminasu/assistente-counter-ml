import React from 'react';
import { Hero, SlotType } from '../types';
import HeroSlot from './HeroSlot';

interface MatchupScreenProps {
    yourPick: string | null;
    enemyPick: string | null;
    heroes: Record<string, Hero>;
    onSlotClick: (type: SlotType) => void;
}

const MatchupScreen: React.FC<MatchupScreenProps> = ({ yourPick, enemyPick, heroes, onSlotClick }) => {
    return (
        <div className="glassmorphism p-6 rounded-xl animated-entry flex-grow border-2 border-yellow-400 shadow-lg shadow-yellow-400/20" style={{ animationDelay: '200ms' }}>
            <div className="grid grid-cols-11 gap-2 items-center">
                <div className="col-span-5">
                    <HeroSlot type="yourPick" heroId={yourPick} heroes={heroes} onClick={onSlotClick} />
                </div>
                <div className="col-span-1 flex items-center justify-center text-2xl sm:text-3xl font-black text-gray-600">
                    VS
                </div>
                <div className="col-span-5">
                    <HeroSlot type="enemyPick" heroId={enemyPick} heroes={heroes} onClick={onSlotClick} />
                </div>
            </div>
        </div>
    );
};

export default MatchupScreen;