import React, { useState, useEffect } from 'react';
// FIX: Moved HeroDetails import from heroService.ts to types.ts to fix import error.
import { Hero, HeroStrategyAnalysis, ItemSuggestion, HeroDetails } from '../types';
import { getHeroStrategyAnalysis } from '../services/geminiService';
import { fetchHeroDetails } from '../services/heroService';
import { findClosestString } from '../utils';
import { GAME_ITEMS } from './data/items';
import { ITEM_ICONS } from '../constants';

interface HeroStrategyPanelProps {
    selectedHero: Hero | null;
}

const ItemCard: React.FC<{ item: ItemSuggestion, type: 'Core' | 'Situacional' }> = ({ item, type }) => {
    const borderColor = type === 'Core' ? 'border-amber-400' : 'border-violet-400';
    return (
        <div className={`p-2 bg-black bg-opacity-30 rounded-lg flex items-start gap-3 border-l-4 ${borderColor}`}>
            <img 
                loading="lazy"
                src={ITEM_ICONS[item.nome] || ITEM_ICONS.default} 
                alt={item.nome} 
                className="w-12 h-12 rounded-md flex-shrink-0"
            />
            <div>
                <p className="font-bold">{item.nome}</p>
                <p className="text-xs text-gray-400 mt-1">{item.motivo}</p>
            </div>
        </div>
    );
};

const HeroStrategyPanel: React.FC<HeroStrategyPanelProps> = ({ selectedHero }) => {
    const [analysis, setAnalysis] = useState<HeroStrategyAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (!selectedHero || !selectedHero.apiId) {
            setAnalysis(null);
            return;
        }

        const runAnalysis = async () => {
            setIsLoading(true);
            setError(null);
            setAnalysis(null);

            try {
                // Primeiro, buscamos os detalhes do herói
                const heroDetails = await fetchHeroDetails(selectedHero.apiId);
                // Depois, usamos os detalhes para obter a análise estratégica
                const analysisResult = await getHeroStrategyAnalysis(heroDetails);

                const validItemNames = GAME_ITEMS.map(item => item.nome);
                
                const correctedCoreItems = analysisResult.coreItems.map(item => ({
                    ...item,
                    nome: findClosestString(item.nome, validItemNames),
                }));

                const correctedSituationalItems = analysisResult.situationalItems.map(item => ({
                    ...item,
                    nome: findClosestString(item.nome, validItemNames),
                }));

                setAnalysis({
                    ...analysisResult,
                    coreItems: correctedCoreItems,
                    situationalItems: correctedSituationalItems,
                });

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        runAnalysis();
    }, [selectedHero]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-amber-400"></div>
                <p className="mt-3 text-sm text-gray-300">GERANDO ESTRATÉGIA...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-400 p-4">
                <p className="font-semibold">Erro na Análise</p>
                <p className="text-xs mt-1">{error}</p>
            </div>
        );
    }
    
    if (!analysis) {
         return (
             <div className="text-center p-8 text-gray-400 flex flex-col items-center justify-center h-full">
                <p className="text-xs text-gray-500 mt-1">A análise estratégica para o herói selecionado aparecerá aqui.</p>
            </div>
        );
    }

    return (
        <div className="p-1 space-y-6 animated-entry overflow-y-auto max-h-[70vh] pr-2">
            <div>
                <h3 className="text-sm uppercase font-bold text-gray-400 mb-2">Estilo de Jogo</h3>
                <p className="text-sm text-gray-200 leading-relaxed p-2 bg-black bg-opacity-20 rounded-md">{analysis.playstyle}</p>
            </div>

            <div>
                <h3 className="text-sm uppercase font-bold text-gray-400 mb-2">Picos de Poder</h3>
                <p className="text-sm text-gray-200 leading-relaxed p-2 bg-black bg-opacity-20 rounded-md">{analysis.powerSpikes}</p>
            </div>
            
            <div>
                <h3 className="text-sm uppercase font-bold text-amber-400 mb-2">Itens Essenciais</h3>
                <div className="space-y-2">
                    {analysis.coreItems.map(item => <ItemCard key={item.nome} item={item} type="Core" />)}
                </div>
            </div>

             <div>
                <h3 className="text-sm uppercase font-bold text-violet-400 mb-2">Itens Situacionais</h3>
                <div className="space-y-2">
                    {analysis.situationalItems.map(item => <ItemCard key={item.nome} item={item} type="Situacional" />)}
                </div>
            </div>
        </div>
    );
};

export default HeroStrategyPanel;