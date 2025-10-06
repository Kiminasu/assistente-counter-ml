// api/gemini.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from '@supabase/supabase-js';

// CORREÇÃO: Importando da pasta local _lib com extensões .js para compatibilidade com ESM no Node.js
import { Hero, HeroDetails, DraftAnalysisResult, AnalysisResult, HeroStrategyAnalysis, ROLES, LaneOrNone, Role, SpellSuggestion, MatchupClassification, HeroRelation, Lane, LANES, AIBanSuggestion } from "./_lib/types.js";
import { GAME_ITEMS } from './_lib/items.js';
import { SPELL_ICONS } from './_lib/constants.js';

// --- INICIALIZAÇÃO SEGURA NO BACKEND ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const DAILY_LIMIT = 5;

// --- FUNÇÕES AUXILIARES E SCHEMAS ---

const formatHeroDetailsForPrompt = (details: HeroDetails): string => {
    if (!details || !details.skills) return `${details?.name || 'Herói Desconhecido'} (detalhes indisponíveis)`;
    const skills = details.skills.map((s, index) => {
        let label = index === 0 ? 'Passiva' : index === details.skills.length - 1 ? 'Ultimate' : `Habilidade ${index}`;
        return `- ${label}: ${s.skilldesc}`;
    }).join('\n');
    const combos = details.combos?.map(c => `\n- Combo (${c.title}): ${c.desc}`).join('') || '';
    return `Nome: ${details.name}\nResumo: ${details.summary}\nHabilidades:\n${skills}${combos ? `\nCombos Táticos:${combos}` : ''}`.trim();
};

const banSuggestionSchema = { type: Type.OBJECT, properties: { heroName: { type: Type.STRING }, reason: { type: Type.STRING } }, required: ["heroName", "reason"] };
const analysisResponseSchema = { type: Type.OBJECT, properties: { sugestoesHerois: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, motivo: { type: Type.STRING }, avisos: { type: Type.ARRAY, items: { type: Type.STRING } }, spells: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, motivo: { type: Type.STRING } }, required: ["nome", "motivo"] } } }, required: ["nome", "motivo", "avisos", "spells"] } }, sugestoesItens: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, motivo: { type: Type.STRING } }, required: ["nome", "motivo"] } } }, required: ["sugestoesHerois", "sugestoesItens"] };
const matchupResponseSchema = { type: Type.OBJECT, properties: { classification: { type: Type.STRING }, detailedAnalysis: { type: Type.STRING }, recommendedSpell: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, motivo: { type: Type.STRING } }, required: ["nome", "motivo"] } }, required: ["classification", "detailedAnalysis", "recommendedSpell"] };
const heroRelationSchema = { type: Type.OBJECT, properties: { assist: { type: Type.OBJECT, properties: { target_hero_id: { type: Type.ARRAY, items: { type: Type.INTEGER } } } }, strong: { type: Type.OBJECT, properties: { target_hero_id: { type: Type.ARRAY, items: { type: Type.INTEGER } } } }, weak: { type: Type.OBJECT, properties: { target_hero_id: { type: Type.ARRAY, items: { type: Type.INTEGER } } } } }, nullable: true };
const combined1v1Schema = { type: Type.OBJECT, properties: { strategicAnalysis: analysisResponseSchema, matchupAnalysis: { ...matchupResponseSchema, nullable: true }, synergyRelations: heroRelationSchema, banSuggestions: { type: Type.ARRAY, items: banSuggestionSchema } }, required: ["strategicAnalysis", "banSuggestions"] };
const compositionSchema = { type: Type.OBJECT, properties: { physicalDamage: { type: Type.INTEGER }, magicDamage: { type: Type.INTEGER }, tankiness: { type: Type.INTEGER }, control: { type: Type.INTEGER } }, required: ["physicalDamage", "magicDamage", "tankiness", "control"] };
const draftAnalysisSchema = { type: Type.OBJECT, properties: { advantageScore: { type: Type.INTEGER }, advantageReason: { type: Type.STRING }, allyComposition: compositionSchema, enemyComposition: compositionSchema, teamStrengths: { type: Type.ARRAY, items: { type: Type.STRING } }, teamWeaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }, nextPickSuggestion: { type: Type.OBJECT, properties: { heroName: { type: Type.STRING }, role: { type: Type.STRING }, reason: { type: Type.STRING } }, nullable: true }, strategicItems: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, reason: { type: Type.STRING } }, required: ["name", "reason"] } }, banSuggestions: { type: Type.ARRAY, items: banSuggestionSchema } }, required: ["advantageScore", "advantageReason", "allyComposition", "enemyComposition", "teamStrengths", "teamWeaknesses", "strategicItems", "banSuggestions"] };
const heroStrategySchema = { type: Type.OBJECT, properties: { coreItems: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, motivo: { type: Type.STRING } }, required: ["nome", "motivo"] } } }, situationalItems: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, motivo: { type: Type.STRING } }, required: ["nome", "motivo"] } } }, playstyle: { type: Type.STRING }, powerSpikes: { type: Type.STRING } }, required: ["coreItems", "situationalItems", "playstyle", "powerSpikes"] };
const perfectCounterSchema = { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, motivo: { type: Type.STRING }, avisos: { type: Type.ARRAY, items: { type: Type.STRING } }, spells: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, motivo: { type: Type.STRING } }, required: ["nome", "motivo"] } }, lane: { type: Type.STRING } }, required: ["nome", "motivo", "avisos", "spells", "lane"] };
const combinedSynergyAnalysisSchema = { type: Type.OBJECT, properties: { strategy: heroStrategySchema, perfectCounters: { type: Type.ARRAY, items: perfectCounterSchema }, synergyRelations: heroRelationSchema, banSuggestions: { type: Type.ARRAY, items: banSuggestionSchema } }, required: ["strategy", "perfectCounters", "synergyRelations", "banSuggestions"] };


