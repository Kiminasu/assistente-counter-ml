
// FIX: Moved UserProfile here from App.tsx to break circular dependency.
export interface UserProfile {
    username: string;
    rank: UserSignupRank;
    subscription_status: 'free' | 'premium';
    analysis_count: number;
    last_analysis_at: string | null;
    subscription_expires_at: string | null;
}

export type GameMode = 'dashboard' | '1v1' | '5v5' | 'ranking' | 'item' | 'synergy' | 'heroes' | 'premium';

export interface Hero {
  id: string;
  apiId: number;
  name: string;
  roles: Role[];
  imageUrl: string;
}

export const LANES = ['EXP', 'SELVA', 'MEIO', 'OURO', 'ROTAÇÃO'] as const;
export type Lane = typeof LANES[number];

export const LANES_WITH_NONE = ['EXP', 'SELVA', 'MEIO', 'OURO', 'ROTAÇÃO', 'NENHUMA'] as const;
export type LaneOrNone = typeof LANES_WITH_NONE[number];

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
  classificacao: 'ANULA' | 'VANTAGEM' | 'PERFEITO';
  estatistica: string;
  spells: SpellSuggestion[];
  lane?: Lane; // Adicionado para counters por lane
}

export interface GameItemAbility {
  tipo: string;
  nome_habilidade: string | null;
  descricao: string;
}

export interface GameItem {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
  atributos: string[];
  habilidades: GameItemAbility[];
}

export interface ItemSuggestion {
  nome: string;
  motivo: string;
  preco: number;
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

export type Team = 'ally' | 'enemy';

export const RANKS = ['all', 'epic', 'legend', 'mythic', 'honor', 'glory'] as const;
export type RankCategory = typeof RANKS[number];

export const USER_SIGNUP_RANKS = ['Guerreiro', 'Elite', 'Mestre', 'Grão-Mestre', 'Épico', 'Lenda', 'Mítico', 'Honra', 'Glória'] as const;
export type UserSignupRank = typeof USER_SIGNUP_RANKS[number];

export const RANK_DAYS = [1, 3, 7, 15, 30] as const;
export type RankDays = typeof RANK_DAYS[number];

export const SORT_FIELDS = {
    win_rate: 'Taxa de Vitória',
    pick_rate: 'Taxa de Escolha',
    ban_rate: 'Taxa de Ban',
} as const;
export type SortField = keyof typeof SORT_FIELDS;

export interface HeroRankInfo {
    hero: Hero;
    winRate: number;
    pickRate: number;
    banRate: number;
}

// FIX: Export the HeroDailyRate interface.
export interface HeroDailyRate {
  date: string;
  win_rate: number;
}

export interface NextPickSuggestion {
  heroName: string;
  role: Role;
  reason: string;
  imageUrl: string;
}

export interface StrategicItemSuggestion {
  name: string;
  reason: string;
  preco: number;
}

export interface TeamCompositionStats {
  physicalDamage: number;
  magicDamage: number;
  tankiness: number;
  control: number;
}

export interface AITacticalCounter {
  heroName: string;
  reason: string;
  counterType: 'HARD' | 'SOFT';
}

export interface DraftAnalysisResult {
  advantageScore: number;
  advantageReason: string;
  allyComposition: TeamCompositionStats;
  enemyComposition: TeamCompositionStats;
  teamStrengths: string[];
  teamWeaknesses: string[];
  nextPickSuggestion: NextPickSuggestion | null;
  strategicItems: StrategicItemSuggestion[];
  banSuggestions: AITacticalCounter[];
}

export interface HeroStrategy {
  coreItems: ItemSuggestion[];
  situationalItems: ItemSuggestion[];
  playstyle: string;
  powerSpikes: string;
}

// FIX: Added 'perfectCounter' to the HeroStrategicAnalysis interface to support the new AI feature.
export interface HeroStrategicAnalysis {
    strategy: HeroStrategy;
    tacticalCounters: AITacticalCounter[];
    perfectCounter?: {
        nome: string;
        motivo: string;
        avisos: string[];
        spells: SpellSuggestion[];
    };
}


export interface HeroSkill {
    skillname: string;
    skilldesc: string;
}

export interface SkillCombo {
    title: string;
    desc: string;
}

export interface HeroDetails {
    name: string;
    summary: string;
    skills: HeroSkill[];
    combos: SkillCombo[];
}

// FIX: Export the HeroRelation interface so it can be used by other components.
export interface HeroRelation {
    assist: { target_hero_id: number[] };
    strong: { target_hero_id: number[] };
    weak: { target_hero_id: number[] };
}