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
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

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
            const isApiKeyError = error.includes("chave da API");
            const isSpecificError = error.includes("Nenhum counter estatístico");

            if (isApiKeyError) {
                return (
                    <div className="text-center p-8 text-yellow-400 flex flex-col items-center justify-center h-full">
                        <svg className="w-16 h-16 mx-auto mb-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <h3 className="text-xl font-bold">Análise Indisponível</h3>
                        <p className="mt-2 text-sm text-yellow-300">{error}</p>
                    </div>
                );
            }
    
            return (
                <div className={`text-center p-8 ${isSpecificError ? 'text-yellow-400' : 'text-red-400'}`}>
                    <h3 className="text-xl font-bold">{isSpecificError ? 'Nenhuma Sugestão Encontrada' : 'Ocorreu um Erro'}</h3>
                    <p className="mt-2 text-sm">{error}</p>
                </div>
            );
        }

        if (!result) {
            return (
                <div className="text-center p-8 text-gray-400 flex flex-col items-center justify-center h-full">
                    <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                    <p>Selecione o herói inimigo e clique em "Analisar Confronto" para receber sugestões.</p>
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
                                    
                                    {suggestion.avisos && suggestion.avisos.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-xs uppercase font-bold text-yellow-400 mb-2">Avisos Importantes</p>
                                            {suggestion.avisos.map((aviso, i) => (
                                                 <div key={i} className="flex items-start gap-2 mt-1 pl-3 border-l-2 border-yellow-400">
                                                    <svg className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                    <p className="text-xs text-gray-300">{aviso}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-3">
                                        <p className="text-xs uppercase font-bold text-gray-400 mb-2">Feitiços Recomendados</p>
                                        {suggestion.spells.map(spell => (
                                            <div key={spell.nome} className="mt-2 pl-3 border-l-2 border-purple-400">
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
                            <div className="flex-grow">
                                <p className="font-bold text-lg text-purple-300">{suggestion.nome}</p>
                                <p className="text-sm text-gray-300 mt-1">{suggestion.motivo}</p>
                            </div>
                        </div>
                    );
                })}
            </>
        );
    };

    return (
        <aside className="col-span-1 glassmorphism p-4 rounded-xl animated-entry flex flex-col lg:h-[85vh] border-2 border-yellow-400 shadow-lg shadow-yellow-400/20">
            <h2 className="text-xl sm:text-2xl font-black text-center mb-4 tracking-wider flex-shrink-0">ANÁLISE E DADOS</h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                {renderContent()}
            </div>
        </aside>
    );
};

export default AnalysisPanel;