import React, { useEffect, useRef, useState } from 'react';
import { BanSuggestion, Hero, HeroStrategicAnalysis, RankCategory, HeroRelation, HeroSuggestion, Role, Lane } from '../types';
import CollapsibleTutorial from './CollapsibleTutorial';
import SynergyPanel from './SynergyPanel';
import HeroStrategyPanel from './HeroStrategyPanel';
import BanSuggestions from './BanSuggestions';
import { RATING_STYLES, ROLE_TAGS, LANE_ICONS, SPELL_ICONS } from '../constants';

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
    strategyAnalysis: HeroStrategicAnalysis | null;
    strategyAnalysisError: string | null;
    synergyRelations: HeroRelation | null;
    synergyError: string | null;
    perfectLaneCounters: HeroSuggestion[];
    perfectLaneCountersError: string | null;
}

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-xl sm:text-2xl font-black text-center mb-3 tracking-wider text-amber-300">{children}</h2>
);

const PerfectLaneCountersPanel: React.FC<{ suggestions: HeroSuggestion[], isLoading: boolean, error: string | null }> = ({ suggestions, isLoading, error }) => {
    const [expandedLane, setExpandedLane] = useState<Lane | null>(null);

    if (isLoading && suggestions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-red-400"></div>
                <p className="mt-3 text-sm text-gray-300">ANALISANDO COUNTERS PERFEITOS...</p>
            </div>
        );
    }
    if (error && suggestions.length === 0) {
        return <p className="text-center text-xs text-yellow-400 p-4">{error}</p>;
    }
    if (suggestions.length === 0) return null;

    const laneOrder: Lane[] = ['EXP', 'SELVA', 'MEIO', 'OURO', 'ROTAÇÃO'];
    const sortedSuggestions = [...suggestions].sort((a, b) => laneOrder.indexOf(a.lane!) - laneOrder.indexOf(b.lane!));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedSuggestions.map((suggestion, index) => {
                const isExpanded = expandedLane === suggestion.lane;
                return (
                    <div key={suggestion.lane} className="p-3 bg-black bg-opacity-30 rounded-xl animated-entry border-l-4 border-red-500">
                        <div 
                            className="flex items-center gap-2 mb-2 cursor-pointer" 
                            onClick={() => setExpandedLane(isExpanded ? null : suggestion.lane!)}
                            aria-expanded={isExpanded}
                        >
                            <img src={LANE_ICONS[suggestion.lane!]} alt={suggestion.lane} className="w-8 h-8"/>
                            <h4 className="font-bold text-lg text-red-300">{suggestion.lane}</h4>
                            <span className="flex-grow text-right font-bold text-white">{suggestion.nome}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </div>
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
                            <div className="pt-2 border-t border-slate-700 space-y-3">
                                <div className="flex items-center gap-3">
                                    <img src={suggestion.imageUrl} alt={suggestion.nome} className="w-14 h-14 rounded-full border-2 border-red-400" />
                                    <span className="font-semibold text-xs text-red-300">COUNTER PERFEITO</span>
                                </div>
                                <p className="text-sm text-gray-300">{suggestion.motivo}</p>
                                
                                {suggestion.avisos && suggestion.avisos.length > 0 && (
                                    <div>
                                        <p className="text-xs uppercase font-bold text-yellow-400 mb-1">Avisos</p>
                                        {suggestion.avisos.map((aviso, i) => (
                                            <div key={i} className="flex items-start gap-2 mt-1">
                                                <svg className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                <p className="text-xs text-gray-300">{aviso}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {suggestion.spells && suggestion.spells.length > 0 && (
                                    <div>
                                        <p className="text-xs uppercase font-bold text-gray-400 mb-1">Feitiços</p>
                                        {suggestion.spells.map(spell => (
                                            <div key={spell.nome} className="mt-1 flex items-start gap-2">
                                                <img loading="lazy" src={SPELL_ICONS[spell.nome] || SPELL_ICONS.default} alt={spell.nome} className="w-6 h-6 rounded-md flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-sky-300">{spell.nome}</p>
                                                    <p className="text-xs text-gray-400">{spell.motivo}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
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
    perfectLaneCounters,
    perfectLaneCountersError
}) => {
    const selectedHero = selectedHeroId ? heroes[selectedHeroId] : null;
    const analysisSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isAnalysisLoading) {
            setTimeout(() => {
                analysisSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [isAnalysisLoading]);

    return (
        <div className="w-full max-w-5xl mx-auto animated-entry flex flex-col gap-6">
            <div className="flex flex-col items-center gap-4">
                <CollapsibleTutorial title="Como Usar o Painel Estratégico">
                     <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-gray-300">
                        <li>Clique abaixo para selecionar um herói para uma análise aprofundada.</li>
                        <li>Clique em <strong className="text-sky-500">"Analisar"</strong> para a IA gerar a build, as táticas de jogo, sinergias e os counters perfeitos para cada lane.</li>
                    </ol>
                </CollapsibleTutorial>
                
                <div className="w-full max-w-md glassmorphism p-4 rounded-2xl border-2 panel-glow-purple flex flex-col gap-4">
                    <h2 className="text-xl font-black text-center text-amber-300 tracking-wider">SELECIONE O HERÓI PARA ANÁLISE</h2>
                    
                    {selectedHero ? (
                        <div className="relative group">
                            <button
                                onClick={onClearHero}
                                className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full text-white/70 hover:text-white hover:bg-black/80 flex items-center justify-center z-20 transition-all opacity-0 group-hover:opacity-100"
                                aria-label="Limpar herói"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div
                                className="flex flex-col sm:flex-row items-center gap-4 cursor-pointer p-2 rounded-lg hover:bg-black/20"
                                onClick={onHeroSelectClick}
                                aria-label="Trocar herói"
                            >
                                <img src={selectedHero.imageUrl} alt={selectedHero.name} className="w-24 h-24 rounded-full border-4 border-sky-400 object-cover flex-shrink-0" />
                                <div className="flex-grow text-center sm:text-left">
                                    <h3 className="text-2xl font-bold text-white">{selectedHero.name}</h3>
                                    <p className="font-semibold text-sky-300">{selectedHero.roles.join(' / ')}</p>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-1 mt-2">
                                        {(selectedHero.roles.flatMap(role => ROLE_TAGS[role as Role] || [])).slice(0, 3).map(tag => (
                                            <span key={tag} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={onHeroSelectClick}
                            className="hero-slot empty flex flex-col items-center justify-center text-center gap-2 p-4 rounded-2xl cursor-pointer min-h-[140px]"
                        >
                            <span className="text-5xl text-gray-600">+</span>
                            <span className="text-lg font-semibold text-gray-400 mt-1">Selecionar Herói</span>
                            <span className="text-sm text-gray-500">Clique para escolher um herói para análise</span>
                        </div>
                    )}

                    <button
                        onClick={onAnalyze}
                        disabled={!selectedHeroId || isAnalysisLoading}
                        className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold py-2 px-4 rounded-xl text-md hover:from-sky-400 hover:to-cyan-400 transition-all duration-300 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-sky-500/40 disabled:shadow-none transform hover:scale-105"
                    >
                         {isAnalysisLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <circle className="opacity-25" cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 10a6 6 0 016-6v2a4 4 0 00-4 4H4z"></path>
                                </svg>
                                Analisando...
                            </>
                         ) : 'Analisar'}
                    </button>
                </div>
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
                            tacticalCounters={strategyAnalysis?.tacticalCounters || []}
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
                        <SectionHeader>Recomendações Perfeitas por Lane</SectionHeader>
                         <p className="text-xs text-center text-gray-400 -mt-2 mb-3 max-w-lg mx-auto">
                            Estes são os counters ideais <strong className="text-red-300">contra o seu herói</strong>, sugeridos pela IA para cada uma das 5 lanes. Use-os para banimento ou para saber como jogar contra.
                        </p>
                        <PerfectLaneCountersPanel 
                            suggestions={perfectLaneCounters}
                            isLoading={isAnalysisLoading}
                            error={perfectLaneCountersError}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SynergyExplorerScreen;