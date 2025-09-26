import React from 'react';
import { Hero, Team, BanSuggestion, DraftAnalysisResult, RankCategory } from '../types';
import HeroSlot from './HeroSlot';
import BanSuggestions from './BanSuggestions';
import DraftStatsPanel from './DraftStatsPanel';
import DraftStrategySection from './DraftStrategySection';
import CollapsibleTutorial from './CollapsibleTutorial';

interface DraftScreenProps {
    allyPicks: (string | null)[];
    enemyPicks: (string | null)[];
    heroes: Record<string, Hero>;
    onSlotClick: (team: Team, index: number) => void;
    onClearSlot: (team: Team, index: number) => void;
    counterBanSuggestions: BanSuggestion[];
    metaBanSuggestions: BanSuggestion[];
    isBanLoading: boolean;
    draftAnalysis: DraftAnalysisResult | null;
    isDraftAnalysisLoading: boolean;
    draftAnalysisError: string | null;
    onClearDraft: () => void;
    activeMetaRank: RankCategory;
    onMetaRankChange: (rank: RankCategory) => void;
}

const DraftScreen: React.FC<DraftScreenProps> = ({ 
    allyPicks, 
    enemyPicks, 
    heroes, 
    onSlotClick,
    onClearSlot,
    counterBanSuggestions,
    metaBanSuggestions, 
    isBanLoading,
    draftAnalysis,
    isDraftAnalysisLoading,
    draftAnalysisError,
    onClearDraft,
    activeMetaRank,
    onMetaRankChange
}) => {
    return (
        <div className="flex flex-col gap-6 animated-entry">
            {/* Hero Selection Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Ally Team */}
                <div className="flex flex-col gap-3 glassmorphism p-4 rounded-2xl border-2 panel-glow-blue">
                    <h2 className="text-2xl font-black text-center text-blue-300 tracking-wider">ALIADOS</h2>
                    {allyPicks.map((heroId, index) => (
                        <HeroSlot 
                            key={`ally-${index}`} 
                            type="ally" 
                            heroId={heroId} 
                            heroes={heroes} 
                            onClick={() => onSlotClick('ally', index)} 
                            onClear={() => onClearSlot('ally', index)}
                        />
                    ))}
                </div>

                {/* Enemy Team */}
                <div className="flex flex-col gap-3 glassmorphism p-4 rounded-2xl border-2 panel-glow-red">
                    <h2 className="text-2xl font-black text-center text-red-300 tracking-wider">INIMIGOS</h2>
                    {enemyPicks.map((heroId, index) => (
                        <HeroSlot 
                            key={`enemy-${index}`} 
                            type="enemy" 
                            heroId={heroId} 
                            heroes={heroes} 
                            onClick={() => onSlotClick('enemy', index)} 
                            onClear={() => onClearSlot('enemy', index)}
                        />
                    ))}
                </div>
            </div>

            {/* Controls & Info */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <button
                        onClick={onClearDraft}
                        className="flex items-center gap-2 bg-gray-800 hover:bg-red-900/50 text-gray-300 hover:text-red-300 font-semibold py-2 px-4 rounded-xl transition-colors duration-200 border border-gray-700 hover:border-red-700 text-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                        Limpar Draft
                    </button>
                </div>
                <CollapsibleTutorial title="Como Usar o Analisador de Draft">
                    <p className="text-xs sm:text-sm text-gray-300">
                        Selecione os heróis para o seu time e o time inimigo.
                        <br />
                        A IA analisará as composições em tempo real, mostrando a barra de vantagem, pontos fortes/fracos e sugestões estratégicas para garantir a vitória no draft.
                    </p>
                </CollapsibleTutorial>
                <BanSuggestions
                    counterSuggestions={counterBanSuggestions}
                    metaSuggestions={metaBanSuggestions}
                    isLoading={isBanLoading}
                    variant="5v5"
                    activeMetaRank={activeMetaRank}
                    onMetaRankChange={onMetaRankChange}
                />
            </div>
            
            {/* Main Analysis Panels */}
            <DraftStatsPanel 
                analysis={draftAnalysis}
                isLoading={isDraftAnalysisLoading}
                error={draftAnalysisError}
            />
            <DraftStrategySection
                analysis={draftAnalysis}
                isLoading={isDraftAnalysisLoading}
                error={draftAnalysisError}
            />
        </div>
    );
};

export default DraftScreen;
