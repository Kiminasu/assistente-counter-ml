import React, { useState, useEffect } from 'react';
import { Hero, HeroDetails, HeroSkill, SkillCombo, FullHeroStats, SynergyStat, HeroDailyStats } from '../types';
import { fetchHeroDetails } from '../services/heroService';
import { fetchHeroDetailStats, fetchHeroRate } from '../services/heroService';
import SynergyTrendChart from './SynergyTrendChart';
import PerformanceTrendChart from './PerformanceTrendChart';

interface HeroDetailModalProps {
    heroId: string | null;
    heroes: Record<string, Hero>;
    onClose: () => void;
    heroApiIdMap: Record<number, Hero>;
}

const SynergyStatItem: React.FC<{ synergy: SynergyStat; type: 'best' | 'worst'; isExpanded: boolean; onToggle: () => void; }> = ({ synergy, type, isExpanded, onToggle }) => {
    const colorClass = type === 'best' ? 'text-green-400' : 'text-red-400';
    const sign = type === 'best' ? '+' : '';

    return (
        <div className="p-3 bg-black bg-opacity-20 rounded-xl">
            <div className="flex items-center gap-3 cursor-pointer" onClick={onToggle}>
                <img src={synergy.hero.imageUrl} alt={synergy.hero.name} className="w-12 h-12 rounded-full flex-shrink-0" />
                <div className="flex-grow">
                    <p className="font-bold">{synergy.hero.name}</p>
                    <p className={`text-sm font-semibold ${colorClass}`}>{sign}{(synergy.increaseWinRate * 100).toFixed(1)}%</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    Ver Gráfico
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
            </div>
             <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-64 mt-3' : 'max-h-0'}`}>
                <SynergyTrendChart
                    data={synergy.winRateOverTime}
                    color={type === 'best' ? '#4ade80' : '#f87171'}
                    heroName={synergy.hero.name}
                />
            </div>
        </div>
    );
};

