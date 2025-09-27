import React from 'react';
import { Hero, HeroDetails, SynergyAnalysisPayload, HeroRelation } from '../types';
import CollapsibleTutorial from './CollapsibleTutorial';

interface SynergyPanelProps {
    isLoading: boolean;
    error: string | null;
    relations: HeroRelation | null;
    analysis: SynergyAnalysisPayload | null;
    heroApiIdMap: Record<number, Hero>;
}

const HeroListItem: React.FC<{ hero: Hero | undefined }> = ({ hero }) => {
    if (!hero) return null;
    return (
        <div className="flex flex-col items-center text-center">
            <img
                loading="lazy"
                src={hero.imageUrl}
                alt={hero.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-600 group-hover:border-violet-500 transition-colors"
            />
            <span className="text-xs mt-1 font-medium">{hero.name}</span>
        </div>
    );
};

const SynergySection: React.FC<{ title: string; colorClass: string; heroIds: number[]; heroApiIdMap: Record<number, Hero> }> = ({ title, colorClass, heroIds, heroApiIdMap }) => {
    if (heroIds.length === 0) return null;

    return (
        <div>
            <h3 className={`text-sm uppercase font-bold mb-3 text-center ${colorClass}`}>{title}</h3>
            <div className="flex flex-wrap justify-center gap-3">
                {heroIds.map(id => <HeroListItem key={id} hero={heroApiIdMap[id]} />)}
            </div>
        </div>
    );
};

const SynergyPanel: React.FC<SynergyPanelProps> = ({ isLoading, error, relations, analysis, heroApiIdMap }) => {

    const renderContent = () => {        
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-violet-400"></div>
                    <p className="mt-3 text-sm text-gray-300">CARREGANDO ANÁLISE...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center text-yellow-400 p-4">
                    <p className="font-semibold">Aviso</p>
                    <p className="text-xs mt-1">{error}</p>
                </div>
            );
        }

        if (!relations && !analysis) {
             return (
                 <div className="text-center p-8 text-gray-400 flex flex-col items-center justify-center h-full">
                    <svg className="w-12 h-12 mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.596a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                    <p className="font-semibold">Sinergias e Análise Tática</p>
                    <p className="text-xs text-gray-500 mt-1">Selecione seu herói e clique em "Analisar".</p>
                </div>
            );
        }

        const hasRelations = relations && (relations.strong?.target_hero_id?.length > 0);

        return (
            <div className="p-1 space-y-6 animated-entry overflow-y-auto max-h-[70vh] pr-2">
                 <div className="mb-4">
                    <CollapsibleTutorial title="Entendendo as Sinergias">
                        <ul className="list-disc list-inside space-y-2 text-xs text-gray-300">
                            <li><strong className="text-green-300">Forte Contra:</strong> Heróis que o seu personagem countera com eficácia.</li>
                            <li><strong className="text-amber-300">Análise da IA:</strong> Estratégias profissionais sobre o estilo de jogo, combos e como counterar os oponentes.</li>
                        </ul>
                    </CollapsibleTutorial>
                </div>
                
                {hasRelations && relations && (
                    <div className="space-y-6">
                        <SynergySection title="Forte Contra" colorClass="text-green-300" heroIds={relations.strong.target_hero_id} heroApiIdMap={heroApiIdMap} />
                    </div>
                )}

                {analysis && (
                    <div className="space-y-4 pt-6 border-t border-slate-700">
                         <h3 className="text-lg font-bold text-center text-amber-300 -mb-2">Análise Tática da IA</h3>
                        <div>
                            <h4 className="text-sm uppercase font-bold text-gray-400 mb-2">Perfil e Estatísticas</h4>
                            <p className="text-sm text-gray-200 leading-relaxed p-3 bg-black bg-opacity-20 rounded-xl">{analysis.statisticsAnalysis}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm uppercase font-bold text-green-300 mb-2">Pontos Fortes</h4>
                                <ul className="list-disc list-inside text-sm text-gray-200 space-y-1 p-3 bg-black bg-opacity-20 rounded-xl">
                                    {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm uppercase font-bold text-red-300 mb-2">Pontos Fracos</h4>
                                <ul className="list-disc list-inside text-sm text-gray-200 space-y-1 p-3 bg-black bg-opacity-20 rounded-xl">
                                    {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm uppercase font-bold text-gray-400 mb-2">Estratégia de Counter</h4>
                            <p className="text-sm text-gray-200 leading-relaxed p-3 bg-black bg-opacity-20 rounded-xl">{analysis.counterStrategy}</p>
                        </div>
                    </div>
                )}
                
                {!hasRelations && !isLoading && (
                     <div className="text-center p-8 text-gray-400 flex flex-col items-center justify-center h-full">
                        <p className="font-semibold">Dados não disponíveis</p>
                        <p className="text-xs text-gray-500 mt-1">Não foi encontrada informação de sinergias para este herói.</p>
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <div className="h-full pt-4">
            {renderContent()}
        </div>
    );
};

export default SynergyPanel;
