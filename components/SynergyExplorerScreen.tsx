import React, { useState, useEffect, useMemo, useRef } from 'react';
// FIX: Import HeroRelation to resolve type error.
import { BanSuggestion, Hero, HeroStrategyAnalysis, HeroRankInfo, RankCategory, HeroSuggestion, HeroRelation } from '../types';
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

const SectionHeader: React.FC<{ icon: 'trending' | 'popular' | 'synergy', children: React.ReactNode }> = ({ icon, children }) => {
    const icons = {
        trending: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L12 11.586l3.293-3.293a1 1 0 010-1.414v.001z" clipRule="evenodd" /></svg>,
        popular: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a2 2 0 00-.8 1.4z" /></svg>,
        synergy: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 11.172V16.5a.5.5 0 01-.854.354l-2.472-2.472a.5.5 0 010-.708l.004-.004 2.468-2.468a.5.5 0 01.854.354z" /><path d="M20 10a10 10 0 11-20 0 10 10 0 0120 0zM8.5 4.94a.5.5 0 01.854-.354l2.472 2.472a.5.5 0 010 .708l-.004.004-2.468 2.468a.5.5 0 01-.854-.354V4.94z" /></svg>,
    };

    return <h2 className="text-xl font-bold text-center mb-3 tracking-wider text-amber-300 flex items-center justify-center gap-2">{icons[icon]} {children}</h2>;
};


