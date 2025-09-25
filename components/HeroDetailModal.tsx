import React, { useState, useEffect } from 'react';
import { Hero } from '../types';
import { fetchHeroDetails, HeroDetails, HeroSkill, SkillCombo } from '../services/heroService';

interface HeroDetailModalProps {
    heroId: string | null;
    heroes: Record<string, Hero>;
    onClose: () => void;
}

const HeroDetailModal: React.FC<HeroDetailModalProps> = ({ heroId, heroes, onClose }) => {
    const [details, setDetails] = useState<HeroDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hero = heroId ? heroes[heroId] : null;

    useEffect(() => {
        if (!hero || !hero.apiId) {
            setDetails(null);
            return;
        }

        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchHeroDetails(hero.apiId);
                setDetails(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Não foi possível carregar os detalhes do herói.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [hero]);

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
            <div key={skill.skillname} className="p-3 bg-black bg-opacity-20 rounded-lg">
                <p className="font-bold text-violet-300">{label}: <span className="text-white">{skill.skillname}</span></p>
                <p className="text-sm text-gray-300 mt-1">{skill.skilldesc}</p>
            </div>
        );
    };
    
    const renderCombo = (combo: SkillCombo) => (
        <div key={combo.title} className="p-3 bg-black bg-opacity-20 rounded-lg">
            <p className="font-bold text-amber-300">{combo.title}</p>
            <p className="text-sm text-gray-300 mt-1">{combo.desc}</p>
        </div>
    );

    if (!hero) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="glassmorphism rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-violet-500 modal-animation">
                {/* Header */}
                <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <img src={hero.imageUrl} alt={hero.name} className="w-16 h-16 rounded-full border-2 border-violet-400" />
                        <div>
                            <h2 className="text-2xl font-bold text-amber-300">{hero.name}</h2>
                            <p className="text-sm text-gray-400">{hero.roles.join(' / ')}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-3xl text-gray-400 hover:text-white">&times;</button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto space-y-4">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full py-16">
                            <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-violet-400"></div>
                            <p className="mt-3 text-sm text-gray-300">A carregar detalhes...</p>
                        </div>
                    )}
                    {error && (
                        <div className="text-center text-red-400 p-4">
                            <p className="font-semibold">Erro</p>
                            <p className="text-xs mt-1">{error}</p>
                        </div>
                    )}
                    {details && (
                        <div className="space-y-6 animated-entry">
                            <div>
                                <h3 className="text-lg font-bold mb-2">Resumo</h3>
                                <p className="text-sm text-gray-300 bg-black bg-opacity-20 p-3 rounded-lg">{details.summary}</p>
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeroDetailModal;