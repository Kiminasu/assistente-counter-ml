import React, { useState, useEffect, useMemo } from 'react';
import { DraftAnalysisResult, BanSuggestion, RankCategory } from '../types';
import { ITEM_ICONS } from '../constants';

// --- SUB-COMPONENT: BAN SUGGESTIONS (MINI) ---

const RANK_LABELS: Record<RankCategory, string> = {
    all: "Todos", epic: "Épico", legend: "Lenda", mythic: "Mítico", honor: "Honra", glory: "Glória"
};
const META_RANKS_TO_DISPLAY: RankCategory[] = ['epic', 'legend', 'mythic', 'honor', 'glory'];

const MiniBanSuggestions: React.FC<{
    counterSuggestions: BanSuggestion[];
    metaSuggestions: BanSuggestion[];
    isBanLoading: boolean;
    activeMetaRank: RankCategory | null;
    onMetaRankChange: (rank: RankCategory) => void;
}> = ({ counterSuggestions, metaSuggestions, isBanLoading, activeMetaRank, onMetaRankChange }) => {
    const [userSelectedTab, setUserSelectedTab] = useState<'counter' | 'meta' | null>(null);
    const hasCounterSuggestions = counterSuggestions && counterSuggestions.length > 0;

    useEffect(() => {
        if (!hasCounterSuggestions && userSelectedTab === 'counter') {
            setUserSelectedTab(null);
        }
    }, [hasCounterSuggestions, userSelectedTab]);

    const activeTab = useMemo(() => {
        if (userSelectedTab) return userSelectedTab;
        return hasCounterSuggestions ? 'counter' : 'meta';
    }, [userSelectedTab, hasCounterSuggestions]);

    const suggestions = activeTab === 'counter' ? counterSuggestions : metaSuggestions;

    const renderBanContent = () => {
        if (isBanLoading || !activeMetaRank) {
            return (
                <div className="flex justify-center items-center h-20">
                    <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-red-400"></div>
                </div>
            );
        }
        if (!suggestions || suggestions.length === 0) {
            return (
                <div className="h-20 flex items-center justify-center text-center">
                    <p className="text-gray-400 text-xs">Nenhuma sugestão de banimento para esta seleção.</p>
                </div>
            );
        }
        return (
            <div className="grid grid-cols-5 gap-2 py-2">
                {suggestions.slice(0, 5).map(({ hero, reason }) => (
                    <div key={hero.id} className="group relative flex flex-col items-center text-center">
                        <img loading="lazy" src={hero.imageUrl} alt={hero.name} className="w-12 h-12 rounded-full object-cover border-2 border-red-800 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] mt-1 font-medium leading-tight">{hero.name}</span>
                        <div className="absolute bottom-full mb-2 w-40 p-2 bg-black text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                            {reason}
                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-black/20 p-3 rounded-xl">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-md font-bold text-red-300">Sugestões de Ban</h3>
                <div className="flex bg-black/30 p-0.5 rounded-lg">
                    <button onClick={() => setUserSelectedTab('counter')} disabled={!hasCounterSuggestions} className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-colors ${activeTab === 'counter' ? 'bg-red-700 text-white' : 'text-gray-400 hover:bg-gray-700/50 disabled:text-gray-600'}`}>Counter</button>
                    <button onClick={() => setUserSelectedTab('meta')} className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-colors ${activeTab === 'meta' ? 'bg-red-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}>Meta</button>
                </div>
            </div>
            {activeTab === 'meta' && (
                <div className="flex flex-wrap justify-center gap-1 mb-2 bg-black/20 p-1 rounded-lg">
                    {META_RANKS_TO_DISPLAY.map(rank => (
                        <button key={rank} onClick={() => onMetaRankChange(rank)} className={`flex-1 text-[10px] font-semibold py-0.5 px-1 rounded transition-colors ${activeMetaRank === rank ? 'bg-red-800 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}>{RANK_LABELS[rank]}</button>
                    ))}
                </div>
            )}
            {renderBanContent()}
        </div>
    );
};

// --- SUB-COMPONENT: STATS ANALYSIS ---

const StatRow: React.FC<{ label: string; allyScore: number; enemyScore: number; }> = ({ label, allyScore, enemyScore }) => (
    <div className="w-full">
        <div className="flex justify-between items-center text-xs mb-1 px-1">
            <span className="font-bold text-blue-300">{allyScore}/10</span>
            <span className="font-semibold text-gray-300">{label}</span>
            <span className="font-bold text-red-300">{enemyScore}/10</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-900 rounded-full h-1.5 text-right">
                <div className="bg-gradient-to-l from-blue-500 to-cyan-400 h-1.5 rounded-full" style={{ width: `${allyScore * 10}%`, float: 'right' }}></div>
            </div>
            <div className="flex-1 bg-gray-900 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-red-500 to-orange-400 h-1.5 rounded-full" style={{ width: `${enemyScore * 10}%` }}></div>
            </div>
        </div>
    </div>
);

