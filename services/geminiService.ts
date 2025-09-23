import { GoogleGenAI, Type } from "@google/genai";
import { Lane } from "../types";
import { ITEM_ICONS, SPELL_ICONS } from "../constants";

// O cliente da IA será inicializado de forma preguiçosa para evitar falhas na inicialização.
let ai: GoogleGenAI | null = null;

/**
 * Obtém o cliente GoogleGenAI inicializado.
 * Lança um erro se a chave da API não estiver configurada no ambiente.
 * @returns Uma instância de GoogleGenAI.
 */
function getGenAIClient(): GoogleGenAI {
    if (ai) {
        return ai;
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        // Este erro será capturado pelos blocos try/catch nas funções de chamada.
        throw new Error("A chave da API do Google não está configurada. A funcionalidade de IA está desativada.");
    }
    
    ai = new GoogleGenAI({ apiKey });
    return ai;
}


interface AnalysisPayload {
  sugestoesHerois: {
    nome: string;
    motivo: string;
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

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        sugestoesHerois: {
            type: Type.ARRAY,
            description: "Lista de heróis sugeridos a partir da lista fornecida.",
            items: {
                type: Type.OBJECT,
                properties: {
                    nome: { type: Type.STRING, description: "Nome do herói, deve ser um da lista de potenciais counters." },
                    motivo: { type: Type.STRING, description: "Análise estratégica concisa e detalhada explicando por que este herói é um bom counter." },
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
                required: ["nome", "motivo", "spells"]
            }
        },
        sugestoesItens: {
            type: Type.ARRAY,
            description: "Lista de 3 itens de counter gerais para o confronto.",
            items: {
                type: Type.OBJECT,
                properties: {
                    nome: { type: Type.STRING, description: "Nome do item, deve ser um da lista de itens fornecida." },
                    motivo: { type: Type.STRING, description: "Motivo pelo qual este item é eficaz contra o oponente." }
                },
                required: ["nome", "motivo"]
            }
        }
    },
    required: ["sugestoesHerois", "sugestoesItens"]
};

export async function getStrategicAnalysis(
  enemyHeroName: string,
  lane: Lane,
  potentialCounters: string[]
): Promise<AnalysisPayload> {
    try {
        const genAI = getGenAIClient(); // A inicialização ocorre aqui.
        const itemList = Object.keys(ITEM_ICONS).filter(item => item !== 'default').join(', ');
        const spellList = Object.keys(SPELL_ICONS).filter(spell => spell !== 'default').join(', ');
        const counterList = potentialCounters.join(', ');

        const systemPrompt = `Você é um analista de nível mítico em Mobile Legends: Bang Bang. Sua tarefa é fornecer uma análise tática completa para um confronto de lane. Responda APENAS com um objeto JSON válido que siga o schema fornecido. Seja conciso e tático nas suas justificativas.`;
        const userQuery = `Oponente: '${enemyHeroName}' na lane '${lane}'.
Analise CADA UM dos seguintes heróis estatisticamente fortes contra ele: [${counterList}].
1. Para cada herói na lista:
   a. Forneça um 'motivo' tático e conciso, explicando como suas habilidades counteram o oponente.
   b. Sugira 1 ou 2 'spells' (feitiços) ideais da lista [${spellList}], explicando o motivo da escolha.
2. Sugira 3 'sugestoesItens' de counter gerais da lista [${itemList}] que seriam eficazes contra o ${enemyHeroName}.
Use os nomes dos itens e feitiços EXATAMENTE como fornecidos nas listas.`;

        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userQuery,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.5,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedResult = JSON.parse(jsonText) as AnalysisPayload;

        if (!parsedResult.sugestoesHerois || !parsedResult.sugestoesItens) {
            throw new Error("Formato de resposta da IA inválido.");
        }

        return parsedResult;
    } catch (error) {
        console.error("Erro ao chamar a API Gemini:", error);
        const errorMessage = error instanceof Error ? error.message : "Não foi possível gerar a análise estratégica da IA. Tente novamente.";
        throw new Error(errorMessage);
    }
}


export async function getMatchupAnalysis(
    yourHeroName: string,
    enemyHeroName: string,
    lane: Lane
): Promise<string> {
    try {
        const genAI = getGenAIClient(); // A inicialização ocorre aqui.
        const systemPrompt = `Você é um analista de nível mítico em Mobile Legends. Dê uma dica estratégica curta (máximo 2 frases) para o confronto direto entre dois heróis numa lane específica. Foque na condição de vitória. Responda apenas com o texto da dica.`;
        const userQuery = `Meu herói: ${yourHeroName}. Oponente: ${enemyHeroName}. Lane: ${lane}. Como devo jogar este confronto?`;

        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userQuery,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.7,
                thinkingConfig: { thinkingBudget: 0 }
            },
        });

        return response.text.trim();
    } catch (error) {
        console.error("Erro ao chamar a API Gemini para análise de confronto:", error);
        return "Não foi possível carregar a análise da IA.";
    }
}