async function getHeroRelations(heroApiId: number): Promise<HeroRelation | null> {
    const relationApiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-relation/${heroApiId}/`;
    const counterApiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-counter/${heroApiId}/`;
    const proxyUrl = 'https://corsproxy.io/?';

    try {
        const [relationResponse, countersResponse] = await Promise.all([
            fetch(proxyUrl + encodeURIComponent(relationApiUrl)).catch(() => null),
            fetch(proxyUrl + encodeURIComponent(counterApiUrl)).catch(() => null)
        ]);

        let assistIds: number[] = [];
        let strongIds: number[] = [];
        if (relationResponse && relationResponse.ok) {
            const apiResponse = await relationResponse.json();
            const record = apiResponse?.data?.records?.[0]?.data;
            if (record?.relation) {
                assistIds = (record.relation.assist?.target_hero_id || []).filter((id: number) => id !== 0);
                strongIds = (record.relation.strong?.target_hero_id || []).filter((id: number) => id !== 0);
            }
        }

        let weakIds: number[] = [];
        if (countersResponse && countersResponse.ok) {
            const apiResponse = await countersResponse.json();
            const counterHeroes = apiResponse?.data?.records?.[0]?.data?.sub_hero;
            if (counterHeroes) {
                weakIds = counterHeroes
                    .sort((a: any, b: any) => b.increase_win_rate - a.increase_win_rate)
                    .map((c: any) => c.heroid);
            }
        }

        const weakIdSet = new Set(weakIds);
        const filteredStrongIds = strongIds.filter(id => !weakIdSet.has(id));
        const filteredAssistIds = assistIds.filter(id => !weakIdSet.has(id));

        if (filteredAssistIds.length === 0 && filteredStrongIds.length === 0 && weakIds.length === 0) {
            return null;
        }

        return {
            assist: { target_hero_id: filteredAssistIds },
            strong: { target_hero_id: filteredStrongIds },
            weak: { target_hero_id: weakIds },
        };
    } catch (error) {
        console.error(`Falha ao buscar relações combinadas para o herói ID ${heroApiId}:`, error);
        return null; // Retorna nulo em caso de erro para não quebrar a análise principal
    }
}


// --- FUNÇÕES DE ANÁLISE ---

