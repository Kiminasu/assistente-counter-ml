import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { Hero, Lane, AnalysisResult, LANES, ROLES, Role, HeroSuggestion, BanSuggestion, MatchupData, ItemSuggestion, RankCategory, RankDays, SortField, HeroRankInfo, Team, DraftAnalysisResult, NextPickSuggestion, StrategicItemSuggestion, LaneOrNone, HeroDetails, HeroRelation, HeroStrategy, UserSignupRank, GameMode, AITacticalCounter, HeroStrategicAnalysis, UserProfile, AILaneRecommendation, SpellSuggestion, AnalysisHistoryItem } from './types';
import { fetchHeroes, fetchHeroCounterStats, fetchHeroDetails, fetchHeroRankings, ApiHeroRankData, fetchHeroRelations, fetchHeroPositionsData } from './services/heroService';
import { getCombined1v1Analysis, getDraftAnalysis, getHeroStrategicAnalysis } from './services/geminiService';
import { findClosestString } from './utils';
import { SPELL_ICONS } from './constants';
import { GAME_ITEMS } from './components/data/items';
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
import DraftScreen from './DraftScreen';
import SynergyPanel from './components/SynergyPanel';
import HeroSlot from './components/HeroSlot';
import ItemDatabaseScreen from './components/ItemDatabaseScreen';
import CollapsibleTutorial from './components/CollapsibleTutorial';
import SynergyExplorerScreen from './SynergyExplorerScreen';
import HeroDatabaseScreen from './components/HeroDatabaseScreen';
import AuthScreen from './AuthScreen';
import UserProfileModal from './components/UserProfileModal';
import UpgradeModal from './components/UpgradeModal';
import PremiumScreen from './components/PremiumScreen';
import DashboardScreen from './components/DashboardScreen';
import { supabase } from './supabaseClient';
import LandingPage from './components/LandingPage';
import FeaturesPage from './components/FeaturesPage';
import HistoryScreen from './components/HistoryScreen';
import TeamsScreen from './components/TeamsScreen';

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

    const [view, setView] = useState<'landing' | 'app' | 'login' | 'features'>('landing');

    const [session, setSession] = useState<Session | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isPremium, setIsPremium] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
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
        } catch (error: any) {
            console.error("Erro ao ler o cache de detalhes do herói do localStorage", error.message);
            return {};
        }
    });

    // State for History
    const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistoryItem[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);

    const heroDetailsCacheRef = useRef(heroDetailsCache);
    useEffect(() => {
        heroDetailsCacheRef.current = heroDetailsCache;
    }, [heroDetailsCache]);

    const fetchUserProfile = useCallback(async (user: { id: string }) => {
        if (!supabase) return;
        setProfileError(null);
    
        const [profileResult, premiumStatusResult] = await Promise.all([
            supabase
                .from('profiles')
                .select('username, rank, subscription_status, analysis_count, last_analysis_at, subscription_expires_at, phone, plan_id')
                .eq('id', user.id)
                .single(),
            supabase.rpc('is_premium_member', { p_user_id: user.id })
        ]);
    
        const { data, error } = profileResult;
        const { data: premiumStatus, error: rpcError } = premiumStatusResult;
    
        if (error && error.code !== 'PGRST116') {
            console.error("Erro ao buscar perfil:", error.message);
            let detailedError = `Falha ao carregar o perfil do usuário. Verifique suas Políticas de Segurança (RLS) no Supabase. (Erro: ${error.message})`;

            if (error.code === '42P17' || error.message.includes('infinite recursion')) {
                detailedError = 'Erro de Configuração Detectado: Ocorreu um erro de recursão infinita ao buscar seus dados. Isso é geralmente causado por uma configuração incorreta das Políticas de Segurança (RLS) no Supabase, onde as tabelas "profiles" e "team_members" podem estar se consultando mutuamente. Por favor, revise suas políticas para corrigir o problema.';
            }
            
            setProfileError(detailedError);
            setUserProfile(null);
        } else if (data) {
            const completeProfile = { ...data, phone: data.phone || '' };
            setUserProfile(completeProfile as UserProfile);
        } else {
            console.warn("Nenhum perfil encontrado para o usuário:", user.id);
            const noProfileError = "Seu perfil não foi encontrado. Se você acabou de se cadastrar, a criação pode ter falhado.";
            setProfileError(noProfileError);
            setUserProfile(null);
        }
    
        if (rpcError) {
            console.error("Erro ao verificar status premium via RPC:", rpcError.message);
            setIsPremium(false);
        } else {
            setIsPremium(premiumStatus);
        }
    }, []);

    const effectiveSubscriptionStatus = useMemo(() => isPremium ? 'premium' : 'free', [isPremium]);

    useEffect(() => {
        const handleAuthChange = async (session: Session | null) => {
            setIsProfileChecked(false);
            setSession(session);
            if (session?.user) {
                await fetchUserProfile(session.user);
                if (view === 'login') {
                    setView('app');
                }
            } else {
                setUserProfile(null);
                setProfileError(null);
                setIsPremium(false);
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
    }, [fetchUserProfile, view]);

     useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('payment');
        if (paymentStatus) {
            if (paymentStatus === 'success') {
                setPaymentStatusMessage({ type: 'success', text: 'Pagamento bem-sucedido! Sua conta foi atualizada para Premium.' });
                if (session?.user) {
                    fetchUserProfile(session.user);
                }
            } else if (paymentStatus === 'failure') {
                setPaymentStatusMessage({ type: 'error', text: 'O pagamento falhou. Por favor, tente novamente.' });
            }
            window.history.replaceState(null, '', window.location.pathname);
            
            setTimeout(() => setPaymentStatusMessage(null), 7000);
        }
    }, [session, fetchUserProfile]);


    useEffect(() => {
        try {
            window.localStorage.setItem('heroDetailsCache', JSON.stringify(heroDetailsCache));
        } catch (error: any) {
            console.error("Erro ao escrever o cache de detalhes do herói no localStorage", error.message);
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

    const handleSetGameMode = useCallback((mode: GameMode) => {
        if ((mode === 'history' || mode === '5v5') && !isPremium) {
            // Acesso para qualquer plano premium
            setIsUpgradeModalOpen(true);
            return;
        }
        setGameMode(mode);
        window.scrollTo(0, 0);
    }, [isPremium]);

    const handleLaunchApp = useCallback(() => {
        setView('app');
    }, []);

    const handleSeePlans = useCallback(() => {
        setView('app');
        setGameMode('premium');
    }, []);

    const handleNavigateToFeatures = () => setView('features');
    
    const handleGoBackToLanding = (sectionId?: string) => {
        const doScroll = () => {
            if (sectionId) {
                document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo(0, 0);
            }
        };

        if (view !== 'landing') {
            setView('landing');
            setTimeout(doScroll, 100); // Aguarda a mudança de view para rolar
        } else {
            doScroll(); // Se já estiver na landing page, apenas rola
        }
    };
    
    const handleLoginClick = () => setView('login');

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

        if (view === 'app' && gameMode === 'ranking') {
            fetchRankings();
        }
    }, [rankDays, rankCategory, sortField, heroes, heroApiIdMap, view, gameMode]);
    
    useEffect(() => {
        if (metaBanRankCategory !== null) return;
        if (!isProfileChecked) return;
    
        if (session && userProfile) {
            const lowerRanks = ['Guerreiro', 'Elite', 'Mestre', 'Grão-Mestre'];
            if (lowerRanks.includes(userProfile.rank)) {
                setMetaBanRankCategory('mythic');
            } else {
                setMetaBanRankCategory('glory');
            }
        } else {
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
            } catch (error: any) {
                console.error("Falha ao buscar sugestões de banimento meta:", error.message);
                setMetaBanSuggestions([]);
            } finally {
                setIsMetaBansLoading(false);
            }
        };
        
        if (view === 'app' && (gameMode === '1v1' || gameMode === '5v5' || gameMode === 'synergy')) {
            fetchAndSetMetaBans();
        }
    }, [heroes, heroApiIdMap, metaBanRankCategory, view, gameMode]);

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
        if (!session) {
            setView('login');
            return false;
        }
        if (!userProfile) return false;
        if (isPremium) return true;

        const today = new Date().toISOString().split('T')[0];
        const lastAnalysisDate = userProfile.last_analysis_at ? new Date(userProfile.last_analysis_at).toISOString().split('T')[0] : null;

        if (lastAnalysisDate === today && userProfile.analysis_count >= DAILY_ANALYSIS_LIMIT) {
            setIsUpgradeModalOpen(true);
            return false;
        }
        return true;
    }, [userProfile, isPremium, session]);

    const fetchAnalysisHistory = useCallback(async () => {
        if (!supabase || !session?.user) return;

        setIsHistoryLoading(true);
        setHistoryError(null);

        const { data, error } = await supabase
            .from('analysis_history')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

        if (error) {
            setHistoryError('Falha ao carregar o histórico.');
            console.error('Falha ao carregar o histórico:', error.message);
        } else {
            setAnalysisHistory(data);
        }
        setIsHistoryLoading(false);
    }, [session]);

    const saveAnalysisToHistory = useCallback(async (type: '1v1' | '5v5' | 'synergy', title: string, data: any) => {
        if (!supabase || !session?.user || !isPremium) return;

        const { error } = await supabase.from('analysis_history').insert({
            user_id: session.user.id,
            analysis_type: type,
            title,
            analysis_data: data,
        });

        if (error) {
            console.error("Erro ao salvar análise:", error.message);
        } else {
            // Opcional: atualizar o estado local do histórico para refletir a nova adição
            fetchAnalysisHistory();
        }
    }, [session, isPremium, fetchAnalysisHistory]);

    const processAIBanSuggestions = (suggestions: AITacticalCounter[]): BanSuggestion[] => {
        return (suggestions || []).map(suggestion => {
            const heroData = Object.values(heroes).find((h: Hero) => h.name === suggestion.heroName);
            return heroData ? { hero: heroData, reason: suggestion.reason } : null;
        }).filter((s): s is BanSuggestion => s !== null);
    };

    const handleSynergyAnalysis = useCallback(async () => {
        if (!checkAnalysisLimit() || !synergyHeroPick) return;

        const selectedHero = heroes[synergyHeroPick];
        if (!selectedHero || !selectedHero.apiId) return;

        setIsSynergyAnalysisLoading(true);
        setHeroStrategicAnalysis(null);
        setStrategicAnalysisError(null);
        setSynergyRelations(null);
        setSynergyError(null);
        setCounterBanSuggestions([]);
        setPerfectLaneCounters([]);
        setPerfectLaneCountersError(null);

        // Etapa 1: Verificar e buscar detalhes ausentes
        let heroDetailsToAnalyze = heroDetailsCacheRef.current[selectedHero.apiId];
        if (!heroDetailsToAnalyze) {
            try {
                heroDetailsToAnalyze = await fetchHeroDetails(selectedHero.apiId);
                // Atualiza o cache e continua para a análise principal
                setHeroDetailsCache(prev => ({ ...prev, [selectedHero.apiId]: heroDetailsToAnalyze! }));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Erro ao buscar detalhes do herói.";
                setStrategicAnalysisError(errorMessage);
                setIsSynergyAnalysisLoading(false);
                return;
            }
        }
        
        // Etapa 2: Executar as análises da IA e de sinergia em paralelo
        try {
            const [analysisResult, relationsData] = await Promise.all([
                getHeroStrategicAnalysis(heroDetailsToAnalyze),
                fetchHeroRelations(selectedHero.apiId, heroes, heroApiIdMap)
            ]);
            
            const { strategy, tacticalCounters: aiCounters, perfectLaneCounters: aiLaneCounters } = analysisResult;
            const validItemNames = GAME_ITEMS.map(item => item.nome);
            const correctedCoreItems = strategy.coreItems.map(item => ({ ...item, nome: findClosestString(item.nome, validItemNames) }));
            const correctedSituationalItems = strategy.situationalItems.map(item => ({ ...item, nome: findClosestString(item.nome, validItemNames) }));
            
            const finalAnalysis: HeroStrategicAnalysis = {
                strategy: { ...strategy, coreItems: correctedCoreItems, situationalItems: correctedSituationalItems },
                tacticalCounters: aiCounters,
                perfectLaneCounters: aiLaneCounters
            };

            setHeroStrategicAnalysis(finalAnalysis);
            
            const bans = processAIBanSuggestions(aiCounters);
            setCounterBanSuggestions(bans);
            
            let finalPerfectLaneCounters: HeroSuggestion[] = [];
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
                finalPerfectLaneCounters = laneCounters;
            }

            setSynergyRelations(relationsData);

            saveAnalysisToHistory('synergy', `Análise de Herói: ${selectedHero.name}`, {
                analysis: finalAnalysis,
                relations: relationsData,
                bans,
                perfectCounters: finalPerfectLaneCounters,
                context: { synergyHeroPick }
            });

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erro na análise estratégica da IA.";
            setStrategicAnalysisError(errorMessage);
            setSynergyError(errorMessage);
            setPerfectLaneCountersError(errorMessage);
        } finally {
            setIsSynergyAnalysisLoading(false);
        }
    }, [synergyHeroPick, heroes, heroApiIdMap, checkAnalysisLimit, saveAnalysisToHistory]);


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
    
            // Otimização: Buscar todos os dados estatísticos necessários em paralelo antes da chamada da IA.
            const [enemyCounterStats, yourCounterStats] = await Promise.all([
                enemyHero.apiId ? fetchHeroCounterStats(enemyHero.apiId) : Promise.resolve({ counters: [], counteredBy: [] }),
                (yourHero && yourHero.apiId) ? fetchHeroCounterStats(yourHero.apiId) : Promise.resolve({ counters: [], counteredBy: [] })
            ]);
    
            let winRate: number | null = null;
            if (yourHero && yourHero.apiId && enemyHero.apiId) {
                const matchupStat = enemyCounterStats.counters.find(counter => counter.heroid === yourHero.apiId);
                let wr = matchupStat?.increase_win_rate ?? 0;
                if (wr === 0) {
                    const counterMatchupStat = yourCounterStats.counters.find(counter => counter.heroid === enemyHero.apiId);
                    if (counterMatchupStat) wr = -counterMatchupStat.increase_win_rate;
                }
                winRate = wr;
            }
    
            const combinedAnalysis = await getCombined1v1Analysis(
                enemyHeroDetails,
                activeLane,
                roleForAnalysis,
                yourHero,
                yourHeroDetails,
                winRate
            );
            
            if (!combinedAnalysis || typeof combinedAnalysis !== 'object') {
                throw new Error("A resposta da IA está em um formato inválido. Por favor, tente novamente.");
            }
    
            const { strategicAnalysis, matchupAnalysis, banSuggestions } = combinedAnalysis;
    
            if (!strategicAnalysis || typeof strategicAnalysis !== 'object' || !Array.isArray(strategicAnalysis.sugestoesHerois) || !Array.isArray(strategicAnalysis.sugestoesItens) || !Array.isArray(banSuggestions) || !Array.isArray(strategicAnalysis.sugestoesCountersAliado)) {
                throw new Error("A resposta da IA está incompleta ou malformada. Por favor, tente novamente.");
            }
    
            // Otimização: Reutiliza os dados já buscados, eliminando uma chamada de API redundante.
            const allStatCounters = enemyCounterStats.counters
                .map(c => ({ hero: heroApiIdMap[c.heroid], increase_win_rate: c.increase_win_rate }))
                .filter((item): item is { hero: Hero; increase_win_rate: number } => !!item.hero)
                .sort((a, b) => b.increase_win_rate - a.increase_win_rate);
    
            const bans = processAIBanSuggestions(banSuggestions);
            setCounterBanSuggestions(bans);
            
            const validItemNames = GAME_ITEMS.map(item => item.nome);
            const validSpellNames = Object.keys(SPELL_ICONS);
    
            const heroSuggestions: HeroSuggestion[] = strategicAnalysis.sugestoesHerois
                .map((aiSuggestion): HeroSuggestion | null => {
                    if (!aiSuggestion || typeof aiSuggestion.nome !== 'string' || typeof aiSuggestion.motivo !== 'string') {
                        console.warn("Sugestão de herói da IA inválida e foi descartada:", aiSuggestion);
                        return null;
                    }
                    
                    const heroData = (Object.values(heroes) as Hero[]).find((h: Hero) => h.name === aiSuggestion.nome);
                    const stat = allStatCounters.find(c => c.hero.name === aiSuggestion.nome);
                    const winRateIncrease = stat?.increase_win_rate || 0;
                    const classificacao: 'ANULA' | 'VANTAGEM' = (winRateIncrease > 0.04 && activeLane !== 'NENHUMA' ? 'ANULA' : 'VANTAGEM');
                    
                    const correctedSpells = (aiSuggestion.spells || [])
                        .map(spell => {
                            if (!spell || typeof spell.nome !== 'string') {
                                console.warn("Sugestão de feitiço da IA inválida e foi descartada:", spell);
                                return null;
                            }
                            return { ...spell, nome: findClosestString(spell.nome, validSpellNames), motivo: spell.motivo || '' };
                        })
                        .filter((s): s is SpellSuggestion => s !== null);
    
                    return {
                        nome: aiSuggestion.nome,
                        motivo: aiSuggestion.motivo,
                        avisos: Array.isArray(aiSuggestion.avisos) ? aiSuggestion.avisos : [],
                        spells: correctedSpells,
                        imageUrl: heroData?.imageUrl || '',
                        classificacao,
                        estatistica: !stat ? 'Análise Tática' : `+${(winRateIncrease * 100).toFixed(1)}% vs. ${enemyHero.name}`
                    };
                })
                .filter((s): s is HeroSuggestion => s !== null);
    
            const correctedItems: ItemSuggestion[] = strategicAnalysis.sugestoesItens
                .map(item => {
                    if (!item || typeof item.nome !== 'string') {
                        console.warn("Sugestão de item da IA inválida e foi descartada:", item);
                        return null;
                    }
                    const correctedName = findClosestString(item.nome, validItemNames);
                    const gameItem = GAME_ITEMS.find(i => i.nome === correctedName);
                    return { 
                        nome: correctedName, 
                        motivo: item.motivo || 'Motivo não fornecido pela IA.',
                        preco: gameItem?.preco || 0 
                    };
                })
                .filter((i): i is ItemSuggestion => i !== null);
            
            const allyCounterSuggestions: HeroSuggestion[] = (strategicAnalysis.sugestoesCountersAliado || [])
                .map((aiSuggestion): HeroSuggestion | null => {
                    if (!aiSuggestion || typeof aiSuggestion.nome !== 'string' || typeof aiSuggestion.motivo !== 'string') {
                        console.warn("Sugestão de counter de aliado da IA inválida e foi descartada:", aiSuggestion);
                        return null;
                    }
                    
                    const heroData = (Object.values(heroes) as Hero[]).find((h: Hero) => h.name === aiSuggestion.nome);
                    
                    const correctedSpells = (aiSuggestion.spells || [])
                        .map(spell => {
                            if (!spell || typeof spell.nome !== 'string') {
                                console.warn("Sugestão de feitiço da IA inválida e foi descartada:", spell);
                                return null;
                            }
                            return { ...spell, nome: findClosestString(spell.nome, validSpellNames), motivo: spell.motivo || '' };
                        })
                        .filter((s): s is SpellSuggestion => s !== null);

                    return {
                        nome: aiSuggestion.nome,
                        motivo: aiSuggestion.motivo,
                        avisos: Array.isArray(aiSuggestion.avisos) ? aiSuggestion.avisos : [],
                        spells: correctedSpells,
                        imageUrl: heroData?.imageUrl || '',
                        classificacao: 'DESVANTAGEM',
                        estatistica: 'Counter Tático'
                    };
                })
                .filter((s): s is HeroSuggestion => s !== null);
            
            const finalResult = { sugestoesHerois: heroSuggestions, sugestoesItens: correctedItems, sugestoesCountersAliado: allyCounterSuggestions };
            setAnalysisResult(finalResult);

            let finalMatchupData: MatchupData | null = null;
            if (yourHero && matchupAnalysis && winRate != null && typeof matchupAnalysis.classification === 'string' && typeof matchupAnalysis.detailedAnalysis === 'string') {
                const correctedSpell = (matchupAnalysis.recommendedSpell && typeof matchupAnalysis.recommendedSpell.nome === 'string') 
                    ? { 
                        ...matchupAnalysis.recommendedSpell, 
                        nome: findClosestString(matchupAnalysis.recommendedSpell.nome, validSpellNames),
                        motivo: matchupAnalysis.recommendedSpell.motivo || ''
                    } 
                    : null;
    
                finalMatchupData = { 
                    yourHero, 
                    enemyHero, 
                    winRate, 
                    classification: matchupAnalysis.classification, 
                    detailedAnalysis: matchupAnalysis.detailedAnalysis, 
                    recommendedSpell: correctedSpell
                };
                setMatchupData(finalMatchupData);
            } else {
                setMatchupData(null);
            }

            saveAnalysisToHistory('1v1', `Análise 1v1: ${yourHero?.name || 'Counters'} vs ${enemyHero.name}`, {
                result: finalResult,
                matchup: finalMatchupData,
                bans,
                context: { matchupAllyPick, matchupEnemyPick, activeLane }
            });
    
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido ao buscar a análise.";
            setAnalysisError(errorMessage);
            setMatchupError(errorMessage);
        } finally {
            setIs1v1AnalysisLoading(false);
        }
    }, [matchupEnemyPick, matchupAllyPick, heroes, activeLane, heroDetailsCache, heroApiIdMap, laneToRoleMap, checkAnalysisLimit, saveAnalysisToHistory]);
    
    useEffect(() => {
        if (gameMode !== '5v5' || Object.keys(heroes).length === 0) {
            setDraftAnalysis(null);
            setDraftAnalysisError(null);
            setCounterBanSuggestions([]);
            return;
        }
    
        const analyzeDraft = async () => {
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
                const detailsToFetch = allPickedHeroes.filter(h => h.apiId && !heroDetailsCacheRef.current[h.apiId]);
                let currentCache = { ...heroDetailsCacheRef.current };
    
                if (detailsToFetch.length > 0) {
                    const fetchedDetails = await Promise.all(
                        detailsToFetch.map(h => 
                            fetchHeroDetails(h.apiId)
                                .then(details => ({ apiId: h.apiId, details }))
                                .catch(err => {
                                    console.error(`Falha ao buscar detalhes para o draft de ${h.name}:`, err.message);
                                    return null;
                                })
                        )
                    );
                    
                    const newCacheEntries = fetchedDetails.reduce((acc, item) => {
                        if (item) acc[item.apiId] = item.details;
                        return acc;
                    }, {} as Record<number, HeroDetails>);
    
                    setHeroDetailsCache(prev => ({ ...prev, ...newCacheEntries }));
                    currentCache = { ...currentCache, ...newCacheEntries };
                }
    
                const allyDetails = pickedAllyHeroes.map(h => currentCache[h.apiId]).filter((d): d is HeroDetails => !!d);
                const enemyDetails = pickedEnemyHeroes.map(h => currentCache[h.apiId]).filter((d): d is HeroDetails => !!d);
    
                if (allyDetails.length !== pickedAllyHeroes.length || enemyDetails.length !== pickedEnemyHeroes.length) {
                    throw new Error("Falha ao buscar os detalhes de um ou mais heróis selecionados. A análise será tentada novamente.");
                }
                
                const pickedHeroIds = new Set(allPickedHeroes.map((h: Hero) => h.id));
                const availableHeroes = (Object.values(heroes) as Hero[]).filter((h: Hero) => !pickedHeroIds.has(h.id));
                
                const analysisFromAI = await getDraftAnalysis(allyDetails, enemyDetails, availableHeroes);
                
                const bans = processAIBanSuggestions(analysisFromAI.banSuggestions);
                setCounterBanSuggestions(bans);
    
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
                
                const finalAnalysis = {
                    ...analysisFromAI,
                    nextPickSuggestion: nextPick,
                    strategicItems: strategicItems,
                };
                setDraftAnalysis(finalAnalysis);

                saveAnalysisToHistory('5v5', `Análise de Draft: ${new Date().toLocaleDateString()}`, {
                    analysis: finalAnalysis,
                    bans,
                    context: { draftAllyPicks, draftEnemyPicks }
                });
    
            } catch (error) {
                setDraftAnalysisError(error instanceof Error ? error.message : "Erro desconhecido ao analisar o draft.");
            } finally {
                setIsDraftAnalysisLoading(false);
            }
        };
    
        analyzeDraft();
    
    }, [draftAllyPicks, draftEnemyPicks, gameMode, heroes, checkAnalysisLimit, saveAnalysisToHistory]);

    useEffect(() => {
        if (gameMode === 'history') {
            fetchAnalysisHistory();
        }
    }, [gameMode, fetchAnalysisHistory]);

    const loadAnalysisFromHistory = useCallback((item: AnalysisHistoryItem) => {
        const { analysis_type, analysis_data } = item;
        setGameMode(analysis_type);
        
        // Limpa estados antigos para evitar sobreposição
        setAnalysisResult(null);
        setMatchupData(null);
        setDraftAnalysis(null);
        setHeroStrategicAnalysis(null);
        setSynergyRelations(null);
        setCounterBanSuggestions([]);
        setPerfectLaneCounters([]);

        if (analysis_type === '1v1') {
            const { result, matchup, bans, context } = analysis_data;
            setAnalysisResult(result);
            setMatchupData(matchup);
            setCounterBanSuggestions(bans);
            setMatchupAllyPick(context.matchupAllyPick);
            setMatchupEnemyPick(context.matchupEnemyPick);
            setActiveLane(context.activeLane);
        } else if (analysis_type === '5v5') {
            const { analysis, bans, context } = analysis_data;
            setDraftAnalysis(analysis);
            setCounterBanSuggestions(bans);
            setDraftAllyPicks(context.draftAllyPicks);
            setDraftEnemyPicks(context.draftEnemyPicks);
        } else if (analysis_type === 'synergy') {
            const { analysis, relations, bans, perfectCounters, context } = analysis_data;
            setHeroStrategicAnalysis(analysis);
            setSynergyRelations(relations);
            setCounterBanSuggestions(bans);
            setPerfectLaneCounters(perfectCounters);
            setSynergyHeroPick(context.synergyHeroPick);
        }
    }, []);

    const handleDeleteAnalysis = useCallback(async (id: string) => {
        if (!supabase) return;
        
        const { error } = await supabase.from('analysis_history').delete().eq('id', id);
        if (error) {
            alert('Falha ao apagar a análise.');
            console.error(error.message);
        } else {
            setAnalysisHistory(prev => prev.filter(item => item.id !== id));
        }
    }, []);


    const handleSlotClick = useCallback((team: Team | 'synergy', index: number) => {
        if (!session) {
            setView('login');
            return;
        }
        setActiveSlot({ team, index });
        setIsModalOpen(true);
    }, [session]);

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
    
    if (isLoadingApp) return <LoadingOverlay message={'CARREGANDO DADOS...'} />;
    if (heroLoadingError) {
        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50 text-center">
                <p className="text-red-500 p-8 text-xl font-semibold">{heroLoadingError}</p>
            </div>
        );
    }

    const renderContent = () => {
        switch (gameMode) {
            case 'dashboard':
                return <DashboardScreen 
                    heroes={heroes}
                    heroApiIdMap={heroApiIdMap}
                    onNavigateToHeroAnalysis={handleNavigateToHeroAnalysis}
                    onSetMode={handleSetGameMode}
                    userProfile={userProfile}
                    effectiveSubscriptionStatus={effectiveSubscriptionStatus}
                />;
            case '1v1':
                return (
                    <div className="flex flex-col gap-6">
                        <CollapsibleTutorial title="Como Analisar um Confronto">
                            <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-gray-300">
                            <li>Selecione o <strong className="text-red-300">herói inimigo</strong>. (Obrigatório)</li>
                            <li>Selecione <strong className="text-blue-300">seu herói</strong>. (Opcional, para análise direta e sinergias).</li>
                            <li>Escolha a <strong className="text-amber-300">lane</strong> do confronto abaixo. (Selecione "NENHUMA" para sugestões gerais).</li>
                            <li>Clique em <strong className="text-sky-500">"Analisar Confronto"</strong> para a IA gerar as sugestões.</li>
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
                                className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-xl text-lg hover:from-sky-400 hover:to-cyan-400 transition-all duration-300 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-sky-500/40 disabled:shadow-none transform hover:scale-105"
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
                                    matchupAllyPick={matchupAllyPick}
                                />
                            </div>
                        </div>
                    </div>
                );
            case '5v5':
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
            case 'ranking':
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
            case 'item': return <ItemDatabaseScreen />;
            case 'synergy':
                return <SynergyExplorerScreen 
                    selectedHeroId={synergyHeroPick}
                    heroes={heroes}
                    heroApiIdMap={heroApiIdMap}
                    onHeroSelectClick={() => handleSlotClick('synergy', 0)}
                    onClearHero={() => setSynergyHeroPick(null)}
                    counterBanSuggestions={counterBanSuggestions}
                    metaBanSuggestions={metaBanSuggestions}
                    isMetaBansLoading={isMetaBansLoading}
                    // FIX: The variable 'activeMetaRank' was not defined in this scope. It has been replaced with the correct state variable 'metaBanRankCategory'.
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
            case 'heroes': return <HeroDatabaseScreen heroes={heroes} heroLanes={heroLanes} />;
            case 'premium': return <PremiumScreen userProfile={userProfile} />;
            case 'history':
                return <HistoryScreen 
                    history={analysisHistory} 
                    isLoading={isHistoryLoading} 
                    error={historyError} 
                    onLoadAnalysis={loadAnalysisFromHistory}
                    onDeleteAnalysis={handleDeleteAnalysis}
                    heroes={heroes}
                />;
            case 'teams':
                return <TeamsScreen session={session} userProfile={userProfile} onUpgradeClick={() => setIsUpgradeModalOpen(true)} />;
            default: return null;
        }
    };

    switch (view) {
        case 'landing':
            return (
                <div className="flex flex-col min-h-screen">
                    <LandingPage 
                        onLaunchApp={handleLaunchApp} 
                        onSeePlans={handleSeePlans} 
                        heroes={heroes} 
                        onLoginClick={handleLoginClick}
                        onNavigateToFeatures={handleNavigateToFeatures}
                        onGoBackToLanding={handleGoBackToLanding}
                    />
                    <Footer />
                </div>
            );
        case 'features':
            return (
                <div className="flex flex-col min-h-screen">
                    <FeaturesPage
                        onGoBack={() => setView('landing')}
                        onLaunchApp={handleLaunchApp}
                        onSeePlans={handleSeePlans}
                    />
                    <Footer />
                </div>
            );
        case 'login':
            return <AuthScreen onGoBack={() => handleGoBackToLanding()} />;
        case 'app':
        default:
            return (
                <div className="flex flex-col min-h-screen">
                    {paymentStatusMessage && (
                        <div className={`fixed top-20 right-5 z-[100] p-4 rounded-lg shadow-lg text-white animated-entry ${paymentStatusMessage.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                            {paymentStatusMessage.text}
                        </div>
                    )}
                    <Header 
                        session={session}
                        userProfile={userProfile}
                        onLogout={async () => { if (supabase) { await supabase.auth.signOut(); setView('login'); } }}
                        onEditProfile={() => setIsProfileModalOpen(true)}
                        onUpgradeClick={() => handleSetGameMode('premium')}
                        analysisLimit={DAILY_ANALYSIS_LIMIT}
                        effectiveSubscriptionStatus={effectiveSubscriptionStatus}
                        activeMode={gameMode} 
                        onSetMode={handleSetGameMode}
                        onLoginClick={handleLoginClick}
                        onNavigateToFeatures={handleNavigateToFeatures}
                        onGoBackToLanding={handleGoBackToLanding}
                    />

                    {profileError && (
                        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative" role="alert">
                                <strong className="font-bold">Erro de Configuração!</strong>
                                <span className="block sm:inline ml-2">{profileError}</span>
                            </div>
                        </div>
                    )}

                    <main className="w-full max-w-7xl mx-auto flex-grow px-4 sm:px-6 lg:px-8 mb-16">
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
                            handleSetGameMode('premium');
                        }}
                    />
                    <Footer />
                </div>
            );
    }
};

export default App;
