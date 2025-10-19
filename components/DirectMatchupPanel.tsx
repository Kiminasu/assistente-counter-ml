import React from 'react';
import { MatchupData, Hero, Role } from '../types';
import { RATING_STYLES, ROLE_TAGS, SPELL_ICONS } from '../constants';
import CollapsibleTutorial from './CollapsibleTutorial';

interface DirectMatchupPanelProps {
    isLoading: boolean;
    data: MatchupData | null;
    error: string | null;
}

const HeroCharacteristics: React.FC<{ hero: Hero, colorClass: string }> = ({ hero, colorClass }) => {
    const roles = hero.roles || [];
    const tags = roles.flatMap(role => ROLE_TAGS[role as Role] || []);
    const uniqueTags = [...new Set(tags)];

    return (
        <div className="bg-black bg-opacity-20 p-3 rounded-xl h-full">
            <p className={`font-bold text-center text-sm sm:text-base ${colorClass}`}>{hero.name}</p>
            <div className="flex flex-wrap justify-center gap-1 mt-2">
                {uniqueTags.slice(0, 4).map(tag => (
                    <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};

const DirectMatchupPanel: React.FC<DirectMatchupPanelProps> = ({ isLoading, data, error }) => {
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-sky-400"></div>
                    <p className="mt-3 text-sm text-gray-300">CARREGANDO CONFRONTO...</p>
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
                <div className="p-4 flex flex-col animated-entry opacity-60">
                    <div className="mb-4">
                        <CollapsibleTutorial title="Entendendo o Confronto">
                             <ul className="list-disc list-inside space-y-2 text-xs text-gray-300">
                                <li><strong className="text-amber-300">Classificação:</strong> Avaliação da IA sobre quem tem a vantagem tática no confronto direto.</li>
                                <li><strong className="text-gray-300">Dados Estatísticos:</strong> Variação na taxa de vitória com base em milhares de partidas reais.</li>
                                <li><strong className="text-sky-300">Análise e Feitiço:</strong> Dicas de como as habilidades interagem e o feitiço ideal para a vitória.</li>
                            </ul>
                        </CollapsibleTutorial>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <div className="w-16 h-16 sm:w-20 sm:h-20 text-3xl font-black text-slate-600 rounded-full mx-auto border-4 border-blue-500/50 bg-slate-800 flex items-center justify-center">?</div>
                            <p className="font-bold mt-2 text-sm sm:text-base text-gray-500">Seu Herói</p>
                        </div>
                         <div>
                            <div className="w-16 h-16 sm:w-20 sm:h-20 text-3xl font-black text-slate-600 rounded-full mx-auto border-4 border-red-500/50 bg-slate-800 flex items-center justify-center">?</div>
                            <p className="font-bold mt-2 text-sm sm:text-base text-gray-500">Inimigo</p>
                        </div>
                    </div>
                    <div className="text-center mt-4 p-3 rounded-xl border-2 border-gray-600 bg-black bg-opacity-20">
                        <p className="font-black text-lg sm:text-xl text-gray-500">CLASSIFICAÇÃO</p>
                        <p className="font-mono font-semibold text-base sm:text-lg text-gray-600">--%</p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <h3 className="text-sm uppercase font-bold text-gray-500 mb-2">Análise Tática</h3>
                        <p className="text-sm text-gray-500 leading-relaxed italic">Selecione seu herói e o inimigo para ver a análise detalhada da IA aqui.</p>
                    </div>
                </div>
            );
        }

        const { yourHero, enemyHero, classification, winRate, detailedAnalysis, recommendedSpell } = data;
        const styles = RATING_STYLES[classification] || RATING_STYLES['NEUTRO'];
        const winRateSign = winRate > 0 ? '+' : '';
        const winRateText = `${winRateSign}${(winRate * 100).toFixed(1)}%`;
        const isTheoretical = winRate === 0;

        return (
            <div className="p-4 flex flex-col animated-entry">
                <div className="mb-4">
                    <CollapsibleTutorial title="Entendendo o Confronto">
                        <ul className="list-disc list-inside space-y-2 text-xs text-gray-300">
                            <li><strong className="text-amber-300">Classificação:</strong> Avaliação da IA sobre quem tem a vantagem tática no confronto direto.</li>
                            <li><strong className="text-gray-300">Dados Estatísticos:</strong> Variação na taxa de vitória com base em milhares de partidas reais.</li>
                            <li><strong className="text-sky-300">Análise e Feitiço:</strong> Dicas de como as habilidades interagem e o feitiço ideal para a vitória.</li>
                        </ul>
                    </CollapsibleTutorial>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <img loading="lazy" src={yourHero.imageUrl} alt={yourHero.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto border-4 border-blue-500"/>
                        <p className="font-bold mt-2 text-sm sm:text-base">{yourHero.name}</p>
                    </div>
                     <div>
                        <img loading="lazy" src={enemyHero.imageUrl} alt={enemyHero.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto border-4 border-red-500"/>
                        <p className="font-bold mt-2 text-sm sm:text-base">{enemyHero.name}</p>
                    </div>
                </div>
                <div className={`text-center mt-4 p-3 rounded-xl border-2 ${styles.border} bg-black bg-opacity-20`}>
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
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <h3 className="text-sm uppercase font-bold text-gray-400 mb-2">Feitiço Recomendado</h3>
                         <div className="p-2 bg-black bg-opacity-20 rounded-xl border-l-4 border-sky-400 flex items-start gap-3">
                            <img loading="lazy" src={SPELL_ICONS[recommendedSpell.nome] || SPELL_ICONS.default} alt={recommendedSpell.nome} className="w-10 h-10 rounded-md flex-shrink-0" />
                            <div>
                                <p className="font-bold text-sky-300">{recommendedSpell.nome}</p>
                                <p className="text-xs text-gray-400 mt-1">{recommendedSpell.motivo}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-700 flex-grow">
                    <h3 className="text-sm uppercase font-bold text-gray-400 mb-3 text-center">Características Principais</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <HeroCharacteristics hero={yourHero} colorClass="text-blue-300" />
                        <HeroCharacteristics hero={enemyHero} colorClass="text-red-300" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-4">
             {renderContent()}
        </div>
    );
};

export default DirectMatchupPanel;