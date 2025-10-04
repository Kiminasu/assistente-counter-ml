


import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BanSuggestion, Hero, HeroStrategyAnalysis, HeroRankInfo, RankCategory, HeroDetails, HeroRelation, HeroSuggestion, ItemSuggestion, Role } from '../types';
import CollapsibleTutorial from './CollapsibleTutorial';
import HeroSlot from './HeroSlot';
import SynergyPanel from './SynergyPanel';
import HeroStrategyPanel from './HeroStrategyPanel';
import BanSuggestions from './BanSuggestions';
import { fetchHeroRankings } from '../services/heroService';
import { META_SYNERGIES } from './data/synergyData';
import { RATING_STYLES } from '../constants';

interface SynergyExplorerScreenProps {
    selectedHeroId: string | null;
    heroes: Record<string, Hero>;
    heroApiIdMap: Record<number, Hero>;
    onHeroSelectClick: () => void;
    onClearHero: () => void;
    counterBanSuggestions: BanSuggestion[];
    metaBanSuggestions: BanSuggestion[];
    isBanLoading: boolean;
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

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-xl sm:text-2xl font-black text-center mb-3 tracking-wider text-amber-300">{children}</h2>
);

const PerfectCounterPanel: React.FC<{ suggestion: HeroSuggestion, isLoading: boolean, error: string | null }> = ({ suggestion, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-red-400"></div>
                <p className="mt-3 text-sm text-gray-300">ANALISANDO O COUNTER PERFEITO...</p>
            </div>
        );
    }
    if (error) {
        return <p className="text-center text-xs text-yellow-400 p-4">{error}</p>;
    }
    if (!suggestion) return null;

    const styles = RATING_STYLES[suggestion.classificacao] || { text: 'text-gray-300', border: 'border-gray-400' };

    return (
        <div className={`p-3 mt-2 bg-black bg-opacity-30 rounded-xl animated-entry border-l-4 ${styles.border}`}>
            <div className="flex items-center gap-4 mb-3">
                <img src={suggestion.imageUrl} alt={suggestion.nome} className={`w-20 h-20 rounded-full border-4 ${styles.border}`} />
                <div className="flex-grow">
                    <p className="font-bold text-xl">{suggestion.nome}</p>
                    <div>
                        <span className={`font-black text-md ${styles.text}`}>{suggestion.classificacao}</span>
                        <span className="text-xs text-gray-400 font-mono ml-2">{suggestion.estatistica}</span>
                    </div>
                </div>
            </div>
            <p className="text-sm text-gray-300">{suggestion.motivo}</p>
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
    isBanLoading,
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
        if (isAnalysisLoading) {
            setTimeout(() => {
                analysisSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [isAnalysisLoading]);

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
                        <li>Clique em <strong className="text-violet-500">"Analisar"</strong> para a IA gerar a build, as táticas de jogo, sinergias e o counter perfeito contra seu herói.</li>
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
                        onClick={onAnalyze}
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
            
            {(selectedHeroId && (synergyRelations || strategyAnalysis || isAnalysisLoading)) && (
                 <div ref={analysisSectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-primary flex flex-col">
                        <SectionHeader>Sinergias</SectionHeader>
                        <SynergyPanel
                            isLoading={isAnalysisLoading}
                            error={synergyError}
                            relations={synergyRelations}
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
                    <div className="lg:col-span-2 glassmorphism p-4 rounded-2xl border-2 panel-glow-red animated-entry mt-2">
                        <SectionHeader>Recomendação Perfeita (Counter)</SectionHeader>
                        <p className="text-xs text-center text-gray-400 -mt-2 mb-3 max-w-sm mx-auto">
                            Este é o counter ideal <strong className="text-red-300">contra o seu herói</strong>, sugerido pela IA para banimento ou para saber como jogar contra.
                        </p>
                        <PerfectCounterPanel 
                            suggestion={perfectCounter!}
                            isLoading={isAnalysisLoading}
                            error={perfectCounterError}
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