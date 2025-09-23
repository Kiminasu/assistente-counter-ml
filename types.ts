
export interface Hero {
  id: string;
  apiId: number;
  name: string;
  roles: Role[];
  imageUrl: string;
}

export const LANES = ['XP', 'Selva', 'Meio', 'Ouro', 'Rotação'] as const;
export type Lane = typeof LANES[number];

export const ROLES = ['Soldado', 'Mago', 'Atirador', 'Assassino', 'Tanque', 'Suporte'] as const;
export type Role = typeof ROLES[number];

export interface SpellSuggestion {
  nome: string;
  motivo: string;
}

export type MatchupClassification = 'ANULA' | 'VANTAGEM' | 'NEUTRO' | 'DESVANTAGEM';

export interface HeroSuggestion {
  nome: string;
  imageUrl: string;
  motivo: string;
  avisos: string[];
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
    detailedAnalysis: string;
    recommendedSpell: SpellSuggestion | null;
}

export type SlotType = 'yourPick' | 'enemyPick';