const HeroDetailModal: React.FC<HeroDetailModalProps> = ({ heroId, heroes, onClose, heroApiIdMap }) => {
    const [details, setDetails] = useState<HeroDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<FullHeroStats | null>(null);
    const [isStatsLoading, setIsStatsLoading] = useState(false);
    const [statsError, setStatsError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('habilidades');
    const [expandedSynergy, setExpandedSynergy] = useState<string | null>(null);

    const [pastDays, setPastDays] = useState<7 | 15 | 30>(7);
    const [dailyRates, setDailyRates] = useState<HeroDailyStats[]>([]);
    const [isRatesLoading, setIsRatesLoading] = useState(false);
    const [ratesError, setRatesError] = useState<string | null>(null);


    const hero = heroId ? heroes[heroId] : null;

    useEffect(() => {
        if (heroId) {
            document.body.style.overflow = 'hidden';
            setActiveTab('habilidades'); // Reset to default tab
            setExpandedSynergy(null); // Reset expanded items
            setPastDays(7); // Reset pastDays filter
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [heroId]);

    useEffect(() => {
        if (hero) {
            setError(null);
            setStatsError(null);
            
            setIsLoading(true);
            fetchHeroDetails(hero.apiId)
                .then(setDetails)
                .catch(err => setError(err.message || `Detalhes para ${hero.name} não foram encontrados.`))
                .finally(() => setIsLoading(false));

            setIsStatsLoading(true);
            fetchHeroDetailStats(hero.apiId, heroApiIdMap)
                .then(setStats)
                .catch(err => setStatsError(err.message || "Falha ao carregar estatísticas."))
                .finally(() => setIsStatsLoading(false));

        } else {
            setDetails(null);
            setStats(null);
            setDailyRates([]);
        }
    }, [hero, heroApiIdMap]);

    useEffect(() => {
        if (hero) {
            setIsRatesLoading(true);
            setRatesError(null);
            setDailyRates([]); // Clear previous data
            fetchHeroRate(hero.apiId, pastDays)
                .then(setDailyRates)
                .catch(err => setRatesError(err.message || "Falha ao carregar tendências."))
                .finally(() => setIsRatesLoading(false));
        }
    }, [hero, pastDays]);

    const getSkillLabel = (iconUrl: string): string => {
        if (!details?.skills) return '';
        const skillIndex = details.skills.findIndex(skill => skill.skillicon === iconUrl);
    
        if (skillIndex === -1) return '';
        if (skillIndex === 0) return 'Passiva';
        if (skillIndex === details.skills.length - 1) return 'Ultimate';
        return `Hab. ${skillIndex}`;
    };

    const renderSkill = (skill: HeroSkill, index: number, totalSkills: number) => {
        let label = '';
        if (index === 0) {
            label = 'Passiva';
        } else if (index === totalSkills - 1) {
            label = 'Ultimate';
        } else {
            label = `Habilidade ${index}`;
        }

        return (
            <div key={skill.skillname} className="p-3 bg-black bg-opacity-20 rounded-xl">
                <p className="font-bold text-sky-300">{label}: <span className="text-white">{skill.skillname}</span></p>
                <p className="text-sm text-gray-300 mt-1">{skill.skilldesc}</p>
            </div>
        );
    };
    
    const renderCombo = (combo: SkillCombo) => (
        <div key={combo.title} className="p-3 bg-black bg-opacity-20 rounded-xl">
            <p className="font-bold text-amber-300 mb-2">{combo.title}</p>
            <div className="flex items-start gap-2 mb-2 flex-wrap">
                {combo.skillIcons.map((iconUrl, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center text-center gap-1 w-14">
                            <img 
                                src={iconUrl} 
                                alt={getSkillLabel(iconUrl)}
                                title={getSkillLabel(iconUrl)}
                                className="w-8 h-8 rounded-md bg-slate-900"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null; 
                                    target.src='https://placehold.co/32x32/1a1c29/FFFFFF?text=?';
                                }}
                            />
                            <span className="text-xs text-slate-400 leading-tight">{getSkillLabel(iconUrl)}</span>
                        </div>
                        {index < combo.skillIcons.length - 1 && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 mt-1.5" viewBox="0 0 20 20" fill="currentColor">
                               <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <p className="text-sm text-gray-300 mt-1">{combo.desc}</p>
        </div>
    );

    if (!hero) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div 
                className="glassmorphism rounded-2xl shadow-xl max-w-4xl w-full flex flex-col border border-sky-500 modal-animation max-h-[85vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <img src={hero.imageUrl} alt={hero.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-sky-400" />
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-amber-300">{hero.name}</h2>
                            <p className="text-sm text-gray-400">{hero.roles.join(' / ')}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-3xl text-gray-400 hover:text-white flex-shrink-0">&times;</button>
                </div>
                
                <nav className="flex-shrink-0 flex border-b border-gray-700" aria-label="Tabs">
                    <button onClick={() => setActiveTab('habilidades')} className={`flex-1 text-center py-3 px-1 font-bold text-sm sm:text-base transition-colors ${activeTab === 'habilidades' ? 'bg-sky-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
                        Habilidades e Combos
                    </button>
                    <button onClick={() => setActiveTab('estatisticas')} className={`flex-1 text-center py-3 px-1 font-bold text-sm sm:text-base transition-colors ${activeTab === 'estatisticas' ? 'bg-sky-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
                        Estatísticas e Sinergias
                    </button>
                </nav>


                <div className="p-4 overflow-y-auto space-y-4 invisible-scrollbar">
                    {activeTab === 'habilidades' && (
                        <>
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center h-full py-16">
                                    <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-sky-400"></div>
                                </div>
                            )}
                            {error && (
                                <div className="text-center text-red-400 p-4">
                                    <p className="font-semibold">Erro</p>
                                    <p className="text-xs mt-1">{error}</p>
                                </div>
                            )}
                            {details && (
                                <div className="space-y-6 animated-entry">
                                    <div>
                                        <h3 className="text-lg font-bold mb-2">Resumo</h3>
                                        <p className="text-sm text-gray-300 bg-black bg-opacity-20 p-3 rounded-xl">{details.summary}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-2">Habilidades</h3>
                                        <div className="space-y-2">
                                            {details.skills.map((skill, index) => renderSkill(skill, index, details.skills.length))}
                                        </div>
                                    </div>
                                    {details.combos && details.combos.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-bold mb-2">Combos Táticos</h3>
                                            <div className="space-y-2">
                                                {details.combos.map(renderCombo)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'estatisticas' && (
                        <div className="animated-entry">
                             {(isStatsLoading && !stats) && (
                                <div className="flex flex-col items-center justify-center h-full py-16">
                                    <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-sky-400"></div>
                                    <p className="mt-2 text-sm text-gray-400">A carregar estatísticas do meta...</p>
                                </div>
                            )}
                            {statsError && !stats && (
                                <div className="text-center text-yellow-400 p-4">
                                    <p className="font-semibold">Aviso</p>
                                    <p className="text-xs mt-1">{statsError}</p>
                                </div>
                            )}
                            {stats && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold mb-2 text-center">Desempenho no Meta</h3>
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div className="p-2 bg-black/20 rounded-lg"><p className="text-xs text-gray-400">Vitórias</p><p className="font-bold text-xl text-green-400">{(stats.stats.winRate * 100).toFixed(1)}%</p></div>
                                            <div className="p-2 bg-black/20 rounded-lg"><p className="text-xs text-gray-400">Escolha</p><p className="font-bold text-xl text-blue-400">{(stats.stats.pickRate * 100).toFixed(1)}%</p></div>
                                            <div className="p-2 bg-black/20 rounded-lg"><p className="text-xs text-gray-400">Ban</p><p className="font-bold text-xl text-red-400">{(stats.stats.banRate * 100).toFixed(1)}%</p></div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-lg font-bold mb-2 text-center">Tendência de Desempenho</h3>
                                        <div className="flex justify-center gap-2 mb-3">
                                            {[7, 15, 30].map(days => (
                                                <button
                                                    key={days}
                                                    onClick={() => setPastDays(days as 7 | 15 | 30)}
                                                    className={`font-semibold text-xs py-1 px-3 rounded-lg transition-colors duration-200 ${pastDays === days ? 'bg-sky-600 text-white' : 'bg-slate-800 hover:bg-slate-700'}`}
                                                >
                                                    {days} Dias
                                                </button>
                                            ))}
                                        </div>
                                        {isRatesLoading && (
                                            <div className="flex flex-col items-center justify-center h-48 bg-black/20 rounded-lg">
                                                <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-sky-400"></div>
                                            </div>
                                        )}
                                        {ratesError && <p className="text-center text-xs text-yellow-400">{ratesError}</p>}
                                        {!isRatesLoading && !ratesError && (
                                            <PerformanceTrendChart data={dailyRates} />
                                        )}
                                    </div>


                                    {stats.bestSynergies.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-bold mb-2 text-center text-green-300">Sinergias Positivas</h3>
                                            <div className="space-y-2">
                                                {stats.bestSynergies.map(syn => <SynergyStatItem key={syn.hero.id} synergy={syn} type="best" isExpanded={expandedSynergy === syn.hero.id} onToggle={() => setExpandedSynergy(prev => prev === syn.hero.id ? null : syn.hero.id)} />)}
                                            </div>
                                        </div>
                                    )}

                                    {stats.worstSynergies.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-bold mb-2 text-center text-red-300">Sinergias Negativas</h3>
                                             <div className="space-y-2">
                                                {stats.worstSynergies.map(syn => <SynergyStatItem key={syn.hero.id} synergy={syn} type="worst" isExpanded={expandedSynergy === syn.hero.id} onToggle={() => setExpandedSynergy(prev => prev === syn.hero.id ? null : syn.hero.id)} />)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeroDetailModal;