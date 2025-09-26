import React from 'react';
import { HeroRankInfo, RankCategory, RankDays, SortField, RANKS, RANK_DAYS, SORT_FIELDS } from '../types';
import CollapsibleTutorial from './CollapsibleTutorial';

const RANK_LABELS: Record<RankCategory, string> = {
    all: "Todos", epic: "Épico", legend: "Lenda", mythic: "Mítico", honor: "Honra", glory: "Glória"
};

const SORT_FIELD_LABELS: Record<SortField, string> = {
    win_rate: "Vitórias",
    pick_rate: "Escolhas",
    ban_rate: "Bans"
};


interface HeroRankingsProps {
    isLoading: boolean;
    rankings: HeroRankInfo[];
    error: string | null;
    activeDays: RankDays;
    onDaysChange: (days: RankDays) => void;
    activeRank: RankCategory;
    onRankChange: (rank: RankCategory) => void;
    activeSort: SortField;
    onSortChange: (sort: SortField) => void;
}

const HeroRankings: React.FC<HeroRankingsProps> = ({
    isLoading, rankings, error,
    activeDays, onDaysChange,
    activeRank, onRankChange,
    activeSort, onSortChange
}) => {
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full py-16">
                    <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-violet-400"></div>
                    <p className="mt-3 text-sm text-gray-300">A carregar o ranking...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center text-red-400 p-4">
                    <p className="font-semibold">Erro ao Carregar Ranking</p>
                    <p className="text-xs mt-1">{error}</p>
                </div>
            );
        }

        if (rankings.length === 0) {
            return (
                <div className="text-center text-gray-400 p-8">
                    <p>Nenhum dado de ranking encontrado para os filtros selecionados.</p>
                </div>
            );
        }

        return (
            <ul className="space-y-2 mt-4 pr-2 max-h-[70vh] overflow-y-auto">
                {rankings.map((rankInfo, index) => {
                    let statValue = 0;
                    let statLabel = '';
                    switch (activeSort) {
                        case 'win_rate':
                            statValue = rankInfo.winRate;
                            statLabel = 'Taxa de Vit.';
                            break;
                        case 'pick_rate':
                            statValue = rankInfo.pickRate;
                            statLabel = 'Taxa de Esc.';
                            break;
                        case 'ban_rate':
                            statValue = rankInfo.banRate;
                            statLabel = 'Taxa de Ban.';
                            break;
                    }

                    return (
                        <li key={rankInfo.hero.id} className="flex items-center p-2 bg-black bg-opacity-20 rounded-xl animated-entry hover:bg-black/40 transition-colors" style={{ animationDelay: `${index * 30}ms` }}>
                            <span className="font-bold text-gray-400 w-8 text-center">{index + 1}</span>
                            <img src={rankInfo.hero.imageUrl} alt={rankInfo.hero.name} className="w-10 h-10 rounded-full mx-2" />
                            <div className="flex-grow">
                                <p className="font-semibold">{rankInfo.hero.name}</p>
                                <div className="flex text-xs text-gray-400 gap-x-2">
                                    <span>V: {(rankInfo.winRate * 100).toFixed(1)}%</span>
                                    <span>E: {(rankInfo.pickRate * 100).toFixed(1)}%</span>
                                    <span>B: {(rankInfo.banRate * 100).toFixed(1)}%</span>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="font-bold text-lg text-amber-300">{(statValue * 100).toFixed(2)}%</p>
                                <p className="text-xs text-gray-500">{statLabel}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <div className="flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-4 tracking-wider flex-shrink-0 text-amber-300">RANKING DE HERÓIS</h2>
            <div className="mb-4">
                <CollapsibleTutorial title="Como Usar o Ranking">
                    <div className="text-xs sm:text-sm text-gray-300 space-y-2">
                        <p>
                            Use os filtros para descobrir os heróis mais fortes do meta.
                            <strong>ELO</strong> define o ranking, <strong>PERÍODO</strong> os últimos dias e <strong>ORDENAR POR</strong> o status principal.
                        </p>
                        <p>
                            <strong>V:</strong> Taxa de Vitória, <strong>E:</strong> Taxa de Escolha, <strong>B:</strong> Taxa de Banimento.
                        </p>
                    </div>
                </CollapsibleTutorial>
            </div>
            <div className="space-y-3 px-4">
                <div>
                    <label className="text-xs font-bold text-gray-400">ELO</label>
                    <div className="grid grid-cols-3 gap-1 mt-1">
                        {RANKS.map(rank => (
                            <button key={rank} onClick={() => onRankChange(rank)} className={`text-xs py-1 px-2 rounded-lg transition-colors ${activeRank === rank ? 'bg-violet-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>{RANK_LABELS[rank]}</button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label className="text-xs font-bold text-gray-400">PERÍODO (DIAS)</label>
                    <div className="flex gap-1 mt-1">
                        {RANK_DAYS.map(days => (
                            <button key={days} onClick={() => onDaysChange(days)} className={`flex-1 text-xs py-1 px-2 rounded-lg transition-colors ${activeDays === days ? 'bg-violet-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>{days}</button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label className="text-xs font-bold text-gray-400">ORDENAR POR</label>
                    <div className="flex gap-1 mt-1">
                        {(Object.keys(SORT_FIELDS) as SortField[]).map(field => (
                            <button key={field} onClick={() => onSortChange(field)} className={`flex-1 text-xs py-1 px-2 rounded-lg transition-colors ${activeSort === field ? 'bg-violet-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>{SORT_FIELD_LABELS[field]}</button>
                        ))}
                    </div>
                </div>
            </div>
            {renderContent()}
        </div>
    );
};

export default HeroRankings;
