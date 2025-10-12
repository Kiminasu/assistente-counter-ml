import React, { useState, useEffect, useMemo } from 'react';
import { Hero, HeroRankInfo, RankCategory, RANKS, GameMode, UserProfile } from '../types';
import { fetchHeroRankings } from '../services/heroService';
import { ITEM_ICONS } from '../constants';

const RANK_LABELS: Record<RankCategory, string> = {
    all: "Todos", epic: "Épico", legend: "Lenda", mythic: "Mítico", honor: "Honra", glory: "Glória"
};
const USER_RANK_TO_API_RANK: Record<string, RankCategory> = {
    'Guerreiro': 'epic', 'Elite': 'epic', 'Mestre': 'epic', 'Grão-Mestre': 'epic',
    'Épico': 'epic', 'Lenda': 'legend', 'Mítico': 'mythic', 'Honra': 'honor', 'Glória': 'glory'
};

const dailyChallenges = [
    {
        heroToCounter: { name: "Fanny", id: "fanny" },
        options: ["Kaja", "Saber", "Chou"],
        correctCounter: "Saber",
        explanation: "Saber possui a maior taxa de vitória estatística contra Fanny devido à sua capacidade de travar o alvo com sua ultimate, impedindo sua mobilidade."
    },
    {
        heroToCounter: { name: "Wanwan", id: "wanwan" },
        options: ["Franco", "Tigreal", "Khufra"],
        correctCounter: "Khufra",
        explanation: "A habilidade 'Bola Saltitante' de Khufra impede Wanwan de usar seus saltos, impossibilitando a ativação de sua ultimate."
    },
    {
        heroToCounter: { name: "Estes", id: "estes" },
        options: ["Baxia", "Valir", "Luo Yi"],
        correctCounter: "Baxia",
        explanation: "A passiva de Baxia reduz os efeitos de cura e escudo dos inimigos que ele atinge, counterando diretamente a poderosa ultimate de Estes."
    },
    {
        heroToCounter: { name: "Atlas", id: "atlas" },
        options: ["Valir", "Diggie", "Pharsa"],
        correctCounter: "Diggie",
        explanation: "A ultimate de Diggie fornece uma área que purifica todo controle de grupo para seus aliados, anulando completamente a ultimate decisiva de Atlas."
    },
    {
        heroToCounter: { name: "Lancelot", id: "lancelot" },
        options: ["Saber", "Chou", "Kaja"],
        correctCounter: "Chou",
        explanation: "A ultimate de Chou pode chutar Lancelot para fora de seus frames de invulnerabilidade, travando-o para um abate fácil."
    }
];

const getChallengeForToday = () => {
    const now = new Date();
    const spTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    const startOfYear = new Date(spTime.getFullYear(), 0, 0);
    const diff = spTime.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dailyChallenges[dayOfYear % dailyChallenges.length];
};


const CounterOfTheDay: React.FC<{ heroes: Record<string, Hero> }> = ({ heroes }) => {
    const [voted, setVoted] = useState<string | null>(null);

    const challenge = useMemo(() => getChallengeForToday(), []);
    const { heroToCounter, options, correctCounter, explanation } = challenge;
    
    // FIX: Cast the result of Object.values to Hero[] to ensure proper type inference.
    const heroToCounterData = (Object.values(heroes) as Hero[]).find(h => h.name === heroToCounter.name);


    const handleVote = (option: string) => {
        setVoted(option);
    };

    return (
        <div className="glassmorphism p-6 rounded-2xl border-2 panel-glow-primary">
            <h2 className="text-xl font-bold text-center mb-4 text-amber-300">COUNTER DO DIA</h2>
            <div className="flex flex-col items-center text-center">
                {heroToCounterData ? (
                    <img src={heroToCounterData.imageUrl} alt={heroToCounterData.name} className="w-20 h-20 rounded-full border-4 border-red-500 mb-2" />
                ) : (
                    <div className="w-20 h-20 rounded-full border-4 border-red-500 mb-2 bg-slate-800"></div>
                )}
                <p className="text-slate-300 mb-4 max-w-xs">O meta está cheio de <strong className="text-white">{heroToCounter.name}</strong>. Quem você usaria para counterá-la?</p>
                <div className="flex justify-center gap-4 w-full">
                    {options.map(option => {
                        const isCorrect = option === correctCounter;
                        const isVoted = voted === option;
                        let buttonClass = 'bg-slate-700 hover:bg-slate-600';
                        if (voted) {
                            if (isCorrect) buttonClass = 'bg-green-500 ring-2 ring-white';
                            else if (isVoted) buttonClass = 'bg-red-500';
                            else buttonClass = 'bg-slate-800 opacity-60';
                        }
                        return (
                            <button key={option} onClick={() => handleVote(option)} disabled={!!voted}
                                className={`flex-1 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ${buttonClass}`}>
                                {option}
                            </button>
                        )
                    })}
                </div>
                {voted && (
                    <p className="text-xs text-slate-400 mt-4 p-2 bg-black/20 rounded-lg animated-entry">
                        <strong className="text-green-300">{correctCounter}</strong> {explanation}
                    </p>
                )}
            </div>
        </div>
    );
};

