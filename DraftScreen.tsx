import React from 'react';
import { Hero, Team, BanSuggestion, DraftAnalysisResult, RankCategory, UserProfile } from './types';
import HeroSlot from './components/HeroSlot';
import CollapsibleTutorial from './components/CollapsibleTutorial';
import DraftAnalysisPanel from './components/DraftAnalysisPanel'; // Importa o novo painel unificado

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
    activeMetaRank: RankCategory | null;
    onMetaRankChange: (rank: RankCategory) => void;
    userProfile: UserProfile | null;
    onUpgradeClick: () => void;
    effectiveSubscriptionStatus: 'free' | 'premium';
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
    onMetaRankChange,
    userProfile,
    onUpgradeClick,
    effectiveSubscriptionStatus
}) => {
    
    // Mostra a tela de upgrade se o usuário free tentar usar a ferramenta
    if (effectiveSubscriptionStatus === 'free') {
        return (
            <div className="glassmorphism p-8 rounded-2xl border-2 border-amber-400 text-center animated-entry" style={{boxShadow: '0 0 30px rgba(251, 191, 36, 0.3)'}}>
                 <h2 className="text-2xl font-bold text-amber-300 mb-4 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Ferramenta Premium
                </h2>
                <p className="text-slate-200 mb-6">O Analisador de Draft 5vs5 é um recurso exclusivo para assinantes Premium. Faça upgrade para ter acesso a esta e outras ferramentas poderosas!</p>
                <button 
                    onClick={onUpgradeClick}
                    className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold py-3 px-6 rounded-xl text-lg hover:from-amber-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-500/20"
                >
                    Ver Planos Premium
                </button>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col gap-6 animated-entry">
            <CollapsibleTutorial title="Como Usar o Analisador de Draft">
                <p className="text-xs sm:text-sm text-gray-300">
                    Selecione os heróis para o seu time e o time inimigo.
                    <br />
                    A IA analisará as composições em tempo real, mostrando a barra de vantagem, pontos fortes/fracos e sugestões estratégicas para garantir a vitória no draft.
                </p>
            </CollapsibleTutorial>

            {/* Layout principal com 3 colunas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                {/* Coluna Aliados */}
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

                {/* Coluna Central de Análise */}
                <DraftAnalysisPanel
                    analysis={draftAnalysis}
                    isLoading={isDraftAnalysisLoading}
                    error={draftAnalysisError}
                    counterBanSuggestions={counterBanSuggestions}
                    metaSuggestions={metaBanSuggestions}
                    isBanLoading={isBanLoading}
                    activeMetaRank={activeMetaRank}
                    onMetaRankChange={onMetaRankChange}
                />

                {/* Coluna Inimigos */}
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

            {/* Botão de Limpar Draft */}
            <div className="flex justify-center mt-2">
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
        </div>
    );
};

export default DraftScreen;