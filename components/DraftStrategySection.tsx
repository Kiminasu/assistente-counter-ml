import React from 'react';
import { DraftAnalysisResult } from '../types';
import { ITEM_ICONS } from '../constants';

interface DraftStrategySectionProps {
    analysis: DraftAnalysisResult | null;
    isLoading: boolean;
    error: string | null;
}

const DraftStrategySection: React.FC<DraftStrategySectionProps> = ({ analysis, isLoading, error }) => {

    const renderBody = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[15rem]">
                    <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-sky-400"></div>
                    <p className="mt-3 text-sm text-slate-300">Analisando estratégia...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center p-4 text-red-400 min-h-[15rem] flex items-center justify-center">
                    <p className="text-sm">{error}</p>
                </div>
            );
        }

        if (!analysis) {
            return (
                <div className="text-center text-gray-400 flex flex-col items-center justify-center h-full p-4 min-h-[15rem]">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <h3 className="text-lg font-bold">Estratégia de Jogo</h3>
                    <p className="mt-2 text-sm">Selecione heróis para receber insights estratégicos da IA.</p>
                </div>
            );
        }
        
        const { teamStrengths, teamWeaknesses, nextPickSuggestion, strategicItems } = analysis;

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-black bg-opacity-20 rounded-xl">
                    <h3 className="font-bold text-green-300 mb-2 border-b-2 border-green-300/50 pb-1">Pontos Fortes</h3>
                    <ul className="space-y-2 list-disc list-inside text-sm text-gray-200">
                        {(teamStrengths ?? []).map((strength, i) => <li key={i}>{strength}</li>)}
                    </ul>
                </div>

                <div className="p-3 bg-black bg-opacity-20 rounded-xl">
                    <h3 className="font-bold text-red-300 mb-2 border-b-2 border-red-300/50 pb-1">Pontos Fracos</h3>
                    <ul className="space-y-2 list-disc list-inside text-sm text-gray-200">
                         {(teamWeaknesses ?? []).map((weakness, i) => <li key={i}>{weakness}</li>)}
                    </ul>
                </div>

                {nextPickSuggestion && (
                    <div className="p-3 bg-black bg-opacity-20 rounded-xl md:col-span-2">
                        <h3 className="font-bold text-sky-300 mb-2 border-b-2 border-sky-300/50 pb-1">Sugestão de Pick</h3>
                        <div className="p-2 bg-gray-900/50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <img loading="lazy" src={nextPickSuggestion.imageUrl} alt={nextPickSuggestion.heroName} className="w-12 h-12 rounded-full flex-shrink-0" />
                                <div>
                                    <p className="font-bold">{nextPickSuggestion.heroName}</p>
                                    <p className="font-semibold text-xs text-gray-400 bg-gray-700 inline-block px-2 py-0.5 rounded-lg">{nextPickSuggestion.role}</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-300 mt-2 italic">{nextPickSuggestion.reason}</p>
                        </div>
                    </div>
                )}
                
                <div className="p-3 bg-black bg-opacity-20 rounded-xl md:col-span-2">
                    <h3 className="font-bold text-yellow-300 mb-2 border-b-2 border-yellow-300/50 pb-1">Itens Estratégicos</h3>
                    <div className="space-y-2">
                        {(strategicItems ?? []).map((item, i) => (
                           <div key={i} className="p-2 bg-gray-900/50 rounded-xl flex items-start gap-3">
                               <img loading="lazy" src={ITEM_ICONS[item.name] || ITEM_ICONS.default} alt={item.name} className="w-10 h-10 rounded-md flex-shrink-0 mt-1" />
                               <div>
                                   <p className="font-bold text-sm">{item.name}</p>
                                   <p className="text-xs text-gray-300 italic">{item.reason}</p>
                               </div>
                            </div>
                        ))}
                   </div>
                </div>

            </div>
        );
    }
    
    return (
        <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-primary animated-entry">
            <h2 className="text-xl font-black text-center mb-4 text-amber-300 tracking-wider">ESTRATÉGIA DE JOGO</h2>
            {renderBody()}
        </div>
    );
};

export default DraftStrategySection;
