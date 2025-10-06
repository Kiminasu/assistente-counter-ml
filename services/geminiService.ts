import { Lane, Role, SpellSuggestion, MatchupClassification, Hero, DraftAnalysisResult, LaneOrNone, HeroStrategy, HeroDetails, AnalysisResult, HeroRelation, AITacticalCounter, HeroStrategicAnalysis } from "../types";
import { supabase } from '../supabaseClient';

async function fetchGeminiWithCache<T>(cacheKey: string, fetchFunction: () => Promise<T>): Promise<T> {
    const ttl = 6 * 60 * 60 * 1000; // 6 horas
    try {
        const cachedItem = localStorage.getItem(cacheKey);
        if (cachedItem) {
            const { timestamp, data } = JSON.parse(cachedItem);
            const isCacheValid = (new Date().getTime() - timestamp) < ttl;
            if (isCacheValid) {
                console.log(`[Cache IA] HIT para: ${cacheKey}`);
                return data as T;
            }
            console.log(`[Cache IA] Expirado para: ${cacheKey}`);
        } else {
             console.log(`[Cache IA] MISS para: ${cacheKey}`);
        }
    } catch (e) {
        console.error(`[Cache IA] Falha ao ler do cache para a chave ${cacheKey}`, e);
    }

    const fetchedData = await fetchFunction();

    try {
        const itemToCache = {
            timestamp: new Date().getTime(),
            data: fetchedData,
        };
        localStorage.setItem(cacheKey, JSON.stringify(itemToCache));
        console.log(`[Cache IA] Escrito no cache para a chave: ${cacheKey}`);
    } catch (e) {
        console.error(`[Cache IA] Falha ao escrever no cache para a chave ${cacheKey}`, e);
    }

    return fetchedData;
}

// Interface para a resposta da API do backend
export interface DetailedMatchupPayload {
  classification: MatchupClassification;
  detailedAnalysis: string;
  recommendedSpell: SpellSuggestion;
}

export interface Combined1v1AnalysisPayload {
  strategicAnalysis: AnalysisResult;
  matchupAnalysis: DetailedMatchupPayload | null;
  synergyRelations: HeroRelation | null;
  banSuggestions: AITacticalCounter[];
}

// Função genérica para chamar o endpoint do backend
async function callBackendApi<T>(analysisType: string, payload: any): Promise<T> {
    if (!supabase) {
        throw new Error("Cliente Supabase não inicializado. Verifique as credenciais.");
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        throw new Error('Você não está autenticado. Por favor, faça login para usar a análise de IA.');
    }

    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ analysisType, payload })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'O servidor retornou uma resposta inválida.' }));
            throw new Error(errorData.error || `Erro do servidor: ${response.statusText}`);
        }

        return response.json() as T;
    } catch (error) {
        console.error(`Erro ao chamar a API backend para ${analysisType}:`, error);
        const errorMessage = error instanceof Error ? error.message : "Não foi possível gerar a análise da IA.";
        throw new Error(errorMessage);
    }
}


export async function getCombined1v1Analysis(
  enemyHeroDetails: HeroDetails,
  lane: LaneOrNone,
  selectedRole: Role | 'Qualquer',
  yourHero: Hero | null,
  yourHeroDetails: HeroDetails | null,
  winRate: number | null
): Promise<Combined1v1AnalysisPayload> {
    const cacheKey = `gemini_1v1_full_${enemyHeroDetails.name}_${yourHeroDetails?.name || 'none'}_${lane}_${selectedRole}`;
    
    return fetchGeminiWithCache(cacheKey, () => callBackendApi<Combined1v1AnalysisPayload>('1v1', {
        enemyHeroDetails,
        lane,
        selectedRole,
        yourHero,
        yourHeroDetails,
        winRate
    }));
}


export async function getDraftAnalysis(
  allyHeroesDetails: HeroDetails[],
  enemyHeroesDetails: HeroDetails[],
  availableHeroes: Hero[],
): Promise<DraftAnalysisResult> {
    const allyNames = allyHeroesDetails.map(h => h.name).sort().join(',');
    const enemyNames = enemyHeroesDetails.map(h => h.name).sort().join(',');
    const cacheKey = `gemini_draft_${allyNames}_vs_${enemyNames}`;

    return fetchGeminiWithCache(cacheKey, () => callBackendApi<DraftAnalysisResult>('draft', {
        allyHeroesDetails,
        enemyHeroesDetails,
        availableHeroes
    }));
}

export async function getHeroStrategicAnalysis(
  heroToAnalyzeDetails: HeroDetails,
): Promise<HeroStrategicAnalysis> {
    const cacheKey = `gemini_strategic_${heroToAnalyzeDetails.name}`;

    return fetchGeminiWithCache(cacheKey, () => callBackendApi<HeroStrategicAnalysis>('strategic', {
        heroToAnalyzeDetails
    }));
}
