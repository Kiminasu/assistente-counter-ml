export interface MetaSynergy {
  heroNames: [string, string];
  description: string;
}

// Data for the new "Key Meta Synergies" panel
export const META_SYNERGIES: MetaSynergy[] = [
  {
    heroNames: ["Atlas", "Pharsa"],
    description: "A iniciação em área do Atlas agrupa os inimigos, criando o cenário perfeito para o dano massivo da ultimate da Pharsa."
  },
  {
    heroNames: ["Johnson", "Odette"],
    description: "A clássica 'Uber'. Johnson transforma-se, leva Odette até o time inimigo e a ultimate de ambos causa um dano em área devastador."
  },
  {
    heroNames: ["Angela", "Fredrinn"],
    description: "Angela anexa-se a Fredrinn, fornecendo escudo e cura, tornando o já resistente caçador de tesouros quase imortal no meio da luta."
  },
  {
    heroNames: ["Luo Yi", "Tigreal"],
    description: "O teleporte global de Luo Yi permite que Tigreal inicie uma luta de forma inesperada, pegando a equipe inimiga completamente desprevenida."
  },
];

export const MANUAL_SYNERGY_DATA: Record<string, { allies: string[], strongAgainst: string[] }> = {
    // Tanks
    "Atlas": { allies: ["Pharsa", "Odette", "Yi Sun-shin"], strongAgainst: ["Fanny", "Ling", "Harith", "Wanwan"] },
    "Tigreal": { allies: ["Luo Yi", "Gord", "Eudora"], strongAgainst: ["Hayabusa", "Lancelot", "Lesley", "Clint"] },
    "Khufra": { allies: ["Pharsa", "Kagura", "Lylia"], strongAgainst: ["Fanny", "Ling", "Benedetta", "Joy"] },
    // Mages
    "Pharsa": { allies: ["Atlas", "Tigreal", "Kaja"], strongAgainst: ["Gord", "Eudora", "Layla", "Miya"] },
    "Valentina": { allies: ["Fredrinn", "Akai", "Atlas"], strongAgainst: ["Angela", "Estes", "Faramis", "Diggie"] },
    "Luo Yi": { allies: ["Tigreal", "Atlas", "Barats"], strongAgainst: ["Chou", "Paquito", "Benedetta", "Yu Zhong"] },
    // Fighters
    "Chou": { allies: ["Selena", "Kagura", "Gusion"], strongAgainst: ["Fanny", "Lancelot", "Hayabusa", "Ling"] },
    "Fredrinn": { allies: ["Angela", "Floryn", "Valentina"], strongAgainst: ["Karina", "Gusion", "Saber", "Natalia"] },
    "Arlott": { allies: ["Angela", "Lolita", "Diggie"], strongAgainst: ["Claude", "Wanwan", "Karrie", "Brody"] },
    // Assassins
    "Lancelot": { allies: ["Angela", "Mathilda", "Rafaela"], strongAgainst: ["Lesley", "Layla", "Clint", "Miya"] },
    "Fanny": { allies: ["Angela", "Mathilda", "Diggie"], strongAgainst: ["Kimmy", "Gord", "Eudora", "Pharsa"] },
    "Ling": { allies: ["Angela", "Mathilda", "Estes"], strongAgainst: ["Esmeralda", "Uranus", "Alice", "Ruby"] },
    // Marksmen
    "Claude": { allies: ["Angela", "Diggie", "Floryn"], strongAgainst: ["Hylos", "Belerick", "Gatotkaca", "Esmeralda"] },
    "Beatrix": { allies: ["Angela", "Mathilda", "Diggie"], strongAgainst: ["Gord", "Eudora", "Layla", "Miya"] },
    "Wanwan": { allies: ["Angela", "Floryn", "Carmilla"], strongAgainst: ["Karrie", "Claude", "Bruno", "Moskov"] },
    // Supports
    "Angela": { allies: ["Fredrinn", "Lancelot", "Claude"], strongAgainst: ["Gusion", "Hayabusa", "Saber", "Ling"] },
    "Diggie": { allies: ["Claude", "Fanny", "Lancelot"], strongAgainst: ["Atlas", "Tigreal", "Khufra", "Minsitthar"] },
    "Floryn": { allies: ["Fredrinn", "Yu Zhong", "Claude"], strongAgainst: ["Valir", "Luo Yi", "Yve", "Chang'e"] },
};