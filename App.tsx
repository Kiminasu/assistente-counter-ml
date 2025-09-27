import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Hero, Lane, AnalysisResult, LANES, ROLES, Role, HeroSuggestion, BanSuggestion, MatchupData, ItemSuggestion, RankCategory, RankDays, SortField, HeroRankInfo, Team, DraftAnalysisResult, NextPickSuggestion, StrategicItemSuggestion, LaneOrNone, HeroDetails, HeroRelation, SynergyAnalysisPayload } from './types';
import { fetchHeroes, fetchCounters, fetchHeroDetails, fetchHeroRankings, ApiHeroRankData, fetchHeroRelations } from './services/heroService';
import { getStrategicAnalysis, getDetailedMatchupAnalysis, getDraftAnalysis, getSynergyAnalysis } from './services/geminiService';
import { findClosestString } from './utils';
import { SPELL_ICONS } from './constants';
import { HERO_EXPERT_RANK } from './components/data/heroData';
import { GAME_ITEMS } from './components/data/items';
import { HERO_CATEGORIZATION } from './components/data/heroCategorization';
import { MANUAL_HERO_DATA } from './components/data/manualHeroData';
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
import SynergyExplorerScreen from './components/SynergyExplorerScreen';
import HeroDatabaseScreen from './components/HeroDatabaseScreen';

type GameMode = '1v1' | '5v5' | 'ranking' | 'item' | 'synergy' | 'heroes';

const NUMBER_OF_META_BAN_SUGGESTIONS = 8;
const NUMBER_OF_COUNTER_BAN_SUGGESTIONS = 6;
const INITIAL_COUNTERS_TO_FETCH = 12; // Fetch more to account for filtering

