import React, { useRef, useEffect, useState } from 'react';
// FIX: Corrected import from 'HeroStrategyAnalysis' to 'HeroStrategicAnalysis' to match the exported type.
import { BanSuggestion, Hero, HeroStrategicAnalysis, RankCategory, HeroSuggestion, HeroRelation } from '../types';
import CollapsibleTutorial from './CollapsibleTutorial';
import HeroSlot from './HeroSlot';
import SynergyPanel from './SynergyPanel';
import HeroStrategyPanel from './HeroStrategyPanel';
import BanSuggestions from './BanSuggestions';
import { fetchHeroRankings, ApiHeroRankData } from '../services/heroService';
import { HeroRankInfo } from '../types';

interface SynergyExplorerScreenProps {
    selectedHeroId: string | null;
    heroes: Record<string, Hero>;
    heroApiIdMap: Record<number, Hero>;
    onHeroSelectClick: () => void;
    onClearHero: () => void;
    counterBanSuggestions: BanSuggestion[];
    metaBanSuggestions: BanSuggestion[];
    isMetaBansLoading: boolean;
    activeMetaRank: RankCategory | null;
    onMetaRankChange: (rank: RankCategory) => void;
    onAnalyze: () => void;
    isAnalysisLoading: boolean;
    strategyAnalysis: HeroStrategicAnalysis | null;
    strategyAnalysisError: string | null;
    synergyRelations: HeroRelation | null;
    synergyError: string | null;
}

const StatCard: React.FC<{ label: string, value: number, classification: { label: string, color: string } }> = ({ label, value, classification }) => {
    return (
        <div className="flex flex-col items-center justify-center bg-black/30 p-2 rounded-lg text-center h-full">
            <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold text-white my-1">{(value * 100).toFixed(2)}%</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${classification.color}`}>
                {classification.label}
            </span>
        </div>
    );
};