const StatsAnalysis: React.FC<{ analysis: DraftAnalysisResult }> = ({ analysis }) => {
    const { advantageScore, advantageReason, allyComposition, enemyComposition } = analysis;
    const advantagePercentage = 50 + (advantageScore * 5);

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-md font-bold text-amber-400 text-center mb-2">Barra de Vantagem</h3>
                <div className="w-full h-6 rounded-full overflow-hidden border-2 border-slate-800 shadow-inner relative bg-gradient-to-r from-red-600 to-red-800">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-500 ease-out" style={{ width: `${advantagePercentage}%` }} />
                    <div className="absolute inset-0 flex justify-between items-center px-3">
                        <span className="font-black text-sm text-white" style={{ textShadow: '0 1px 3px #000' }}>{advantagePercentage.toFixed(0)}%</span>
                        <span className="font-black text-sm text-white" style={{ textShadow: '0 1px 3px #000' }}>{(100 - advantagePercentage).toFixed(0)}%</span>
                    </div>
                </div>
                <p className="text-center text-gray-300 text-xs mt-2 italic min-h-[1.5rem] flex items-center justify-center px-2">{advantageReason}</p>
            </div>
            <div className="space-y-2">
                <StatRow label="Dano Físico" allyScore={allyComposition.physicalDamage} enemyScore={enemyComposition.physicalDamage} />
                <StatRow label="Dano Mágico" allyScore={allyComposition.magicDamage} enemyScore={enemyComposition.magicDamage} />
                <StatRow label="Tanque" allyScore={allyComposition.tankiness} enemyScore={enemyComposition.tankiness} />
                <StatRow label="Controle" allyScore={allyComposition.control} enemyScore={enemyComposition.control} />
            </div>
        </div>
    );
};

// --- SUB-COMPONENT: STRATEGY ANALYSIS ---

const StrategyAnalysis: React.FC<{ analysis: DraftAnalysisResult }> = ({ analysis }) => {
    const { teamStrengths, teamWeaknesses, nextPickSuggestion, strategicItems } = analysis;
    return (
        <div className="space-y-4">
            {nextPickSuggestion && (
                <div>
                    <h3 className="text-md font-bold text-sky-300 mb-2">Sugestão de Pick</h3>
                    <div className="p-3 bg-black bg-opacity-30 rounded-lg">
                        <div className="flex items-center gap-3">
                            <img src={nextPickSuggestion.imageUrl} alt={nextPickSuggestion.heroName} className="w-12 h-12 rounded-full flex-shrink-0" />
                            <div>
                                <p className="font-bold text-md">{nextPickSuggestion.heroName}</p>
                                <p className="font-semibold text-xs text-gray-400 bg-gray-700 inline-block px-2 py-0.5 rounded">{nextPickSuggestion.role}</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-300 mt-2 italic">{nextPickSuggestion.reason}</p>
                    </div>
                </div>
            )}
            <div>
                <h3 className="text-md font-bold text-green-300 mb-2">Pontos Fortes</h3>
                <ul className="space-y-1 list-disc list-inside text-xs text-gray-300 pl-2">
                    {teamStrengths.map((strength, i) => <li key={i}>{strength}</li>)}
                </ul>
            </div>
            <div>
                <h3 className="text-md font-bold text-red-300 mb-2">Pontos Fracos</h3>
                <ul className="space-y-1 list-disc list-inside text-xs text-gray-300 pl-2">
                    {teamWeaknesses.map((weakness, i) => <li key={i}>{weakness}</li>)}
                </ul>
            </div>
            {strategicItems.length > 0 && (
                <div>
                    <h3 className="text-md font-bold text-yellow-300 mb-2">Itens Estratégicos</h3>
                    <div className="space-y-2">
                        {strategicItems.map((item, i) => (
                            <div key={i} className="p-2 bg-black bg-opacity-30 rounded-lg flex items-start gap-3">
                                <img src={ITEM_ICONS[item.name] || ITEM_ICONS.default} alt={item.name} className="w-10 h-10 rounded-md flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-300">{item.reason}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- PAINEL PRINCIPAL UNIFICADO ---

interface DraftAnalysisPanelProps {
    analysis: DraftAnalysisResult | null;
    isLoading: boolean;
    error: string | null;
    counterBanSuggestions: BanSuggestion[];
    metaSuggestions: BanSuggestion[];
    isBanLoading: boolean;
    activeMetaRank: RankCategory | null;
    onMetaRankChange: (rank: RankCategory) => void;
}

const DraftAnalysisPanel: React.FC<DraftAnalysisPanelProps> = ({ analysis, isLoading, error, ...banProps }) => {
    const hasPicks = analysis !== null;
    const hasError = !!error;

    return (
        <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-primary flex flex-col gap-4 min-h-[500px]">
            <h2 className="text-xl font-black text-center text-amber-300 tracking-wider">ANÁLISE DE DRAFT</h2>
            
            {isLoading && !hasPicks && (
                <div className="flex flex-col items-center justify-center flex-grow text-center">
                    <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-violet-400"></div>
                    <p className="mt-4 text-sm">Analisando o draft com a IA...</p>
                </div>
            )}

            {hasError && (
                 <div className="text-center p-4 text-red-400 flex-grow flex items-center justify-center">
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {!isLoading && !hasPicks && !hasError && (
                <div className="text-center text-gray-400 flex flex-col items-center justify-center flex-grow p-4">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <p className="text-sm">Selecione heróis para receber a análise estratégica em tempo real.</p>
                </div>
            )}
            
            {(hasPicks || (isLoading && hasPicks)) && !hasError && (
                <div className={`relative ${isLoading ? 'opacity-30 transition-opacity' : ''}`}>
                    {isLoading && (
                        <div className="absolute inset-0 bg-transparent flex items-center justify-center z-10">
                            <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-violet-400"></div>
                        </div>
                    )}
                    <div className="space-y-4">
                        <MiniBanSuggestions {...banProps} />
                        {analysis && <StatsAnalysis analysis={analysis} />}
                        {analysis && <StrategyAnalysis analysis={analysis} />}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DraftAnalysisPanel;