
// Usando URLs de imagens de uma fonte confiável para melhor qualidade e consistência.
export const ITEM_ICONS: Record<string, string> = {
    "Dominância de Gelo": "https://lain.mlbb.ninja/assets/items/dominance-ice.png",
    "Escudo de Atena": "https://lain.mlbb.ninja/assets/items/athenas-shield.png",
    "Lâmina dos Sete Mares": "https://lain.mlbb.ninja/assets/items/blade-of-the-heptaseas.png",
    "Vento da Natureza": "https://lain.mlbb.ninja/assets/items/wind-of-nature.png",
    "Quebra-Defesa": "https://lain.mlbb.ninja/assets/items/malefic-roar.png",
    "Oráculo": "https://lain.mlbb.ninja/assets/items/oracle.png",
    "default": "https://lain.mlbb.ninja/assets/items/sea-halberd.png" 
};

export const SPELL_ICONS: Record<string, string> = {
    "Executar": "https://lain.mlbb.ninja/assets/spells/execute.png",
    "Caçar": "https://lain.mlbb.ninja/assets/spells/retribution.png",
    "Inspirar": "https://lain.mlbb.ninja/assets/spells/inspire.png",
    "Petrificar": "https://lain.mlbb.ninja/assets/spells/petrify.png",
    "Purificar": "https://lain.mlbb.ninja/assets/spells/purify.png",
    "Teleporte": "https://lain.mlbb.ninja/assets/spells/arrival.png",
    "Vingança": "https://lain.mlbb.ninja/assets/spells/vengeance.png",
    "Proteção": "https://lain.mlbb.ninja/assets/spells/aegis.png",
    "Avançar": "https://lain.mlbb.ninja/assets/spells/sprint.png",
    "Curar": "https://lain.mlbb.ninja/assets/spells/healing-spell.png",
    "Lampejo": "https://lain.mlbb.ninja/assets/spells/flicker.png",
    "default": "https://lain.mlbb.ninja/assets/spells/flicker.png"
};

export const RATING_STYLES: Record<string, { text: string; border: string }> = {
    "ANULA": { text: "text-green-400", border: "border-green-400" },
    "VANTAGEM": { text: "text-blue-400", border: "border-blue-400" },
    "DESVANTAGEM": { text: "text-red-400", border: "border-red-400" },
    "NEUTRO": { text: "text-gray-400", border: "border-gray-400" },
};