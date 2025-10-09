import React, { useState, useEffect, useMemo, useRef } from 'react';
// FIX: Corrected typo from HeroStrategyAnalysis to HeroStrategicAnalysis.
import { BanSuggestion, Hero, HeroStrategicAnalysis, HeroRankInfo, RankCategory, HeroDetails, HeroRelation, HeroSuggestion, ItemSuggestion, Role } from '../types';
import CollapsibleTutorial from './CollapsibleTutorial';
import HeroSlot from './HeroSlot';
import SynergyPanel from './SynergyPanel';
import HeroStrategyPanel from './HeroStrategyPanel';
import BanSuggestions from './BanSuggestions';
import { RATING_STYLES } from '../constants';
import { HERO_TRANSLATIONS } from './data/heroTranslations';

interface SynergyExplorerScreenProps {
    selectedHeroId: string | null;
    heroes: Record<string, Hero>;
    heroApiIdMap: Record<number, Hero>;
    onHeroSelectClick: () => void;
    onClearHero: () => void;
    counterBanSuggestions: BanSuggestion[];
    metaBanSuggestions: BanSuggestion[];
    isMetaBansLoading: boolean;
    activeMetaRank: RankCategory | null;
    onMetaRankChange: (rank: RankCategory) => void;
    onAnalyze: () => void;
    isAnalysisLoading: boolean;
    // FIX: Corrected typo from HeroStrategyAnalysis to HeroStrategicAnalysis.
    strategyAnalysis: HeroStrategicAnalysis | null;
    strategyAnalysisError: string | null;
    synergyRelations: HeroRelation | null;
    synergyError: string | null;
    perfectCounter: HeroSuggestion | null;
    perfectCounterError: string | null;
}

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-xl sm:text-2xl font-black text-center mb-3 tracking-wider text-amber-300">{children}</h2>
);

const PerfectCounterPanel: React.FC<{ suggestion: HeroSuggestion, isLoading: boolean, error: string | null }> = ({ suggestion, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-red-400"></div>
                <p className="mt-3 text-sm text-gray-300">ANALISANDO O COUNTER PERFEITO...</p>
            </div>
        );
    }
    if (error) {
        return <p className="text-center text-xs text-yellow-400 p-4">{error}</p>;
    }
    if (!suggestion) return null;

    const styles = RATING_STYLES[suggestion.classificacao] || { text: 'text-gray-300', border: 'border-gray-400' };

    return (
        <div className={`p-3 mt-2 bg-black bg-opacity-30 rounded-xl animated-entry border-l-4 ${styles.border}`}>
            <div className="flex items-center gap-4 mb-3">
                <img src={suggestion.imageUrl} alt={suggestion.nome} className={`w-20 h-20 rounded-full border-4 ${styles.border}`} />
                <div className="flex-grow">
                    <p className="font-bold text-xl">{suggestion.nome}</p>
                    <div>
                        <span className={`font-black text-md ${styles.text}`}>{suggestion.classificacao}</span>
                        <span className="text-xs text-gray-400 font-mono ml-2">{suggestion.estatistica}</span>
                    </div>
                </div>
            </div>
            <p className="text-sm text-gray-300">{suggestion.motivo}</p>
        </div>
    );
};


