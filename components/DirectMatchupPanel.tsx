import React from 'react';
import { MatchupData } from '../types';
import { RATING_STYLES } from '../constants';

interface DirectMatchupPanelProps {
    isLoading: boolean;
    data: MatchupData | null;
    error: string | null;
}

const DirectMatchupPanel: React.FC<DirectMatchupPanelProps> = ({ isLoading, data, error }) => {
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-purple-400"></div>
                    <p className="mt-3 text-sm text-gray-300">A analisar o confronto...</p>
                </div>
            );
        }

        if (error) {
            const isApiKeyError = error.includes("chave da API");
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
                <div className="text-center text-red-400 p-4">
                    <p className="font-semibold">Erro na Análise</p>
                    <p className="text-xs mt-1">{error}</p>
                </div>
            );
        }

        if (!data) {
             return (
                <div className="text-center p-8 text-gray-400 flex flex-col items-center justify-center h-full">
                     <svg className="w-12 h-12 mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <p className="font-semibold">Confronto Direto</p>
                    <p className="text-xs text-gray-500 mt-1">Selecione o seu herói e o inimigo para ver a análise.</p>
                </div>
            );
        }

        const { yourHero, enemyHero, classification, winRate, detailedAnalysis, recommendedSpell } = data;
        const styles = RATING_STYLES[classification];
        const winRateSign = winRate > 0 ? '+' : '';
        const winRateText = `${winRateSign}${(winRate * 100).toFixed(1)}%`;
        const isTheoretical = winRate === 0;

        return (
            <div className="p-4 flex flex-col h-full animated-entry">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <img src={yourHero.imageUrl} alt={yourHero.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto border-4 border-blue-500"/>
                        <p className="font-bold mt-2 text-sm sm:text-base">{yourHero.name}</p>
                    </div>
                     <div>
                        <img src={enemyHero.imageUrl} alt={enemyHero.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto border-4 border-red-500"/>
                        <p className="font-bold mt-2 text-sm sm:text-base">{enemyHero.name}</p>
                    </div>
                </div>
                <div className={`text-center mt-4 p-3 rounded-lg border-2 ${styles.border} bg-black bg-opacity-20`}>
                    <p className={`font-black text-lg sm:text-xl ${styles.text}`}>{classification}</p>
                    {!isTheoretical && <p className="font-mono font-semibold text-base sm:text-lg">{winRateText}</p>}
                    <p className="text-xs text-gray-400">
                        {isTheoretical ? 'Vantagem Tática' : 'de vantagem nos dados'}
                    </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <h3 className="text-sm uppercase font-bold text-gray-400 mb-2">Análise Tática</h3>
                    <p className="text-sm text-gray-200 leading-relaxed">{detailedAnalysis}</p>
                </div>

                {recommendedSpell && (
                    <div className="mt-4 pt-4 border-t border-gray-700 flex-grow">
                        <h3 className="text-sm uppercase font-bold text-gray-400 mb-2">Feitiço Recomendado</h3>
                         <div className="p-2 bg-black bg-opacity-20 rounded-lg border-l-4 border-purple-400">
                            <div>
                                <p className="font-bold text-purple-300">{recommendedSpell.nome}</p>
                                <p className="text-xs text-gray-400 mt-1">{recommendedSpell.motivo}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <aside className="col-span-1 glassmorphism p-4 rounded-xl animated-entry flex flex-col lg:h-[85vh] border-2 border-yellow-400 shadow-lg shadow-yellow-400/20">
            <h2 className="text-xl sm:text-2xl font-black text-center mb-4 tracking-wider flex-shrink-0">CONFRONTO DIRETO</h2>
            <div className="flex-1 overflow-y-auto">
                {renderContent()}
            </div>
        </aside>
    );
};

export default DirectMatchupPanel;