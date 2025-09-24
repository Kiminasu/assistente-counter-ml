import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Hero, Lane, AnalysisResult, LANES, ROLES, Role, HeroSuggestion, BanSuggestion, MatchupData, ItemSuggestion, RankCategory, RankDays, SortField, HeroRankInfo, Team, DraftAnalysisResult, NextPickSuggestion, StrategicItemSuggestion, LaneOrNone } from './types';
import { fetchHeroes, fetchCounters, fetchHeroDetails, HeroDetails, fetchHeroRankings, ApiHeroRankData } from './services/heroService';
import { getStrategicAnalysis, getDetailedMatchupAnalysis, getDraftAnalysis } from './services/geminiService';
import { findClosestString } from './utils';
import { SPELL_ICONS, HERO_ROLES } from './constants';
import { HERO_EXPERT_RANK } from './components/data/heroData';
import { GAME_ITEMS } from './components/data/items';
import { HERO_LANES_DATA } from './components/data/heroLanes';
import LoadingOverlay from './components/LoadingOverlay';
import AnalysisPanel from './components/AnalysisPanel';
import LaneSelector from './components/LaneSelector';
import HeroSelectionModal from './components/HeroSelectionModal';
import BanSuggestions from './components/BanSuggestions';
import DirectMatchupPanel from './components/DirectMatchupPanel';
import Footer from './components/Footer';
import TabbedPanel from './components/TabbedPanel';
import HeroRankings from './components/HeroRankings';
import Header from './components/Header';
import DraftScreen from './components/DraftScreen';
import SynergyPanel from './components/SynergyPanel';
import HeroSlot from './components/HeroSlot';
import ItemDatabaseScreen from './components/ItemDatabaseScreen';
import CollapsibleTutorial from './components/CollapsibleTutorial';

type GameMode = '1v1' | '5v5' | 'ranking' | 'item';

