
export interface Hero {
  id: string;
  apiId: number;
  name: string;
  role: string;
  imageUrl: string;
}

export const LANES = ['XP', 'Selva', 'Meio', 'Ouro', 'Rotação'] as const;
export type Lane = typeof LANES[number];

export interface SpellSuggestion {
  nome: string;
  motivo: string;
}

export type MatchupClassification = 'ANULA' | 'VANTAGEM' | 'NEUTRO' | 'DESVANTAGEM';

export interface HeroSuggestion {
  nome: string;
  imageUrl: string;
  motivo: string;
  classificacao: 'ANULA' | 'VANTAGEM';
  estatistica: string;
  spells: SpellSuggestion[];
}

export interface ItemSuggestion {
  nome: string;
  motivo: string;
}

export interface AnalysisResult {
  sugestoesHerois: HeroSuggestion[];
  sugestoesItens: ItemSuggestion[];
}

export interface BanSuggestion {
    hero: Hero;
    reason: string;
}

export interface MatchupData {
    yourHero: Hero;
    enemyHero: Hero;
    winRate: number;
    classification: MatchupClassification;
    analysis: string;
}

export type SlotType = 'yourPick' | 'enemyPick';