async function handle1v1Analysis(payload: any) {
    const { enemyHeroDetails, lane, potentialCountersDetails, selectedRole, yourHero, yourHeroDetails, winRate } = payload;
    
    const synergyRelationsTask = yourHero?.apiId ? getHeroRelations(yourHero.apiId) : Promise.resolve(null);
    
    const itemNames = GAME_ITEMS.map(item => item.nome).join(', ');
    const spellList = Object.keys(SPELL_ICONS).filter(spell => spell !== 'default').join(', ');
    const enemyDetailsPrompt = formatHeroDetailsForPrompt(enemyHeroDetails);
    const countersDetailsPrompt = potentialCountersDetails.map((d: HeroDetails) => formatHeroDetailsForPrompt(d)).join('\n\n---\n\n');
    const systemPrompt = `Você é um analista de nível Mítico de Mobile Legends. Forneça uma análise tática infalível baseada ESTRITAMENTE nos dados. Responda APENAS com um objeto JSON válido que siga o schema. O campo 'synergyRelations' deve ser nulo.`;
    const laneContext = lane === 'NENHUMA' ? 'em confronto geral' : `na lane '${lane}'`;
    
    const strategicInstructions = `**Parte 1: Análise Estratégica (strategicAnalysis)**\nOponente: ${enemyHeroDetails.name} ${laneContext}.\nAnalisar counters para a função '${selectedRole}'.\nHeróis para Análise:\n${countersDetailsPrompt}\nInstruções: Forneça 'motivo', 'avisos', 'spells' da lista [${spellList}], e 3 'sugestoesItens' da lista [${itemNames}].`;
    
    let matchupInstructions = '';
    if (yourHeroDetails) {
        let winRateDesc = `NEUTRO`;
        if (winRate > 0.01) winRateDesc = `VANTAGEM de +${(winRate * 100).toFixed(1)}%`;
        else if (winRate < -0.01) winRateDesc = `DESVANTAGEM de ${(winRate * 100).toFixed(1)}%`;
        matchupInstructions = `**Parte 2: Confronto Direto (matchupAnalysis)**\nMeu Herói (${yourHeroDetails.name}) vs Inimigo (${enemyHeroDetails.name}).\nEstatística: ${winRateDesc}.\nMeu Herói:\n${formatHeroDetailsForPrompt(yourHeroDetails)}\nInimigo:\n${enemyDetailsPrompt}\nInstruções: Determine 'classification', 'detailedAnalysis' e 'recommendedSpell' da lista [${spellList}].`;
    }

    let banInstructions = '';
    if (yourHeroDetails) {
        banInstructions = `**Parte 3: Sugestões de Banimento (banSuggestions)**\nCom base nas fraquezas do meu herói (${yourHeroDetails.name}) contra o inimigo (${enemyHeroDetails.name}), sugira de 3 a 5 bans táticos para protegê-lo. A razão ('reason') deve explicar interações de habilidades específicas.`;
    } else {
        banInstructions = `**Parte 3: Sugestões de Banimento (banSuggestions)**\nCom base nas forças do herói inimigo (${enemyHeroDetails.name}), sugira de 3 a 5 bans táticos para counterá-lo. A razão ('reason') deve explicar interações de habilidades específicas.`;
    }

    const userQuery = `${strategicInstructions}\n\n${matchupInstructions}\n\n${banInstructions}\n\n${!matchupInstructions ? 'O campo "matchupAnalysis" deve ser nulo.' : ''}`;
    
    const geminiTask = ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userQuery,
        config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: combined1v1Schema,
            temperature: 0.1
        }
    });

    const [geminiResponse, synergyRelations] = await Promise.all([geminiTask, synergyRelationsTask]);
    const result = JSON.parse(geminiResponse.text);
    result.synergyRelations = synergyRelations;

    return result;
}