const App: React.FC = () => {
    const [heroes, setHeroes] = useState<Record<string, Hero>>({});
    const [isLoadingHeroes, setIsLoadingHeroes] = useState(true);
    const [heroLoadingError, setHeroLoadingError] = useState<string | null>(null);

    const [gameMode, setGameMode] = useState<GameMode>('1v1');

    // State for 1v1 mode
    const [matchupAllyPick, setMatchupAllyPick] = useState<string | null>(null);
    const [matchupEnemyPick, setMatchupEnemyPick] = useState<string | null>(null);
    const [is1v1AnalysisLoading, setIs1v1AnalysisLoading] = useState(false);
    
    // State for 5v5 mode
    const [draftAllyPicks, setDraftAllyPicks] = useState<(string | null)[]>(Array(5).fill(null));
    const [draftEnemyPicks, setDraftEnemyPicks] = useState<(string | null)[]>(Array(5).fill(null));

    const [activeLane, setActiveLane] = useState<LaneOrNone>('NENHUMA'); 

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSlot, setActiveSlot] = useState<{ team: Team; index: number } | null>(null);

    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const [banSuggestions, setBanSuggestions] = useState<BanSuggestion[]>([]);

    const [matchupData, setMatchupData] = useState<MatchupData | null>(null);
    const [matchupError, setMatchupError] = useState<string | null>(null);
    
    const [heroDetailsCache, setHeroDetailsCache] = useState<Record<number, HeroDetails>>(() => {
        try {
            const item = window.localStorage.getItem('heroDetailsCache');
            return item ? JSON.parse(item) : {};
        } catch (error) {
            console.error("Erro ao ler o cache de detalhes do herói do localStorage", error);
            return {};
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem('heroDetailsCache', JSON.stringify(heroDetailsCache));
        } catch (error) {
            console.error("Erro ao escrever o cache de detalhes do herói no localStorage", error);
        }
    }, [heroDetailsCache]);


    const [heroRankings, setHeroRankings] = useState<HeroRankInfo[]>([]);
    const [isRankingsLoading, setIsRankingsLoading] = useState(false);
    const [rankingsError, setRankingsError] = useState<string | null>(null);
    const [rankDays, setRankDays] = useState<RankDays>(7);
    const [rankCategory, setRankCategory] = useState<RankCategory>('mythic');
    const [sortField, setSortField] = useState<SortField>('win_rate');

    const [heroLanes, setHeroLanes] = useState<Record<number, Lane[]>>({});

    const [draftAnalysis, setDraftAnalysis] = useState<DraftAnalysisResult | null>(null);
    const [isDraftAnalysisLoading, setIsDraftAnalysisLoading] = useState(false);
    const [draftAnalysisError, setDraftAnalysisError] = useState<string | null>(null);

    const laneToRoleMap: Record<Lane, Role> = {
        'EXP': 'Soldado',
        'SELVA': 'Assassino',
        'MEIO': 'Mago',
        'OURO': 'Atirador',
        'ROTAÇÃO': 'Suporte'
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const fetchedHeroes = await fetchHeroes();
                
                Object.values(fetchedHeroes).forEach(hero => {
                    hero.roles = HERO_ROLES[hero.name] || [];
                });

                const heroLanesMap: Record<number, Lane[]> = {};
                for (const hero of Object.values(fetchedHeroes)) {
                    if (hero.apiId && HERO_LANES_DATA[hero.name]) {
                        heroLanesMap[hero.apiId] = HERO_LANES_DATA[hero.name];
                    }
                }

                setHeroes(fetchedHeroes);
                setHeroLanes(heroLanesMap);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
                setHeroLoadingError(`Falha ao carregar dados iniciais: ${errorMessage} Tente atualizar a página.`);
            } finally {
                setIsLoadingHeroes(false);
            }
        };
        loadInitialData();
    }, []);
    
    const heroApiIdMap = useMemo(() => {
        return Object.values(heroes).reduce((acc, hero) => {
            if (hero.apiId) {
                acc[hero.apiId] = hero;
            }
            return acc;
        }, {} as Record<number, Hero>);
    }, [heroes]);

     useEffect(() => {
        if (Object.keys(heroes).length === 0) return;

        const fetchRankings = async () => {
            setIsRankingsLoading(true);
            setRankingsError(null);
            try {
                const sortFieldApi = sortField === 'pick_rate' ? 'appearance_rate' : sortField;
                const rankingsData: ApiHeroRankData[] = await fetchHeroRankings(rankDays, rankCategory, sortFieldApi);
                
                const mappedRankings: HeroRankInfo[] = rankingsData
                    .map(data => {
                        const hero = Object.values(heroes).find(h => h.apiId === data.main_heroid);
                        if (!hero) return null;

                        return {
                            hero: hero,
                            winRate: data.main_hero_win_rate,
                            pickRate: data.main_hero_appearance_rate,
                            banRate: data.main_hero_ban_rate
                        };
                    })
                    .filter((r): r is HeroRankInfo => r !== null);
                
                setHeroRankings(mappedRankings);

            } catch (error) {
                setRankingsError(error instanceof Error ? error.message : "Erro desconhecido.");
            } finally {
                setIsRankingsLoading(false);
            }
        };

        fetchRankings();
    }, [rankDays, rankCategory, sortField, heroes]);
    
    useEffect(() => {
        const calculateBanSuggestions = async () => {
            if (heroRankings.length === 0) {
                setBanSuggestions([]);
                return;
            }
    
            const yourHero = matchupAllyPick ? heroes[matchupAllyPick] : null;
            const rankLabel: Record<RankCategory, string> = { all: "Todos", epic: "Épico", legend: "Lenda", mythic: "Mítico", honor: "Honra", glory: "Glória" };
    
            const metaBans = [...heroRankings]
                .sort((a, b) => b.banRate - a.banRate)
                .slice(0, 8)
                .map(rankInfo => ({
                    hero: rankInfo.hero,
                    reason: `Taxa de banimento de ${(rankInfo.banRate * 100).toFixed(1)}% no elo ${rankLabel[rankCategory]}.`
                }));
    
            if (!yourHero || !yourHero.apiId) {
                setBanSuggestions(metaBans);
                return;
            }
    
            try {
                const counterData = await fetchCounters(yourHero.apiId);
                const personalCounters = counterData
                    .sort((a, b) => b.increase_win_rate - a.increase_win_rate)
                    .slice(0, 3)
                    .map(data => {
                        const hero = heroApiIdMap[data.heroid];
                        if (!hero) return null;
                        return {
                            hero,
                            reason: `Forte counter para ${yourHero.name} (+${(data.increase_win_rate * 100).toFixed(1)}% de vitória).`
                        };
                    })
                    .filter((s): s is BanSuggestion => s !== null);
    
                const combinedSuggestions = [...personalCounters];
                const personalCounterIds = new Set(personalCounters.map(s => s.hero.id));
                
                for (const metaBan of metaBans) {
                    if (combinedSuggestions.length >= 8) break;
                    if (!personalCounterIds.has(metaBan.hero.id)) {
                        combinedSuggestions.push(metaBan);
                    }
                }
                setBanSuggestions(combinedSuggestions);
            } catch (error) {
                console.error("Erro ao buscar counters para sugestão de ban:", error);
                setBanSuggestions(metaBans); // Fallback para meta bans
            }
        };
    
        calculateBanSuggestions();
    }, [heroRankings, rankCategory, matchupAllyPick, heroes, heroApiIdMap]);
    
    const handleAnalysis = async () => {
        if (!matchupEnemyPick) return;
    
        setIs1v1AnalysisLoading(true);
        setAnalysisResult(null);
        setAnalysisError(null);
        setMatchupData(null);
        setMatchupError(null);
    
        try {
            const yourHero = matchupAllyPick ? heroes[matchupAllyPick] : null;
            const enemyHero = heroes[matchupEnemyPick];
            if (!enemyHero?.apiId) throw new Error("Herói inimigo inválido.");
    
            const performStrategicAnalysis = async (lane: LaneOrNone, isPerfectAnalysis: boolean = false): Promise<{ heroSuggestions: HeroSuggestion[], correctedItems: ItemSuggestion[], relevantCounterHeroes: any[] }> => {
                const isAnyLane = lane === 'NENHUMA';
                const roleForAnalysis: Role | 'Qualquer' = isAnyLane ? 'Qualquer' : laneToRoleMap[lane as Lane];
                const counterData = await fetchCounters(enemyHero.apiId);
                
                const heroesForRole = isAnyLane 
                    ? Object.values(heroes) 
                    : Object.values(heroes).filter(h => h.roles.includes(roleForAnalysis as Role));
                
                const relevantCounterHeroes = counterData
                    .map(c => heroApiIdMap[c.heroid])
                    .filter((hero): hero is Hero => !!hero && (isAnyLane || heroesForRole.some(h => h.id === hero.id)))
                    .map(hero => ({ ...hero, increase_win_rate: counterData.find(c => c.heroid === hero.apiId)!.increase_win_rate }))
                    .filter(c => c.increase_win_rate > 0.01)
                    .sort((a, b) => b.increase_win_rate - a.increase_win_rate);
    
                let potentialCounters: Array<Hero & { increase_win_rate?: number }> = [];
                let isTheoretical = false;
                const TOTAL_CANDIDATES_FOR_AI = isPerfectAnalysis ? 4 : 7;
    
                if (relevantCounterHeroes.length >= 2) {
                    potentialCounters = relevantCounterHeroes.slice(0, TOTAL_CANDIDATES_FOR_AI);
                } else {
                    isTheoretical = true;
                    potentialCounters = [...relevantCounterHeroes];
                    const theoreticalCandidates = heroesForRole
                        .filter(h => h.name !== enemyHero.name && !potentialCounters.some(pc => pc.id === h.id))
                        .sort((a, b) => (HERO_EXPERT_RANK[b.name] || 5) - (HERO_EXPERT_RANK[a.name] || 5));
                    potentialCounters.push(...theoreticalCandidates.slice(0, TOTAL_CANDIDATES_FOR_AI - potentialCounters.length));
    
                    if (potentialCounters.length === 0) {
                        throw new Error(isAnyLane ? `Nenhum herói foi encontrado para análise.` : `Nenhum herói da função '${roleForAnalysis}' foi encontrado para análise.`);
                    }
                }
    
                const allHeroesForDetails = [enemyHero, ...potentialCounters];
                const detailsToFetch = allHeroesForDetails.filter(h => h.apiId && !heroDetailsCache[h.apiId]);
                let newCacheEntries: Record<number, HeroDetails> = {};
                
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
                
                const analysisFromAI = await getStrategicAnalysis(enemyHeroDetails, lane, potentialCountersDetails, roleForAnalysis, isTheoretical);
                const validItemNames = GAME_ITEMS.map(item => item.nome);
                const validSpellNames = Object.keys(SPELL_ICONS);
    
                const heroSuggestions: HeroSuggestion[] = analysisFromAI.sugestoesHerois.map((aiSuggestion): HeroSuggestion => {
                    const heroData = Object.values(heroes).find(h => h.name === aiSuggestion.nome);
                    const stat = relevantCounterHeroes.find(c => c.name === aiSuggestion.nome);
                    const winRateIncrease = stat?.increase_win_rate || 0;
                    const classificacao: 'ANULA' | 'VANTAGEM' = (isTheoretical || !stat) ? 'VANTAGEM' : (winRateIncrease > 0.04 ? 'ANULA' : 'VANTAGEM');
                    const correctedSpells = aiSuggestion.spells.map(spell => ({ ...spell, nome: findClosestString(spell.nome, validSpellNames) }));
                    return {
                        nome: aiSuggestion.nome,
                        motivo: aiSuggestion.motivo,
                        avisos: aiSuggestion.avisos || [],
                        spells: correctedSpells,
                        imageUrl: heroData?.imageUrl || '',
                        classificacao,
                        estatistica: (isTheoretical || !stat) ? 'Análise Tática' : `+${(winRateIncrease * 100).toFixed(1)}% vs. ${enemyHero.name}`
                    };
                });

                const hasAnula = heroSuggestions.some(s => s.classificacao === 'ANULA');
                if (!isPerfectAnalysis && !hasAnula && heroSuggestions.length > 0) {
                    const sortedByWinRate = [...heroSuggestions].sort((a, b) => {
                        const statA = relevantCounterHeroes.find(c => c.name === a.nome)?.increase_win_rate || 0;
                        const statB = relevantCounterHeroes.find(c => c.name === b.nome)?.increase_win_rate || 0;
                        return statB - statA;
                    });
                    const bestHeroToPromote = sortedByWinRate[0];
                    if (bestHeroToPromote) {
                        const anulaHero = { ...bestHeroToPromote, classificacao: 'ANULA' as const };
                        heroSuggestions.push(anulaHero);
                    }
                }
    
                const correctedItems: ItemSuggestion[] = analysisFromAI.sugestoesItens.map(item => {
                    const correctedName = findClosestString(item.nome, validItemNames);
                    const gameItem = GAME_ITEMS.find(i => i.nome === correctedName);
                    return { nome: correctedName, motivo: item.motivo, preco: gameItem?.preco || 0 };
                });
    
                return { heroSuggestions, correctedItems, relevantCounterHeroes };
            };
    
            const strategicTask = async () => {
                try {
                    if (activeLane === 'NENHUMA') {
                        const { heroSuggestions, correctedItems, relevantCounterHeroes } = await performStrategicAnalysis('NENHUMA');
                        const sortedSuggestions = heroSuggestions.sort((a, b) => (relevantCounterHeroes.find(c => c.name === b.nome)?.increase_win_rate || 0) - (relevantCounterHeroes.find(c => c.name === a.nome)?.increase_win_rate || 0));

                        if (sortedSuggestions.length > 0) {
                            // Promove o melhor counter estatístico a 'PERFEITO'.
                            const perfectSuggestion = { ...sortedSuggestions[0], classificacao: 'PERFEITO' as const };
                            const otherSuggestions = sortedSuggestions.slice(1);
                            
                            setAnalysisResult({ 
                                sugestoesHerois: [perfectSuggestion, ...otherSuggestions], 
                                sugestoesItens: correctedItems 
                            });
                        } else {
                            // Lida com o caso de não haver sugestões.
                            setAnalysisResult({ sugestoesHerois: sortedSuggestions, sugestoesItens: correctedItems });
                        }
                    } else {
                        const [laneResult, perfectResult] = await Promise.all([
                            performStrategicAnalysis(activeLane, false),
                            performStrategicAnalysis('NENHUMA', true)
                        ]);
    
                        const perfectSuggestionRaw = perfectResult.heroSuggestions
                            .sort((a, b) => (perfectResult.relevantCounterHeroes.find(c => c.name === b.nome)?.increase_win_rate || 0) - (perfectResult.relevantCounterHeroes.find(c => c.name === a.nome)?.increase_win_rate || 0))[0];
    
                        const perfectSuggestion = perfectSuggestionRaw ? { ...perfectSuggestionRaw, classificacao: 'PERFEITO' as const } : null;
                        
                        let combinedSuggestions = laneResult.heroSuggestions.sort((a, b) => (laneResult.relevantCounterHeroes.find(c => c.name === b.nome)?.increase_win_rate || 0) - (laneResult.relevantCounterHeroes.find(c => c.name === a.nome)?.increase_win_rate || 0));
    
                        if (perfectSuggestion) {
                            combinedSuggestions = combinedSuggestions.filter(s => s.nome !== perfectSuggestion.nome);
                            combinedSuggestions.unshift(perfectSuggestion);
                        }
    
                        setAnalysisResult({
                            sugestoesHerois: combinedSuggestions,
                            sugestoesItens: laneResult.correctedItems
                        });
                    }
                } catch (error) {
                    setAnalysisError(error instanceof Error ? error.message : "Ocorreu um erro desconhecido ao buscar a análise.");
                    throw error;
                }
            };
    
            const matchupTask = async () => {
                if (!yourHero || !yourHero.apiId || !enemyHero || !enemyHero.apiId || activeLane === 'NENHUMA') return;
                try {
                    const heroesForDetails = [yourHero, enemyHero];
                    const detailsToFetch = heroesForDetails.filter(h => h.apiId && !heroDetailsCache[h.apiId]);
                    let newCacheEntries: Record<number, HeroDetails> = {};
                    
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
                    
                    if (!yourHeroDetails || !enemyHeroDetails) throw new Error("Não foi possível carregar os detalhes dos heróis para o confronto.");
    
                    const enemyCounters = await fetchCounters(enemyHero.apiId);
                    const matchupStat = enemyCounters.find(counter => counter.heroid === yourHero.apiId);
                    let winRate = matchupStat?.increase_win_rate ?? 0;
                    if (winRate === 0) {
                        const yourCounters = await fetchCounters(yourHero.apiId);
                        const counterMatchupStat = yourCounters.find(counter => counter.heroid === enemyHero.apiId);
                        if (counterMatchupStat) winRate = -counterMatchupStat.increase_win_rate;
                    }
    
                    const analysis = await getDetailedMatchupAnalysis(yourHeroDetails, enemyHeroDetails, activeLane as Lane, winRate);
                    
                    const validSpellNames = Object.keys(SPELL_ICONS);
                    const correctedSpell = { ...analysis.recommendedSpell, nome: findClosestString(analysis.recommendedSpell.nome, validSpellNames) };
    
                    setMatchupData({ yourHero, enemyHero, winRate, classification: analysis.classification, detailedAnalysis: analysis.detailedAnalysis, recommendedSpell: correctedSpell });
                } catch (error) {
                    setMatchupError(error instanceof Error ? error.message : "Erro desconhecido na análise de confronto.");
                    throw error;
                }
            };
    
            await Promise.all([strategicTask(), matchupTask()]);
    
        } catch (err) {
            console.error("Erro durante a análise 1v1:", err);
        } finally {
            setIs1v1AnalysisLoading(false);
        }
    };
    
    useEffect(() => {
        if (gameMode !== '5v5' || Object.keys(heroes).length === 0) return;

        const runDraftAnalysis = async () => {
            const pickedAllyHeroes = draftAllyPicks.map(id => id ? heroes[id] : null).filter((h): h is Hero => h !== null);
            const pickedEnemyHeroes = draftEnemyPicks.map(id => id ? heroes[id] : null).filter((h): h is Hero => h !== null);

            if (pickedAllyHeroes.length === 0 && pickedEnemyHeroes.length === 0) {
                setDraftAnalysis(null);
                setDraftAnalysisError(null);
                return;
            }

            setIsDraftAnalysisLoading(true);
            setDraftAnalysis(null);
            setDraftAnalysisError(null);

            try {
                const allPickedHeroes = [...pickedAllyHeroes, ...pickedEnemyHeroes];
                const detailsToFetch = allPickedHeroes.filter(h => h.apiId && !heroDetailsCache[h.apiId]);
                let newCacheEntries: Record<number, HeroDetails> = {};
                
                if (detailsToFetch.length > 0) {
                    const fetchedDetails = await Promise.all(
                        detailsToFetch.map(h => fetchHeroDetails(h.apiId).then(details => ({ apiId: h.apiId, details })))
                    );
                    fetchedDetails.forEach(item => { newCacheEntries[item.apiId] = item.details; });
                    setHeroDetailsCache(prev => ({ ...prev, ...newCacheEntries }));
                }
                
                const currentCache = { ...heroDetailsCache, ...newCacheEntries };
                const allyDetails = pickedAllyHeroes.map(h => currentCache[h.apiId]).filter((d): d is HeroDetails => !!d);
                const enemyDetails = pickedEnemyHeroes.map(h => currentCache[h.apiId]).filter((d): d is HeroDetails => !!d);

                const pickedHeroIds = new Set(allPickedHeroes.map(h => h.id));
                const availableHeroes = Object.values(heroes).filter(h => !pickedHeroIds.has(h.id));
                
                const analysisFromAI = await getDraftAnalysis(allyDetails, enemyDetails, availableHeroes);

                let nextPick: NextPickSuggestion | null = null;
                if (analysisFromAI.nextPickSuggestion) {
                    const heroData = Object.values(heroes).find(h => h.name === analysisFromAI.nextPickSuggestion?.heroName);
                    const role = findClosestString(analysisFromAI.nextPickSuggestion.role, ROLES as any) as Role;
                    if (heroData) {
                        nextPick = {
                            heroName: heroData.name,
                            imageUrl: heroData.imageUrl,
                            role: role || heroData.roles[0] || 'Soldado',
                            reason: analysisFromAI.nextPickSuggestion.reason,
                        };
                    }
                }

                const validItemNames = GAME_ITEMS.map(item => item.nome);
                const strategicItems: StrategicItemSuggestion[] = analysisFromAI.strategicItems.map(item => {
                    const correctedName = findClosestString(item.name, validItemNames);
                    const gameItem = GAME_ITEMS.find(i => i.nome === correctedName);
                    return {
                        name: correctedName,
                        reason: item.reason,
                        preco: gameItem?.preco || 0,
                    };
                });
                
                setDraftAnalysis({
                    ...analysisFromAI,
                    nextPickSuggestion: nextPick,
                    strategicItems: strategicItems,
                });

            } catch (error) {
                setDraftAnalysisError(error instanceof Error ? error.message : "Erro desconhecido ao analisar o draft.");
            } finally {
                setIsDraftAnalysisLoading(false);
            }
        };

        const debounceTimeout = setTimeout(runDraftAnalysis, 1000);
        return () => clearTimeout(debounceTimeout);

    }, [draftAllyPicks, draftEnemyPicks, gameMode, heroes, heroDetailsCache]);

    const handleSlotClick = (team: Team, index: number) => {
        setActiveSlot({ team, index });
        setIsModalOpen(true);
    };

    const handleHeroSelect = (heroId: string) => {
        if (!activeSlot) return;

        const { team, index } = activeSlot;

        if (gameMode === '1v1') {
            if (team === 'ally') {
                setMatchupAllyPick(heroId);
            } else {
                setMatchupEnemyPick(heroId);
            }
            // Reset results on any hero change in 1v1
            setAnalysisResult(null); 
            setAnalysisError(null);
            setMatchupData(null); 
            setMatchupError(null);
        } else { // 5v5 mode
            if (team === 'ally') {
                const newPicks = [...draftAllyPicks];
                newPicks[index] = heroId;
                setDraftAllyPicks(newPicks);
            } else {
                const newPicks = [...draftEnemyPicks];
                newPicks[index] = heroId;
                setDraftEnemyPicks(newPicks);
            }
        }
        
        setIsModalOpen(false);
        setActiveSlot(null);
    };
    
    const handleClearDraft = () => {
        setDraftAllyPicks(Array(5).fill(null));
        setDraftEnemyPicks(Array(5).fill(null));
        setDraftAnalysis(null);
        setDraftAnalysisError(null);
    };

    const tabs = [
        {
            label: "Confronto Direto",
            content: <DirectMatchupPanel isLoading={is1v1AnalysisLoading} data={matchupData} error={matchupError} />
        },
        {
            label: "Sinergias",
            content: <SynergyPanel 
                selectedHeroId={matchupAllyPick}
                heroes={heroes}
                heroApiIdMap={heroApiIdMap}
            />
        }
    ];

    if (isLoadingHeroes) {
        return <LoadingOverlay message={'CARREGANDO'} />;
    }

    if (heroLoadingError) {
        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50 text-center">
                <p className="text-red-500 p-8 text-xl font-semibold">{heroLoadingError}</p>
            </div>
        );
    }

    const renderContent = () => {
        if (gameMode === '1v1') {
            return (
                 <div className="flex flex-col gap-6">
                    {/* Top Section: Hero Matchup & Controls */}
                    <div className="grid grid-cols-2 lg:grid-cols-11 gap-4 lg:gap-6 items-start">
                        {/* Ally Hero Column */}
                        <div className="col-span-1 lg:col-span-3 flex flex-col gap-2 glassmorphism p-3 rounded-xl border-2 panel-glow-blue">
                            <h2 className="text-xl font-black text-center text-blue-300 tracking-wider">SEU HERÓI</h2>
                            <HeroSlot 
                                type="ally" 
                                heroId={matchupAllyPick} 
                                heroes={heroes} 
                                onClick={() => handleSlotClick('ally', 0)}
                                label="Selecione"
                            />
                        </div>

                        {/* Enemy Hero Column */}
                        <div className="col-span-1 lg:col-span-3 lg:order-3 flex flex-col gap-2 glassmorphism p-3 rounded-xl border-2 panel-glow-red">
                            <h2 className="text-xl font-black text-center text-red-300 tracking-wider">INIMIGO</h2>
                            <HeroSlot 
                                type="enemy" 
                                heroId={matchupEnemyPick} 
                                heroes={heroes} 
                                onClick={() => handleSlotClick('enemy', 0)}
                                label="Selecione"
                            />
                        </div>

                        {/* Center Controls Column */}
                        <div className="col-span-2 lg:col-span-5 lg:order-2 flex flex-col items-center gap-4">
                            <div className="w-full max-w-lg">
                                <CollapsibleTutorial title="Como Analisar um Confronto">
                                    <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-gray-300">
                                        <li>Selecione <strong className="text-blue-300">seu herói</strong> no painel azul.</li>
                                        <li>Selecione o <strong className="text-red-300">herói inimigo</strong> no painel vermelho.</li>
                                        <li>Escolha a <strong className="text-amber-300">lane</strong> do confronto abaixo. (Selecione "NENHUMA" para sugestões gerais).</li>
                                        <li>Clique em <strong className="text-amber-300">"Analisar"</strong> para a IA gerar as sugestões com base em dados reais.</li>
                                    </ol>
                                </CollapsibleTutorial>
                            </div>
                            <div className="w-full max-w-lg">
                                <LaneSelector 
                                    activeLane={activeLane} 
                                    onSelectLane={setActiveLane} 
                                    isDisabled={is1v1AnalysisLoading}
                                />
                            </div>
                            <div className="w-full max-w-lg animated-entry" style={{ animationDelay: '150ms' }}>
                                <button
                                    onClick={handleAnalysis}
                                    disabled={!matchupEnemyPick || is1v1AnalysisLoading}
                                    className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-3 px-4 rounded-lg text-lg hover:from-violet-400 hover:to-fuchsia-400 transition-all duration-300 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-violet-500/40 disabled:shadow-none transform hover:scale-105"
                                >
                                    {is1v1AnalysisLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                <circle className="opacity-25" cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 10a6 6 0 016-6v2a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                            Analisando...
                                        </>
                                    ) : (
                                        'Analisar Confronto'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Ban Suggestions Section */}
                    <BanSuggestions
                        suggestions={banSuggestions}
                        isLoading={isRankingsLoading}
                        variant="1v1"
                    />

                    {/* Bottom Section: Detailed Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <AnalysisPanel 
                            isLoading={is1v1AnalysisLoading}
                            result={analysisResult}
                            error={analysisError}
                            activeLane={activeLane as Lane}
                        />
                        <TabbedPanel tabs={tabs} />
                    </div>
                </div>
            );
        }
        if (gameMode === '5v5') {
            return (
                <DraftScreen
                    allyPicks={draftAllyPicks}
                    enemyPicks={draftEnemyPicks}
                    heroes={heroes}
                    onSlotClick={handleSlotClick}
                    banSuggestions={banSuggestions}
                    isBanLoading={isRankingsLoading}
                    draftAnalysis={draftAnalysis}
                    isDraftAnalysisLoading={isDraftAnalysisLoading}
                    draftAnalysisError={draftAnalysisError}
                    onClearDraft={handleClearDraft}
                />
            );
        }
        if (gameMode === 'ranking') {
            return (
                <div className="w-full max-w-4xl mx-auto animated-entry">
                    <div className="glassmorphism p-4 sm:p-6 rounded-xl border-2 panel-glow-primary">
                        <HeroRankings 
                            isLoading={isRankingsLoading}
                            rankings={heroRankings}
                            error={rankingsError}
                            activeDays={rankDays}
                            onDaysChange={setRankDays}
                            activeRank={rankCategory}
                            onRankChange={setRankCategory}
                            activeSort={sortField}
                            onSortChange={setSortField}
                        />
                    </div>
                </div>
            );
        }
        if (gameMode === 'item') {
            return <ItemDatabaseScreen />;
        }
        return null;
    };


    return (
        <div className="flex flex-col min-h-screen p-4 sm:p-6 lg:p-8">
            <Header activeMode={gameMode} onSetMode={setGameMode} />

            <main className="w-full max-w-7xl mx-auto flex-grow">
                {renderContent()}
            </main>

            <HeroSelectionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onHeroSelect={handleHeroSelect}
                heroes={heroes}
                heroLanes={heroLanes}
            />
            <Footer />
        </div>
    );
};

export default App;