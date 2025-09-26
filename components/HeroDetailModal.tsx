import React, { useState, useEffect } from 'react';
import { Hero, HeroDetails, HeroSkill, SkillCombo } from '../types';
import { HERO_TRANSLATIONS } from '../components/data/heroTranslations';

interface HeroDetailModalProps {
    heroId: string | null;
    heroes: Record<string, Hero>;
    onClose: () => void;
}

const HeroDetailModal: React.FC<HeroDetailModalProps> = ({ heroId, heroes, onClose }) => {
    const [details, setDetails] = useState<HeroDetails | null>(null);
    const [error, setError] = useState<string | null>(null);

    const hero = heroId ? heroes[heroId] : null;

    useEffect(() => {
        if (heroId) {
            // Prevent background scrolling when modal is open
            document.body.style.overflow = 'hidden';
        }
        // Cleanup function to restore scrolling when modal closes or component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [heroId]);

    useEffect(() => {
        if (hero) {
            setError(null);
            const heroData = HERO_TRANSLATIONS[hero.name];
            if (heroData) {
                setDetails(heroData);
            } else {
                setDetails(null);
                setError(`Detalhes para ${hero.name} não foram encontrados.`);
            }
        } else {
            setDetails(null);
        }
    }, [hero, heroId]);

    const renderSkill = (skill: HeroSkill, index: number, totalSkills: number) => {
        let label = '';
        if (index === 0) {
            label = 'Passiva';
        } else if (index === totalSkills - 1) {
            label = 'Ultimate';
        } else {
            label = `Habilidade ${index}`;
        }

        return (
            <div key={skill.skillname} className="p-3 bg-black bg-opacity-20 rounded-xl">
                <p className="font-bold text-violet-300">{label}: <span className="text-white">{skill.skillname}</span></p>
                <p className="text-sm text-gray-300 mt-1">{skill.skilldesc}</p>
            </div>
        );
    };
    
    const renderCombo = (combo: SkillCombo) => (
        <div key={combo.title} className="p-3 bg-black bg-opacity-20 rounded-xl">
            <p className="font-bold text-amber-300">{combo.title}</p>
            <p className="text-sm text-gray-300 mt-1">{combo.desc}</p>
        </div>
    );

    if (!hero) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div 
                className="glassmorphism rounded-2xl shadow-xl max-w-4xl w-full flex flex-col border border-violet-500 modal-animation max-h-[85vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <img src={hero.imageUrl} alt={hero.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-violet-400" />
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-amber-300">{hero.name}</h2>
                            <p className="text-sm text-gray-400">{hero.roles.join(' / ')}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-3xl text-gray-400 hover:text-white flex-shrink-0">&times;</button>
                </div>

                <div className="p-4 overflow-y-auto space-y-4 invisible-scrollbar">
                    {error && (
                        <div className="text-center text-red-400 p-4">
                            <p className="font-semibold">Erro</p>
                            <p className="text-xs mt-1">{error}</p>
                        </div>
                    )}
                    {details ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold mb-2">Resumo</h3>
                                <p className="text-sm text-gray-300 bg-black bg-opacity-20 p-3 rounded-xl">{details.summary}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-2">Habilidades</h3>
                                <div className="space-y-2">
                                    {details.skills.map((skill, index) => renderSkill(skill, index, details.skills.length))}
                                </div>
                            </div>
                            {details.combos && details.combos.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold mb-2">Combos Táticos</h3>
                                    <div className="space-y-2">
                                        {details.combos.map(renderCombo)}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : !error && (
                         <div className="flex flex-col items-center justify-center h-full py-16">
                            <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-violet-400"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeroDetailModal;