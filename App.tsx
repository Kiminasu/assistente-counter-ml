import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Hero, Lane, AnalysisResult, SlotType, LANES, HeroSuggestion, BanSuggestion, MatchupData, MatchupClassification } from './types';
import { fetchHeroes, fetchCounters, fetchDirectMatchup } from './services/heroService';
import { getStrategicAnalysis, getMatchupAnalysis } from './services/geminiService';
import { findClosestString } from './utils';
import { ITEM_ICONS } from './constants';
import LoadingOverlay from './components/LoadingOverlay';
import AnalysisPanel from './components/AnalysisPanel';
import LaneSelector from './components/LaneSelector';
import MatchupScreen from './components/MatchupScreen';
import HeroSelectionModal from './components/HeroSelectionModal';
import BanSuggestions from './components/BanSuggestions';
import DirectMatchupPanel from './components/DirectMatchupPanel';

const App: React.FC = () => {
    const [heroes, setHeroes] = useState<Record<string, Hero>>({});
    const [isLoadingHeroes, setIsLoadingHeroes] = useState(true);
    const [heroLoadingError, setHeroLoadingError] = useState<string | null>(null);

    const [yourPick, setYourPick] = useState<string | null>(null);
    const [enemyPick, setEnemyPick] = useState<string | null>(null);
    const [activeLane, setActiveLane] = useState<Lane>(LANES[0]);

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

    useEffect(() => {
        const loadHeroes = async () => {
            try {
                const fetchedHeroes = await fetchHeroes();
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

    const fetchAnalysis = useCallback(async (heroId: string, lane: Lane) => {
        const enemyHero = heroes[heroId];
        if (!enemyHero || !enemyHero.apiId) return;
        
        setIsAnalysisLoading(true);
        setAnalysisError(null);
        setAnalysisResult(null);
        
        try {
            const counterData = await fetchCounters(enemyHero.apiId);

            const significantCounters = counterData
                .filter(c => c.increase_win_rate > 0.015)
                .sort((a, b) => b.increase_win_rate - a.increase_win_rate);

            const potentialCounters = significantCounters
                .map(counter => heroApiIdMap[counter.heroid]?.name)
                .filter((name): name is string => !!name)
                .slice(0, 5);

            if (potentialCounters.length === 0) {
                 throw new Error("Não há dados estatísticos suficientes para gerar uma análise.");
            }
            
            const analysisFromAI = await getStrategicAnalysis(enemyHero.name, lane, potentialCounters);

            const heroSuggestions: HeroSuggestion[] = analysisFromAI.sugestoesHerois.map(aiSuggestion => {
                const heroData = Object.values(heroes).find(h => h.name === aiSuggestion.nome);
                const stat = counterData.find(c => heroApiIdMap[c.heroid]?.name === aiSuggestion.nome);
                const winRateIncrease = stat ? stat.increase_win_rate : 0;
                
                const classificacao: 'ANULA' | 'VANTAGEM' = winRateIncrease > 0.04 ? 'ANULA' : 'VANTAGEM';
                return {
                    ...aiSuggestion,
                    imageUrl: heroData?.imageUrl || '',
                    classificacao,
                    estatistica: `+${(winRateIncrease * 100).toFixed(1)}% vs. ${enemyHero.name}`
                };
            }).sort((a, b) => {
                const statA = counterData.find(c => heroApiIdMap[c.heroid]?.name === a.nome)?.increase_win_rate || 0;
                const statB = counterData.find(c => heroApiIdMap[c.heroid]?.name === b.nome)?.increase_win_rate || 0;
                return statB - statA;
            });

            // Correct item names before setting the state
            const validItemNames = Object.keys(ITEM_ICONS);
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
    }, [heroes, heroApiIdMap]);

    const fetchBans = useCallback(async (heroId: string) => {
        const myHero = heroes[heroId];
        if (!myHero || !myHero.apiId) return;

        setIsBansLoading(true);
        setBanSuggestions([]);

        try {
            const counterData = await fetchCounters(myHero.apiId);
            const banSuggestions: BanSuggestion[] = counterData
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

            setBanSuggestions(banSuggestions);
        } catch (error) {
            console.error("Erro ao buscar sugestões de ban:", error);
        } finally {
            setIsBansLoading(false);
        }
    }, [heroes, heroApiIdMap]);


    useEffect(() => {
        if (enemyPick) {
            fetchAnalysis(enemyPick, activeLane);
        } else {
            setAnalysisResult(null);
            setAnalysisError(null);
        }
    }, [enemyPick, activeLane, fetchAnalysis]);

    useEffect(() => {
        if (yourPick) {
            fetchBans(yourPick);
        } else {
            setBanSuggestions([]);
        }
    }, [yourPick, fetchBans]);

     useEffect(() => {
        const analyzeMatchup = async () => {
            if (yourPick && enemyPick) {
                const yourHero = heroes[yourPick];
                const enemyHero = heroes[enemyPick];

                if (!yourHero?.apiId || !enemyHero?.apiId) return;

                setIsMatchupLoading(true);
                setMatchupError(null);
                setMatchupData(null);
                
                try {
                    const [stats, analysis] = await Promise.all([
                        fetchDirectMatchup(yourHero.apiId, enemyHero.apiId),
                        getMatchupAnalysis(yourHero.name, enemyHero.name, activeLane)
                    ]);
                    
                    const winRate = stats?.increase_win_rate ?? 0;
                    let classification: MatchupClassification = 'NEUTRO';
                    if (winRate > 0.04) classification = 'ANULA';
                    else if (winRate > 0.01) classification = 'VANTAGEM';
                    else if (winRate < -0.01) classification = 'DESVANTAGEM';

                    setMatchupData({
                        yourHero,
                        enemyHero,
                        winRate,
                        classification,
                        analysis
                    });

                } catch (error) {
                     setMatchupError(error instanceof Error ? error.message : "Erro desconhecido.");
                } finally {
                    setIsMatchupLoading(false);
                }
            } else {
                setMatchupData(null);
            }
        };
        analyzeMatchup();
    }, [yourPick, enemyPick, heroes, activeLane]);

    const handleSlotClick = (type: SlotType) => {
        setActiveSlotType(type);
        setIsModalOpen(true);
    };

    const handleHeroSelect = (heroId: string) => {
        if (activeSlotType === 'yourPick') {
            setYourPick(heroId);
        } else if (activeSlotType === 'enemyPick') {
            setEnemyPick(heroId);
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
        <>
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
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
                    <MatchupScreen 
                        yourPick={yourPick}
                        enemyPick={enemyPick}
                        heroes={heroes}
                        onSlotClick={handleSlotClick}
                    />
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
            <HeroSelectionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onHeroSelect={handleHeroSelect}
                heroes={heroes}
            />
        </>
    );
};

export default App;