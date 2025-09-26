import React from 'react';
import { Hero, HeroStrategyAnalysis, ItemSuggestion } from '../types';
import { ITEM_ICONS } from '../constants';

interface HeroStrategyPanelProps {
    selectedHero: Hero | null;
    analysis: HeroStrategyAnalysis | null;
    isLoading: boolean;
    error: string | null;
}

const ItemCard: React.FC<{ item: ItemSuggestion, type: 'Core' | 'Situacional' }> = ({ item, type }) => {
    const borderColor = type === 'Core' ? 'border-amber-400' : 'border-violet-400';
    return (
        <div className={`p-2 bg-black bg-opacity-30 rounded-xl flex items-start gap-3 border-l-4 ${borderColor}`}>
            <img 
                loading="lazy"
                src={ITEM_ICONS[item.nome] || ITEM_ICONS.default} 
                alt={item.nome} 
                className="w-12 h-12 rounded-lg flex-shrink-0"
            />
            <div>
                <p className="font-bold">{item.nome}</p>
                <p className="text-xs text-gray-400 mt-1">{item.motivo}</p>
            </div>
        </div>
    );
};

const HeroStrategyPanel: React.FC<HeroStrategyPanelProps> = ({ selectedHero, analysis, isLoading, error }) => {
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
    
    if (analysis) {
        return (
            <div className="p-1 space-y-6 animated-entry overflow-y-auto max-h-[70vh] pr-2">
                <div>
                    <h3 className="text-sm uppercase font-bold text-gray-400 mb-2">Estilo de Jogo</h3>
                    <p className="text-sm text-gray-200 leading-relaxed p-3 bg-black bg-opacity-20 rounded-xl">{analysis.playstyle}</p>
                </div>

                <div>
                    <h3 className="text-sm uppercase font-bold text-gray-400 mb-2">Picos de Poder</h3>
                    <p className="text-sm text-gray-200 leading-relaxed p-3 bg-black bg-opacity-20 rounded-xl">{analysis.powerSpikes}</p>
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
    }

    if (selectedHero) {
        return (
            <div className="text-center p-8 text-gray-400 flex flex-col items-center justify-center h-full">
                <p className="font-semibold">Análise para {selectedHero.name}</p>
                <p className="text-xs text-gray-500 mt-1">Clique no botão "Analisar" para gerar a build e as táticas de jogo.</p>
            </div>
        );
    }

    return (
         <div className="text-center p-8 text-gray-400 flex flex-col items-center justify-center h-full">
            <p className="font-semibold">Análise Estratégica</p>
            <p className="text-xs text-gray-500 mt-1">Selecione um herói e clique em "Analisar" para ver os detalhes aqui.</p>
        </div>
    );
};

export default HeroStrategyPanel;
