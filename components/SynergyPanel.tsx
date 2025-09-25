import React, { useState, useEffect } from 'react';
import { Hero } from '../types';
import { fetchHeroRelations, HeroRelation } from '../services/heroService';

interface SynergyPanelProps {
    selectedHeroId: string | null;
    heroes: Record<string, Hero>;
    heroApiIdMap: Record<number, Hero>;
}

const HeroListItem: React.FC<{ hero: Hero | undefined }> = ({ hero }) => {
    if (!hero) return null;
    return (
        <div className="flex flex-col items-center text-center">
            <img
                src={hero.imageUrl}
                alt={hero.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-600 group-hover:border-violet-500 transition-colors"
            />
            <span className="text-xs mt-1 font-medium">{hero.name}</span>
        </div>
    );
};

const SynergySection: React.FC<{ title: string; colorClass: string; heroIds: number[]; heroApiIdMap: Record<number, Hero> }> = ({ title, colorClass, heroIds, heroApiIdMap }) => {
    if (heroIds.length === 0) return null;

    return (
        <div>
            <h3 className={`text-sm uppercase font-bold mb-3 ${colorClass}`}>{title}</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {heroIds.map(id => <HeroListItem key={id} hero={heroApiIdMap[id]} />)}
            </div>
        </div>
    );
};

const SynergyPanel: React.FC<SynergyPanelProps> = ({ selectedHeroId, heroes, heroApiIdMap }) => {
    const [relations, setRelations] = useState<HeroRelation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedHeroId) {
            setRelations(null);
            setError(null);
            return;
        }

        const fetchRelationsData = async () => {
            const hero = heroes[selectedHeroId];
            if (!hero?.apiId) return;

            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchHeroRelations(hero.apiId);
                if (data) {
                    setRelations(data);
                } else {
                    setError(`Não foram encontradas sinergias para ${hero.name}.`);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Falha ao carregar os dados.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRelationsData();
    }, [selectedHeroId, heroes, heroApiIdMap]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-violet-400"></div>
                    <p className="mt-3 text-sm text-gray-300">CARREGANDO SINERGIAS</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center text-yellow-400 p-4">
                    <p className="font-semibold">Aviso</p>
                    <p className="text-xs mt-1">{error}</p>
                </div>
            );
        }
        
        if (!selectedHeroId) {
            return (
                 <div className="text-center p-8 text-gray-400 flex flex-col items-center justify-center h-full">
                    <svg className="w-12 h-12 mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.596a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                    <p className="font-semibold">Sinergias e Counters</p>
                    <p className="text-xs text-gray-500 mt-1">Selecione o seu herói para ver as suas relações.</p>
                </div>
            );
        }

        if (!relations || (relations.assist.target_hero_id.length === 0 && relations.strong.target_hero_id.length === 0 && relations.weak.target_hero_id.length === 0)) {
            return (
                 <div className="text-center p-8 text-gray-400 flex flex-col items-center justify-center h-full">
                    <p className="font-semibold">Dados não disponíveis</p>
                    <p className="text-xs text-gray-500 mt-1">Não foi encontrada informação de sinergias para este herói.</p>
                </div>
            );
        }

        return (
            <div className="p-4 space-y-6 animated-entry">
                <SynergySection title="Bons Aliados" colorClass="text-blue-300" heroIds={relations.assist.target_hero_id} heroApiIdMap={heroApiIdMap} />
                <SynergySection title="Forte Contra" colorClass="text-green-300" heroIds={relations.strong.target_hero_id} heroApiIdMap={heroApiIdMap} />
                <SynergySection title="Fraco Contra" colorClass="text-red-300" heroIds={relations.weak.target_hero_id} heroApiIdMap={heroApiIdMap} />
            </div>
        );
    }
    
    return (
        <div className="h-full pt-4">
            {renderContent()}
        </div>
    );
};

export default SynergyPanel;