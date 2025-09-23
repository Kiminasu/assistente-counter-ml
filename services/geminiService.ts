import { GoogleGenAI, Type } from "@google/genai";
import { Lane, Role, SpellSuggestion, MatchupClassification, Hero } from "../types";
import { ITEM_ICONS, SPELL_ICONS } from "../constants";
import { HeroDetails } from './heroService';

let ai: GoogleGenAI | null = null;

function getApiKey(): string {
    let key: string | undefined;
    
    // De acordo com as diretrizes do projeto, a chave da API deve vir exclusivamente de process.env.API_KEY.
    // O ambiente de hospedagem (Google AI Studio, Netlify, etc.) é responsável por disponibilizar esta variável.
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        key = process.env.API_KEY;
    }

    if (!key) {
        // Esta mensagem de erro fornece instruções claras para o usuário configurar seu ambiente de implantação.
        throw new Error("A chave da API do Google não está configurada. Para corrigir, defina a variável de ambiente `API_KEY` nas configurações do seu site no Netlify (ou na sua plataforma de hospedagem).");
    }
    return key;
}

function getGenAIClient(): GoogleGenAI {
    if (ai) {
        return ai;
    }
    const apiKey = getApiKey();
    ai = new GoogleGenAI({ apiKey });
    return ai;
}

const formatHeroDetailsForPrompt = (details: HeroDetails): string => {
    if (!details || !details.skills) return `${details?.name || 'Herói Desconhecido'} (detalhes indisponíveis)`;

    const skills = details.skills.map(s => `- ${s.skillname}: ${s.skilldesc}`).join('\n');
    const combos = details.combos?.map(c => `\n- Combo (${c.title}): ${c.desc}`).join('') || '';

    return `
Nome: ${details.name}
Resumo: ${details.summary}
Habilidades:
${skills}
${combos ? `\nCombos Táticos:${combos}` : ''}
    `.trim();
};

export interface AnalysisPayload {
  sugestoesHerois: {
    nome: string;
    motivo: string;
    avisos: string[];
    spells: {
      nome: string;
      motivo: string;
    }[];
  }[];
  sugestoesItens: {
    nome: string;
    motivo: string;
  }[];
}

const analysisResponseSchema = {
    type: Type.OBJECT,
    properties: {
        sugestoesHerois: {
            type: Type.ARRAY,
            description: "Lista de heróis sugeridos a partir da lista fornecida.",
            items: {
                type: Type.OBJECT,
                properties: {
                    nome: { type: Type.STRING, description: "Nome do herói, deve ser um da lista de potenciais counters." },
                    motivo: { type: Type.STRING, description: "Análise estratégica concisa e detalhada explicando por que este herói é um bom counter, considerando TODAS as habilidades, passivas e combos fornecidos." },
                    avisos: {
                        type: Type.ARRAY,
                        description: "Lista de 1-2 avisos críticos sobre o confronto. Foque em habilidades do oponente que podem counterar sua estratégia (ex: escudo da Hanabi) ou picos de poder a serem respeitados.",
                        items: { type: Type.STRING }
                    },
                    spells: {
                        type: Type.ARRAY,
                        description: "Lista de 1 ou 2 feitiços de batalha recomendados para este herói no confronto.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                nome: { type: Type.STRING, description: "Nome do feitiço, deve ser um da lista de feitiços fornecida." },
                                motivo: { type: Type.STRING, description: "Breve motivo para a escolha do feitiço." }
                            },
                            required: ["nome", "motivo"]
                        }
                    }
                },
                required: ["nome", "motivo", "avisos", "spells"]
            }
        },
        sugestoesItens: {
            type: Type.ARRAY,
            description: "Lista de 3 itens de counter gerais para o confronto.",
            items: {
                type: Type.OBJECT,
                properties: {
                    nome: { type: Type.STRING, description: "Nome do item, deve ser um da lista de itens fornecida." },
                    motivo: { type: Type.STRING, description: "Motivo pelo qual este item é eficaz contra o oponente, com base em suas habilidades." }
                },
                required: ["nome", "motivo"]
            }
        }
    },
    required: ["sugestoesHerois", "sugestoesItens"]
};

