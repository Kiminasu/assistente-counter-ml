import React from 'react';
import { Hero } from '../types';
import CollapsibleTutorial from './CollapsibleTutorial';
import HeroSlot from './HeroSlot';
import SynergyPanel from './SynergyPanel';
import HeroStrategyPanel from './HeroStrategyPanel';

interface SynergyExplorerScreenProps {
    selectedHeroId: string | null;
    heroes: Record<string, Hero>;
    heroApiIdMap: Record<number, Hero>;
    onHeroSelectClick: () => void;
}

const SynergyExplorerScreen: React.FC<SynergyExplorerScreenProps> = ({ 
    selectedHeroId, 
    heroes, 
    heroApiIdMap, 
    onHeroSelectClick 
}) => {
    const selectedHero = selectedHeroId ? heroes[selectedHeroId] : null;

    return (
        <div className="w-full max-w-5xl mx-auto animated-entry flex flex-col gap-6">
            <div className="flex flex-col items-center gap-4">
                <CollapsibleTutorial title="Como Explorar Sinergias">
                    <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-gray-300">
                        <li>Clique no painel abaixo para selecionar um herói.</li>
                        <li>A análise mostrará com quais heróis ele tem boa sinergia.</li>
                        <li>A IA também gerará uma análise estratégica com build de itens e estilo de jogo.</li>
                    </ol>
                </CollapsibleTutorial>
                
                <div className="w-full max-w-xs glassmorphism p-3 rounded-xl border-2 panel-glow-primary">
                    <h2 className="text-xl font-black text-center text-amber-300 tracking-wider">SELECIONE O HERÓI</h2>
                     <HeroSlot 
                        type="ally" 
                        heroId={selectedHeroId} 
                        heroes={heroes} 
                        onClick={onHeroSelectClick}
                    />
                </div>
            </div>

            {selectedHeroId && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    <div className="flex flex-col">
                        <h2 className="text-xl sm:text-2xl font-black text-center mb-2 tracking-wider">Sinergias e Counters</h2>
                        <div className="glassmorphism p-4 rounded-xl flex-grow border-2 panel-glow-primary">
                            <SynergyPanel
                                selectedHeroId={selectedHeroId}
                                heroes={heroes}
                                heroApiIdMap={heroApiIdMap}
                            />
                        </div>
                    </div>
                     <div className="flex flex-col">
                        <h2 className="text-xl sm:text-2xl font-black text-center mb-2 tracking-wider">Análise Estratégica da IA</h2>
                        <div className="glassmorphism p-4 rounded-xl flex-grow border-2 panel-glow-primary">
                            <HeroStrategyPanel
                                selectedHero={selectedHero}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SynergyExplorerScreen;