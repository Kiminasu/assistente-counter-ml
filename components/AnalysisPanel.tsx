import React, { useState } from 'react';
import { AnalysisResult, Lane } from '../types';
import { RATING_STYLES } from '../constants';

interface AnalysisPanelProps {
    isLoading: boolean;
    result: AnalysisResult | null;
    error: string | null;
    activeLane: Lane;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ isLoading, result, error, activeLane }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
                    <p className="mt-4 text-lg">Combinando dados e IA para a lane {activeLane}...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center text-red-400 p-8">
                    <h3 className="text-xl font-bold">Ocorreu um Erro</h3>
                    <p className="mt-2">Não foi possível gerar as sugestões. Isto pode ser um problema temporário com a IA ou a API de dados.</p>
                    <p className="text-sm mt-1 text-gray-500">{error}</p>
                </div>
            );
        }

        if (!result) {
            return (
                <div className="text-center p-8 text-gray-400 flex flex-col items-center justify-center h-full">
                    <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                    <p>Selecione o herói inimigo para receber sugestões de counter.</p>
                </div>
            );
        }

        return (
            <>
                <h2 className="text-xl font-bold text-center mb-3 text-purple-300">Heróis Sugeridos</h2>
                {result.sugestoesHerois.map((suggestion, index) => {
                    const styles = RATING_STYLES[suggestion.classificacao] || { text: 'text-gray-300', border: 'border-gray-400' };
                    const isExpanded = expandedIndex === index;
                    return (
                        <div key={index} className={`bg-black bg-opacity-20 rounded-lg mb-2 animated-entry border-l-4 ${styles.border}`} style={{ animationDelay: `${index * 100}ms`}}>
                            <div className="flex items-center p-3 cursor-pointer" onClick={() => handleToggle(index)}>
                                <img src={suggestion.imageUrl} alt={suggestion.nome} className="w-12 h-12 rounded-full flex-shrink-0 mr-4" />
                                <div className="flex-grow">
                                    <p className="font-bold text-lg">{suggestion.nome}</p>
                                    <div>
                                        <span className={`font-black text-sm ${styles.text}`}>{suggestion.classificacao}</span>
                                        <span className="text-xs text-gray-400 font-mono ml-2">{suggestion.estatistica}</span>
                                    </div>
                                </div>
                                <div className={`text-2xl transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden max-h-0 ${isExpanded ? 'max-h-96' : ''}`}>
                                <div className="px-4 pb-3 pt-1 border-t border-gray-700">
                                    <p className="text-sm text-gray-300 mt-2">{suggestion.motivo}</p>
                                    <div className="mt-3">
                                        <p className="text-xs uppercase font-bold text-gray-400 mb-2">Feitiços Recomendados</p>
                                        {suggestion.spells.map(spell => (
                                            <div key={spell.nome} className="mt-1 pl-3 border-l-2 border-purple-400">
                                                <p className="text-sm font-semibold text-purple-300">{spell.nome}</p>
                                                <p className="text-xs text-gray-400">{spell.motivo}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                <h2 className="text-xl font-bold text-center mt-6 mb-3 text-purple-300">Itens de Counter Recomendados</h2>
                {result.sugestoesItens.map((suggestion, index) => {
                    return (
                        <div key={index} className="p-3 bg-black bg-opacity-20 rounded-lg mb-3 animated-entry border-l-4 border-purple-500" style={{ animationDelay: `${(result.sugestoesHerois.length + index) * 100}ms`}}>
                            <p className="font-bold text-lg text-purple-300">{suggestion.nome}</p>
                            <p className="text-sm text-gray-300 mt-1">{suggestion.motivo}</p>
                        </div>
                    );
                })}
            </>
        );
    };

    return (
        <aside className="col-span-1 glassmorphism p-4 rounded-xl animated-entry flex flex-col lg:h-[85vh]">
            <h2 className="text-xl sm:text-2xl font-black text-center mb-4 tracking-wider flex-shrink-0">ANÁLISE E DADOS</h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                {renderContent()}
            </div>
        </aside>
    );
};

export default AnalysisPanel;