const TierList: React.FC<{
    heroes: Record<string, Hero>,
    heroApiIdMap: Record<number, Hero>,
    onHeroClick: (heroId: string) => void,
    userProfile: UserProfile | null
}> = ({ heroes, heroApiIdMap, onHeroClick, userProfile }) => {
    const [tierHeroes, setTierHeroes] = useState<HeroRankInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeRank, setActiveRank] = useState<RankCategory>('glory');

    useEffect(() => {
        if (userProfile?.rank) {
            setActiveRank(USER_RANK_TO_API_RANK[userProfile.rank] || 'glory');
        }
    }, [userProfile]);

    useEffect(() => {
        if (Object.keys(heroApiIdMap).length === 0) return;
        
        const fetchTiers = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchHeroRankings(7, activeRank, 'win_rate');
                const mappedData = data.map(d => {
                    const hero = heroApiIdMap[d.main_heroid];
                    return hero ? { hero, winRate: d.main_hero_win_rate, pickRate: d.main_hero_appearance_rate, banRate: d.main_hero_ban_rate } : null;
                }).filter((h): h is HeroRankInfo => h !== null);
                setTierHeroes(mappedData);
            } catch (err) {
                setError("Falha ao carregar a Tier List.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTiers();
    }, [activeRank, heroApiIdMap]);

    const tiers: { [key: string]: HeroRankInfo[] } = useMemo(() => {
        const s = tierHeroes.filter(h => h.winRate > 0.54 && (h.pickRate > 0.01 || h.banRate > 0.1)).sort((a,b) => b.winRate - a.winRate).slice(0, 10);
        const a = tierHeroes.filter(h => h.winRate <= 0.54 && h.winRate > 0.52).sort((a,b) => b.winRate - a.winRate).slice(0, 10);
        const b = tierHeroes.filter(h => h.winRate <= 0.52 && h.winRate > 0.50).sort((a,b) => b.winRate - a.winRate).slice(0, 10);
        return { S: s, A: a, B: b };
    }, [tierHeroes]);

    return (
        <div className="glassmorphism p-6 rounded-2xl border-2 panel-glow-primary flex flex-col">
            <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-amber-300">TIER LIST DO META</h2>
                <div className="flex bg-black/30 p-0.5 rounded-lg mt-2 sm:mt-0">
                    {(Object.keys(RANK_LABELS) as RankCategory[]).filter(r => r !== 'all' && r !== 'honor').map(rank => (
                        <button key={rank} onClick={() => setActiveRank(rank)}
                            className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${activeRank === rank ? 'bg-violet-600 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}>
                            {RANK_LABELS[rank]}
                        </button>
                    ))}
                </div>
            </div>
            <p className="text-center text-xs text-slate-400 mb-4"><strong>S:</strong> Mais Fortes, <strong>A:</strong> Muito Fortes, <strong>B:</strong> Fortes e Equilibrados</p>
            {isLoading && <div className="flex justify-center items-center h-48"><div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-violet-400"></div></div>}
            {error && <p className="text-center text-xs text-yellow-400 h-48 flex items-center justify-center">{error}</p>}
            {!isLoading && !error && (
                <div className="space-y-4">
                    {Object.entries(tiers).map(([tier, heroList]) => (
                        <div key={tier}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-md font-black text-2xl" style={{ backgroundColor: {S: '#ff7f7f', A: '#ffbf7f', B: '#bfff7f'}[tier as 'S'|'A'|'B'], color: '#1a1c29' }}>{tier}</div>
                                <div className="flex flex-wrap gap-2 flex-1">
                                    {heroList.length > 0 ? heroList.map(info => (
                                        <img key={info.hero.id} src={info.hero.imageUrl} alt={info.hero.name}
                                            onClick={() => onHeroClick(info.hero.id)}
                                            className="w-12 h-12 rounded-full border-2 border-slate-600 cursor-pointer transition-transform hover:scale-110 hover:border-amber-300"
                                            title={info.hero.name} />
                                    )) : <p className="text-xs text-slate-500 italic">Nenhum herói neste tier com os filtros atuais.</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const CrucialMetaItems: React.FC = () => {
    const items = [
        {
            name: 'Dominância de Gelo',
            reason: 'Reduz a velocidade de ataque e a cura de heróis com alta regeneração, essencial contra atiradores e suportes de cura.'
        },
        {
            name: 'Lâmina do Desespero',
            reason: 'Aumenta drasticamente o dano físico, sendo o item de finalização perfeito para assassinos e soldados executarem alvos com pouca vida.'
        },
        {
            name: 'Imortalidade',
            reason: 'Oferece uma segunda vida em lutas de equipe cruciais, permitindo que heróis de iniciação ou dano causem impacto mesmo após serem abatidos.'
        }
    ];

    return (
        <div className="glassmorphism p-6 rounded-2xl border-2 panel-glow-primary">
            <h2 className="text-xl font-bold text-center mb-4 text-amber-300">ITENS CRUCIAIS DO META</h2>
            <div className="space-y-4">
                {items.map(item => (
                    <div key={item.name} className="p-3 bg-black/30 rounded-xl flex items-start gap-3 border-l-4 border-violet-500">
                        <img src={ITEM_ICONS[item.name] || ITEM_ICONS.default} alt={item.name} className="w-12 h-12 rounded-lg flex-shrink-0" />
                        <div>
                            <p className="font-bold">{item.name}</p>
                            <p className="text-xs text-gray-400 mt-1">{item.reason}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const Tools: React.FC<{ onSetMode: (mode: GameMode) => void; effectiveSubscriptionStatus: 'free' | 'premium' }> = ({ onSetMode, effectiveSubscriptionStatus }) => {
    const tools: { label: string, mode: GameMode, icon: React.ReactNode, isPremium?: boolean }[] = [
        { label: "Análise de Herói", mode: 'synergy', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg> },
        { label: "Análise 1vs1", mode: '1v1', icon: <span className="font-black text-xl tracking-tighter">1vs1</span> },
        { label: "Draft 5vs5", mode: '5v5', icon: <span className="font-black text-xl tracking-tighter">5vs5</span>, isPremium: true },
        { label: "Heróis", mode: 'heroes', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.5 5.5a3 3 0 00-3 0V13a1 1 0 00-1 1v1a1 1 0 001 1h3a1 1 0 001-1v-1a1 1 0 00-1-1v-.5zM16.5 8.5a3 3 0 100-6 3 3 0 000 6zm-3 5.5a3 3 0 00-3 0V15a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1v-.5z" /></svg> },
        { label: "Itens", mode: 'item', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v2h2a2 2 0 012 2v5a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h2V4zm2 0v2h6V4H7zm2 4a1 1 0 011 1v1h-2V9a1 1 0 011-1z" /></svg> },
        { label: "Ranking", mode: 'ranking', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18,21H6V18H18M11,12V17H13V12H11M7,14V17H9V14H7M15,13V17H17V13H15M22,8H17.8L15,4H9L6.2,8H2V6H22V8Z" /></svg> },
    ];

    return (
        <div className="glassmorphism p-6 rounded-2xl border-2 panel-glow-primary">
            <h2 className="text-xl font-bold text-center mb-4 text-amber-300">FERRAMENTAS ESTRATÉGICAS</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-3 gap-3">
                {tools.map(tool => (
                    <button key={tool.mode} onClick={() => onSetMode(tool.mode)} className="relative flex flex-col items-center justify-center gap-1 p-2 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-violet-600/50 hover:border-violet-500 transition-all duration-300 transform hover:-translate-y-1 h-24">
                        {tool.isPremium && effectiveSubscriptionStatus !== 'premium' && <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-amber-400 to-yellow-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-lg animate-soft-blink">PREMIUM</span>}
                        <div className="h-8 flex items-center justify-center text-slate-300">{tool.icon}</div>
                        <span className="text-xs font-semibold text-center leading-tight">{tool.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

interface DashboardScreenProps {
    heroes: Record<string, Hero>;
    heroApiIdMap: Record<number, Hero>;
    onNavigateToHeroAnalysis: (heroId: string) => void;
    onSetMode: (mode: GameMode) => void;
    userProfile: UserProfile | null;
    effectiveSubscriptionStatus: 'free' | 'premium';
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ heroes, heroApiIdMap, onNavigateToHeroAnalysis, onSetMode, userProfile, effectiveSubscriptionStatus }) => {
    return (
        <div className="flex flex-col gap-8 animated-entry">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna Principal (ocupa 2/3 no desktop) */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <TierList heroes={heroes} heroApiIdMap={heroApiIdMap} onHeroClick={onNavigateToHeroAnalysis} userProfile={userProfile} />
                    <CrucialMetaItems />
                </div>
                {/* Coluna Lateral (ocupa 1/3 no desktop) */}
                <div className="flex flex-col gap-8">
                    <CounterOfTheDay heroes={heroes} />
                    <Tools onSetMode={onSetMode} effectiveSubscriptionStatus={effectiveSubscriptionStatus} />
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;