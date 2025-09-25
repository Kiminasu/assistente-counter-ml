import React from 'react';
import { DraftAnalysisResult } from '../types';
import { ITEM_ICONS } from '../constants';

interface DraftStrategySectionProps {
    analysis: DraftAnalysisResult | null;
    isLoading: boolean;
    error: string | null;
}

const DraftStrategySection: React.FC<DraftStrategySectionProps> = ({ analysis, isLoading, error }) => {
    
    if (isLoading || error || !analysis) {
        // This section only appears when there is valid data,
        // as the loading/error states are handled by the main stats panel.
        return null;
    }

    const { teamStrengths, teamWeaknesses, nextPickSuggestion, strategicItems } = analysis;
    // FIX: Adiciona o encadeamento opcional e a coalescência nula para evitar erros se o objeto de análise da IA não tiver propriedades.
    const hasContent = (teamStrengths?.length || 0) > 0 || (teamWeaknesses?.length || 0) > 0 || nextPickSuggestion || (strategicItems?.length || 0) > 0;
    
    if (!hasContent) return null;

    return (
        <div className="glassmorphism p-4 rounded-xl border-2 panel-glow-purple animated-entry">
            <h2 className="text-xl font-black text-center mb-4 text-amber-300 tracking-wider">ESTRATÉGIA DE JOGO</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Strengths */}
                <div className="p-3 bg-black bg-opacity-20 rounded-lg">
                    <h3 className="font-bold text-green-300 mb-2 border-b-2 border-green-300/50 pb-1">Pontos Fortes</h3>
                    <ul className="space-y-2 list-disc list-inside text-sm text-gray-200">
                        {/* FIX: Utiliza um array de fallback vazio para evitar que o mapa falhe em caso de indefinição. */}
                        {(teamStrengths || []).map((strength, i) => <li key={i}>{strength}</li>)}
                    </ul>
                </div>

                {/* Weaknesses */}
                <div className="p-3 bg-black bg-opacity-20 rounded-lg">
                    <h3 className="font-bold text-red-300 mb-2 border-b-2 border-red-300/50 pb-1">Pontos Fracos</h3>
                    <ul className="space-y-2 list-disc list-inside text-sm text-gray-200">
                        {/* FIX: Utiliza um array de fallback vazio para evitar que o mapa falhe em caso de indefinição. */}
                         {(teamWeaknesses || []).map((weakness, i) => <li key={i}>{weakness}</li>)}
                    </ul>
                </div>

                {/* Next Pick Suggestion */}
                {nextPickSuggestion && (
                    <div className="p-3 bg-black bg-opacity-20 rounded-lg lg:col-span-1 md:col-span-2">
                        <h3 className="font-bold text-violet-300 mb-2 border-b-2 border-violet-300/50 pb-1">Sugestão de Pick</h3>
                        <div className="p-2 bg-gray-900/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <img loading="lazy" src={nextPickSuggestion.imageUrl} alt={nextPickSuggestion.heroName} className="w-12 h-12 rounded-full flex-shrink-0" />
                                <div>
                                    <p className="font-bold">{nextPickSuggestion.heroName}</p>
                                    <p className="font-semibold text-xs text-gray-400 bg-gray-700 inline-block px-2 py-0.5 rounded">{nextPickSuggestion.role}</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-300 mt-2 italic">{nextPickSuggestion.reason}</p>
                        </div>
                    </div>
                )}
                
                {/* Strategic Items */}
                <div className={`p-3 bg-black bg-opacity-20 rounded-lg ${!nextPickSuggestion ? 'lg:col-span-2 md:col-span-2' : ''}`}>
                    <h3 className="font-bold text-yellow-300 mb-2 border-b-2 border-yellow-300/50 pb-1">Itens Estratégicos</h3>
                    <div className="space-y-2">
                        {/* FIX: Utiliza um array de fallback vazio para evitar que o mapa falhe em caso de indefinição. */}
                        {(strategicItems || []).map((item, i) => (
                           <div key={i} className="p-2 bg-gray-900/50 rounded-lg flex items-start gap-3">
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
        </div>
    );
};

export default DraftStrategySection;