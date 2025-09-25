import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Hero, Lane, LANES } from '../types';
import { LANE_ICONS } from '../constants';
import HeroDetailModal from './HeroDetailModal';

interface HeroDatabaseScreenProps {
    heroes: Record<string, Hero>;
    heroLanes: Record<number, Lane[]>;
}

const HeroDatabaseScreen: React.FC<HeroDatabaseScreenProps> = ({ heroes, heroLanes }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLane, setSelectedLane] = useState<Lane | 'Todas'>('Todas');
    const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);
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
    
    const handleHeroClick = (heroId: string) => {
        setSelectedHeroId(heroId);
    };

    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (!isTouchDevice) {
            searchInputRef.current?.focus();
        }
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto animated-entry">
            <div className="sticky top-2 z-20 bg-opacity-50 backdrop-filter backdrop-blur-md -mx-2 p-2 rounded-lg">
                <div className="glassmorphism p-4 rounded-xl border-2 panel-glow-primary">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
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
                         <div className="flex flex-wrap justify-center items-center gap-2">
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
                </div>
            </div>

            <div className="mt-6 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-4">
                 {filteredHeroes.length > 0 ? (
                    filteredHeroes.map((hero, index) => (
                        <div 
                            key={hero.id} 
                            onClick={() => handleHeroClick(hero.id)} 
                            className="flex flex-col items-center text-center cursor-pointer group animated-entry"
                            style={{ animationDelay: `${Math.min(index * 20, 500)}ms` }}
                        >
                            <img 
                                loading="lazy"
                                src={hero.imageUrl} 
                                alt={hero.name} 
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-slate-700 group-hover:border-violet-500 group-hover:scale-110 transition-all" 
                            />
                            <span className="text-xs sm:text-sm mt-2 font-medium">{hero.name}</span>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-400 py-16">
                        Nenhum herói encontrado com os filtros aplicados.
                    </div>
                )}
            </div>
            
            {selectedHeroId && (
                <HeroDetailModal 
                    heroId={selectedHeroId} 
                    heroes={heroes} 
                    onClose={() => setSelectedHeroId(null)} 
                />
            )}
        </div>
    );
};

export default HeroDatabaseScreen;