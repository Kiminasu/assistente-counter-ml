import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
// FIX: Import AILaneRecommendation to handle the new analysis object.
import { Hero, Lane, AnalysisResult, LANES, ROLES, Role, HeroSuggestion, BanSuggestion, MatchupData, ItemSuggestion, RankCategory, RankDays, SortField, HeroRankInfo, Team, DraftAnalysisResult, NextPickSuggestion, StrategicItemSuggestion, LaneOrNone, HeroDetails, HeroRelation, HeroStrategy, UserSignupRank, GameMode, AITacticalCounter, HeroStrategicAnalysis, UserProfile, AILaneRecommendation } from './types';
import { fetchHeroes, fetchHeroCounterStats, fetchHeroDetails, fetchHeroRankings, ApiHeroRankData, fetchHeroRelations, fetchHeroPositionsData } from './services/heroService';
import { getCombined1v1Analysis, getDraftAnalysis, getHeroStrategicAnalysis } from './services/geminiService';
import { findClosestString } from './utils';
import { SPELL_ICONS } from './constants';
import { HERO_EXPERT_RANK } from './components/data/heroData';
import { GAME_ITEMS } from './components/data/items';
import { MANUAL_HERO_DATA } from './components/data/manualHeroData';
import { MANUAL_SYNERGY_DATA } from './components/data/synergyData';
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
import AuthScreen from './AuthScreen';
import UserProfileModal from './components/UserProfileModal';
import UpgradeModal from './components/UpgradeModal';
import PremiumScreen from './components/PremiumScreen';
import DashboardScreen from './components/DashboardScreen';
import { supabase } from './supabaseClient';

const DAILY_ANALYSIS_LIMIT = 5;

const NUMBER_OF_META_BAN_SUGGESTIONS = 8;

