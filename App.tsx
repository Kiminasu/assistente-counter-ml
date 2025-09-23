

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Hero, Lane, AnalysisResult, SlotType, LANES, ROLES, Role, HeroSuggestion, BanSuggestion, MatchupData } from './types';
import { fetchHeroes, fetchCounters, fetchHeroDetails, HeroDetails } from './services/heroService';
import { getStrategicAnalysis, getDetailedMatchupAnalysis } from './services/geminiService';
import { findClosestString } from './utils';
import { ITEM_ICONS, SPELL_ICONS, HERO_ROLES } from './constants';
import { HERO_EXPERT_RANK } from './components/data/heroData';
import LoadingOverlay from './components/LoadingOverlay';
import AnalysisPanel from './components/AnalysisPanel';
import LaneSelector from './components/LaneSelector';
import MatchupScreen from './components/MatchupScreen';
import HeroSelectionModal from './components/HeroSelectionModal';
import BanSuggestions from './components/BanSuggestions';
import DirectMatchupPanel from './components/DirectMatchupPanel';
import RoleSelector from './components/RoleSelector';

const App: React.FC = () => {
    const [heroes, setHeroes] = useState<Record<string, Hero>>({});
    const [isLoadingHeroes, setIsLoadingHeroes] = useState(true);
    const [heroLoadingError, setHeroLoadingError] = useState<string | null>(null);

    const [yourPick, setYourPick] = useState<string | null>(null);
    const [enemyPick, setEnemyPick] = useState<string | null>(null);
    const [activeLane, setActiveLane] = useState<Lane>(LANES[3]); 
    const [selectedRole, setSelectedRole] = useState<Role>(ROLES[2]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSlotType, setActiveSlotType] = useState<SlotType | null>(null);

    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const [banSuggestions, setBanSuggestions] = useState<BanSuggestion[]>([]);
    const [isBansLoading, setIsBansLoading] = useState(false);

    const [matchupData, setMatchupData] = useState<MatchupData | null>(null);
    const [isMatchupLoading, setIsMatchupLoading] = useState(false);
    const [matchupError, setMatchupError] = useState<string | null>(null);
    
    const [heroDetailsCache, setHeroDetailsCache] = useState<Record<number, HeroDetails>>({});

    useEffect(() => {
        const loadHeroes = async () => {
            try {
                const fetchedHeroes = await fetchHeroes();
                
                Object.values(fetchedHeroes).forEach(hero => {
                    hero.roles = HERO_ROLES[hero.name] || [];
                });

                setHeroes(fetchedHeroes);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
                setHeroLoadingError(`Falha ao carregar heróis: ${errorMessage} Tente atualizar a página.`);
            } finally {
                setIsLoadingHeroes(false);
            }
        };
        loadHeroes();
    }, []);
    
    const heroApiIdMap = useMemo(() => {
        return Object.values(heroes).reduce((acc, hero) => {
            if (hero.apiId) {
                acc[hero.apiId] = hero;
            }
            return acc;
        }, {} as Record<number, Hero>);
    }, [heroes]);

    const fetchAnalysis = useCallback(async (heroId: string, lane: Lane, role: Role) => {
        const enemyHero = heroes[heroId];
        if (!enemyHero?.apiId) return;
        
        setIsAnalysisLoading(true);
        setAnalysisError(null);
        setAnalysisResult(null);
        
        try {
            const counterData = await fetchCounters(enemyHero.apiId);
            const heroesInRole = Object.values(heroes).filter(h => h.roles.includes(role));
            
            const relevantCounterHeroes = counterData
                .map(c => heroApiIdMap[c.heroid])
                .filter((hero): hero is Hero => !!hero && heroesInRole.some(h => h.id === hero.id))
                .map(hero => {
                    const stat = counterData.find(c => c.heroid === hero.apiId)!;
                    return { ...hero, increase_win_rate: stat.increase_win_rate };
                })
                .filter(c => c.increase_win_rate > 0.01)
                .sort((a, b) => b.increase_win_rate - a.increase_win_rate);

            let potentialCounters: Array<Hero & { increase_win_rate?: number }> = [];
            let isTheoretical = false;

            const MIN_STATISTICAL_COUNTERS = 2;
            const TOTAL_CANDIDATES_FOR_AI = 4;

            if (relevantCounterHeroes.length >= MIN_STATISTICAL_COUNTERS) {
                potentialCounters = relevantCounterHeroes.slice(0, TOTAL_CANDIDATES_FOR_AI);
            } else {
                isTheoretical = true;
                potentialCounters = [...relevantCounterHeroes];
                
                const theoreticalCandidates = heroesInRole
                    .filter(h => h.name !== enemyHero.name && !potentialCounters.some(pc => pc.id === h.id))
                    .sort((a, b) => (HERO_EXPERT_RANK[b.name] || 5) - (HERO_EXPERT_RANK[a.name] || 5));
                
                const neededCandidates = TOTAL_CANDIDATES_FOR_AI - potentialCounters.length;
                potentialCounters.push(...theoreticalCandidates.slice(0, neededCandidates));

                if (potentialCounters.length === 0) {
                     throw new Error(`Nenhum herói da função '${role}' foi encontrado para análise.`);
                }
            }

            const allHeroesForDetails = [enemyHero, ...potentialCounters];
            const detailsToFetch = allHeroesForDetails.filter(h => h.apiId && !heroDetailsCache[h.apiId]);
            const newCacheEntries: Record<number, HeroDetails> = {};

            if (detailsToFetch.length > 0) {
                const fetchedDetails = await Promise.all(
                    detailsToFetch.map(h => fetchHeroDetails(h.apiId).then(details => ({ apiId: h.apiId, details })))
                );
                fetchedDetails.forEach(item => { newCacheEntries[item.apiId] = item.details; });
                setHeroDetailsCache(prev => ({ ...prev, ...newCacheEntries }));
            }

            const currentCache = { ...heroDetailsCache, ...newCacheEntries };
            const enemyHeroDetails = currentCache[enemyHero.apiId];
            const potentialCountersDetails = potentialCounters.map(h => currentCache[h.apiId]).filter((d): d is HeroDetails => !!d);

            if (!enemyHeroDetails || potentialCountersDetails.length !== potentialCounters.length) {
                 throw new Error("Falha ao carregar detalhes de um ou mais heróis para a análise.");
            }
            
            const analysisFromAI = await getStrategicAnalysis(enemyHeroDetails, lane, potentialCountersDetails, role, isTheoretical);

            const validItemNames = Object.keys(ITEM_ICONS);
            const validSpellNames = Object.keys(SPELL_ICONS);

            const heroSuggestions: HeroSuggestion[] = analysisFromAI.sugestoesHerois.map((aiSuggestion): HeroSuggestion => {
                const heroData = Object.values(heroes).find(h => h.name === aiSuggestion.nome);
                const stat = relevantCounterHeroes.find(c => c.name === aiSuggestion.nome);
                const winRateIncrease = stat?.increase_win_rate || 0;
                
                const classificacao: 'ANULA' | 'VANTAGEM' = (isTheoretical || !stat) ? 'VANTAGEM' : (winRateIncrease > 0.04 ? 'ANULA' : 'VANTAGEM');

                const correctedSpells = aiSuggestion.spells.map(spell => ({
                    ...spell,
                    nome: findClosestString(spell.nome, validSpellNames),
                }));

                return {
                    nome: aiSuggestion.nome,
                    motivo: aiSuggestion.motivo,
                    avisos: aiSuggestion.avisos || [],
                    spells: correctedSpells,
                    imageUrl: heroData?.imageUrl || '',
                    classificacao,
                    estatistica: (isTheoretical || !stat) ? 'Análise Tática' : `+${(winRateIncrease * 100).toFixed(1)}% vs. ${enemyHero.name}`
                };
            }).sort((a, b) => {
                const statA = relevantCounterHeroes.find(c => c.name === a.nome)?.increase_win_rate || 0;
                const statB = relevantCounterHeroes.find(c => c.name === b.nome)?.increase_win_rate || 0;
                return statB - statA;
            });

            const correctedItems = analysisFromAI.sugestoesItens.map(item => ({
                ...item,
                nome: findClosestString(item.nome, validItemNames)
            }));

            setAnalysisResult({
                sugestoesHerois: heroSuggestions,
                sugestoesItens: correctedItems,
            });

        } catch (error) {
            setAnalysisError(error instanceof Error ? error.message : "Ocorreu um erro desconhecido ao buscar a análise.");
        } finally {
            setIsAnalysisLoading(false);
        }
    }, [heroes, heroApiIdMap, heroDetailsCache]);

    const fetchBans = useCallback(async (heroId: string) => {
        const myHero = heroes[heroId];
        if (!myHero?.apiId) return;

        setIsBansLoading(true);
        setBanSuggestions([]);

        try {
            const counterData = await fetchCounters(myHero.apiId);
            const banSuggestionsData: BanSuggestion[] = counterData
                .sort((a, b) => b.increase_win_rate - a.increase_win_rate)
                .map(counter => {
                    const heroToBan = heroApiIdMap[counter.heroid];
                    if (!heroToBan) return null;
                    return {
                        hero: heroToBan,
                        reason: `Aumenta a taxa de vitória em ${(counter.increase_win_rate * 100).toFixed(1)}% contra ${myHero.name}.`
                    };
                })
                .filter((b): b is BanSuggestion => b !== null)
                .slice(0, 5);

            setBanSuggestions(banSuggestionsData);
        } catch (error) {
            console.error("Erro ao buscar sugestões de ban:", error);
        } finally {
            setIsBansLoading(false);
        }
    }, [heroes, heroApiIdMap]);
    
    const handleAnalysis = () => {
        if (enemyPick) {
            fetchAnalysis(enemyPick, activeLane, selectedRole);
        }
    };

    useEffect(() => {
        if (yourPick) {
            fetchBans(yourPick);
        } else {
            setBanSuggestions([]);
        }
    }, [yourPick, fetchBans]);

     useEffect(() => {
        const analyzeMatchup = async () => {
            if (!yourPick || !enemyPick) {
                setMatchupData(null);
                return;
            };

            const yourHero = heroes[yourPick];
            const enemyHero = heroes[enemyPick];

            if (!yourHero?.apiId || !enemyHero?.apiId) return;

            setIsMatchupLoading(true);
            setMatchupError(null);
            setMatchupData(null);
            
            try {
                const heroesForDetails = [yourHero, enemyHero];
                const detailsToFetch = heroesForDetails.filter(h => h.apiId && !heroDetailsCache[h.apiId]);
                const newCacheEntries: Record<number, HeroDetails> = {};
                
                if (detailsToFetch.length > 0) {
                    const fetchedDetails = await Promise.all(
                        detailsToFetch.map(h => fetchHeroDetails(h.apiId).then(details => ({ apiId: h.apiId, details })))
                    );
                    fetchedDetails.forEach(item => { newCacheEntries[item.apiId] = item.details; });
                    setHeroDetailsCache(prev => ({ ...prev, ...newCacheEntries }));
                }

                const currentCache = { ...heroDetailsCache, ...newCacheEntries };
                const yourHeroDetails = currentCache[yourHero.apiId];
                const enemyHeroDetails = currentCache[enemyHero.apiId];
                
                if (!yourHeroDetails || !enemyHeroDetails) {
                    throw new Error("Não foi possível carregar os detalhes dos heróis para o confronto.");
                }

                const enemyCounters = await fetchCounters(enemyHero.apiId);
                const matchupStat = enemyCounters.find(counter => counter.heroid === yourHero.apiId);
                let winRate = matchupStat?.increase_win_rate ?? 0;

                if (winRate === 0) {
                    const yourCounters = await fetchCounters(yourHero.apiId);
                    const counterMatchupStat = yourCounters.find(counter => counter.heroid === enemyHero.apiId);
                    if (counterMatchupStat) {
                        winRate = -counterMatchupStat.increase_win_rate;
                    }
                }

                const isSuggestedCounter = !!analysisResult?.sugestoesHerois.some(s => s.nome === yourHero.name);
                const analysis = await getDetailedMatchupAnalysis(yourHeroDetails, enemyHeroDetails, activeLane, winRate, isSuggestedCounter);
                
                const validSpellNames = Object.keys(SPELL_ICONS);
                const correctedSpell = {
                    ...analysis.recommendedSpell,
                    nome: findClosestString(analysis.recommendedSpell.nome, validSpellNames)
                };

                setMatchupData({
                    yourHero,
                    enemyHero,
                    winRate,
                    classification: analysis.classification,
                    detailedAnalysis: analysis.detailedAnalysis,
                    recommendedSpell: correctedSpell
                });

            } catch (error) {
                 setMatchupError(error instanceof Error ? error.message : "Erro desconhecido.");
            } finally {
                setIsMatchupLoading(false);
            }
        };
        analyzeMatchup();
    }, [yourPick, enemyPick, heroes, activeLane, analysisResult, heroDetailsCache]);

    const handleSlotClick = (type: SlotType) => {
        setActiveSlotType(type);
        setIsModalOpen(true);
    };

    const handleHeroSelect = (heroId: string) => {
        if (activeSlotType === 'yourPick') {
            setYourPick(heroId);
        } else if (activeSlotType === 'enemyPick') {
            setEnemyPick(heroId);
            setAnalysisResult(null);
            setAnalysisError(null);
        }
        setIsModalOpen(false);
        setActiveSlotType(null);
    };

    if (isLoadingHeroes) {
        return <LoadingOverlay message={'A carregar heróis da API...'} />;
    }

    if (heroLoadingError) {
        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50 text-center">
                <p className="text-red-500 p-8 text-xl font-semibold">{heroLoadingError}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen p-4 lg:p-8">
            <header className="text-center mb-6 animated-entry">
                <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white">
                    Assistente de Counter MLBB
                </h1>
                <div className="w-24 h-1 bg-yellow-400 mx-auto mt-3 rounded-full"></div>
                <p className="text-sm sm:text-base text-gray-300 mt-4 max-w-3xl mx-auto">
                    Analise confrontos, descubra os melhores counters e domine sua lane com sugestões táticas baseadas em dados.
                </p>
                 <p className="text-xs text-gray-500 font-semibold mt-4">
                    Desenvolvido por Lucas Kimi
                </p>
            </header>

            <div className="w-full max-w-7xl mx-auto flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="lg:order-1 order-2">
                        <AnalysisPanel 
                            isLoading={isAnalysisLoading}
                            result={analysisResult}
                            error={analysisError}
                            activeLane={activeLane}
                        />
                    </div>
                    
                    <main className="col-span-1 flex flex-col gap-4 sm:gap-6 lg:order-2 order-1">
                        <LaneSelector activeLane={activeLane} onSelectLane={setActiveLane} />
                        <RoleSelector activeRole={selectedRole} onSelectRole={setSelectedRole} />
                        <MatchupScreen 
                            yourPick={yourPick}
                            enemyPick={enemyPick}
                            heroes={heroes}
                            onSlotClick={handleSlotClick}
                        />
                         <div className="animated-entry" style={{ animationDelay: '250ms' }}>
                            <button
                                onClick={handleAnalysis}
                                disabled={!enemyPick || isAnalysisLoading}
                                className="w-full bg-yellow-400 text-black font-bold py-3 px-4 rounded-lg text-lg hover:bg-yellow-300 transition-colors duration-300 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-yellow-400/30 disabled:shadow-none"
                            >
                                {isAnalysisLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analisando...
                                    </>
                                ) : (
                                    'Analisar Confronto'
                                )}
                            </button>
                        </div>
                        <BanSuggestions
                            suggestions={banSuggestions}
                            isLoading={isBansLoading}
                        />
                    </main>

                    <div className="lg:order-3 order-3">
                        <DirectMatchupPanel
                            isLoading={isMatchupLoading}
                            data={matchupData}
                            error={matchupError}
                        />
                    </div>
                </div>
            </div>

            <HeroSelectionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onHeroSelect={handleHeroSelect}
                heroes={heroes}
            />
        </div>
    );
};

export default App;