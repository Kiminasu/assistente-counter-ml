import React, { useMemo } from 'react';
import { GameItem } from '../types';
import { GAME_ITEMS } from './data/items';
import { ITEM_ICONS } from '../constants';

const ItemDatabaseScreen: React.FC = () => {
    const groupedItems = useMemo(() => {
        return GAME_ITEMS.reduce((acc, item) => {
            const category = item.categoria || 'Outros';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {} as Record<string, GameItem[]>);
    }, []);

    const categoryOrder = ['Dano Físico', 'Dano Mágico', 'Defesa', 'Movimento', 'Adaptativo'];

    const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);
        if (indexA > -1 && indexB > -1) return indexA - indexB;
        if (indexA > -1) return -1;
        if (indexB > -1) return 1;
        return a.localeCompare(b);
    });

    return (
        <div className="w-full max-w-6xl mx-auto animated-entry">
            {sortedCategories.map((category, index) => (
                <div key={category} className="mb-8 animated-entry" style={{ animationDelay: `${index * 100}ms` }}>
                    <h2 className="text-3xl font-black tracking-wider mb-4 text-amber-300 border-b-2 border-amber-300/30 pb-2">{category}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupedItems[category].map((item, itemIndex) => (
                            <div 
                                key={item.id} 
                                className="glassmorphism p-4 rounded-xl border border-transparent hover:border-violet-500 transition-all duration-300 flex flex-col gap-3 animated-entry"
                                style={{ animationDelay: `${itemIndex * 50}ms` }}
                            >
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={ITEM_ICONS[item.nome] || ITEM_ICONS.default} 
                                        alt={item.nome} 
                                        className="w-16 h-16 rounded-lg flex-shrink-0 bg-black/30 p-1"
                                    />
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg text-amber-300">{item.nome}</h3>
                                            <div className="flex items-center gap-1 text-yellow-400 bg-black bg-opacity-30 px-2 py-1 rounded-full flex-shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.5 7.5a.5.5 0 00-1 0v5a.5.5 0 001 0V9.354a2.5 2.5 0 113-1.118v.07a.5.5 0 001 0V8.25a3.5 3.5 0 10-5 2.38V7.5z" clipRule="evenodd" />
                                                </svg>
                                                <span className="font-bold text-sm leading-none">{item.preco}</span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {item.atributos.join(' • ')}
                                        </div>
                                    </div>
                                </div>
                                {item.habilidades.length > 0 && (
                                    <div className="space-y-2 pt-3 border-t border-slate-700/50">
                                        {item.habilidades.map((ability, i) => (
                                            <div key={i}>
                                                <p className="font-semibold text-sm text-gray-200">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full mr-2 ${ability.tipo === 'Passiva' ? 'bg-blue-500/30 text-blue-300' : 'bg-green-500/30 text-green-300'}`}>
                                                        {ability.tipo}
                                                    </span>
                                                    {ability.nome_habilidade}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1 pl-4 border-l-2 border-slate-600 ml-2">
                                                    {ability.descricao}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItemDatabaseScreen;