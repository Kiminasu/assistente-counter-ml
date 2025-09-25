
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Hero, Lane, LANES } from '../types';
import { LANE_ICONS } from '../constants';

interface HeroSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onHeroSelect: (heroId: string) => void;
    heroes: Record<string, Hero>;
    heroLanes: Record<number, Lane[]>;
}

const HeroSelectionModal: React.FC<HeroSelectionModalProps> = ({ isOpen, onClose, onHeroSelect, heroes, heroLanes }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLane, setSelectedLane] = useState<Lane | 'Todas'>('Todas');
    const searchInputRef = useRef<HTMLInputElement>(null);

    const laneFilters: (Lane | 'Todas')[] = ['Todas', ...LANES];

    const filteredHeroes = useMemo(() => {
        const heroesArray: Hero[] = Object.values(heroes);

        const searchFiltered = searchTerm
            ? heroesArray.filter((hero: Hero) => hero.name.toLowerCase().includes(searchTerm.toLowerCase()))
            : heroesArray;

        const laneFiltered = selectedLane === 'Todas'
            ? searchFiltered
            : searchFiltered.filter((hero: Hero) => {
                const lanesForHero = heroLanes[hero.apiId];
                return lanesForHero && lanesForHero.includes(selectedLane);
            });

        return laneFiltered.sort((a: Hero, b: Hero) => a.name.localeCompare(b.name));
    }, [heroes, searchTerm, selectedLane, heroLanes]);

    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
            setSelectedLane('Todas');
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            if (!isTouchDevice) {
                setTimeout(() => searchInputRef.current?.focus(), 100);
            }
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="glassmorphism rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col border border-violet-500 modal-animation">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <div className="relative flex-grow mr-4">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Procurar herói..."
                            className="w-full p-2 pl-8 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="w-4 h-4 absolute left-2.5 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <button onClick={onClose} className="text-2xl text-gray-400 hover:text-white flex-shrink-0">&times;</button>
                </div>
                <div className="p-3 border-b border-gray-700 flex-shrink-0">
                    <div className="flex flex-wrap justify-center gap-2">
                        {laneFilters.map(lane => (
                            <button
                                key={lane}
                                onClick={() => setSelectedLane(lane)}
                                className={`flex items-center justify-center gap-2 font-semibold py-1 px-3 rounded text-xs sm:text-sm transition-colors duration-200 ${selectedLane === lane ? 'bg-violet-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                                {lane !== 'Todas' && <img src={LANE_ICONS[lane as Lane]} alt={lane} className="w-4 h-4" />}
                                {lane}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-4 grid grid-cols-4 sm:grid-cols-6 gap-4 overflow-y-auto">
                    {filteredHeroes.length > 0 ? (
                        filteredHeroes.map(hero => (
                            <div key={hero.id} onClick={() => onHeroSelect(hero.id)} className="flex flex-col items-center text-center cursor-pointer group">
                                <img 
                                    loading="lazy"
                                    src={hero.imageUrl} 
                                    alt={hero.name} 
                                    className="w-16 h-16 rounded-full object-cover border-2 border-transparent group-hover:border-violet-500 group-hover:scale-110 transition-all" 
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null; 
                                        target.src='https://placehold.co/64x64/1a1c29/FFFFFF?text=?';
                                    }}
                                />
                                <span className="text-xs mt-2 font-medium">{hero.name}</span>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-400 py-8">
                            Nenhum herói encontrado com os filtros aplicados.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeroSelectionModal;