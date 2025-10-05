// api/gemini.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from '@supabase/supabase-js';

// CORREÇÃO: Importando da pasta local _lib com extensões .js para compatibilidade com ESM no Node.js
import { Hero, HeroDetails, DraftAnalysisResult, AnalysisResult, HeroStrategyAnalysis, ROLES, LaneOrNone, Role, SpellSuggestion, MatchupClassification } from "./_lib/types.js";
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

const analysisResponseSchema = { type: Type.OBJECT, properties: { sugestoesHerois: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, motivo: { type: Type.STRING }, avisos: { type: Type.ARRAY, items: { type: Type.STRING } }, spells: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, motivo: { type: Type.STRING } }, required: ["nome", "motivo"] } } }, required: ["nome", "motivo", "avisos", "spells"] } }, sugestoesItens: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, motivo: { type: Type.STRING } }, required: ["nome", "motivo"] } } }, required: ["sugestoesHerois", "sugestoesItens"] };
const matchupResponseSchema = { type: Type.OBJECT, properties: { classification: { type: Type.STRING }, detailedAnalysis: { type: Type.STRING }, recommendedSpell: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, motivo: { type: Type.STRING } }, required: ["nome", "motivo"] } }, required: ["classification", "detailedAnalysis", "recommendedSpell"] };
const combined1v1Schema = { type: Type.OBJECT, properties: { strategicAnalysis: analysisResponseSchema, matchupAnalysis: { ...matchupResponseSchema, nullable: true } }, required: ["strategicAnalysis"] };
const compositionSchema = { type: Type.OBJECT, properties: { physicalDamage: { type: Type.INTEGER }, magicDamage: { type: Type.INTEGER }, tankiness: { type: Type.INTEGER }, control: { type: Type.INTEGER } }, required: ["physicalDamage", "magicDamage", "tankiness", "control"] };
const draftAnalysisSchema = { type: Type.OBJECT, properties: { advantageScore: { type: Type.INTEGER }, advantageReason: { type: Type.STRING }, allyComposition: compositionSchema, enemyComposition: compositionSchema, teamStrengths: { type: Type.ARRAY, items: { type: Type.STRING } }, teamWeaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }, nextPickSuggestion: { type: Type.OBJECT, properties: { heroName: { type: Type.STRING }, role: { type: Type.STRING }, reason: { type: Type.STRING } }, nullable: true }, strategicItems: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, reason: { type: Type.STRING } }, required: ["name", "reason"] } } }, required: ["advantageScore", "advantageReason", "allyComposition", "enemyComposition", "teamStrengths", "teamWeaknesses", "strategicItems"] };
const heroStrategySchema = { type: Type.OBJECT, properties: { coreItems: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, motivo: { type: Type.STRING } }, required: ["nome", "motivo"] } }, situationalItems: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, motivo: { type: Type.STRING } }, required: ["nome", "motivo"] } }, playstyle: { type: Type.STRING }, powerSpikes: { type: Type.STRING } }, required: ["coreItems", "situationalItems", "playstyle", "powerSpikes"] };
const perfectCounterSchema = { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, motivo: { type: Type.STRING }, avisos: { type: Type.ARRAY, items: { type: Type.STRING } }, spells: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { nome: { type: Type.STRING }, motivo: { type: Type.STRING } }, required: ["nome", "motivo"] } } }, required: ["nome", "motivo", "avisos", "spells"] };
const combinedSynergyAnalysisSchema = { type: Type.OBJECT, properties: { strategy: heroStrategySchema, perfectCounter: perfectCounterSchema }, required: ["strategy", "perfectCounter"] };


// --- FUNÇÕES DE ANÁLISE ---

