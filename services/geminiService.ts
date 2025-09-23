import { GoogleGenAI, Type } from "@google/genai";
import { Lane, Role, SpellSuggestion, MatchupClassification } from "../types";
import { ITEM_ICONS, SPELL_ICONS } from "../constants";

let ai: GoogleGenAI | null = null;

function getGenAIClient(): GoogleGenAI {
    if (ai) {
        return ai;
    }
    const apiKey = process.env.VITE_API_KEY || process.env.API_KEY;
    if (!apiKey) {
        throw new Error("A chave da API do Google não está configurada. A funcionalidade de IA está desativada.");
    }
    ai = new GoogleGenAI({ apiKey });
    return ai;
}

interface AnalysisPayload {
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
                    motivo: { type: Type.STRING, description: "Análise estratégica concisa e detalhada explicando por que este herói é um bom counter, considerando todas as habilidades e passivas." },
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
  potentialCounters: string[],
  selectedRole: Role,
  isTheoretical: boolean = false
): Promise<AnalysisPayload> {
    try {
        const genAI = getGenAIClient();
        const itemList = Object.keys(ITEM_ICONS).filter(item => item !== 'default').join(', ');
        const spellList = Object.keys(SPELL_ICONS).filter(spell => spell !== 'default').join(', ');
        const counterList = potentialCounters.join(', ');

        const systemPrompt = `Você é um analista de nível Mítico em Mobile Legends. Sua tarefa é fornecer uma análise tática profunda e holística. Considere todas as habilidades e passivas dos heróis envolvidos. Responda APENAS com um objeto JSON válido que siga o schema fornecido. Não se refira a si mesmo como uma IA. Forneça a análise de forma direta e factual, usando sempre termos e nomes de itens/feitiços em português do Brasil.`;
        
        let userQuery = '';
        const commonInstructions = `
1. Para cada herói escolhido:
   a. Forneça um 'motivo' tático detalhado, explicando como suas habilidades counteram ${enemyHeroName}.
   b. Forneça 1-2 'avisos' críticos, como habilidades do oponente que podem anular sua vantagem (ex: passiva de escudo da Hanabi) ou picos de poder que devem ser respeitados.
   c. Sugira 1 ou 2 'spells' (feitiços) ideais da lista [${spellList}].
2. Sugira 3 'sugestoesItens' de counter gerais da lista [${itemList}] que seriam eficazes contra o ${enemyHeroName}.`;

        if (isTheoretical) {
            userQuery = `Oponente: '${enemyHeroName}' na lane '${lane}'. Eu quero jogar com um herói da função '${selectedRole}'.
Não foram encontrados dados estatísticos. Baseado no seu conhecimento profundo, analise a lista de heróis da função '${selectedRole}': [${counterList}].
Escolha os 3 melhores counters TEÓRICOS para ${enemyHeroName} e siga as instruções abaixo.
${commonInstructions}`;
        } else {
            userQuery = `Oponente: '${enemyHeroName}' na lane '${lane}'. Eu quero jogar com um herói da função '${selectedRole}'.
Analise CADA UM dos seguintes heróis, que são counters estatísticos: [${counterList}], e siga as instruções abaixo.
${commonInstructions}`;
        }


        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userQuery,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: analysisResponseSchema,
                temperature: 0.2,
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

interface DetailedMatchupPayload {
    classification: MatchupClassification;
    detailedAnalysis: string;
    recommendedSpell: SpellSuggestion;
}

const matchupResponseSchema = {
    type: Type.OBJECT,
    properties: {
        classification: { 
            type: Type.STRING,
            description: "A classificação final do confronto: 'VANTAGEM', 'DESVANTAGEM', ou 'NEUTRO'. Baseie-se na análise teórica se os dados estatísticos forem neutros."
        },
        detailedAnalysis: {
            type: Type.STRING,
            description: "Análise tática concisa (3-4 frases). Comece com a mesma palavra da 'classification' para consistência. Explique o porquê e dê 2 dicas práticas sobre como jogar."
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
    yourHeroName: string,
    enemyHeroName: string,
    lane: Lane,
    winRate: number
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

        const systemPrompt = `Você é um analista de nível Mítico em Mobile Legends. Sua tarefa é analisar um confronto direto e fornecer conselhos táticos. Responda APENAS com um objeto JSON válido que siga o schema. Seja direto e lógico. Não se refira a si mesmo como uma IA. Forneça a análise de forma direta e factual, usando sempre termos e nomes de itens/feitiços em português do Brasil.`;
        const userQuery = `Confronto: ${yourHeroName} vs ${enemyHeroName} na lane ${lane}.
Meu herói (${yourHeroName}) tem ${winRateDescription}.

INSTRUÇÕES:
1. Determine a 'classification' final ('VANTAGEM', 'DESVANTAGEM', 'NEUTRO'). Se os dados estatísticos forem NEUTROS, você DEVE fazer uma análise teórica profunda das habilidades e passivas para decidir quem tem a vantagem. Não devolva 'NEUTRO' a menos que seja um confronto de pura habilidade.
2. Forneça uma 'detailedAnalysis'. Comece a análise com a mesma palavra da 'classification' para consistência. Explique o motivo e dê 2 dicas táticas.
3. Recomende o melhor 'recommendedSpell' da lista [${spellList}].`;

        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userQuery,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: matchupResponseSchema,
                temperature: 0.5,
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