export async function getStrategicAnalysis(
  enemyHeroDetails: HeroDetails,
  lane: Lane,
  potentialCountersDetails: HeroDetails[],
  selectedRole: Role,
  isTheoretical: boolean = false
): Promise<AnalysisPayload> {
    try {
        const genAI = getGenAIClient();
        const itemList = Object.keys(ITEM_ICONS).filter(item => item !== 'default').join(', ');
        const spellList = Object.keys(SPELL_ICONS).filter(spell => spell !== 'default').join(', ');
        
        const enemyDetailsPrompt = formatHeroDetailsForPrompt(enemyHeroDetails);
        const countersDetailsPrompt = potentialCountersDetails.map(d => formatHeroDetailsForPrompt(d)).join('\n\n---\n\n');

        const systemPrompt = `Você é um analista de nível Mítico e engenheiro de jogo de Mobile Legends. Sua tarefa é fornecer uma análise tática infalível, tratando cada confronto como um problema matemático. Analise variáveis como dano, escalonamento, tempos de recarga e combos de habilidades para formular conclusões lógicas. Responda APENAS com um objeto JSON válido que siga o schema. Seja direto, preciso e use termos em português do Brasil.`;
        
        const commonInstructions = `
1. Para cada herói counter sugerido:
   a. Forneça um 'motivo' tático detalhado, explicando como suas habilidades e combos counteram especificamente as de ${enemyHeroDetails.name}.
   b. Forneça 1-2 'avisos' críticos, como habilidades do oponente que anulam sua vantagem ou combos que você precisa evitar.
   c. Sugira 1 ou 2 'spells' (feitiços) ideais da lista [${spellList}].
2. Sugira 3 'sugestoesItens' de counter da lista [${itemList}] que sejam eficazes contra ${enemyHeroDetails.name} E APROPRIADOS para um herói da função '${selectedRole}' na lane '${lane}', explicando a interação com as habilidades dele.`;
        
        let userQuery = '';
        if (isTheoretical) {
            userQuery = `Oponente na lane '${lane}':\n${enemyDetailsPrompt}\n\nEu quero jogar com um herói da função '${selectedRole}'.
Não foram encontrados dados estatísticos. Baseado na sua análise profunda das habilidades, escolha os 3 melhores counters TEÓRICOS da seguinte lista e siga as instruções.\n\nHeróis para Análise:\n${countersDetailsPrompt}\n\n${commonInstructions}`;
        } else {
            userQuery = `Oponente na lane '${lane}':\n${enemyDetailsPrompt}\n\nEu quero jogar com um herói da função '${selectedRole}'.
Analise CADA UM dos seguintes heróis, que são counters estatísticos, e siga as instruções.\n\nHeróis para Análise:\n${countersDetailsPrompt}\n\n${commonInstructions}`;
        }


        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userQuery,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: analysisResponseSchema,
                temperature: 0.1,
                thinkingConfig: { thinkingBudget: 0 },
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AnalysisPayload;
    } catch (error) {
        console.error("Erro ao chamar a API Gemini para análise estratégica:", error);
        const errorMessage = error instanceof Error ? error.message : "Não foi possível gerar a análise da IA.";
        throw new Error(errorMessage);
    }
}

export interface DetailedMatchupPayload {
    classification: MatchupClassification;
    detailedAnalysis: string;
    recommendedSpell: SpellSuggestion;
}

