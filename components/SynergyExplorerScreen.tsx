import React, { useRef, useEffect, useState } from 'react';
import { BanSuggestion, Hero, HeroStrategyAnalysis, RankCategory, HeroSuggestion, HeroRelation, HeroRankInfo } from '../types';
import CollapsibleTutorial from './CollapsibleTutorial';
import HeroSlot from './HeroSlot';
import SynergyPanel from './SynergyPanel';
import HeroStrategyPanel from './HeroStrategyPanel';
import BanSuggestions from './BanSuggestions';
import { RATING_STYLES } from '../constants';
import { fetchHeroRankings } from '../services/heroService';

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
    strategyAnalysis: HeroStrategyAnalysis | null;
    strategyAnalysisError: string | null;
    synergyRelations: HeroRelation | null;
    synergyError: string | null;
    perfectCounter: HeroSuggestion | null;
    perfectCounterError: string | null;
}


const PerfectCounterCard: React.FC<{ heroName: string, suggestion: HeroSuggestion | null, isLoading: boolean, error: string | null }> = ({ heroName, suggestion, isLoading, error }) => {
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center p-8 h-full">
                    <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-red-400"></div>
                    <p className="mt-3 text-sm text-gray-300">Analisando o counter perfeito...</p>
                </div>
            );
        }
        if (error) {
            return <p className="text-center text-sm text-yellow-400 p-4">{error}</p>;
        }
        if (!suggestion) {
             return (
                <div className="text-center p-8 text-gray-400 flex flex-col items-center justify-center h-full">
                    <p className="font-semibold">Counter Perfeito</p>
                    <p className="text-xs text-gray-500 mt-1">A análise da IA revelará o melhor herói para counterar {heroName || 'seu herói'}.</p>
                </div>
            );
        }

        const styles = RATING_STYLES[suggestion.classificacao] || { text: 'text-gray-300', border: 'border-gray-400' };

        return (
            <div className={`p-4 bg-black bg-opacity-30 rounded-2xl animated-entry h-full flex flex-col`}>
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-3 text-center sm:text-left">
                    <img src={suggestion.imageUrl} alt={suggestion.nome} className={`w-28 h-28 rounded-full border-4 ${styles.border} flex-shrink-0 shadow-lg`} style={{boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)'}}/>
                    <div className="flex-grow">
                        <p className="font-black text-3xl">{suggestion.nome}</p>
                        <div>
                            <span className={`font-bold text-lg ${styles.text}`}>{suggestion.classificacao}</span>
                            <span className="text-xs text-gray-400 font-mono ml-2">{suggestion.estatistica}</span>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-gray-300 p-3 bg-black/20 rounded-lg flex-grow">{suggestion.motivo}</p>
            </div>
        );
    };

    return (
        <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-red h-full">
            <h2 className="text-xl font-black text-center mb-2 tracking-wider text-red-300">COUNTER PERFEITO (vs. {heroName})</h2>
            {renderContent()}
        </div>
    );
};

const StatBar: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => {
    const percentage = Math.min(value * 100, 100);
    return (
        <div>
            <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-semibold text-slate-300">{label}</span>
                <span className="font-bold" style={{ color }}>{percentage.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-2.5">
                <div className="h-2.5 rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
            </div>
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
    perfectCounter,
    perfectCounterError
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
                const rankingsData = await fetchHeroRankings(7, 'glory', 'win_rate');
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
    
    return (
        <div className="w-full max-w-7xl mx-auto animated-entry flex flex-col gap-8">
            <CollapsibleTutorial title="Como Usar a Análise de Herói">
                 <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-gray-300">
                    <li>Clique abaixo para <strong className="text-violet-300">selecionar um herói</strong> para uma análise aprofundada.</li>
                    <li>Após selecionar, veja um resumo do meta do herói e clique em <strong className="text-violet-500">"Analisar Herói"</strong>.</li>
                    <li>A IA irá gerar a build, táticas, sinergias e o counter perfeito para seu personagem.</li>
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
                                <div className="flex justify-center items-center h-full min-h-[10rem]">
                                    <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-violet-400"></div>
                                </div>
                            ) : selectedHeroStats ? (
                                <div className="animated-entry">
                                    <h3 className="text-md font-bold text-center mb-2 text-amber-300">VISÃO RÁPIDA DO META</h3>
                                    <div className="space-y-2 bg-black/20 p-3 rounded-lg">
                                        <StatBar label="Taxa de Vitória" value={selectedHeroStats.winRate} color="#4ade80" />
                                        <StatBar label="Taxa de Escolha" value={selectedHeroStats.pickRate} color="#60a5fa" />
                                        <StatBar label="Taxa de Ban" value={selectedHeroStats.banRate} color="#f87171" />
                                    </div>
                                    <p className="text-center text-[10px] text-slate-500 mt-1">Elo: Glória+ (7 dias)</p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-500 text-sm min-h-[10rem]">
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
                    
                    <div ref={analysisSectionRef} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3 flex flex-col gap-6">
                            <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-primary flex flex-col">
                                <h2 className="text-xl font-black text-center mb-3 tracking-wider text-amber-300">Análise Estratégica da IA</h2>
                                <HeroStrategyPanel
                                    selectedHero={selectedHero}
                                    analysis={strategyAnalysis}
                                    isLoading={isAnalysisLoading}
                                    error={strategyAnalysisError}
                                />
                            </div>
                            <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-primary flex flex-col">
                                <h2 className="text-xl font-black text-center mb-3 tracking-wider text-amber-300">Sinergias de Batalha</h2>
                                <SynergyPanel
                                    isLoading={isAnalysisLoading}
                                    error={synergyError}
                                    relations={synergyRelations}
                                    heroApiIdMap={heroApiIdMap}
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                            <PerfectCounterCard 
                                heroName={selectedHero?.name || ''}
                                suggestion={perfectCounter}
                                isLoading={isAnalysisLoading}
                                error={perfectCounterError}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SynergyExplorerScreen;
