import React, { useState, useEffect, useMemo } from 'react';
import { Hero, HeroDetails, SynergyAnalysisPayload } from '../types';
import { fetchHeroRelations, HeroRelation, fetchHeroDetails } from '../services/heroService';
import { getSynergyAnalysis } from '../services/geminiService';
import { MANUAL_SYNERGY_DATA } from './data/synergyData';
import CollapsibleTutorial from './CollapsibleTutorial';

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
                loading="lazy"
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
            <h3 className={`text-sm uppercase font-bold mb-3 text-center ${colorClass}`}>{title}</h3>
            <div className="flex flex-wrap justify-center gap-3">
                {heroIds.map(id => <HeroListItem key={id} hero={heroApiIdMap[id]} />)}
            </div>
        </div>
    );
};

const SynergyPanel: React.FC<SynergyPanelProps> = ({ selectedHeroId, heroes, heroApiIdMap }) => {
    const [relations, setRelations] = useState<HeroRelation | null>(null);
    const [isLoadingRelations, setIsLoadingRelations] = useState(false);
    const [relationsError, setRelationsError] = useState<string | null>(null);

    const [analysis, setAnalysis] = useState<SynergyAnalysisPayload | null>(null);
    const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const [supplementedRelations, setSupplementedRelations] = useState<{ assist: number[], strong: number[], weak: number[] } | null>(null);

    const heroNameMap = useMemo(() => {
        return Object.values(heroes).reduce((acc, hero: Hero) => {
            acc[hero.name] = hero.apiId;
            return acc;
        }, {} as Record<string, number>);
    }, [heroes]);

    useEffect(() => {
        if (!selectedHeroId) {
            setRelations(null);
            setAnalysis(null);
            setRelationsError(null);
            setAnalysisError(null);
            setSupplementedRelations(null);
            return;
        }

        const fetchRelationsData = async () => {
            const hero = heroes[selectedHeroId];
            if (!hero?.apiId) return;

            setIsLoadingRelations(true);
            setRelationsError(null);
            setAnalysis(null);
            try {
                const data = await fetchHeroRelations(hero.apiId);
                setRelations(data);

                // Supplementation logic
                let assistIds = [...(data?.assist?.target_hero_id || [])];
                let strongIds = [...(data?.strong?.target_hero_id || [])];
                const weakIds = [...(data?.weak?.target_hero_id || [])];

                if (MANUAL_SYNERGY_DATA[hero.name]) {
                    const manualData = MANUAL_SYNERGY_DATA[hero.name];
                    if (assistIds.length < 2) {
                        const needed = 2 - assistIds.length;
                        const candidates = manualData.allies.map(name => heroNameMap[name]).filter(id => id && !assistIds.includes(id));
                        assistIds.push(...candidates.slice(0, needed));
                    }
                    if (strongIds.length < 4) {
                        const needed = 4 - strongIds.length;
                        const candidates = manualData.strongAgainst.map(name => heroNameMap[name]).filter(id => id && !strongIds.includes(id));
                        strongIds.push(...candidates.slice(0, needed));
                    }
                }
                setSupplementedRelations({ assist: [...new Set(assistIds)], strong: [...new Set(strongIds)], weak: weakIds });

            } catch (err) {
                setRelationsError(err instanceof Error ? err.message : "Falha ao carregar os dados.");
            } finally {
                setIsLoadingRelations(false);
            }
        };

        fetchRelationsData();
    }, [selectedHeroId, heroes, heroApiIdMap, heroNameMap]);

    useEffect(() => {
        if (!supplementedRelations || !selectedHeroId) return;

        const runAnalysis = async () => {
            setIsAnalysisLoading(true);
            setAnalysisError(null);
            try {
                const hero = heroes[selectedHeroId];
                if (!hero?.apiId) return;

                const selectedHeroDetails = await fetchHeroDetails(hero.apiId);

                const alliesDetails = (await Promise.all(
                    supplementedRelations.assist.map(id => heroApiIdMap[id]).filter(Boolean).map(h => fetchHeroDetails(h.apiId))
                )).filter((d): d is HeroDetails => !!d);

                const strongAgainstDetails = (await Promise.all(
                    supplementedRelations.strong.map(id => heroApiIdMap[id]).filter(Boolean).map(h => fetchHeroDetails(h.apiId))
                )).filter((d): d is HeroDetails => !!d);
                
                const result = await getSynergyAnalysis(selectedHeroDetails, alliesDetails, strongAgainstDetails);
                setAnalysis(result);

            } catch (err) {
                setAnalysisError(err instanceof Error ? err.message : "Falha ao gerar análise da IA.");
            } finally {
                setIsAnalysisLoading(false);
            }
        };
        
        runAnalysis();

    }, [supplementedRelations, selectedHeroId, heroes, heroApiIdMap]);

    const renderContent = () => {
        const isLoading = isLoadingRelations || isAnalysisLoading;
        const error = relationsError || analysisError;
        
        if (!selectedHeroId) {
             return (
                 <div className="text-center p-8 text-gray-400 flex flex-col items-center justify-center h-full">
                    <svg className="w-12 h-12 mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.596a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                    <p className="font-semibold">Sinergias e Counters</p>
                    <p className="text-xs text-gray-500 mt-1">Selecione o seu herói para ver a análise completa.</p>
                </div>
            );
        }

        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-violet-400"></div>
                    <p className="mt-3 text-sm text-gray-300">CARREGANDO ANÁLISE...</p>
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

        const hasRelations = supplementedRelations && (supplementedRelations.assist.length > 0 || supplementedRelations.strong.length > 0 || supplementedRelations.weak.length > 0);

        return (
            <div className="p-1 space-y-6 animated-entry overflow-y-auto max-h-[70vh] pr-2">
                 <div className="mb-4">
                    <CollapsibleTutorial title="Entendendo as Sinergias">
                        <ul className="list-disc list-inside space-y-2 text-xs text-gray-300">
                             <li><strong className="text-blue-300">Bons Aliados:</strong> Heróis que têm ótima sinergia de habilidades com o seu.</li>
                            <li><strong className="text-green-300">Forte Contra:</strong> Heróis que o seu personagem countera com eficácia.</li>
                            <li><strong className="text-red-300">Fraco Contra:</strong> Heróis que são fortes contra o seu e devem ser evitados.</li>
                            <li><strong className="text-amber-300">Análise da IA:</strong> Estratégias profissionais sobre o estilo de jogo, combos e como counterar os oponentes.</li>
                        </ul>
                    </CollapsibleTutorial>
                </div>
                
                {hasRelations && supplementedRelations && (
                    <div className="space-y-6">
                        <SynergySection title="Bons Aliados" colorClass="text-blue-300" heroIds={supplementedRelations.assist} heroApiIdMap={heroApiIdMap} />
                        <SynergySection title="Forte Contra" colorClass="text-green-300" heroIds={supplementedRelations.strong} heroApiIdMap={heroApiIdMap} />
                        <SynergySection title="Fraco Contra" colorClass="text-red-300" heroIds={supplementedRelations.weak} heroApiIdMap={heroApiIdMap} />
                    </div>
                )}

                {analysis && (
                    <div className="space-y-4 pt-6 border-t border-slate-700">
                         <h3 className="text-lg font-bold text-center text-amber-300 -mb-2">Análise Tática da IA</h3>
                        <div>
                            <h4 className="text-sm uppercase font-bold text-gray-400 mb-2">Perfil e Estatísticas</h4>
                            <p className="text-sm text-gray-200 leading-relaxed p-3 bg-black bg-opacity-20 rounded-xl">{analysis.statisticsAnalysis}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm uppercase font-bold text-green-300 mb-2">Pontos Fortes</h4>
                                <ul className="list-disc list-inside text-sm text-gray-200 space-y-1 p-3 bg-black bg-opacity-20 rounded-xl">
                                    {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm uppercase font-bold text-red-300 mb-2">Pontos Fracos</h4>
                                <ul className="list-disc list-inside text-sm text-gray-200 space-y-1 p-3 bg-black bg-opacity-20 rounded-xl">
                                    {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm uppercase font-bold text-amber-400 mb-2">Sinergias Chave</h4>
                            <div className="space-y-2">
                            {analysis.keySynergies.map(synergy => (
                                <div key={synergy.heroName} className="p-3 bg-black bg-opacity-20 rounded-xl">
                                    <p className="font-bold text-amber-300">{heroes[selectedHeroId]?.name} + {synergy.heroName}</p>
                                    <p className="text-xs text-gray-300 mt-1">{synergy.reason}</p>
                                </div>
                            ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm uppercase font-bold text-gray-400 mb-2">Estratégia de Counter</h4>
                            <p className="text-sm text-gray-200 leading-relaxed p-3 bg-black bg-opacity-20 rounded-xl">{analysis.counterStrategy}</p>
                        </div>
                    </div>
                )}
                
                {!hasRelations && !isLoading && (
                     <div className="text-center p-8 text-gray-400 flex flex-col items-center justify-center h-full">
                        <p className="font-semibold">Dados não disponíveis</p>
                        <p className="text-xs text-gray-500 mt-1">Não foi encontrada informação de sinergias para este herói.</p>
                    </div>
                )}
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