const PerfectCounterPanel: React.FC<{ heroName: string, suggestion: HeroSuggestion, isLoading: boolean, error: string | null }> = ({ heroName, suggestion, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 h-full">
                <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-red-400"></div>
                <p className="mt-3 text-sm text-gray-300">Analisando o counter perfeito...</p>
            </div>
        );
    }
    if (error) {
        return <p className="text-center text-xs text-yellow-400 p-4">{error}</p>;
    }
    if (!suggestion) return null;

    const styles = RATING_STYLES[suggestion.classificacao] || { text: 'text-gray-300', border: 'border-gray-400' };

    return (
        <div className={`p-4 bg-black bg-opacity-30 rounded-2xl animated-entry border-2 ${styles.border} ${styles.border.replace('border', 'shadow')} shadow-lg h-full flex flex-col justify-between`}>
            <div>
                <p className="text-sm uppercase font-bold text-red-300 mb-2 text-center">Counter Perfeito (vs. {heroName})</p>
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-3">
                    <img src={suggestion.imageUrl} alt={suggestion.nome} className={`w-24 h-24 rounded-full border-4 ${styles.border} flex-shrink-0`} />
                    <div className="flex-grow text-center sm:text-left">
                        <p className="font-black text-2xl">{suggestion.nome}</p>
                        <div>
                            <span className={`font-bold text-lg ${styles.text}`}>{suggestion.classificacao}</span>
                            <span className="text-xs text-gray-400 font-mono ml-2">{suggestion.estatistica}</span>
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-sm text-gray-300 p-3 bg-black/20 rounded-lg">{suggestion.motivo}</p>
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

    const [risingHeroes, setRisingHeroes] = useState<HeroRankInfo[]>([]);
    const [isRisingHeroesLoading, setIsRisingHeroesLoading] = useState(true);
    const [risingHeroesError, setRisingHeroesError] = useState<string | null>(null);

    const [popularHeroes, setPopularHeroes] = useState<HeroRankInfo[]>([]);
    const [isPopularHeroesLoading, setIsPopularHeroesLoading] = useState(true);
    const [popularHeroesError, setPopularHeroesError] = useState<string | null>(null);

    const heroNameToImageMap = useMemo(() => {
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

                const mapDataToHeroRankInfo = (data: any) => {
                    const hero = heroApiIdMap[data.main_heroid];
                    if (!hero) return null;
                    return { hero, winRate: data.main_hero_win_rate, pickRate: data.main_hero_appearance_rate, banRate: data.main_hero_ban_rate };
                };
                
                setRisingHeroes(winRateData.map(mapDataToHeroRankInfo).filter((r): r is HeroRankInfo => r !== null).slice(0, 5));
                setPopularHeroes(pickRateData.map(mapDataToHeroRankInfo).filter((r): r is HeroRankInfo => r !== null).slice(0, 5));

            } catch (error) {
                setRisingHeroesError("Falha ao carregar heróis.");
                setPopularHeroesError("Falha ao carregar heróis.");
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

    const renderMetaHeroes = (heroList: HeroRankInfo[], isLoading: boolean, error: string | null, colorClass: string, statType: 'winRate' | 'pickRate') => {
        if (isLoading) return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-violet-400"></div></div>;
        if (error) return <p className="text-center text-xs text-yellow-400">{error}</p>;
        
        return (
            <div className="grid grid-cols-5 gap-3">
                {heroList.map(info => (
                    <div key={info.hero.id} className="group relative flex flex-col items-center text-center">
                        <img src={info.hero.imageUrl} alt={info.hero.name} className={`w-14 h-14 rounded-full border-2 ${colorClass} transform transition-transform group-hover:scale-110`} />
                        <span className="text-xs mt-1 font-semibold">{info.hero.name}</span>
                        <div className="absolute bottom-full mb-2 w-40 p-2 bg-black text-white text-xs rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                            {statType === 'winRate' ? 'Taxa de Vitória:' : 'Taxa de Escolha:'} <span className="font-bold">{(info[statType] * 100).toFixed(1)}%</span>
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
        <div className="w-full max-w-7xl mx-auto animated-entry flex flex-col gap-8">
            <CollapsibleTutorial title="Como Usar o Painel Estratégico">
                 <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-gray-300">
                    <li>Explore os painéis de <strong className="text-amber-300">dados do meta</strong> para insights imediatos.</li>
                    <li>Clique no painel abaixo para <strong className="text-violet-300">selecionar um herói</strong> para uma análise aprofundada.</li>
                    <li>Clique em <strong className="text-violet-500">"Analisar Herói"</strong> para a IA gerar a build, táticas, sinergias e o counter perfeito.</li>
                </ol>
            </CollapsibleTutorial>

            {!selectedHero ? (
                 <div className="glassmorphism p-6 rounded-2xl border-2 panel-glow-purple flex flex-col items-center gap-4 text-center">
                    <h2 className="text-2xl font-black tracking-wider">COMECE SUA ANÁLISE</h2>
                    <p className="text-slate-400 max-w-md">Selecione um herói para obter uma análise estratégica completa da IA, incluindo builds, estilo de jogo, sinergias e counters.</p>
                    <div className="w-48">
                        <HeroSlot type="synergy" heroId={null} heroes={heroes} onClick={onHeroSelectClick} label="Selecionar Herói"/>
                    </div>
                </div>
            ) : (
                <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-purple flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <HeroSlot type="synergy" heroId={selectedHeroId} heroes={heroes} onClick={onHeroSelectClick} onClear={onClearHero} />
                        <div>
                            <h2 className="text-2xl font-bold text-white">{selectedHero.name}</h2>
                            <p className="text-sm text-slate-400">{selectedHero.roles.join(' / ')}</p>
                        </div>
                    </div>
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
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-primary flex flex-col flex-1">
                    <SectionHeader icon="trending">Heróis em Ascensão</SectionHeader>
                    <div className="flex-grow flex items-center justify-center">
                        {renderMetaHeroes(risingHeroes, isRisingHeroesLoading, risingHeroesError, 'border-amber-400', 'winRate')}
                    </div>
                </div>
                <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-primary flex flex-col flex-1">
                    <SectionHeader icon="popular">Heróis Mais Escolhidos</SectionHeader>
                    <div className="flex-grow flex items-center justify-center">
                        {renderMetaHeroes(popularHeroes, isPopularHeroesLoading, popularHeroesError, 'border-blue-400', 'pickRate')}
                    </div>
                </div>
                <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-primary flex flex-col h-full md:col-span-2 lg:col-span-1">
                    <SectionHeader icon="synergy">Sinergias Chave do Meta</SectionHeader>
                    <div className="flex-grow flex items-center justify-center">
                        {renderMetaSynergies()}
                    </div>
                </div>
            </div>

            <BanSuggestions
                counterSuggestions={counterBanSuggestions}
                metaSuggestions={metaBanSuggestions}
                isLoading={isMetaBansLoading}
                variant="1v1"
                activeMetaRank={activeMetaRank}
                onMetaRankChange={onMetaRankChange}
            />
            
            {(selectedHeroId && (synergyRelations || strategyAnalysis || isAnalysisLoading)) && (
                 <div ref={analysisSectionRef} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-2 glassmorphism p-4 rounded-2xl border-2 panel-glow-primary flex flex-col">
                        <h2 className="text-xl font-black text-center mb-3 tracking-wider text-amber-300">Sinergias de Batalha</h2>
                        <SynergyPanel
                            isLoading={isAnalysisLoading}
                            error={synergyError}
                            relations={synergyRelations}
                            heroApiIdMap={heroApiIdMap}
                        />
                    </div>
                     <div className="lg:col-span-3 glassmorphism p-4 rounded-2xl border-2 panel-glow-primary flex flex-col">
                        <h2 className="text-xl font-black text-center mb-3 tracking-wider text-amber-300">Análise Estratégica da IA</h2>
                        <HeroStrategyPanel
                            selectedHero={selectedHero}
                            analysis={strategyAnalysis}
                            isLoading={isAnalysisLoading}
                            error={strategyAnalysisError}
                        />
                    </div>
                    <div className="lg:col-span-5 animated-entry">
                        <PerfectCounterPanel 
                            heroName={selectedHero?.name || ''}
                            suggestion={perfectCounter!}
                            isLoading={isAnalysisLoading}
                            error={perfectCounterError}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SynergyExplorerScreen;