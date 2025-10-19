import React, { useState, useEffect } from 'react';
import { AnalysisResult, ItemSuggestion, HeroSuggestion, LaneOrNone } from '../types';
import { RATING_STYLES, ITEM_ICONS, SPELL_ICONS } from '../constants';

interface AnalysisPanelProps {
    isLoading: boolean;
    loadingMessage: string;
    result: AnalysisResult | null;
    error: string | null;
    activeLane: LaneOrNone;
    matchupAllyPick: string | null;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ 
    isLoading,
    loadingMessage,
    result, 
    error,
    activeLane,
    matchupAllyPick
}) => {
    const [selectedSuggestion, setSelectedSuggestion] = useState<HeroSuggestion | null>(null);
    const [selectedItem, setSelectedItem] = useState<ItemSuggestion | null>(null);

    useEffect(() => {
        // Reseta as seleções quando um novo resultado de análise é recebido
        setSelectedSuggestion(null);
        setSelectedItem(null);
    }, [result]);

    const handleHeroClick = (suggestion: HeroSuggestion) => {
        setSelectedItem(null); // Fecha a análise de item se estiver aberta
        setSelectedSuggestion(current => (current?.nome === suggestion.nome ? null : suggestion));
    };

    const handleItemClick = (item: ItemSuggestion) => {
        setSelectedSuggestion(null); // Fecha a análise de herói se estiver aberta
        setSelectedItem(current => (current?.nome === item.nome ? null : item));
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <div className="w-full animate-pulse space-y-8">
                        {/* Hero Group Skeleton */}
                        <div>
                            <div className="h-5 bg-slate-700 rounded w-3/4 mx-auto mb-4"></div>
                            <div className="flex justify-center gap-4">
                                <div className="w-20 h-20 bg-slate-700 rounded-full"></div>
                                <div className="w-20 h-20 bg-slate-700 rounded-full"></div>
                                <div className="w-20 h-20 bg-slate-700 rounded-full"></div>
                            </div>
                        </div>
                        {/* Items Group Skeleton */}
                        <div>
                            <div className="h-5 bg-slate-700 rounded w-1/2 mx-auto mb-4"></div>
                            <div className="flex justify-center gap-4">
                                <div className="w-20 h-20 bg-slate-700 rounded-lg"></div>
                                <div className="w-20 h-20 bg-slate-700 rounded-lg"></div>
                                <div className="w-20 h-20 bg-slate-700 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-sky-400 mx-auto"></div>
                        <p className="mt-3 text-sm text-sky-300 transition-all duration-300">{loadingMessage}</p>
                    </div>
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
                <div className="opacity-50 text-center space-y-8">
                     <div>
                        <h3 className="font-bold text-lg text-green-400">Heróis que Anulam (Lane)</h3>
                         <p className="text-sm text-gray-500 mt-1">Aguardando análise...</p>
                    </div>
                     <div>
                        <h3 className="font-bold text-lg text-indigo-400">Heróis com Vantagem</h3>
                        <p className="text-sm text-gray-500 mt-1">Aguardando análise...</p>
                    </div>
                     <div>
                         <h3 className="text-lg font-bold text-amber-300">Itens de Counter Recomendados</h3>
                         <p className="text-sm text-gray-500 mt-1">Aguardando análise...</p>
                    </div>
                </div>
            );
        }
        
        const groupedSuggestions = (result.sugestoesHerois || []).reduce((acc, suggestion) => {
            const classification = suggestion.classificacao;
            if (!acc[classification]) {
                acc[classification] = [];
            }
            acc[classification].push(suggestion);
            return acc;
        }, {} as Record<string, HeroSuggestion[]>);

        const groupOrder: ('ANULA' | 'VANTAGEM')[] = ['ANULA', 'VANTAGEM'];
        
        const classificationLabels: Record<string, string> = {
            'ANULA': 'Heróis que Anulam (Lane)',
            'VANTAGEM': `Heróis com Vantagem ${activeLane === 'NENHUMA' ? '(Geral)' : '(Lane)'}`
        };

        const renderHeroDetailCard = (suggestion: HeroSuggestion) => {
            const styles = RATING_STYLES[suggestion.classificacao] || RATING_STYLES['NEUTRO'];
            return (
                <div className={`p-4 my-4 bg-slate-900/70 rounded-xl animated-entry border-l-4 ${styles.border}`} style={{ animationDelay: '50ms'}}>
                    <div className="flex-grow mb-3">
                        <p className="font-bold text-lg">{suggestion.nome}</p>
                        <div className="flex items-center gap-2">
                            <span className={`font-black text-sm ${styles.text}`}>{suggestion.classificacao}</span>
                            <span className="text-xs text-gray-400 font-mono">{suggestion.estatistica}</span>
                        </div>
                    </div>

                    <p className="text-sm text-gray-300 pb-3 border-b border-slate-700/50">{suggestion.motivo}</p>
                    
                    {suggestion.avisos && suggestion.avisos.length > 0 && (
                        <div className="mt-3">
                            <p className="text-sm uppercase font-bold text-yellow-400 mb-2">Avisos Importantes</p>
                            {suggestion.avisos.map((aviso, i) => (
                                 <div key={i} className="flex items-start gap-2 mt-2 p-2 bg-yellow-400/10 rounded-lg">
                                    <svg className="w-4 h-4 text-yellow-300 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    <p className="text-xs text-gray-300">{aviso}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {suggestion.spells && suggestion.spells.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm uppercase font-bold text-gray-400 mb-2">Feitiços Recomendados</p>
                            {suggestion.spells.map(spell => (
                                <div key={spell.nome} className="mt-2 flex items-start gap-3">
                                    <img loading="lazy" src={SPELL_ICONS[spell.nome] || SPELL_ICONS.default} alt={spell.nome} className="w-10 h-10 rounded-md mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-base font-semibold text-sky-300">{spell.nome}</p>
                                        <p className="text-xs text-gray-400">{spell.motivo}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <>
                {groupOrder.map(groupName => {
                    const suggestionsInGroup = groupedSuggestions[groupName];
                    if (!suggestionsInGroup || suggestionsInGroup.length === 0) return null;

                    const isDetailVisible = selectedSuggestion && suggestionsInGroup.some(s => s.nome === selectedSuggestion.nome);

                    return (
                        <div key={groupName} className="mb-6">
                            <h3 className={`font-bold text-lg mb-3 text-center ${RATING_STYLES[groupName]?.text || 'text-gray-300'}`}>
                                {classificationLabels[groupName]}
                            </h3>
                           
                            <div className="flex justify-center flex-wrap gap-4">
                                {suggestionsInGroup.map((suggestion) => {
                                    const isSelected = selectedSuggestion?.nome === suggestion.nome;
                                    const styles = RATING_STYLES[suggestion.classificacao] || RATING_STYLES['NEUTRO'];
                                    const heroImageSize = 'w-20 h-20';
                                    return (
                                        <div 
                                            key={suggestion.nome} 
                                            className="flex flex-col items-center text-center cursor-pointer group"
                                            onClick={() => handleHeroClick(suggestion)}
                                            aria-label={`Analisar ${suggestion.nome}`}
                                            role="button"
                                            aria-pressed={isSelected}
                                        >
                                            <div className="relative">
                                                <img 
                                                    loading="lazy"
                                                    src={suggestion.imageUrl} 
                                                    alt={suggestion.nome} 
                                                    className={`${heroImageSize} rounded-full object-cover border-4 transition-all duration-200 group-hover:scale-110 ${styles.border} ${isSelected ? 'ring-4 ring-sky-400 ring-offset-2 ring-offset-slate-900' : ''} flex-shrink-0`}
                                                />
                                            </div>
                                            <span className={`text-sm mt-2 font-medium transition-colors flex items-center gap-1 ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                                {suggestion.nome}
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform duration-300 ${isSelected ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {isDetailVisible && selectedSuggestion && renderHeroDetailCard(selectedSuggestion)}
                        </div>
                    );
                })}

                {matchupAllyPick && result.sugestoesCountersAliado && result.sugestoesCountersAliado.length > 0 && (() => {
                    const allyCounters = result.sugestoesCountersAliado!;
                    const isDetailVisible = selectedSuggestion && allyCounters.some(s => s.nome === selectedSuggestion.nome);

                    return (
                        <div className="mb-6">
                            <h3 className="font-bold text-lg mb-3 text-center text-red-400">
                                Heróis que Counteram seu Herói
                            </h3>
                            <div className="flex justify-center flex-wrap gap-4">
                                {allyCounters.map((suggestion) => {
                                    const isSelected = selectedSuggestion?.nome === suggestion.nome;
                                    const heroImageSize = 'w-20 h-20';
                                    return (
                                        <div
                                            key={suggestion.nome}
                                            className="flex flex-col items-center text-center cursor-pointer group"
                                            onClick={() => handleHeroClick(suggestion)}
                                            aria-label={`Analisar ${suggestion.nome}`}
                                            role="button"
                                            aria-pressed={isSelected}
                                        >
                                            <img
                                                loading="lazy"
                                                src={suggestion.imageUrl}
                                                alt={suggestion.nome}
                                                className={`${heroImageSize} rounded-full object-cover border-4 transition-all duration-200 group-hover:scale-110 border-red-400 ${isSelected ? 'ring-4 ring-sky-400 ring-offset-2 ring-offset-slate-900' : ''}`}
                                            />
                                            <span className={`text-sm mt-2 font-medium transition-colors flex items-center gap-1 ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                                {suggestion.nome}
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform duration-300 ${isSelected ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            {isDetailVisible && selectedSuggestion && renderHeroDetailCard(selectedSuggestion)}
                        </div>
                    );
                })()}

                <h2 className="text-xl font-bold text-center mt-8 mb-4 text-amber-300">Itens de Counter Recomendados</h2>
                
                <div className="flex justify-center flex-wrap gap-4">
                    {(result.sugestoesItens || []).map((item, index) => {
                         const isSelected = selectedItem?.nome === item.nome;
                         return (
                            <div 
                                key={index} 
                                className="flex flex-col items-center text-center cursor-pointer group w-24"
                                onClick={() => handleItemClick(item)}
                                aria-label={`Analisar ${item.nome}`}
                                role="button"
                                aria-pressed={isSelected}
                            >
                                <img 
                                    loading="lazy"
                                    src={ITEM_ICONS[item.nome] || ITEM_ICONS.default} 
                                    alt={item.nome} 
                                    className={`w-20 h-20 rounded-lg object-cover border-4 transition-all duration-200 group-hover:scale-110 border-sky-500 ${isSelected ? 'ring-4 ring-sky-400 ring-offset-2 ring-offset-slate-900' : ''}`}
                                />
                                <span className={`text-sm mt-2 font-medium transition-colors flex items-center justify-center gap-1 w-full ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                    <span className="break-words text-center">{item.nome}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform duration-300 flex-shrink-0 mt-0.5 ${isSelected ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </div>
                         )
                    })}
                </div>

                {selectedItem && (
                    <div className="p-4 my-4 bg-slate-900/70 rounded-xl animated-entry border-l-4 border-sky-500" style={{ animationDelay: '50ms'}}>
                        <div className="flex items-center gap-4">
                             <img 
                                loading="lazy"
                                src={ITEM_ICONS[selectedItem.nome] || ITEM_ICONS.default} 
                                alt={selectedItem.nome} 
                                className="w-14 h-14 rounded-md flex-shrink-0"
                            />
                            <div className="flex-grow">
                                <div className="flex justify-between items-center gap-2">
                                    <p className="font-bold text-lg text-amber-300">{selectedItem.nome}</p>
                                    {selectedItem.preco > 0 && (
                                        <div className="flex items-center gap-1 text-yellow-400 bg-black bg-opacity-30 px-2 py-1 rounded-full flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.5 7.5a.5.5 0 00-1 0v5a.5.5 0 001 0V9.354a2.5 2.5 0 113-1.118v.07a.5.5 0 001 0V8.25a3.5 3.5 0 10-5 2.38V7.5z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-bold text-sm leading-none">{selectedItem.preco}</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-300 mt-1">{selectedItem.motivo}</p>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <aside className="col-span-1 glassmorphism p-4 rounded-2xl animated-entry flex flex-col border-2 panel-glow-primary">
            <div className="flex-shrink-0">
                <h2 className="text-2xl sm:text-3xl font-black text-center mb-4 tracking-wider text-amber-300" style={{ textShadow: '0 0 10px rgba(56, 182, 255, 0.3)'}}>Análise Tática da IA</h2>
            </div>
            <div className="pr-2 min-h-[200px]">
                {renderContent()}
            </div>
        </aside>
    );
};

export default AnalysisPanel;