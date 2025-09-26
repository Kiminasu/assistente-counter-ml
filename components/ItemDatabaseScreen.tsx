import React, { useState, useMemo } from 'react';
import { GameItem } from '../types';
import { GAME_ITEMS } from './data/items';
import { ITEM_ICONS } from '../constants';

const ItemDatabaseScreen: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('Todos');

    const categoryOrder = ['Dano Físico', 'Dano Mágico', 'Defesa', 'Movimento', 'Adaptativo'];
    const categories = ['Todos', ...categoryOrder];

    const filteredItems = useMemo(() => {
        if (activeCategory === 'Todos') {
            // Ordena todos os itens pela categoria e depois pelo nome para uma visualização consistente
            return [...GAME_ITEMS].sort((a, b) => {
                const categoryA = categoryOrder.indexOf(a.categoria);
                const categoryB = categoryOrder.indexOf(b.categoria);
                if (categoryA !== categoryB) return categoryA - categoryB;
                return a.nome.localeCompare(b.nome);
            });
        }
        return GAME_ITEMS.filter(item => item.categoria === activeCategory);
    }, [activeCategory]);

    return (
        <div className="w-full max-w-6xl mx-auto animated-entry">
            <div className="mb-8 flex flex-wrap justify-center gap-2 bg-black bg-opacity-30 p-2 rounded-xl sticky top-2 z-10">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-3 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                            activeCategory === category
                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                                : 'text-gray-300 bg-gray-700/50 hover:bg-gray-700'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item, itemIndex) => (
                    <div 
                        key={item.id} 
                        className="glassmorphism p-4 rounded-2xl border border-transparent hover:border-violet-500 transition-all duration-300 flex flex-col gap-3 animated-entry transform hover:scale-105"
                        style={{ animationDelay: `${itemIndex * 25}ms` }}
                    >
                        <div className="flex items-center gap-4">
                            <img 
                                loading="lazy"
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
            {filteredItems.length === 0 && (
                <div className="text-center text-gray-400 py-16">
                    <p>Nenhum item encontrado nesta categoria.</p>
                </div>
            )}
        </div>
    );
};

export default ItemDatabaseScreen;
