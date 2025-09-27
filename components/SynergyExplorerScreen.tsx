import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BanSuggestion, Hero, HeroStrategyAnalysis, HeroRankInfo, RankCategory, HeroDetails, HeroRelation, SynergyAnalysisPayload } from '../types';
import CollapsibleTutorial from './CollapsibleTutorial';
import HeroSlot from './HeroSlot';
import SynergyPanel from './SynergyPanel';
import HeroStrategyPanel from './HeroStrategyPanel';
import BanSuggestions from './BanSuggestions';
import { getHeroStrategyAnalysis, getSynergyAnalysis } from '../services/geminiService';
import { fetchHeroDetails, fetchHeroRankings, fetchHeroRelations } from '../services/heroService';
import { findClosestString } from '../utils';
import { GAME_ITEMS } from './data/items';
import { META_SYNERGIES, MANUAL_SYNERGY_DATA } from './data/synergyData';

interface SynergyExplorerScreenProps {
    selectedHeroId: string | null;
    heroes: Record<string, Hero>;
    heroApiIdMap: Record<number, Hero>;
    onHeroSelectClick: () => void;
    onClearHero: () => void;
    counterBanSuggestions: BanSuggestion[];
    metaBanSuggestions: BanSuggestion[];
    isBanLoading: boolean;
    activeMetaRank: RankCategory;
    onMetaRankChange: (rank: RankCategory) => void;
}

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-xl sm:text-2xl font-black text-center mb-3 tracking-wider text-amber-300">{children}</h2>
);

