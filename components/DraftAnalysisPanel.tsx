import React from 'react';
import { DraftAnalysisResult } from '../types';
import { ITEM_ICONS } from '../constants';

interface DraftAnalysisPanelProps {
    analysis: DraftAnalysisResult | null;
    isLoading: boolean;
    error: string | null;
}

const DraftAnalysisPanel: React.FC<DraftAnalysisPanelProps> = ({ analysis, isLoading, error }) => {
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
                    <p className="mt-4 text-lg">Analisando o draft com a IA...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center p-4 text-red-400">
                    <h3 className="text-xl font-bold">Ocorreu um Erro</h3>
                    <p className="mt-2 text-sm">{error}</p>
                </div>
            );
        }

        if (!analysis) {
            return (
                 <div className="text-center text-gray-400 flex flex-col items-center justify-center h-full">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <h3 className="text-xl font-bold">Análise do Draft</h3>
                    <p className="mt-2 text-sm">Comece a selecionar heróis para receber uma análise estratégica da composição da sua equipe.</p>
                </div>
            );
        }
        
        const { teamStrengths, teamWeaknesses, nextPickSuggestion, strategicItems } = analysis;

        return (
            <div className="p-4 space-y-4 overflow-y-auto">
                <div>
                    <h3 className="text-lg font-bold text-green-300 mb-2">Pontos Fortes</h3>
                    <ul className="space-y-1 list-disc list-inside text-sm text-gray-300">
                        {teamStrengths.map((strength, i) => <li key={i}>{strength}</li>)}
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-red-300 mb-2">Pontos Fracos</h3>
                    <ul className="space-y-1 list-disc list-inside text-sm text-gray-300">
                         {teamWeaknesses.map((weakness, i) => <li key={i}>{weakness}</li>)}
                    </ul>
                </div>

                {nextPickSuggestion && (
                    <div>
                        <h3 className="text-lg font-bold text-purple-300 mb-2">Sugestão de Próximo Pick</h3>
                        <div className="p-3 bg-black bg-opacity-30 rounded-lg border-l-4 border-purple-500">
                            <div className="flex items-center gap-4">
                                <img src={nextPickSuggestion.imageUrl} alt={nextPickSuggestion.heroName} className="w-14 h-14 rounded-full flex-shrink-0" />
                                <div className="flex-grow">
                                    <p className="font-bold text-lg">{nextPickSuggestion.heroName}</p>
                                    <p className="font-semibold text-xs text-gray-400 bg-gray-700 inline-block px-2 py-0.5 rounded">{nextPickSuggestion.role}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">{nextPickSuggestion.reason}</p>
                        </div>
                    </div>
                )}
                
                {strategicItems.length > 0 && (
                     <div>
                        <h3 className="text-lg font-bold text-yellow-300 mb-2">Itens Estratégicos</h3>
                         <div className="space-y-2">
                             {strategicItems.map((item, i) => (
                                <div key={i} className="p-3 bg-black bg-opacity-30 rounded-lg flex items-center gap-4 border-l-4 border-yellow-500">
                                    <img src={ITEM_ICONS[item.name] || ITEM_ICONS.default} alt={item.name} className="w-12 h-12 rounded-md flex-shrink-0" />
                                    <div>
                                        <p className="font-bold">{item.name}</p>
                                        <p className="text-sm text-gray-300">{item.reason}</p>
                                    </div>
                                 </div>
                             ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }
    
    return (
         <div className="glassmorphism p-4 rounded-xl flex-grow flex flex-col border-2 border-yellow-400 shadow-lg shadow-yellow-400/20">
            {renderContent()}
        </div>
    );
};

export default DraftAnalysisPanel;