const App: React.FC = () => {
    // Verificação de configuração do Supabase.
    if (!supabase) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <div className="w-full max-w-lg glassmorphism p-8 rounded-2xl border-2 panel-glow-red">
                    <h1 className="text-3xl font-bold text-red-400 mb-4">CONFIGURAÇÃO INCOMPLETA</h1>
                    <p className="text-slate-300 mb-2">
                        A aplicação não conseguiu se conectar ao backend.
                    </p>
                    <p className="text-slate-300 mb-6">
                        Parece que as credenciais do Supabase ainda não foram adicionadas. Por favor, siga estes passos:
                    </p>
                    <ol className="text-left text-slate-400 space-y-3 bg-black/30 p-4 rounded-lg">
                        <li>1. Abra o arquivo <code className="bg-slate-800 text-amber-300 px-2 py-1 rounded">supabaseClient.ts</code> no seu editor.</li>
                        <li>2. Copie a <b className="text-white">URL do Projeto</b> e a chave <b className="text-white">anon public</b> das configurações da API do seu projeto Supabase.</li>
                        <li>3. Cole esses valores nas variáveis `supabaseUrl` e `supabaseAnonKey`.</li>
                        <li>4. Salve o arquivo. A aplicação será atualizada automaticamente.</li>
                    </ol>
                </div>
            </div>
        );
    }

    const [session, setSession] = useState<Session | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isProfileChecked, setIsProfileChecked] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    const [heroes, setHeroes] = useState<Record<string, Hero>>({});
    const [isLoadingApp, setIsLoadingApp] = useState(true);
    const [heroLoadingError, setHeroLoadingError] = useState<string | null>(null);

    const [gameMode, setGameMode] = useState<GameMode>('dashboard');
    const [paymentStatusMessage, setPaymentStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);


    // State for 1v1 mode
    const [matchupAllyPick, setMatchupAllyPick] = useState<string | null>(null);
    const [matchupEnemyPick, setMatchupEnemyPick] = useState<string | null>(null);
    const [is1v1AnalysisLoading, setIs1v1AnalysisLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("CARREGANDO ANÁLISE...");
    
    // State for 5v5 mode
    const [draftAllyPicks, setDraftAllyPicks] = useState<(string | null)[]>(Array(5).fill(null));
    const [draftEnemyPicks, setDraftEnemyPicks] = useState<(string | null)[]>(Array(5).fill(null));

    // State for Synergy mode
    const [synergyHeroPick, setSynergyHeroPick] = useState<string | null>(null);
    const [heroStrategicAnalysis, setHeroStrategicAnalysis] = useState<HeroStrategicAnalysis | null>(null);
    const [strategicAnalysisError, setStrategicAnalysisError] = useState<string | null>(null);
    const [synergyRelations, setSynergyRelations] = useState<HeroRelation | null>(null);
    const [synergyError, setSynergyError] = useState<string | null>(null);
    const [isSynergyAnalysisLoading, setIsSynergyAnalysisLoading] = useState(false);
    // FIX: Add state for perfect lane counters feature.
    const [perfectLaneCounters, setPerfectLaneCounters] = useState<HeroSuggestion[]>([]);
    const [perfectLaneCountersError, setPerfectLaneCountersError] = useState<string | null>(null);


    const [activeLane, setActiveLane] = useState<LaneOrNone>('NENHUMA'); 

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSlot, setActiveSlot] = useState<{ team: Team | 'synergy'; index: number } | null>(null);

    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const [counterBanSuggestions, setCounterBanSuggestions] = useState<BanSuggestion[]>([]);
    const [metaBanSuggestions, setMetaBanSuggestions] = useState<BanSuggestion[]>([]);

    const [matchupData, setMatchupData] = useState<MatchupData | null>(null);
    const [matchupError, setMatchupError] = useState<string | null>(null);
    
    const [synergyRelations1v1, setSynergyRelations1v1] = useState<HeroRelation | null>(null);
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

    const fetchUserProfile = useCallback(async (user: { id: string }) => {
        if (!supabase) return;
        const { data, error } = await supabase
            .from('profiles')
            .select('username, rank, subscription_status, analysis_count, last_analysis_at, subscription_expires_at')
            .eq('id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') { // Ignore "0 rows" error
            console.error("Erro ao buscar perfil:", error);
            setUserProfile(null);
        } else {
            setUserProfile(data as UserProfile | null);
        }
    }, []);

    const effectiveSubscriptionStatus = useMemo(() => {
        if (userProfile?.subscription_status === 'premium' && userProfile.subscription_expires_at) {
            return new Date(userProfile.subscription_expires_at) > new Date() ? 'premium' : 'free';
        }
        return 'free';
    }, [userProfile]);


    useEffect(() => {
        const handleAuthChange = async (session: Session | null) => {
            setIsProfileChecked(false);
            setSession(session);
            if (session?.user) {
                await fetchUserProfile(session.user);
            } else {
                setUserProfile(null);
            }
            setIsProfileChecked(true);
        };

        if (supabase) {
            supabase.auth.getSession().then(({ data: { session } }) => {
                handleAuthChange(session);
            });
    
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                handleAuthChange(session);
            });
    
            return () => subscription.unsubscribe();
        }
    }, [fetchUserProfile]);

     useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('payment');
        if (paymentStatus) {
            if (paymentStatus === 'success') {
                setPaymentStatusMessage({ type: 'success', text: 'Pagamento bem-sucedido! Sua conta foi atualizada para Premium.' });
                // Refetch user profile to get updated subscription status
                if (session?.user) {
                    fetchUserProfile(session.user);
                }
            } else if (paymentStatus === 'failure') {
                setPaymentStatusMessage({ type: 'error', text: 'O pagamento falhou. Por favor, tente novamente.' });
            }
            // Clean up the URL
            window.history.replaceState(null, '', window.location.pathname);
            
            // Hide message after a few seconds
            setTimeout(() => setPaymentStatusMessage(null), 7000);
        }
    }, [session, fetchUserProfile]);


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
    const [metaBanRankCategory, setMetaBanRankCategory] = useState<RankCategory | null>(null);

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
                const [fetchedHeroesFromApi, positionsData] = await Promise.all([
                    fetchHeroes(),
                    fetchHeroPositionsData()
                ]);
                
                const allHeroesData = { ...MANUAL_HERO_DATA, ...fetchedHeroesFromApi };

                const enrichedHeroes: Record<string, Hero> = {};
                const heroLanesMap: Record<number, Lane[]> = {};

                for (const heroId in allHeroesData) {
                    const baseHero = allHeroesData[heroId as keyof typeof allHeroesData];
                    const categorization = positionsData[baseHero.apiId];
                    
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
                setIsLoadingApp(false);
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
    
    useEffect(() => {
        let interval: number;
        if (is1v1AnalysisLoading) {
            const messages = [
                "Analisando as fraquezas do oponente...",
                "Calculando os melhores counters táticos...",
                "Gerando builds de itens estratégicos...",
                "Compilando a estratégia final...",
            ];
            let messageIndex = 0;
            setLoadingMessage(messages[messageIndex]);
            interval = window.setInterval(() => {
                messageIndex = (messageIndex + 1) % messages.length;
                setLoadingMessage(messages[messageIndex]);
            }, 2500); // Change message every 2.5 seconds
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [is1v1AnalysisLoading]);

    useEffect(() => {
        if (Object.keys(heroes).length === 0) return;

        const fetchRankings = async () => {
            setIsRankingsLoading(true);
            setRankingsError(null);
            try {
                const rankingsData: ApiHeroRankData[] = await fetchHeroRankings(rankDays, rankCategory, sortField);
                
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
    
    useEffect(() => {
        // Only set the initial rank for meta bans.
        if (metaBanRankCategory !== null) return;
    
        // Wait until we have checked for a profile.
        if (!isProfileChecked) return;
    
        if (session) { // User is logged in.
            if (userProfile) { // And profile exists.
                const lowerRanks = ['Guerreiro', 'Elite', 'Mestre', 'Grão-Mestre'];
                if (lowerRanks.includes(userProfile.rank)) {
                    setMetaBanRankCategory('mythic');
                } else {
                    setMetaBanRankCategory('glory');
                }
            } else {
                // User is logged in, but no profile was found. Default to 'glory'.
                setMetaBanRankCategory('glory');
            }
        } else { // User is logged out.
            setMetaBanRankCategory('glory');
        }
    }, [userProfile, session, metaBanRankCategory, isProfileChecked]);

    useEffect(() => {
        if (Object.keys(heroes).length === 0 || !metaBanRankCategory) return;

        const fetchAndSetMetaBans = async () => {
            setIsMetaBansLoading(true);
            try {
                const metaRankDays: RankDays = 7;
                const rankingsData: ApiHeroRankData[] = await fetchHeroRankings(metaRankDays, metaBanRankCategory, 'pick_rate');
                
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

    // Reseta sugestões de ban de counter ao mudar de modo para evitar mostrar sugestões incorretas
    useEffect(() => {
        setCounterBanSuggestions([]);
    }, [gameMode]);
    
    useEffect(() => {
        if (gameMode !== '1v1' || !matchupAllyPick) {
            setSynergyRelations1v1(null);
            setSynergyError1v1(null);
            setIsSynergyLoading1v1(false);
            return;
        }

        const fetchSynergyData = async () => {
            setIsSynergyLoading1v1(true);
            setSynergyError1v1(null);
            setSynergyRelations1v1(null);
            try {
                const selectedHero = heroes[matchupAllyPick!];
                if (!selectedHero || !selectedHero.apiId) {
                    throw new Error("Herói aliado inválido para análise de sinergia.");
                }

                const relationsData = await fetchHeroRelations(selectedHero.apiId, heroes, heroApiIdMap);
                
                setSynergyRelations1v1(relationsData);
            } catch (err) {
                setSynergyError1v1(err instanceof Error ? err.message : "Falha ao carregar dados de sinergia.");
            } finally {
                setIsSynergyLoading1v1(false);
            }
        };

        fetchSynergyData();
    }, [matchupAllyPick, gameMode, heroes, heroApiIdMap]);

    // FIX: Consolidate state resets for strategic analysis.
    useEffect(() => {
        if (!synergyHeroPick) {
            setHeroStrategicAnalysis(null);
            setStrategicAnalysisError(null);
            setSynergyRelations(null);
            setSynergyError(null);
            setIsSynergyAnalysisLoading(false);
            setCounterBanSuggestions([]);
            setPerfectLaneCounters([]);
            setPerfectLaneCountersError(null);
        }
    }, [synergyHeroPick]);
    
    const checkAnalysisLimit = useCallback(() => {
        if (!userProfile) return false;
        if (effectiveSubscriptionStatus === 'premium') return true;

        const today = new Date().toISOString().split('T')[0];
        const lastAnalysisDate = userProfile.last_analysis_at ? new Date(userProfile.last_analysis_at).toISOString().split('T')[0] : null;

        if (lastAnalysisDate === today && userProfile.analysis_count >= DAILY_ANALYSIS_LIMIT) {
            setIsUpgradeModalOpen(true);
            return false;
        }
        return true;
    }, [userProfile, effectiveSubscriptionStatus]);

    const processAIBanSuggestions = (suggestions: AITacticalCounter[]): BanSuggestion[] => {
        return suggestions.map(suggestion => {
            const heroData = Object.values(heroes).find((h: Hero) => h.name === suggestion.heroName);
            return heroData ? { hero: heroData, reason: suggestion.reason } : null;
        }).filter((s): s is BanSuggestion => s !== null);
    };


    const handleSynergyAnalysis = useCallback(async () => {
        if (!checkAnalysisLimit() || !synergyHeroPick) return;
    
        const selectedHero = heroes[synergyHeroPick];
        if (!selectedHero || !selectedHero.apiId) return;
    
        setIsSynergyAnalysisLoading(true);
        // FIX: Reset consolidated state objects.
        setHeroStrategicAnalysis(null);
        setStrategicAnalysisError(null);
        setSynergyRelations(null);
        setSynergyError(null);
        setCounterBanSuggestions([]);
        setPerfectLaneCounters([]);
        setPerfectLaneCountersError(null);
        
        // Fetch hero details (only for the selected hero)
        const getDetails = async (hero: Hero): Promise<HeroDetails> => {
            if (heroDetailsCache[hero.apiId]) return heroDetailsCache[hero.apiId];
            if (!hero.apiId) throw new Error(`API ID for ${hero.name} not found.`);
            const details = await fetchHeroDetails(hero.apiId);
            setHeroDetailsCache(prev => ({...prev, [hero.apiId]: details}));
            return details;
        };
    
        // Parallel fetching: AI analysis and statistical relations
        try {
            const heroToAnalyzeDetails = await getDetails(selectedHero);

            const [analysisResult, relationsData] = await Promise.all([
                getHeroStrategicAnalysis(heroToAnalyzeDetails),
                fetchHeroRelations(selectedHero.apiId, heroes, heroApiIdMap)
            ]);
    
            // FIX: Process and set the entire strategic analysis object.
            const { strategy, tacticalCounters: aiCounters, perfectLaneCounters: aiLaneCounters } = analysisResult;
            const validItemNames = GAME_ITEMS.map(item => item.nome);
            const correctedCoreItems = strategy.coreItems.map(item => ({ ...item, nome: findClosestString(item.nome, validItemNames) }));
            const correctedSituationalItems = strategy.situationalItems.map(item => ({ ...item, nome: findClosestString(item.nome, validItemNames) }));
            
            setHeroStrategicAnalysis({
                strategy: { ...strategy, coreItems: correctedCoreItems, situationalItems: correctedSituationalItems },
                tacticalCounters: aiCounters,
                perfectLaneCounters: aiLaneCounters
            });
            
            setCounterBanSuggestions(processAIBanSuggestions(aiCounters));
            
            // FIX: Process the new perfectLaneCounters array
            if (aiLaneCounters) {
                const validSpellNames = Object.keys(SPELL_ICONS);
                const laneCounters: HeroSuggestion[] = aiLaneCounters.map(rec => {
                    const heroData = (Object.values(heroes) as Hero[]).find(h => h.name === rec.heroName);
                    const correctedSpells = (rec.spells || []).map(spell => ({ ...spell, nome: findClosestString(spell.nome, validSpellNames) }));

                    return {
                        nome: rec.heroName,
                        imageUrl: heroData?.imageUrl || '',
                        motivo: rec.reason,
                        avisos: rec.warnings || [],
                        classificacao: 'PERFEITO',
                        estatistica: `Counter para a ${rec.lane}`,
                        spells: correctedSpells,
                        lane: rec.lane
                    };
                });
                setPerfectLaneCounters(laneCounters);
            }

            // Process statistical synergy result
            setSynergyRelations(relationsData);

            if (session?.user) await fetchUserProfile(session.user);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erro na análise estratégica da IA.";
            // FIX: Set a single error state for all parts of the analysis.
            setStrategicAnalysisError(errorMessage);
            setSynergyError(errorMessage);
            setPerfectLaneCountersError(errorMessage);
        } finally {
            setIsSynergyAnalysisLoading(false);
        }
    }, [synergyHeroPick, heroes, heroApiIdMap, heroDetailsCache, checkAnalysisLimit, session, fetchUserProfile]);

    const handleNavigateToHeroAnalysis = useCallback((heroId: string) => {
        setSynergyHeroPick(heroId);
        setGameMode('synergy');
    }, []);

    const handleAnalysis = useCallback(async () => {
        if (!matchupEnemyPick || !checkAnalysisLimit()) return;
        
        setTimeout(() => {
            analysisSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    
        setIs1v1AnalysisLoading(true);
        setAnalysisResult(null);
        setAnalysisError(null);
        setMatchupData(null);
        setMatchupError(null);
        setCounterBanSuggestions([]);
    
        const enemyHero = heroes[matchupEnemyPick];
        const yourHero = matchupAllyPick ? heroes[matchupAllyPick] : null;
    
        if (!enemyHero?.apiId) {
            setAnalysisError("Herói inimigo inválido.");
            setIs1v1AnalysisLoading(false);
            return;
        }
    
        try {
            const isAnyLane = activeLane === 'NENHUMA';
            const roleForAnalysis: Role | 'Qualquer' = isAnyLane ? 'Qualquer' : laneToRoleMap[activeLane as Lane];
    
            // Otimização: Buscar detalhes apenas dos heróis necessários
            const heroesForDetails = [enemyHero, yourHero].filter((h): h is Hero => h !== null);
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
            const enemyHeroDetails = currentCache[enemyHero.apiId];
            const yourHeroDetails = yourHero ? currentCache[yourHero.apiId] : null;
    
            if (!enemyHeroDetails) {
                throw new Error("Falha ao carregar detalhes do herói inimigo para a análise.");
            }
            
            // Otimização: Buscar winrate em paralelo com a chamada da IA (se possível)
            let winRate: number | null = null;
            if (yourHero && yourHero.apiId && enemyHero.apiId) {
                 const enemyCounterStats = await fetchHeroCounterStats(enemyHero.apiId);
                 const matchupStat = enemyCounterStats.counters.find(counter => counter.heroid === yourHero.apiId);
                 let wr = matchupStat?.increase_win_rate ?? 0;
                 if (wr === 0) {
                     const yourCounterStats = await fetchHeroCounterStats(yourHero.apiId);
                     const counterMatchupStat = yourCounterStats.counters.find(counter => counter.heroid === enemyHero.apiId);
                     if (counterMatchupStat) wr = -counterMatchupStat.increase_win_rate;
                 }
                 winRate = wr;
            }
    
            // Otimização: Chamar IA com dados mínimos
            const combinedAnalysis = await getCombined1v1Analysis(
                enemyHeroDetails,
                activeLane,
                roleForAnalysis,
                yourHero,
                yourHeroDetails,
                winRate
            );
            if (session?.user) await fetchUserProfile(session.user);
    
            // Após a resposta da IA, buscar dados estatísticos para enriquecer a UI
            const { counters: counterData } = await fetchHeroCounterStats(enemyHero.apiId);
            const allStatCounters = counterData
                .map(c => ({ hero: heroApiIdMap[c.heroid], increase_win_rate: c.increase_win_rate }))
                .filter((item): item is { hero: Hero; increase_win_rate: number } => !!item.hero)
                .sort((a, b) => b.increase_win_rate - a.increase_win_rate);

            const { strategicAnalysis, matchupAnalysis, banSuggestions } = combinedAnalysis;
    
            setCounterBanSuggestions(processAIBanSuggestions(banSuggestions));
            
            const validItemNames = GAME_ITEMS.map(item => item.nome);
            const validSpellNames = Object.keys(SPELL_ICONS);
    
            const aiHeroSuggestions = strategicAnalysis?.sugestoesHerois || [];
            const aiItemSuggestions = strategicAnalysis?.sugestoesItens || [];

            const heroSuggestions: HeroSuggestion[] = aiHeroSuggestions.map((aiSuggestion): HeroSuggestion => {
                const heroData = (Object.values(heroes) as Hero[]).find((h: Hero) => h.name === aiSuggestion.nome);
                const stat = allStatCounters.find(c => c.hero.name === aiSuggestion.nome);
                const winRateIncrease = stat?.increase_win_rate || 0;
                const classificacao: 'ANULA' | 'VANTAGEM' = (winRateIncrease > 0.04 && activeLane !== 'NENHUMA' ? 'ANULA' : 'VANTAGEM');
                const correctedSpells = (aiSuggestion.spells || []).map(spell => ({ ...spell, nome: findClosestString(spell.nome, validSpellNames) }));
                return {
                    nome: aiSuggestion.nome,
                    motivo: aiSuggestion.motivo,
                    avisos: aiSuggestion.avisos || [],
                    spells: correctedSpells,
                    imageUrl: heroData?.imageUrl || '',
                    classificacao,
                    estatistica: !stat ? 'Análise Tática' : `+${(winRateIncrease * 100).toFixed(1)}% vs. ${enemyHero.name}`
                };
            });
    
            const correctedItems: ItemSuggestion[] = aiItemSuggestions.map(item => {
                const correctedName = findClosestString(item.nome, validItemNames);
                const gameItem = GAME_ITEMS.find(i => i.nome === correctedName);
                return { nome: correctedName, motivo: item.motivo, preco: gameItem?.preco || 0 };
            });
            
            setAnalysisResult({ sugestoesHerois: heroSuggestions, sugestoesItens: correctedItems });
    
            if (matchupAnalysis && yourHero && winRate != null) {
                const correctedSpell = { ...matchupAnalysis.recommendedSpell, nome: findClosestString(matchupAnalysis.recommendedSpell.nome, validSpellNames) };
                setMatchupData({ 
                    yourHero, 
                    enemyHero, 
                    winRate, 
                    classification: matchupAnalysis.classification, 
                    detailedAnalysis: matchupAnalysis.detailedAnalysis, 
                    recommendedSpell: correctedSpell 
                });
            }
    
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido ao buscar a análise.";
            setAnalysisError(errorMessage);
            setMatchupError(errorMessage);
        } finally {
            setIs1v1AnalysisLoading(false);
        }
    }, [matchupEnemyPick, matchupAllyPick, heroes, activeLane, heroDetailsCache, heroApiIdMap, laneToRoleMap, checkAnalysisLimit, session, fetchUserProfile]);
    
    const runDraftAnalysis = useCallback(async () => {
        if (!checkAnalysisLimit()) return;
        const pickedAllyHeroes = draftAllyPicks.map(id => id ? heroes[id] : null).filter((h): h is Hero => h !== null);
        const pickedEnemyHeroes = draftEnemyPicks.map(id => id ? heroes[id] : null).filter((h): h is Hero => h !== null);

        if (pickedAllyHeroes.length === 0 && pickedEnemyHeroes.length === 0) {
            setDraftAnalysis(null);
            setDraftAnalysisError(null);
            setCounterBanSuggestions([]);
            return;
        }

        setIsDraftAnalysisLoading(true);
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
             if (session?.user) await fetchUserProfile(session.user);

            setCounterBanSuggestions(processAIBanSuggestions(analysisFromAI.banSuggestions));

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
    }, [draftAllyPicks, draftEnemyPicks, heroes, heroDetailsCache, checkAnalysisLimit, session, fetchUserProfile]);


    useEffect(() => {
        if (gameMode !== '5v5' || Object.keys(heroes).length === 0) return;
        const debounceTimeout = setTimeout(runDraftAnalysis, 500);
        return () => clearTimeout(debounceTimeout);
    }, [draftAllyPicks, draftEnemyPicks, gameMode, heroes, runDraftAnalysis]);

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

    const handleSetGameMode = useCallback((mode: GameMode) => {
        setGameMode(mode);
    }, []);

    const tabs = useMemo(() => [
        {
            label: "Confronto Direto",
            content: <DirectMatchupPanel isLoading={is1v1AnalysisLoading} data={matchupData} error={matchupError} />
        },
        {
            label: "Sinergias",
            content: <SynergyPanel 
                isLoading={isSynergyLoading1v1}
                error={synergyError1v1}
                relations={synergyRelations1v1}
                heroApiIdMap={heroApiIdMap}
                tacticalCounters={[]} // Not used in 1v1 mode
                heroes={heroes}
            />
        }
    ], [is1v1AnalysisLoading, matchupData, matchupError, isSynergyLoading1v1, synergyError1v1, synergyRelations1v1, heroApiIdMap, heroes]);

    if (isLoadingApp) {
        return <LoadingOverlay message={'CARREGANDO DADOS...'} />;
    }

    if (heroLoadingError) {
        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50 text-center">
                <p className="text-red-500 p-8 text-xl font-semibold">{heroLoadingError}</p>
            </div>
        );
    }
    
    if (!session) {
        return <AuthScreen />;
    }

    const renderContent = () => {
        if (gameMode === 'dashboard') {
            return <DashboardScreen 
                heroes={heroes}
                heroApiIdMap={heroApiIdMap}
                onNavigateToHeroAnalysis={handleNavigateToHeroAnalysis}
                onSetMode={handleSetGameMode}
                userProfile={userProfile}
                effectiveSubscriptionStatus={effectiveSubscriptionStatus}
            />
        }
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

                    <div className="grid grid-cols-2 gap-4 items-start">
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

                    <BanSuggestions
                        counterSuggestions={counterBanSuggestions}
                        metaSuggestions={metaBanSuggestions}
                        isLoading={isMetaBansLoading}
                        variant="1v1"
                        activeMetaRank={metaBanRankCategory}
                        onMetaRankChange={setMetaBanRankCategory}
                    />

                    <div ref={analysisSectionRef} className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
                        <div className="order-1 lg:order-2">
                            <TabbedPanel tabs={tabs} />
                        </div>
                        <div className="order-2 lg:order-1">
                             <AnalysisPanel 
                                isLoading={is1v1AnalysisLoading}
                                loadingMessage={loadingMessage}
                                result={analysisResult}
                                error={analysisError}
                                activeLane={activeLane}
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
                    userProfile={userProfile}
                    onUpgradeClick={() => setIsUpgradeModalOpen(true)}
                    effectiveSubscriptionStatus={effectiveSubscriptionStatus}
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
                isMetaBansLoading={isMetaBansLoading}
                // FIX: Pass metaBanRankCategory state variable instead of undefined 'activeMetaRank'
                activeMetaRank={metaBanRankCategory}
                onMetaRankChange={setMetaBanRankCategory}
                onAnalyze={handleSynergyAnalysis}
                isAnalysisLoading={isSynergyAnalysisLoading}
                strategyAnalysis={heroStrategicAnalysis}
                strategyAnalysisError={strategicAnalysisError}
                synergyRelations={synergyRelations}
                synergyError={synergyError}
                perfectLaneCounters={perfectLaneCounters}
                perfectLaneCountersError={perfectLaneCountersError}
            />;
        }
        if (gameMode === 'heroes') {
            return <HeroDatabaseScreen heroes={heroes} heroLanes={heroLanes} />;
        }
        if (gameMode === 'premium') {
            return <PremiumScreen userProfile={userProfile} />;
        }
        return null;
    };


    return (
        <div className="flex flex-col min-h-screen p-4 sm:p-6 lg:p-8">
            {paymentStatusMessage && (
                <div className={`fixed top-5 right-5 z-[100] p-4 rounded-lg shadow-lg text-white animated-entry ${paymentStatusMessage.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {paymentStatusMessage.text}
                </div>
            )}
            <Header 
                activeMode={gameMode} 
                onSetMode={handleSetGameMode}
                session={session}
                userProfile={userProfile}
                onLogout={() => supabase && supabase.auth.signOut()}
                onEditProfile={() => setIsProfileModalOpen(true)}
                onUpgradeClick={() => setGameMode('premium')}
                analysisLimit={DAILY_ANALYSIS_LIMIT}
                effectiveSubscriptionStatus={effectiveSubscriptionStatus}
            />

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
            {isProfileModalOpen && userProfile && session?.user && (
                 <UserProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    userProfile={userProfile}
                    userId={session.user.id}
                    onProfileUpdate={() => fetchUserProfile(session.user!)}
                />
            )}
            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                onUpgradeClick={() => {
                    setIsUpgradeModalOpen(false);
                    setGameMode('premium');
                }}
            />
            <Footer />
        </div>
    );
};

export default App;