const matchupResponseSchema = {
    type: Type.OBJECT,
    properties: {
        classification: { 
            type: Type.STRING,
            description: "A classificação final do confronto: 'ANULA', 'VANTAGEM', 'DESVANTAGEM', ou 'NEUTRO'. A decisão deve ser lógica e baseada 100% nas habilidades e dados fornecidos."
        },
        detailedAnalysis: {
            type: Type.STRING,
            description: "Análise tática concisa (3-4 frases). Comece com a mesma palavra da 'classification' para consistência. Explique o porquê com base nas habilidades e combos, e dê 2 dicas práticas."
        },
        recommendedSpell: {
            type: Type.OBJECT,
            properties: {
                nome: { type: Type.STRING, description: "O melhor feitiço de batalha para este confronto, da lista fornecida." },
                motivo: { type: Type.STRING, description: "Motivo curto e direto para a escolha do feitiço." }
            },
            required: ["nome", "motivo"]
        }
    },
    required: ["classification", "detailedAnalysis", "recommendedSpell"]
};

export async function getDetailedMatchupAnalysis(
    yourHeroDetails: HeroDetails,
    enemyHeroDetails: HeroDetails,
    lane: Lane,
    winRate: number,
    isSuggestedCounter: boolean
): Promise<DetailedMatchupPayload> {
    try {
        const genAI = getGenAIClient();
        const spellList = Object.keys(SPELL_ICONS).filter(spell => spell !== 'default').join(', ');
        
        let winRateDescription = `estatisticamente NEUTRO (ou sem dados)`;
        if (winRate > 0.01) {
            winRateDescription = `uma VANTAGEM estatística de +${(winRate * 100).toFixed(1)}%`;
        } else if (winRate < -0.01) {
            winRateDescription = `uma DESVANTAGEM estatística de ${(winRate * 100).toFixed(1)}%`;
        }

        const yourHeroDetailsPrompt = formatHeroDetailsForPrompt(yourHeroDetails);
        const enemyHeroDetailsPrompt = formatHeroDetailsForPrompt(enemyHeroDetails);

        let consistencyInstruction = `Analise este confronto de forma objetiva, usando as habilidades e combos fornecidos para determinar o resultado.`;
        if (isSuggestedCounter) {
            consistencyInstruction = `PONTO CRÍTICO: ${yourHeroDetails.name} já foi identificado como um counter tático para ${enemyHeroDetails.name} em uma análise anterior. Sua principal tarefa é elaborar sobre ESSA VANTAGEM. A 'classification' DEVE ser 'VANTAGEM' ou 'ANULA'. Explique detalhadamente *por que* a vantagem existe, com base na interação direta das habilidades e combos, e como explorá-la. NÃO CONTRADIGA a análise anterior.`;
        }

        const systemPrompt = `Você é um analista de nível Mítico e engenheiro de jogo de Mobile Legends. Sua tarefa é analisar um confronto direto com precisão absoluta, tratando-o como um problema matemático e baseando-se nos dados de habilidades e combos fornecidos. Sua lógica deve ser impecável. Responda APENAS com um objeto JSON válido que siga o schema. Seja direto, preciso e use termos em português do Brasil.`;
        const userQuery = `
CONFRONTO DIRETO na lane ${lane}:

Meu Herói:
${yourHeroDetailsPrompt}

Herói Inimigo:
${enemyHeroDetailsPrompt}

Dados Estatísticos: Meu herói (${yourHeroDetails.name}) tem ${winRateDescription} contra ${enemyHeroDetails.name}.

INSTRUÇÕES:
1. ${consistencyInstruction}
2. Determine a 'classification' final ('ANULA', 'VANTAGEM', 'DESVANTAGEM', 'NEUTRO'). Use a análise teórica das habilidades e combos como fator decisivo.
3. Forneça uma 'detailedAnalysis'. Comece a análise com a mesma palavra da 'classification' para consistência. Explique o motivo e dê 2 dicas táticas diretas.
4. Recomende o melhor 'recommendedSpell' da lista [${spellList}].`;

        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userQuery,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: matchupResponseSchema,
                temperature: 0.1,
                thinkingConfig: { thinkingBudget: 0 }
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as DetailedMatchupPayload;
    } catch (error) {
        console.error("Erro ao chamar a API Gemini para análise de confronto:", error);
        throw new Error("Não foi possível carregar a análise detalhada da IA.");
    }
}