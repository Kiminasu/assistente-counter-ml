import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Hero } from '../types';

interface HeroSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onHeroSelect: (heroId: string) => void;
    heroes: Record<string, Hero>;
}

const HeroSelectionModal: React.FC<HeroSelectionModalProps> = ({ isOpen, onClose, onHeroSelect, heroes }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    const filteredHeroes = useMemo(() => {
        // FIX: Cast Object.values(heroes) to Hero[] to ensure correct type inference for filter and sort, as explicit parameter typing is insufficient if Object.values returns unknown[].
        return (Object.values(heroes) as Hero[])
            .filter(hero => hero.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [heroes, searchTerm]);

    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="glassmorphism rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col border border-purple-500 modal-animation">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <div className="relative w-full mr-4">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Procurar herói..."
                            className="w-full p-2 pl-8 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="w-4 h-4 absolute left-2.5 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <button onClick={onClose} className="text-2xl text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="p-4 grid grid-cols-4 sm:grid-cols-6 gap-4 overflow-y-auto">
                    {filteredHeroes.map(hero => (
                        <div key={hero.id} onClick={() => onHeroSelect(hero.id)} className="flex flex-col items-center text-center cursor-pointer group">
                            <img 
                                src={hero.imageUrl} 
                                alt={hero.name} 
                                className="w-16 h-16 rounded-full object-cover border-2 border-transparent group-hover:border-purple-500 group-hover:scale-110 transition-all" 
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null; 
                                    target.src='https://placehold.co/64x64/1a1c29/FFFFFF?text=?';
                                }}
                            />
                            <span className="text-xs mt-2 font-medium">{hero.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroSelectionModal;