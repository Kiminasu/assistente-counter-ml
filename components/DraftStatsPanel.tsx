import React from 'react';
import { DraftAnalysisResult, TeamCompositionStats } from '../types';

interface DraftStatsPanelProps {
    analysis: DraftAnalysisResult | null;
    isLoading: boolean;
    error: string | null;
}

const StatRow: React.FC<{ label: string; allyScore: number; enemyScore: number; }> = ({ label, allyScore, enemyScore }) => (
    <div className="w-full">
        <div className="flex justify-between items-center text-xs mb-1 px-1">
            <span className="font-bold text-blue-300">{allyScore}/10</span>
            <span className="font-semibold text-gray-300">{label}</span>
            <span className="font-bold text-red-300">{enemyScore}/10</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-900 rounded-full h-2 text-right">
                <div className="bg-gradient-to-l from-blue-500 to-cyan-400 h-2 rounded-full" style={{ width: `${allyScore * 10}%`, float: 'right' }}></div>
            </div>
            <div className="flex-1 bg-gray-900 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-500 to-orange-400 h-2 rounded-full" style={{ width: `${enemyScore * 10}%` }}></div>
            </div>
        </div>
    </div>
);


const DraftStatsPanel: React.FC<DraftStatsPanelProps> = ({ analysis, isLoading, error }) => {
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-violet-400"></div>
                    <p className="mt-4 text-lg">Analisando o draft...</p>
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
                 <div className="text-center text-gray-400 flex flex-col items-center justify-center h-full p-4">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <h3 className="text-xl font-bold">Analisador de Vantagem</h3>
                    <p className="mt-2 text-sm">Selecione heróis para ver a análise numérica da composição.</p>
                </div>
            );
        }
        
        const { advantageScore, advantageReason, allyComposition, enemyComposition } = analysis;
        const advantagePercentage = 50 + (advantageScore * 5); // Score -10 to 10 -> 0% to 100%

        return (
            <div className="p-4 space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-amber-400 text-center mb-2">Barra de Vantagem</h3>
                    <div 
                        className="w-full h-8 rounded-full overflow-hidden border-2 border-slate-800 shadow-inner relative bg-gradient-to-r from-red-600 to-red-800"
                        role="progressbar"
                        aria-valuenow={advantageScore}
                        aria-valuemin={-10}
                        aria-valuemax={10}
                        aria-label={`Vantagem do time: ${advantageScore}`}
                    >
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-500 ease-out"
                            style={{ width: `${advantagePercentage}%` }}
                        />
                         <div className="absolute inset-0 flex justify-between items-center px-4">
                             <span className="font-black text-white" style={{ textShadow: '0 1px 3px #000' }}>{advantagePercentage.toFixed(0)}%</span>
                             <span className="font-black text-white" style={{ textShadow: '0 1px 3px #000' }}>{(100 - advantagePercentage).toFixed(0)}%</span>
                        </div>
                        <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white/30 -ml-px"></div>
                    </div>
                    <p className="text-center text-gray-300 text-xs mt-2 italic h-8">{advantageReason}</p>
                </div>

                <div className="space-y-3">
                    <StatRow label="Dano Físico" allyScore={allyComposition.physicalDamage} enemyScore={enemyComposition.physicalDamage} />
                    <StatRow label="Dano Mágico" allyScore={allyComposition.magicDamage} enemyScore={enemyComposition.magicDamage} />
                    <StatRow label="Tanque" allyScore={allyComposition.tankiness} enemyScore={enemyComposition.tankiness} />
                    <StatRow label="Controle" allyScore={allyComposition.control} enemyScore={enemyComposition.control} />
                </div>
            </div>
        );
    }
    
    return (
         <div className="glassmorphism p-2 rounded-xl flex-grow flex flex-col border-2 panel-glow-primary min-h-[24rem]">
            {renderContent()}
        </div>
    );
};

export default DraftStatsPanel;