async function handleDraftAnalysis(payload: any) {
    const { allyHeroesDetails, enemyHeroesDetails, availableHeroes } = payload;
    const itemNames = GAME_ITEMS.map(item => item.nome).join(', ');
    const availableHeroNames = availableHeroes.map((h: Hero) => h.name).join(', ');
    const allyDetailsPrompt = allyHeroesDetails.length > 0 ? allyHeroesDetails.map(formatHeroDetailsForPrompt).join('\n---\n') : "Nenhum.";
    const enemyDetailsPrompt = enemyHeroesDetails.length > 0 ? enemyHeroesDetails.map(formatHeroDetailsForPrompt).join('\n---\n') : "Nenhum.";
    const systemPrompt = "Você é um analista de draft Mítico de Mobile Legends. Analise o draft e responda APENAS com um objeto JSON válido que siga o schema.";
    const userQuery = `DRAFT 5v5:\nTime Aliado:\n${allyDetailsPrompt}\nTime Inimigo:\n${enemyDetailsPrompt}\nHeróis Disponíveis: [${availableHeroNames}]\nItens: [${itemNames}]\nINSTRUÇÕES: Forneça 'advantageScore', 'advantageReason', 'allyComposition', 'enemyComposition', 'teamStrengths', 'teamWeaknesses', 'nextPickSuggestion' (ou nulo), 2 'strategicItems', e de 3 a 5 'banSuggestions' táticas. As sugestões de ban devem focar em neutralizar a estratégia inimiga mais forte ou proteger a maior fraqueza do time aliado.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userQuery,
        config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: draftAnalysisSchema,
            temperature: 0.1
        }
    });
    return JSON.parse(response.text);
}

async function handleSynergyAnalysis(payload: any) {
    const { heroToAnalyze, heroToAnalyzeDetails, potentialCountersDetails } = payload;

    const synergyRelationsTask = getHeroRelations(heroToAnalyze.apiId);

    const itemNames = GAME_ITEMS.map(item => item.nome).join(', ');
    const spellList = Object.keys(SPELL_ICONS).filter(spell => spell !== 'default').join(', ');
    const heroToAnalyzePrompt = formatHeroDetailsForPrompt(heroToAnalyzeDetails);
    const countersDetailsPrompt = potentialCountersDetails.map((d: HeroDetails) => formatHeroDetailsForPrompt(d)).join('\n\n---\n\n');
    const systemPrompt = "Você é um analista Mítico de Mobile Legends. Forneça uma análise estratégica completa e responda APENAS com um objeto JSON válido que siga o schema. O campo 'synergyRelations' deve ser nulo.";
    const userQuery = `ANÁLISE ESTRATÉGICA\nHERÓI: ${heroToAnalyzePrompt}\nCOUNTERS POTENCIAIS (para escolher os perfeitos): ${countersDetailsPrompt}\nItens: [${itemNames}]\nFeitiços: [${spellList}]\nLanes: [${LANES.join(', ')}]\nINSTRUÇÕES:\n1. Para 'strategy': sugira 'coreItems', 'situationalItems', 'playstyle' e 'powerSpikes'.\n2. Para 'perfectCounters': forneça uma lista de 5 sugestões, UMA PARA CADA LANE: 'EXP', 'SELVA', 'MEIO', 'OURO', 'ROTAÇÃO'. Cada sugestão deve ser taticamente sólida, incluindo 'nome', 'motivo', 'avisos', 'spells' e a 'lane' correspondente. A lógica tática é mais importante que dados brutos.\n3. Para 'banSuggestions': forneça uma lista de 3 a 5 sugestões táticas de banimento CONTRA ${heroToAnalyzeDetails.name}. A razão ('reason') deve explicar interações de habilidades específicas que justificam o ban (ex: 'A ultimate do Yin pode cancelar a ultimate da Angela, isolando o alvo').`;
    
    const geminiTask = ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userQuery,
        config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: combinedSynergyAnalysisSchema,
            temperature: 0.1
        }
    });

    const [geminiResponse, synergyRelations] = await Promise.all([geminiTask, synergyRelationsTask]);
    const result = JSON.parse(geminiResponse.text);
    result.synergyRelations = synergyRelations; // Adiciona os dados de sinergia à resposta final

    return result;
}


// --- HANDLER PRINCIPAL DA API ---

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método Não Permitido' });

    if (!process.env.API_KEY || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
        return res.status(500).json({ error: "Variáveis de ambiente do servidor não configuradas corretamente." });
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
        
        const token = authHeader.split(' ')[1];
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);
        if (userError || !user) return res.status(401).json({ error: 'Token inválido ou expirado.' });

        const { data: profile, error: profileError } = await supabase.from('profiles').select('subscription_status, analysis_count, last_analysis_at').eq('id', user.id).single();
        if (profileError) throw new Error('Perfil de usuário não encontrado.');

        if (profile.subscription_status !== 'premium') {
            const today = new Date().toISOString().split('T')[0];
            const lastAnalysisDate = profile.last_analysis_at ? new Date(profile.last_analysis_at).toISOString().split('T')[0] : null;
            if (lastAnalysisDate === today && profile.analysis_count >= DAILY_LIMIT) {
                return res.status(429).json({ error: `Você atingiu seu limite de ${DAILY_LIMIT} análises gratuitas por dia. Faça upgrade para análises ilimitadas!` });
            }
            const newCount = lastAnalysisDate === today ? profile.analysis_count + 1 : 1;
            await supabase.from('profiles').update({ analysis_count: newCount, last_analysis_at: new Date().toISOString() }).eq('id', user.id);
        }

        const { analysisType, payload } = req.body;
        let result;
        switch (analysisType) {
            case '1v1': result = await handle1v1Analysis(payload); break;
            case 'draft': result = await handleDraftAnalysis(payload); break;
            case 'synergy': result = await handleSynergyAnalysis(payload); break;
            default: return res.status(400).json({ error: 'Tipo de análise inválido' });
        }
        
        return res.status(200).json(result);
    } catch (error: any) {
        console.error("Erro na função de API:", error);
        return res.status(500).json({ error: error.message || "Erro interno do servidor." });
    }
}