import React from 'react';
import { AnalysisHistoryItem, Hero } from '../types';

interface HistoryScreenProps {
    history: AnalysisHistoryItem[];
    isLoading: boolean;
    error: string | null;
    onLoadAnalysis: (item: AnalysisHistoryItem) => void;
    onDeleteAnalysis: (id: string) => void;
    heroes: Record<string, Hero>;
}

const AnalysisTypeIcon: React.FC<{ type: '1v1' | '5v5' | 'synergy' }> = ({ type }) => {
    switch (type) {
        case '1v1':
            return <span className="font-black text-lg tracking-tighter text-sky-300">1v1</span>;
        case '5v5':
            return <span className="font-black text-lg tracking-tighter text-red-300">5v5</span>;
        case 'synergy':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
        default:
            return null;
    }
};

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, isLoading, error, onLoadAnalysis, onDeleteAnalysis, heroes }) => {
    
    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Impede que o clique acione o onLoadAnalysis
        if (window.confirm('Tem certeza que deseja apagar esta análise? Esta ação não pode ser desfeita.')) {
            onDeleteAnalysis(id);
        }
    };

    const renderAnalysisContent = (item: AnalysisHistoryItem) => {
        const { analysis_type, analysis_data } = item;
        const context = analysis_data.context;

        switch (analysis_type) {
            case 'synergy': {
                const heroId = context.synergyHeroPick;
                const hero = heroId ? heroes[heroId] : null;
                return (
                    <div className="flex items-center gap-3">
                        {hero ? (
                            <img src={hero.imageUrl} alt={hero.name} className="w-10 h-10 rounded-full border-2 border-violet-400" title={`Análise de ${hero.name}`} />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-violet-400" />
                        )}
                        <p className="font-bold text-slate-100 group-hover:text-white transition-colors">Análise de Herói</p>
                    </div>
                );
            }
            case '1v1': {
                const allyHeroId = context.matchupAllyPick;
                const enemyHeroId = context.matchupEnemyPick;
                const allyHero = allyHeroId ? heroes[allyHeroId] : null;
                const enemyHero = enemyHeroId ? heroes[enemyHeroId] : null;

                return (
                    <div className="flex items-center gap-2">
                        {allyHero ? (
                            <img src={allyHero.imageUrl} alt={allyHero.name} className="w-10 h-10 rounded-full border-2 border-blue-400" title={allyHero.name} />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-blue-400 flex items-center justify-center text-slate-400 font-bold text-xs" title="Nenhum herói">?</div>
                        )}
                        <span className="font-bold text-slate-500 mx-1">vs</span>
                        {enemyHero ? (
                            <img src={enemyHero.imageUrl} alt={enemyHero.name} className="w-10 h-10 rounded-full border-2 border-red-400" title={enemyHero.name} />
                        ) : (
                             <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-red-400" />
                        )}
                    </div>
                );
            }
            case '5v5': {
                const allyPicks = context.draftAllyPicks || [];
                const enemyPicks = context.draftEnemyPicks || [];

                const renderTeam = (picks: (string|null)[], borderColor: string) => (
                    <div className="flex -space-x-3 sm:-space-x-4">
                        {Array.from({ length: 5 }).map((_, i) => {
                            const heroId = picks[i];
                            const hero = heroId ? heroes[heroId] : null;
                            return hero ? (
                                <img key={i} src={hero.imageUrl} alt={hero.name} title={hero.name} className={`w-8 h-8 rounded-full border-2 ${borderColor} bg-slate-900`} />
                            ) : (
                                <div key={i} className={`w-8 h-8 rounded-full border-2 ${borderColor} bg-slate-700 flex items-center justify-center text-slate-400 font-bold text-xs`}>?</div>
                            );
                        })}
                    </div>
                );
                
                return (
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        {renderTeam(allyPicks, 'border-blue-400')}
                        <span className="font-bold text-slate-500 mx-1 my-1 sm:my-0">vs</span>
                        {renderTeam(enemyPicks, 'border-red-400')}
                    </div>
                );
            }
            default:
                return <p className="font-bold text-slate-100 group-hover:text-white transition-colors">{item.title}</p>;
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-16">
                <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-sky-400"></div>
                <p className="mt-3 text-sm text-gray-300">Carregando seu histórico de análises...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-400">{error}</p>;
    }

    if (history.length === 0) {
        return (
            <div className="text-center text-gray-400 p-8 glassmorphism rounded-2xl border-2 panel-glow-primary">
                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h3 className="mt-4 text-xl font-bold">Nenhuma Análise Salva</h3>
                <p className="mt-2 text-sm text-gray-500">
                    Seu histórico está vazio. As análises que você fizer usando os planos Mítico ou Glória Imortal aparecerão aqui.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto animated-entry">
            <div className="glassmorphism p-4 sm:p-6 rounded-2xl border-2 panel-glow-primary">
                <h2 className="text-2xl sm:text-3xl font-black text-center mb-6 tracking-wider text-amber-300">HISTÓRICO DE ANÁLISES</h2>
                <ul className="space-y-3">
                    {history.map((item, index) => (
                        <li 
                            key={item.id}
                            className="animated-entry"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div 
                                onClick={() => onLoadAnalysis(item)}
                                className="group relative flex items-center p-4 bg-black/30 rounded-xl hover:bg-sky-900/50 border border-slate-700 hover:border-sky-500 transition-all cursor-pointer"
                            >
                                <div className="flex-shrink-0 w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mr-4">
                                    <AnalysisTypeIcon type={item.analysis_type} />
                                </div>
                                <div className="flex-grow min-w-0">
                                    {renderAnalysisContent(item)}
                                    <p className="text-xs text-slate-400 mt-1">{new Date(item.created_at).toLocaleString('pt-BR')}</p>
                                </div>
                                <button
                                    onClick={(e) => handleDelete(e, item.id)}
                                    className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 text-slate-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 ml-2"
                                    aria-label="Apagar análise"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default HistoryScreen;