const SynergyExplorerScreen: React.FC<SynergyExplorerScreenProps> = ({ 
    selectedHeroId, 
    heroes, 
    heroApiIdMap, 
    onHeroSelectClick,
    onClearHero,
    counterBanSuggestions,
    metaBanSuggestions,
    isMetaBansLoading,
    activeMetaRank,
    onMetaRankChange,
    onAnalyze,
    isAnalysisLoading,
    strategyAnalysis,
    strategyAnalysisError,
    synergyRelations,
    synergyError,
    perfectCounter,
    perfectCounterError
}) => {
    const selectedHero = selectedHeroId ? heroes[selectedHeroId] : null;
    const analysisSectionRef = useRef<HTMLDivElement>(null);

     const heroSummary = useMemo(() => {
        if (!selectedHero) return 'Resumo do herói não disponível.';
        const details = HERO_TRANSLATIONS[selectedHero.name];
        return details ? details.summary : 'Resumo do herói não disponível.';
    }, [selectedHero]);

    useEffect(() => {
        if (isAnalysisLoading) {
            setTimeout(() => {
                analysisSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [isAnalysisLoading]);
    
    const tacticalCounters = strategyAnalysis?.tacticalCounters ?? [];

    return (
        <div className="w-full max-w-5xl mx-auto animated-entry flex flex-col gap-6">
            <div className="flex flex-col items-center gap-4">
                <CollapsibleTutorial title="Como Usar o Painel Estratégico">
                     <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-gray-300">
                        <li>Clique abaixo para selecionar um herói para uma análise aprofundada.</li>
                        <li>Clique em <strong className="text-violet-500">"Analisar Estratégia"</strong> para a IA gerar a build, as táticas de jogo, sinergias e o counter perfeito contra seu herói.</li>
                    </ol>
                </CollapsibleTutorial>
                
                {selectedHero ? (
                    <div className="w-full glassmorphism p-6 rounded-2xl border-2 panel-glow-purple flex flex-col md:flex-row items-center gap-6 animated-entry">
                        <div className="flex-shrink-0 flex flex-col items-center text-center w-40">
                            <img src={selectedHero.imageUrl} alt={selectedHero.name} className="w-28 h-28 rounded-full border-4 border-violet-400 mb-2 shadow-lg shadow-violet-500/30"/>
                            <h2 className="text-2xl font-bold text-white">{selectedHero.name}</h2>
                            <p className="text-sm font-semibold text-violet-300">{selectedHero.roles.join(' / ')}</p>
                            <button onClick={onClearHero} className="mt-2 text-xs text-red-400 hover:underline">
                                Trocar Herói
                            </button>
                        </div>
                        <div className="flex-grow flex flex-col justify-between self-stretch">
                            <div>
                                <h3 className="text-lg font-bold text-amber-300 mb-2">Resumo Estratégico</h3>
                                <p className="text-sm text-slate-300 max-h-32 overflow-y-auto invisible-scrollbar pr-2">
                                    {heroSummary}
                                </p>
                            </div>
                            <button
                                onClick={onAnalyze}
                                disabled={!selectedHeroId || isAnalysisLoading}
                                className="mt-4 w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-3 px-4 rounded-xl text-lg hover:from-violet-400 hover:to-fuchsia-400 transition-all duration-300 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-violet-500/40 disabled:shadow-none transform hover:scale-105"
                            >
                                {isAnalysisLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <circle className="opacity-25" cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 10a6 6 0 016-6v2a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                        Analisando...
                                    </>
                                ) : 'Analisar Estratégia'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div 
                        className="w-full glassmorphism p-8 rounded-2xl border-2 border-dashed border-slate-600 flex flex-col items-center justify-center text-center transition-all hover:border-violet-500 hover:bg-slate-900/50 cursor-pointer" 
                        onClick={onHeroSelectClick}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-white">Selecione um Herói</h2>
                        <p className="text-slate-400 mt-1 max-w-sm">Clique aqui para escolher um herói e iniciar a análise estratégica completa da IA.</p>
                    </div>
                )}
            </div>
            
            <BanSuggestions
                counterSuggestions={counterBanSuggestions}
                metaSuggestions={metaBanSuggestions}
                isLoading={isMetaBansLoading}
                variant="1v1"
                activeMetaRank={activeMetaRank}
                onMetaRankChange={onMetaRankChange}
            />
            
            {(selectedHeroId && (synergyRelations || strategyAnalysis || isAnalysisLoading)) && (
                 <div ref={analysisSectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-primary flex flex-col">
                        <SectionHeader>Sinergias</SectionHeader>
                        <SynergyPanel
                            isLoading={isAnalysisLoading}
                            error={synergyError}
                            relations={synergyRelations}
                            heroApiIdMap={heroApiIdMap}
                            tacticalCounters={tacticalCounters}
                            heroes={heroes}
                        />
                    </div>
                     <div className="glassmorphism p-4 rounded-2xl border-2 panel-glow-primary flex flex-col">
                        <SectionHeader>Análise Estratégica da IA</SectionHeader>
                        <HeroStrategyPanel
                            selectedHero={selectedHero}
                            analysis={strategyAnalysis?.strategy ?? null}
                            isLoading={isAnalysisLoading}
                            error={strategyAnalysisError}
                        />
                    </div>
                    <div className="lg:col-span-2 glassmorphism p-4 rounded-2xl border-2 panel-glow-red animated-entry mt-2">
                        <SectionHeader>Recomendação Perfeita (Counter)</SectionHeader>
                        <p className="text-xs text-center text-gray-400 -mt-2 mb-3 max-w-sm mx-auto">
                            Este é o counter ideal <strong className="text-red-300">contra o seu herói</strong>, sugerido pela IA para banimento ou para saber como jogar contra.
                        </p>
                        <PerfectCounterPanel 
                            suggestion={perfectCounter!}
                            isLoading={isAnalysisLoading}
                            error={perfectCounterError}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SynergyExplorerScreen;