const SynergyExplorerScreen: React.FC<SynergyExplorerScreenProps> = ({ 
    selectedHeroId, 
    heroes, 
    heroApiIdMap, 
    onHeroSelectClick,
    onClearHero,
    counterBanSuggestions,
    metaBanSuggestions,
    isMetaBansLoading,
    activeMetaRank,
    onMetaRankChange,
    onAnalyze,
    isAnalysisLoading,
    strategyAnalysis,
    strategyAnalysisError,
    synergyRelations,
    synergyError,
}) => {
    const selectedHero = selectedHeroId ? heroes[selectedHeroId] : null;
    const analysisSectionRef = useRef<HTMLDivElement>(null);
    const [selectedHeroStats, setSelectedHeroStats] = useState<HeroRankInfo | null>(null);
    const [isStatsLoading, setIsStatsLoading] = useState(false);

    useEffect(() => {
        if (!selectedHeroId || !heroApiIdMap || Object.keys(heroApiIdMap).length === 0) {
            setSelectedHeroStats(null);
            return;
        }

        const fetchStats = async () => {
            setIsStatsLoading(true);
            setSelectedHeroStats(null);
            const hero = heroes[selectedHeroId];
            if (!hero || !hero.apiId) {
                setIsStatsLoading(false);
                return;
            };

            try {
                // Fetch a larger list to increase the chance of finding the hero
                const rankingsData: ApiHeroRankData[] = await fetchHeroRankings(7, 'glory', 'win_rate');
                const heroStatsData = rankingsData.find(data => data.main_heroid === hero.apiId);
                
                if (heroStatsData) {
                    const mappedStat: HeroRankInfo = {
                        hero: hero,
                        winRate: heroStatsData.main_hero_win_rate,
                        pickRate: heroStatsData.main_hero_appearance_rate,
                        banRate: heroStatsData.main_hero_ban_rate
                    };
                    setSelectedHeroStats(mappedStat);
                } else {
                     // Set stats to 0 if not found, to avoid empty state
                    setSelectedHeroStats({ hero, winRate: 0, pickRate: 0, banRate: 0 }); 
                }
            } catch (error) {
                console.error("Failed to fetch hero stats for quick view:", error);
                setSelectedHeroStats(null);
            } finally {
                setIsStatsLoading(false);
            }
        };

        fetchStats();
    }, [selectedHeroId, heroApiIdMap, heroes]);


    useEffect(() => {
        if (isAnalysisLoading) {
            setTimeout(() => {
                analysisSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [isAnalysisLoading]);
    
    // FIX: Derive tactical counters from the main strategyAnalysis object.
    const tacticalCounters = strategyAnalysis?.tacticalCounters ?? [];

    const classifyWinRate = (rate: number) => {
        if (rate > 0.54) return { label: 'EXCELENTE', color: 'bg-green-500/30 text-green-300' };
        if (rate > 0.51) return { label: 'ALTA', color: 'bg-teal-500/30 text-teal-300' };
        if (rate > 0.49) return { label: 'MÉDIA', color: 'bg-yellow-500/30 text-yellow-300' };
        if (rate > 0) return { label: 'BAIXA', color: 'bg-red-500/30 text-red-300' };
        return { label: 'N/A', color: 'bg-gray-500/30 text-gray-300' };
    };

    const classifyPickRate = (rate: number) => {
        if (rate > 0.03) return { label: 'ONIPRESENTE', color: 'bg-sky-400/30 text-sky-300' };
        if (rate > 0.015) return { label: 'POPULAR', color: 'bg-blue-400/30 text-blue-300' };
        if (rate > 0.005) return { label: 'SITUACIONAL', color: 'bg-indigo-400/30 text-indigo-300' };
        if (rate > 0) return { label: 'NICHO', color: 'bg-gray-400/30 text-gray-300' };
        return { label: 'N/A', color: 'bg-gray-500/30 text-gray-300' };
    };

    const classifyBanRate = (rate: number) => {
        if (rate > 0.6) return { label: 'BAN PERMANENTE', color: 'bg-red-600/40 text-red-300' };
        if (rate > 0.3) return { label: 'MUITO ALTA', color: 'bg-red-500/30 text-red-400' };
        if (rate > 0.1) return { label: 'RESPEITADO', color: 'bg-orange-500/30 text-orange-300' };
        if (rate > 0) return { label: 'OCASIONAL', color: 'bg-yellow-500/30 text-yellow-400' };
        return { label: 'IGNORADO', color: 'bg-gray-500/30 text-gray-300' };
    };

    return (
        <div className="w-full max-w-7xl mx-auto animated-entry flex flex-col gap-8">
            <CollapsibleTutorial title="Como Usar a Análise de Herói">
                 <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-gray-300">
                    <li>Clique abaixo para <strong className="text-violet-300">selecionar um herói</strong> para uma análise aprofundada.</li>
                    <li>Após selecionar, veja um resumo do meta do herói e clique em <strong className="text-violet-500">"Analisar Herói"</strong>.</li>
                    <li>A IA irá gerar a build, táticas, sinergias e os counters perfeitos para cada lane contra seu personagem.</li>
                </ol>
            </CollapsibleTutorial>

             <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-purple">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="flex items-center gap-4 justify-center md:justify-start">
                        <HeroSlot type="synergy" heroId={selectedHeroId} heroes={heroes} onClick={onHeroSelectClick} onClear={onClearHero} label="Selecionar"/>
                        {selectedHero && (
                            <div className="text-left">
                                <h2 className="text-2xl font-bold text-white">{selectedHero.name}</h2>
                                <p className="text-sm text-slate-400">{selectedHero.roles.join(' / ')}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex-grow">
                        {selectedHeroId && (
                            isStatsLoading ? (
                                <div className="flex justify-center items-center h-full min-h-[6rem]">
                                    <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-violet-400"></div>
                                </div>
                            ) : selectedHeroStats ? (
                                <div className="animated-entry">
                                    <h3 className="text-md font-bold text-center mb-2 text-amber-300">VISÃO RÁPIDA DO META</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        <StatCard label="Vitória" value={selectedHeroStats.winRate} classification={classifyWinRate(selectedHeroStats.winRate)} />
                                        <StatCard label="Escolha" value={selectedHeroStats.pickRate} classification={classifyPickRate(selectedHeroStats.pickRate)} />
                                        <StatCard label="Ban" value={selectedHeroStats.banRate} classification={classifyBanRate(selectedHeroStats.banRate)} />
                                    </div>
                                    <p className="text-center text-[10px] text-slate-500 mt-1">Elo: Glória+ (7 dias)</p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-500 text-sm min-h-[6rem]">
                                    Estatísticas do meta não encontradas.
                                </div>
                            )
                        )}
                    </div>

                    <div className="flex justify-center md:justify-end">
                        <button
                            onClick={onAnalyze}
                            disabled={!selectedHeroId || isAnalysisLoading}
                            className="w-full md:w-auto bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-3 px-6 rounded-xl text-lg hover:from-violet-400 hover:to-fuchsia-400 transition-all duration-300 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-violet-500/40 disabled:shadow-none transform hover:scale-105"
                        >
                            {isAnalysisLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <circle className="opacity-25" cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 10a6 6 0 016-6v2a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                    Analisando...
                                </>
                             ) : 'Analisar Herói'}
                        </button>
                    </div>
                </div>
            </div>
            
            {(selectedHeroId || isAnalysisLoading) && (
                 <>
                    <BanSuggestions
                        counterSuggestions={counterBanSuggestions}
                        metaSuggestions={metaBanSuggestions}
                        isLoading={isMetaBansLoading}
                        variant="1v1"
                        activeMetaRank={activeMetaRank}
                        onMetaRankChange={onMetaRankChange}
                    />
                    
                    <div ref={analysisSectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-primary flex flex-col">
                            <h2 className="text-xl font-black text-center mb-3 tracking-wider text-amber-300">Análise Estratégica da IA</h2>
                            <HeroStrategyPanel
                                selectedHero={selectedHero}
                                analysis={strategyAnalysis?.strategy ?? null}
                                isLoading={isAnalysisLoading}
                                error={strategyAnalysisError}
                            />
                        </div>
                        <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-primary flex flex-col">
                            <h2 className="text-xl font-black text-center mb-3 tracking-wider text-amber-300">Sinergias de Batalha</h2>
                            <SynergyPanel
                                isLoading={isAnalysisLoading || isStatsLoading}
                                error={synergyError || strategyAnalysisError}
                                relations={synergyRelations}
                                heroApiIdMap={heroApiIdMap}
                                tacticalCounters={tacticalCounters}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SynergyExplorerScreen;