async function handle1v1Analysis(payload: any) {
    const { enemyHeroDetails, lane, potentialCountersDetails, selectedRole, yourHeroDetails, winRate } = payload;
    const itemNames = GAME_ITEMS.map(item => item.nome).join(', ');
    const spellList = Object.keys(SPELL_ICONS).filter(spell => spell !== 'default').join(', ');
    const enemyDetailsPrompt = formatHeroDetailsForPrompt(enemyHeroDetails);
    const countersDetailsPrompt = potentialCountersDetails.map((d: HeroDetails) => formatHeroDetailsForPrompt(d)).join('\n\n---\n\n');
    const systemPrompt = `Você é um analista de nível Mítico de Mobile Legends. Forneça uma análise tática infalível baseada ESTRITAMENTE nos dados. Responda APENAS com um objeto JSON válido que siga o schema.`;
    const laneContext = lane === 'NENHUMA' ? 'em confronto geral' : `na lane '${lane}'`;
    const strategicInstructions = `**Parte 1: Análise Estratégica (strategicAnalysis)**\nOponente: ${enemyHeroDetails.name} ${laneContext}.\nAnalisar counters para a função '${selectedRole}'.\nHeróis para Análise:\n${countersDetailsPrompt}\nInstruções: Forneça 'motivo', 'avisos', 'spells' da lista [${spellList}], e 3 'sugestoesItens' da lista [${itemNames}].`;
    let matchupInstructions = '';
    if (yourHeroDetails) {
        let winRateDesc = `NEUTRO`;
        if (winRate > 0.01) winRateDesc = `VANTAGEM de +${(winRate * 100).toFixed(1)}%`;
        else if (winRate < -0.01) winRateDesc = `DESVANTAGEM de ${(winRate * 100).toFixed(1)}%`;
        matchupInstructions = `**Parte 2: Confronto Direto (matchupAnalysis)**\nMeu Herói (${yourHeroDetails.name}) vs Inimigo (${enemyHeroDetails.name}).\nEstatística: ${winRateDesc}.\nMeu Herói:\n${formatHeroDetailsForPrompt(yourHeroDetails)}\nInimigo:\n${enemyDetailsPrompt}\nInstruções: Determine 'classification', 'detailedAnalysis' e 'recommendedSpell' da lista [${spellList}].`;
    }
    const userQuery = `${strategicInstructions}\n\n${matchupInstructions}\n\n${!matchupInstructions ? 'O campo "matchupAnalysis" deve ser nulo.' : ''}`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userQuery,
        config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: combined1v1Schema,
            temperature: 0.1
        }
    });
    return JSON.parse(response.text);
}

async function handleDraftAnalysis(payload: any) {
    const { allyHeroesDetails, enemyHeroesDetails, availableHeroes } = payload;
    const itemNames = GAME_ITEMS.map(item => item.nome).join(', ');
    const availableHeroNames = availableHeroes.map((h: Hero) => h.name).join(', ');
    const allyDetailsPrompt = allyHeroesDetails.length > 0 ? allyHeroesDetails.map(formatHeroDetailsForPrompt).join('\n---\n') : "Nenhum.";
    const enemyDetailsPrompt = enemyHeroesDetails.length > 0 ? enemyHeroesDetails.map(formatHeroDetailsForPrompt).join('\n---\n') : "Nenhum.";
    const systemPrompt = "Você é um analista de draft Mítico de Mobile Legends. Analise o draft e responda APENAS com um objeto JSON válido que siga o schema.";
    const userQuery = `DRAFT 5v5:\nTime Aliado:\n${allyDetailsPrompt}\nTime Inimigo:\n${enemyDetailsPrompt}\nHeróis Disponíveis: [${availableHeroNames}]\nItens: [${itemNames}]\nINSTRUÇÕES: Forneça 'advantageScore', 'advantageReason', 'allyComposition', 'enemyComposition', 'teamStrengths', 'teamWeaknesses', 'nextPickSuggestion' (ou nulo), e 2 'strategicItems'.`;

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
    const { heroToAnalyzeDetails, potentialCountersDetails } = payload;
    const itemNames = GAME_ITEMS.map(item => item.nome).join(', ');
    const spellList = Object.keys(SPELL_ICONS).filter(spell => spell !== 'default').join(', ');
    const heroToAnalyzePrompt = formatHeroDetailsForPrompt(heroToAnalyzeDetails);
    const countersDetailsPrompt = potentialCountersDetails.map((d: HeroDetails) => formatHeroDetailsForPrompt(d)).join('\n\n---\n\n');
    const systemPrompt = "Você é um analista Mítico de Mobile Legends. Forneça uma análise estratégica completa e responda APENAS com um objeto JSON válido que siga o schema.";
    const userQuery = `ANÁLISE ESTRATÉGICA\nHERÓI: ${heroToAnalyzePrompt}\nCOUNTERS POTENCIAIS (escolha o melhor): ${countersDetailsPrompt}\nItens: [${itemNames}]\nFeitiços: [${spellList}]\nINSTRUÇÕES: 1. Para 'strategy': sugira 'coreItems', 'situationalItems', 'playstyle' e 'powerSpikes'. 2. Para 'perfectCounter': escolha o melhor, dê 'motivo', 'avisos' e 'spells'.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userQuery,
        config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: combinedSynergyAnalysisSchema,
            temperature: 0.1
        }
    });
    return JSON.parse(response.text);
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