const App: React.FC = () => {
    const [heroes, setHeroes] = useState<Record<string, Hero>>({});
    const [isLoadingHeroes, setIsLoadingHeroes] = useState(true);
    const [heroLoadingError, setHeroLoadingError] = useState<string | null>(null);

    const [gameMode, setGameMode] = useState<GameMode>('synergy');

    // State for 1v1 mode
    const [matchupAllyPick, setMatchupAllyPick] = useState<string | null>(null);
    const [matchupEnemyPick, setMatchupEnemyPick] = useState<string | null>(null);
    const [is1v1AnalysisLoading, setIs1v1AnalysisLoading] = useState(false);
    
    // State for 5v5 mode
    const [draftAllyPicks, setDraftAllyPicks] = useState<(string | null)[]>(Array(5).fill(null));
    const [draftEnemyPicks, setDraftEnemyPicks] = useState<(string | null)[]>(Array(5).fill(null));

    // State for Synergy mode
    const [synergyHeroPick, setSynergyHeroPick] = useState<string | null>(null);

    const [activeLane, setActiveLane] = useState<LaneOrNone>('NENHUMA'); 

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSlot, setActiveSlot] = useState<{ team: Team | 'synergy'; index: number } | null>(null);

    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const [counterBanSuggestions, setCounterBanSuggestions] = useState<BanSuggestion[]>([]);
    const [metaBanSuggestions, setMetaBanSuggestions] = useState<BanSuggestion[]>([]);

    const [matchupData, setMatchupData] = useState<MatchupData | null>(null);
    const [matchupError, setMatchupError] = useState<string | null>(null);
    
    // FIX: Add states for synergy data in 1v1 mode tab.
    const [synergyRelations1v1, setSynergyRelations1v1] = useState<HeroRelation | null>(null);
    const [synergyAnalysis1v1, setSynergyAnalysis1v1] = useState<SynergyAnalysisPayload | null>(null);
    const [synergyError1v1, setSynergyError1v1] = useState<string | null>(null);
    const [isSynergyLoading1v1, setIsSynergyLoading1v1] = useState(false);

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
    const [isMetaBansLoading, setIsMetaBansLoading] = useState(false);
    const [rankingsError, setRankingsError] = useState<string | null>(null);
    const [rankDays, setRankDays] = useState<RankDays>(7);
    const [rankCategory, setRankCategory] = useState<RankCategory>('mythic');
    const [sortField, setSortField] = useState<SortField>('win_rate');
    const [metaBanRankCategory, setMetaBanRankCategory] = useState<RankCategory>('glory');

    const [heroLanes, setHeroLanes] = useState<Record<number, Lane[]>>({});

    const [draftAnalysis, setDraftAnalysis] = useState<DraftAnalysisResult | null>(null);
    const [isDraftAnalysisLoading, setIsDraftAnalysisLoading] = useState(false);
    const [draftAnalysisError, setDraftAnalysisError] = useState<string | null>(null);

    const analysisSectionRef = useRef<HTMLDivElement>(null);

    const laneToRoleMap: Record<Lane, Role> = useMemo(() => ({
        'EXP': 'Soldado',
        'SELVA': 'Assassino',
        'MEIO': 'Mago',
        'OURO': 'Atirador',
        'ROTAÇÃO': 'Suporte'
    }), []);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const fetchedHeroesFromApi = await fetchHeroes();
                
                // Merge manual data with API data. API data takes precedence.
                const allHeroesData = { ...MANUAL_HERO_DATA, ...fetchedHeroesFromApi };

                const enrichedHeroes: Record<string, Hero> = {};
                const heroLanesMap: Record<number, Lane[]> = {};

                for (const heroId in allHeroesData) {
                    const baseHero = allHeroesData[heroId as keyof typeof allHeroesData];
                    const categorization = HERO_CATEGORIZATION[baseHero.name];
                    
                    const enrichedHero: Hero = {
                        ...baseHero,
                        roles: categorization?.roles || [],
                    };
                    
                    enrichedHeroes[heroId] = enrichedHero;

                    if (baseHero.apiId && categorization?.lanes) {
                        heroLanesMap[baseHero.apiId] = categorization.lanes;
                    }
                }
                
                setHeroes(enrichedHeroes);
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
        return Object.values(heroes).reduce((acc, hero: Hero) => {
            if (hero.apiId) {
                acc[hero.apiId] = hero;
            }
            return acc;
        }, {} as Record<number, Hero>);
    }, [heroes]);

    // Efeito para buscar rankings para a tela de "Ranking"
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
                        const hero = heroApiIdMap[data.main_heroid];
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
    }, [rankDays, rankCategory, sortField, heroes, heroApiIdMap]);

    // Efeito para buscar e definir as sugestões de banimento "Meta" com base no elo selecionado
    useEffect(() => {
        if (Object.keys(heroes).length === 0) return;

        const fetchAndSetMetaBans = async () => {
            setIsMetaBansLoading(true);
            try {
                const metaRankDays: RankDays = 7;
                // Busca por taxa de escolha ('appearance_rate') para mais estabilidade da API, e ordena por ban_rate no cliente.
                const rankingsData: ApiHeroRankData[] = await fetchHeroRankings(metaRankDays, metaBanRankCategory, 'appearance_rate');
                
                const rankLabel: Record<RankCategory, string> = { all: "Todos", epic: "Épico", legend: "Lenda", mythic: "Mítico", honor: "Honra", glory: "Glória" };

                const metaBans = rankingsData
                    .sort((a, b) => b.main_hero_ban_rate - a.main_hero_ban_rate)
                    .map(data => {
                        const hero = heroApiIdMap[data.main_heroid];
                        if (!hero) return null;
                        return {
                            hero,
                            reason: `Taxa de banimento de ${(data.main_hero_ban_rate * 100).toFixed(1)}% no elo ${rankLabel[metaBanRankCategory]}.`
                        };
                    })
                    .filter((s): s is BanSuggestion => s !== null)
                    .slice(0, NUMBER_OF_META_BAN_SUGGESTIONS);

                setMetaBanSuggestions(metaBans);
            } catch (error) {
                console.error("Falha ao buscar sugestões de banimento meta:", error);
                setMetaBanSuggestions([]);
            } finally {
                setIsMetaBansLoading(false);
            }
        };

        fetchAndSetMetaBans();
    }, [heroes, heroApiIdMap, metaBanRankCategory]);


    // Efeito para calcular as sugestões de banimento "Counter"
    useEffect(() => {
        const calculateCounterBans = async () => {
            let personalCounters: BanSuggestion[] = [];
            try {
                const heroIdForCounters = gameMode === '1v1' ? matchupAllyPick : synergyHeroPick;

                if ((gameMode === '1v1' || gameMode === 'synergy') && heroIdForCounters) {
                    const yourHero = heroes[heroIdForCounters];
                    if (yourHero?.apiId) {
                        const counterData = await fetchCounters(yourHero.apiId);
                        personalCounters = counterData
                            .sort((a, b) => b.increase_win_rate - a.increase_win_rate)
                            .slice(0, INITIAL_COUNTERS_TO_FETCH)
                            .map(data => {
                                const hero = heroApiIdMap[data.heroid];
                                if (!hero) return null;
                                return {
                                    hero,
                                    reason: `Forte counter para ${yourHero.name} (+${(data.increase_win_rate * 100).toFixed(1)}% de vitória).`
                                };
                            })
                            .filter((s): s is BanSuggestion => s !== null)
                            .slice(0, NUMBER_OF_COUNTER_BAN_SUGGESTIONS);
                    }
                } else if (gameMode === '5v5') {
                    const pickedAllyHeroes = draftAllyPicks
                        .map(id => id ? heroes[id] : null)
                        .filter((h): h is Hero => h !== null && !!h.apiId);

                    if (pickedAllyHeroes.length > 0) {
                        const counterPromises = pickedAllyHeroes.map(hero => fetchCounters(hero.apiId));
                        const allCountersData = await Promise.all(counterPromises);
                        
                        const aggregatedCounters: Record<number, { hero: Hero; count: number; totalWinRate: number }> = {};
                        const pickedHeroIds = new Set([...draftAllyPicks, ...draftEnemyPicks].filter(Boolean));

                        allCountersData.flat().forEach(counter => {
                            const hero = heroApiIdMap[counter.heroid];
                            if (!hero || pickedHeroIds.has(hero.id)) return;

                            if (aggregatedCounters[counter.heroid]) {
                                aggregatedCounters[counter.heroid].count++;
                                aggregatedCounters[counter.heroid].totalWinRate += counter.increase_win_rate;
                            } else {
                                aggregatedCounters[counter.heroid] = { hero, count: 1, totalWinRate: counter.increase_win_rate };
                            }
                        });

                        personalCounters = Object.values(aggregatedCounters)
                            .sort((a, b) => {
                                if (b.count !== a.count) return b.count - a.count;
                                return (b.totalWinRate / b.count) - (a.totalWinRate / a.count);
                            })
                            .slice(0, INITIAL_COUNTERS_TO_FETCH)
                            .map(agg => ({
                                hero: agg.hero,
                                reason: `Countera ${agg.count} herói(s) aliado(s). Ameaça: +${((agg.totalWinRate / agg.count) * 100).toFixed(1)}% de vitória.`
                            }))
                            .slice(0, NUMBER_OF_COUNTER_BAN_SUGGESTIONS);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar counters para sugestão de ban:", error);
                personalCounters = [];
            }
            setCounterBanSuggestions(personalCounters);
        };

        calculateCounterBans();
    }, [matchupAllyPick, draftAllyPicks, draftEnemyPicks, synergyHeroPick, gameMode, heroes, heroApiIdMap]);
    
    // FIX: Add useEffect to fetch synergy data for the 1v1 mode tab.
    useEffect(() => {
        if (gameMode !== '1v1' || !matchupAllyPick) {
            setSynergyRelations1v1(null);
            setSynergyAnalysis1v1(null);
            setSynergyError1v1(null);
            setIsSynergyLoading1v1(false);
            return;
        }

        const fetchSynergyData = async () => {
            setIsSynergyLoading1v1(true);
            setSynergyError1v1(null);
            setSynergyRelations1v1(null);
            setSynergyAnalysis1v1(null);
            try {
                const selectedHero = heroes[matchupAllyPick!];
                if (!selectedHero || !selectedHero.apiId) {
                    throw new Error("Herói aliado inválido para análise de sinergia.");
                }

                const relationsData = await fetchHeroRelations(selectedHero.apiId);
                setSynergyRelations1v1(relationsData);

                const selectedHeroDetails = await fetchHeroDetails(selectedHero.apiId);

                const strongAgainstHeroes = (relationsData?.strong?.target_hero_id || [])
                    .map(id => heroApiIdMap[id])
                    .filter((h): h is Hero => !!h);

                const strongAgainstDetails = (await Promise.all(
                    strongAgainstHeroes.map(h => fetchHeroDetails(h.apiId))
                )).filter((d): d is HeroDetails => !!d);
                
                if (strongAgainstDetails.length > 0) {
                    const analysisResult = await getSynergyAnalysis(selectedHeroDetails, [], strongAgainstDetails);
                    setSynergyAnalysis1v1(analysisResult);
                }

            } catch (err) {
                setSynergyError1v1(err instanceof Error ? err.message : "Falha ao carregar dados de sinergia.");
            } finally {
                setIsSynergyLoading1v1(false);
            }
        };

        fetchSynergyData();
    }, [matchupAllyPick, gameMode, heroes, heroApiIdMap]);

    const handleAnalysis = useCallback(async () => {
        if (!matchupEnemyPick) return;
        
        setTimeout(() => {
            analysisSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    
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
                    ? (Object.values(heroes) as Hero[])
                    : (Object.values(heroes) as Hero[]).filter((h: Hero) => h.roles.includes(roleForAnalysis as Role));
                
                const relevantCounterHeroes = counterData
                    .map(c => heroApiIdMap[c.heroid])
                    .filter((hero): hero is Hero => !!hero && (isAnyLane || heroesForRole.some((h: Hero) => h.id === hero.id)))
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
                        .filter((h: Hero) => h.name !== enemyHero.name && !potentialCounters.some(pc => pc.id === h.id))
                        .sort((a: Hero, b: Hero) => (HERO_EXPERT_RANK[b.name] || 5) - (HERO_EXPERT_RANK[a.name] || 5));
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
                    const heroData = (Object.values(heroes) as Hero[]).find((h: Hero) => h.name === aiSuggestion.nome);
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
                            const perfectSuggestion = { ...sortedSuggestions[0], classificacao: 'PERFEITO' as const };
                            const otherSuggestions = sortedSuggestions.slice(1);
                            
                            setAnalysisResult({ 
                                sugestoesHerois: [perfectSuggestion, ...otherSuggestions], 
                                sugestoesItens: correctedItems 
                            });
                        } else {
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
    }, [matchupEnemyPick, matchupAllyPick, heroes, activeLane, heroDetailsCache, heroApiIdMap, laneToRoleMap]);
    
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

                const pickedHeroIds = new Set(allPickedHeroes.map((h: Hero) => h.id));
                const availableHeroes = (Object.values(heroes) as Hero[]).filter((h: Hero) => !pickedHeroIds.has(h.id));
                
                const analysisFromAI = await getDraftAnalysis(allyDetails, enemyDetails, availableHeroes);

                let nextPick: NextPickSuggestion | null = null;
                if (analysisFromAI.nextPickSuggestion) {
                    const heroData = (Object.values(heroes) as Hero[]).find((h: Hero) => h.name === analysisFromAI.nextPickSuggestion?.heroName);
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
                    // FIX: Removed @ts-ignore and fallback to `item.itemName` as the schema in geminiService now correctly specifies `name`.
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

    const handleSlotClick = useCallback((team: Team | 'synergy', index: number) => {
        setActiveSlot({ team, index });
        setIsModalOpen(true);
    }, []);

    const handleHeroSelect = useCallback((heroId: string) => {
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
        } else if (gameMode === '5v5') {
            if (team === 'ally') {
                const newPicks = [...draftAllyPicks];
                newPicks[index] = heroId;
                setDraftAllyPicks(newPicks);
            } else {
                const newPicks = [...draftEnemyPicks];
                newPicks[index] = heroId;
                setDraftEnemyPicks(newPicks);
            }
        } else if (gameMode === 'synergy' && team === 'synergy') {
            setSynergyHeroPick(heroId);
        }
        
        setIsModalOpen(false);
        setActiveSlot(null);
    }, [activeSlot, gameMode, draftAllyPicks, draftEnemyPicks]);
    
    const handleClear1v1Slot = useCallback((team: Team) => {
        if (team === 'ally') {
            setMatchupAllyPick(null);
        } else {
            setMatchupEnemyPick(null);
        }
        setAnalysisResult(null);
        setAnalysisError(null);
        setMatchupData(null);
        setMatchupError(null);
    }, []);

    const handleClearDraft = useCallback(() => {
        setDraftAllyPicks(Array(5).fill(null));
        setDraftEnemyPicks(Array(5).fill(null));
        setDraftAnalysis(null);
        setDraftAnalysisError(null);
    }, []);

    const handleClearDraftSlot = useCallback((team: Team, index: number) => {
        if (team === 'ally') {
            const newPicks = [...draftAllyPicks];
            newPicks[index] = null;
            setDraftAllyPicks(newPicks);
        } else {
            const newPicks = [...draftEnemyPicks];
            newPicks[index] = null;
            setDraftEnemyPicks(newPicks);
        }
    }, [draftAllyPicks, draftEnemyPicks]);

    const tabs = useMemo(() => [
        {
            label: "Confronto Direto",
            content: <DirectMatchupPanel isLoading={is1v1AnalysisLoading} data={matchupData} error={matchupError} />
        },
        {
            label: "Sinergias",
// FIX: Pass correct props to SynergyPanel and use the new state variables for synergy data.
            content: <SynergyPanel 
                isLoading={isSynergyLoading1v1}
                error={synergyError1v1}
                relations={synergyRelations1v1}
                analysis={synergyAnalysis1v1}
                heroApiIdMap={heroApiIdMap}
            />
        }
    ], [is1v1AnalysisLoading, matchupData, matchupError, isSynergyLoading1v1, synergyError1v1, synergyRelations1v1, synergyAnalysis1v1, heroApiIdMap]);

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
                    <CollapsibleTutorial title="Como Analisar um Confronto">
                        <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-gray-300">
                           <li>Selecione o <strong className="text-red-300">herói inimigo</strong>. (Obrigatório)</li>
                           <li>Selecione <strong className="text-blue-300">seu herói</strong>. (Opcional, para análise direta e sinergias).</li>
                           <li>Escolha a <strong className="text-amber-300">lane</strong> do confronto abaixo. (Selecione "NENHUMA" para sugestões gerais).</li>
                           <li>Clique em <strong className="text-violet-500">"Analisar Confronto"</strong> para a IA gerar as sugestões.</li>
                       </ol>
                    </CollapsibleTutorial>

                    {/* Top Section: Hero Matchup */}
                    <div className="grid grid-cols-2 gap-4 items-start">
                        {/* Ally Hero Column */}
                        <div className="col-span-1 flex flex-col gap-2 glassmorphism p-3 rounded-2xl border-2 panel-glow-blue">
                            <h2 className="text-xl font-black text-center text-blue-300 tracking-wider">SEU HERÓI</h2>
                            <HeroSlot 
                                type="ally" 
                                heroId={matchupAllyPick} 
                                heroes={heroes} 
                                onClick={() => handleSlotClick('ally', 0)}
                                onClear={() => handleClear1v1Slot('ally')}
                                label="Opcional"
                            />
                        </div>

                        {/* Enemy Hero Column */}
                        <div className="col-span-1 flex flex-col gap-2 glassmorphism p-3 rounded-2xl border-2 panel-glow-red">
                            <h2 className="text-xl font-black text-center text-red-300 tracking-wider">INIMIGO</h2>
                            <HeroSlot 
                                type="enemy" 
                                heroId={matchupEnemyPick} 
                                heroes={heroes} 
                                onClick={() => handleSlotClick('enemy', 0)}
                                onClear={() => handleClear1v1Slot('enemy')}
                                label="Selecione"
                            />
                        </div>
                    </div>

                    <div className="glassmorphism p-4 rounded-2xl animated-entry border-2 panel-glow-primary flex flex-col gap-4">
                        <LaneSelector 
                            activeLane={activeLane} 
                            onSelectLane={setActiveLane} 
                            isDisabled={is1v1AnalysisLoading}
                        />
                         <button
                            onClick={handleAnalysis}
                            disabled={!matchupEnemyPick || is1v1AnalysisLoading}
                            className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-3 px-4 rounded-xl text-lg hover:from-violet-400 hover:to-fuchsia-400 transition-all duration-300 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-violet-500/40 disabled:shadow-none transform hover:scale-105"
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

                    {/* Ban Suggestions Section */}
                    <BanSuggestions
                        counterSuggestions={counterBanSuggestions}
                        metaSuggestions={metaBanSuggestions}
                        isLoading={isMetaBansLoading}
                        variant="1v1"
                        activeMetaRank={metaBanRankCategory}
                        onMetaRankChange={setMetaBanRankCategory}
                    />

                    {/* Bottom Section: Detailed Analysis */}
                    <div ref={analysisSectionRef} className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
                        {/* Tabs Panel - now visually first on mobile */}
                        <div className="order-1 lg:order-2">
                            <TabbedPanel tabs={tabs} />
                        </div>
                        {/* Analysis Panel - now visually second on mobile */}
                        <div className="order-2 lg:order-1">
                             <AnalysisPanel 
                                isLoading={is1v1AnalysisLoading}
                                result={analysisResult}
                                error={analysisError}
                            />
                        </div>
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
                    onClearSlot={handleClearDraftSlot}
                    counterBanSuggestions={counterBanSuggestions}
                    metaBanSuggestions={metaBanSuggestions}
                    isBanLoading={isMetaBansLoading}
                    draftAnalysis={draftAnalysis}
                    isDraftAnalysisLoading={isDraftAnalysisLoading}
                    draftAnalysisError={draftAnalysisError}
                    onClearDraft={handleClearDraft}
                    activeMetaRank={metaBanRankCategory}
                    onMetaRankChange={setMetaBanRankCategory}
                />
            );
        }
        if (gameMode === 'ranking') {
            return (
                <div className="w-full max-w-4xl mx-auto animated-entry">
                    <div className="glassmorphism p-4 sm:p-6 rounded-2xl border-2 panel-glow-primary">
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
        if (gameMode === 'synergy') {
            return <SynergyExplorerScreen 
                selectedHeroId={synergyHeroPick}
                heroes={heroes}
                heroApiIdMap={heroApiIdMap}
                onHeroSelectClick={() => handleSlotClick('synergy', 0)}
                onClearHero={() => setSynergyHeroPick(null)}
                counterBanSuggestions={counterBanSuggestions}
                metaBanSuggestions={metaBanSuggestions}
                isBanLoading={isMetaBansLoading}
                activeMetaRank={metaBanRankCategory}
                onMetaRankChange={setMetaBanRankCategory}
            />;
        }
        if (gameMode === 'heroes') {
            return <HeroDatabaseScreen heroes={heroes} heroLanes={heroLanes} />;
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