const SynergyExplorerScreen: React.FC<SynergyExplorerScreenProps> = ({ 
    selectedHeroId, 
    heroes, 
    heroApiIdMap, 
    onHeroSelectClick,
    onClearHero,
    counterBanSuggestions,
    metaBanSuggestions,
    isBanLoading,
    activeMetaRank,
    onMetaRankChange
}) => {
    const selectedHero = selectedHeroId ? heroes[selectedHeroId] : null;
    const analysisSectionRef = useRef<HTMLDivElement>(null);

    // States for strategy analysis
    const [strategyAnalysis, setStrategyAnalysis] = useState<HeroStrategyAnalysis | null>(null);
    const [strategyAnalysisError, setStrategyAnalysisError] = useState<string | null>(null);
    
    // States for synergy analysis
    const [synergyRelations, setSynergyRelations] = useState<HeroRelation | null>(null);
    const [synergyAnalysis, setSynergyAnalysis] = useState<SynergyAnalysisPayload | null>(null);
    const [synergyError, setSynergyError] = useState<string | null>(null);

    // Combined loading state
    const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

    const [risingHeroes, setRisingHeroes] = useState<HeroRankInfo[]>([]);
    const [isRisingHeroesLoading, setIsRisingHeroesLoading] = useState(true);
    const [risingHeroesError, setRisingHeroesError] = useState<string | null>(null);

    const [popularHeroes, setPopularHeroes] = useState<HeroRankInfo[]>([]);
    const [isPopularHeroesLoading, setIsPopularHeroesLoading] = useState(true);
    const [popularHeroesError, setPopularHeroesError] = useState<string | null>(null);

    const heroNameToImageMap = useMemo(() => {
        // FIX: Explicitly type the 'hero' parameter to avoid it being inferred as 'unknown'.
        return Object.values(heroes).reduce((acc, hero: Hero) => {
            acc[hero.name] = hero.imageUrl;
            return acc;
        }, {} as Record<string, string>);
    }, [heroes]);

    useEffect(() => {
        if (Object.keys(heroes).length === 0 || Object.keys(heroApiIdMap).length === 0) return;

        const fetchMetaHeroes = async () => {
            setIsRisingHeroesLoading(true);
            setIsPopularHeroesLoading(true);
            setRisingHeroesError(null);
            setPopularHeroesError(null);
            try {
                const [winRateData, pickRateData] = await Promise.all([
                    fetchHeroRankings(7, 'glory', 'win_rate'),
                    fetchHeroRankings(7, 'glory', 'pick_rate')
                ]);

                // Processar heróis em ascensão (taxa de vitória)
                const mappedRisingHeroes: HeroRankInfo[] = winRateData
                    .map(data => {
                        const hero = heroApiIdMap[data.main_heroid];
                        if (!hero) return null;
                        return {
                            hero,
                            winRate: data.main_hero_win_rate,
                            pickRate: data.main_hero_appearance_rate,
                            banRate: data.main_hero_ban_rate
                        };
                    })
                    .filter((r): r is HeroRankInfo => r !== null)
                    .slice(0, 5);
                setRisingHeroes(mappedRisingHeroes);
                
                // Processar heróis populares (taxa de escolha)
                const mappedPopularHeroes: HeroRankInfo[] = pickRateData
                    .map(data => {
                        const hero = heroApiIdMap[data.main_heroid];
                        if (!hero) return null;
                        return {
                            hero,
                            winRate: data.main_hero_win_rate,
                            pickRate: data.main_hero_appearance_rate,
                            banRate: data.main_hero_ban_rate
                        };
                    })
                    .filter((r): r is HeroRankInfo => r !== null)
                    .slice(0, 5);
                setPopularHeroes(mappedPopularHeroes);

            } catch (error) {
                setRisingHeroesError("Não foi possível carregar os heróis em ascensão.");
                setPopularHeroesError("Não foi possível carregar os heróis mais escolhidos.");
            } finally {
                setIsRisingHeroesLoading(false);
                setIsPopularHeroesLoading(false);
            }
        };
        
        fetchMetaHeroes();
    }, [heroes, heroApiIdMap]);

    useEffect(() => {
        if (!selectedHeroId) {
            setStrategyAnalysis(null);
            setStrategyAnalysisError(null);
            setSynergyAnalysis(null);
            setSynergyError(null);
            setSynergyRelations(null);
        }
    }, [selectedHeroId]);
    
    const handleAnalyze = async () => {
        if (!selectedHero || !selectedHero.apiId) return;

        setIsAnalysisLoading(true);
        setStrategyAnalysis(null);
        setStrategyAnalysisError(null);
        setSynergyAnalysis(null);
        setSynergyError(null);
        setSynergyRelations(null);

        setTimeout(() => {
            analysisSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        try {
            const heroNameMap = Object.values(heroes).reduce((acc, hero: Hero) => {
                acc[hero.name] = hero.apiId;
                return acc;
            }, {} as Record<string, number>);

            const strategyTask = async () => {
                const heroDetails = await fetchHeroDetails(selectedHero.apiId);
                const analysisResult = await getHeroStrategyAnalysis(heroDetails);

                const validItemNames = GAME_ITEMS.map(item => item.nome);
                const correctedCoreItems = analysisResult.coreItems.map(item => ({ ...item, nome: findClosestString(item.nome, validItemNames) }));
                const correctedSituationalItems = analysisResult.situationalItems.map(item => ({ ...item, nome: findClosestString(item.nome, validItemNames) }));
                
                return { ...analysisResult, coreItems: correctedCoreItems, situationalItems: correctedSituationalItems };
            };

            const synergyTask = async () => {
                const relationsData = await fetchHeroRelations(selectedHero.apiId);
                setSynergyRelations(relationsData);

                let strongIds = [...(relationsData?.strong?.target_hero_id || [])];
                if (MANUAL_SYNERGY_DATA[selectedHero.name]) {
                    const manualData = MANUAL_SYNERGY_DATA[selectedHero.name];
                    if (strongIds.length < 4) {
                        const needed = 4 - strongIds.length;
                        const candidates = manualData.strongAgainst.map(name => heroNameMap[name]).filter(id => id && !strongIds.includes(id));
                        strongIds.push(...candidates.slice(0, needed));
                    }
                }
                const uniqueStrongIds = [...new Set(strongIds)];
                
                // Update relations with supplemented data for UI consistency
                setSynergyRelations(prev => ({ ...prev, strong: { target_hero_id: uniqueStrongIds }, weak: prev?.weak || {target_hero_id: []}, assist: prev?.assist || {target_hero_id: []} }));

                const selectedHeroDetails = await fetchHeroDetails(selectedHero.apiId);
                const strongAgainstDetails = (await Promise.all(
                    uniqueStrongIds.map(id => heroApiIdMap[id]).filter(Boolean).map(h => fetchHeroDetails(h.apiId))
                )).filter((d): d is HeroDetails => !!d);

                return await getSynergyAnalysis(selectedHeroDetails, [], strongAgainstDetails);
            };

            const [strategyResult, synergyResult] = await Promise.all([
                strategyTask(),
                synergyTask()
            ]);
            
            setStrategyAnalysis(strategyResult);
            setSynergyAnalysis(synergyResult);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
            setStrategyAnalysisError(errorMessage);
            setSynergyError(errorMessage);
        } finally {
            setIsAnalysisLoading(false);
        }
    };

    const renderRisingHeroes = () => {
        if (isRisingHeroesLoading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-violet-400"></div>
                </div>
            );
        }
        if (risingHeroesError) {
            return <p className="text-center text-xs text-yellow-400">{risingHeroesError}</p>;
        }
        return (
            <div className="grid grid-cols-5 gap-3">
                {risingHeroes.map(info => (
                    <div key={info.hero.id} className="group relative flex flex-col items-center text-center">
                        <img src={info.hero.imageUrl} alt={info.hero.name} className="w-14 h-14 rounded-full border-2 border-amber-400 transform transition-transform group-hover:scale-110" />
                        <span className="text-xs mt-1 font-semibold">{info.hero.name}</span>
                        <div className="absolute bottom-full mb-2 w-36 p-2 bg-black text-white text-xs rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                            Taxa de Vitória: <span className="font-bold text-green-400">{(info.winRate * 100).toFixed(1)}%</span> (Glória, 7 dias)
                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderPopularHeroes = () => {
        if (isPopularHeroesLoading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-blue-400"></div>
                </div>
            );
        }
        if (popularHeroesError) {
            return <p className="text-center text-xs text-yellow-400">{popularHeroesError}</p>;
        }
        return (
            <div className="grid grid-cols-5 gap-3">
                {popularHeroes.map(info => (
                    <div key={info.hero.id} className="group relative flex flex-col items-center text-center">
                        <img src={info.hero.imageUrl} alt={info.hero.name} className="w-14 h-14 rounded-full border-2 border-blue-400 transform transition-transform group-hover:scale-110" />
                        <span className="text-xs mt-1 font-semibold">{info.hero.name}</span>
                        <div className="absolute bottom-full mb-2 w-40 p-2 bg-black text-white text-xs rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                            Taxa de Escolha: <span className="font-bold text-blue-300">{(info.pickRate * 100).toFixed(1)}%</span> (Glória, 7 dias)
                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderMetaSynergies = () => (
        <div className="space-y-3">
            {META_SYNERGIES.map((synergy, index) => (
                <div key={index} className="p-3 bg-black bg-opacity-30 rounded-xl flex flex-col transform transition-transform hover:scale-105 hover:bg-black/50">
                    <div className="flex justify-center items-center gap-2">
                        <img src={heroNameToImageMap[synergy.heroNames[0]]} alt={synergy.heroNames[0]} className="w-12 h-12 rounded-full border-2 border-gray-500" />
                        <span className="text-2xl font-bold text-amber-300">+</span>
                        <img src={heroNameToImageMap[synergy.heroNames[1]]} alt={synergy.heroNames[1]} className="w-12 h-12 rounded-full border-2 border-gray-500" />
                    </div>
                    <p className="text-xs text-center text-gray-300 mt-2">{synergy.description}</p>
                </div>
            ))}
        </div>
    );

    return (
        <div className="w-full max-w-5xl mx-auto animated-entry flex flex-col gap-6">
            <div className="flex flex-col items-center gap-4">
                <CollapsibleTutorial title="Como Usar o Painel Estratégico">
                     <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-gray-300">
                        <li>Explore os painéis de <strong className="text-amber-300">dados do meta</strong> para insights imediatos.</li>
                        <li>Clique abaixo para selecionar um herói para uma análise aprofundada.</li>
                        <li>Clique em <strong className="text-violet-500">"Analisar"</strong> para a IA gerar a build e as táticas de jogo.</li>
                    </ol>
                </CollapsibleTutorial>
                
                <div className="w-full max-w-xs glassmorphism p-3 rounded-2xl border-2 panel-glow-purple flex flex-col gap-3">
                    <h2 className="text-xl font-black text-center text-amber-300 tracking-wider">SELECIONE O HERÓI</h2>
                     <HeroSlot 
                        type="synergy" 
                        heroId={selectedHeroId} 
                        heroes={heroes} 
                        onClick={onHeroSelectClick}
                        onClear={onClearHero}
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={!selectedHeroId || isAnalysisLoading}
                        className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-2 px-4 rounded-xl text-md hover:from-violet-400 hover:to-fuchsia-400 transition-all duration-300 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-violet-500/40 disabled:shadow-none transform hover:scale-105"
                    >
                         {isAnalysisLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <circle className="opacity-25" cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 10a6 6 0 016-6v2a4 4 0 00-4 4H4z"></path>
                                </svg>
                                Analisando...
                            </>
                         ) : 'Analisar'}
                    </button>
                </div>
            </div>
            
            <BanSuggestions
                counterSuggestions={counterBanSuggestions}
                metaSuggestions={metaBanSuggestions}
                isLoading={isBanLoading}
                variant="1v1"
                activeMetaRank={activeMetaRank}
                onMetaRankChange={onMetaRankChange}
            />
            
            {(selectedHeroId) && (
                 <div ref={analysisSectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-primary flex flex-col">
                        <SectionHeader>Sinergias</SectionHeader>
                        <SynergyPanel
                            isLoading={isAnalysisLoading}
                            error={synergyError}
                            relations={synergyRelations}
                            analysis={synergyAnalysis}
                            heroApiIdMap={heroApiIdMap}
                        />
                    </div>
                     <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-primary flex flex-col">
                        <SectionHeader>Análise Estratégica da IA</SectionHeader>
                        <HeroStrategyPanel
                            selectedHero={selectedHero}
                            analysis={strategyAnalysis}
                            isLoading={isAnalysisLoading}
                            error={strategyAnalysisError}
                        />
                    </div>
                </div>
            )}


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <div className="flex flex-col gap-6">
                    <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-primary flex flex-col flex-1">
                        <SectionHeader>Heróis em Ascensão</SectionHeader>
                        <div className="flex-grow flex items-center justify-center">
                            {renderRisingHeroes()}
                        </div>
                    </div>
                     <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-primary flex flex-col flex-1">
                        <SectionHeader>Heróis Mais Escolhidos</SectionHeader>
                        <div className="flex-grow flex items-center justify-center">
                            {renderPopularHeroes()}
                        </div>
                    </div>
                </div>
                <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-primary flex flex-col h-full">
                    <SectionHeader>Sinergias Chave do Meta</SectionHeader>
                    <div className="flex-grow flex items-center justify-center">
                        {renderMetaSynergies()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SynergyExplorerScreen;
