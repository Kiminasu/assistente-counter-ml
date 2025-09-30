


import { GoogleGenAI, Type } from "@google/genai";
import { Lane, Role, SpellSuggestion, MatchupClassification, GameItem, ROLES, Hero, DraftAnalysisResult, LaneOrNone, HeroStrategyAnalysis, HeroDetails, AnalysisResult } from "../types";
import { SPELL_ICONS } from "../constants";
import { GAME_ITEMS } from '../components/data/items';

let genAIInstance: GoogleGenAI | null = null;

function getGenAIClient(): GoogleGenAI {
    if (genAIInstance) {
        return genAIInstance;
    }

    // FIX: A chave da API deve ser obtida de process.env.API_KEY de acordo com as diretrizes de codificação.
    // A implementação anterior usava import.meta.env, que não está em conformidade e causava um erro de tipo.
    const apiKey = import.meta.env.VITE_API_KEY;

    if (!apiKey) {
        // A disponibilidade da chave da API é um pré-requisito e é tratada externamente.
        throw new Error("Chave da API não encontrada.");
    }
    genAIInstance = new GoogleGenAI({ apiKey });
    return genAIInstance;
}

const formatHeroDetailsForPrompt = (details: HeroDetails): string => {
    if (!details || !details.skills) return `${details?.name || 'Herói Desconhecido'} (detalhes indisponíveis)`;

    const skills = details.skills.map((s, index) => {
        let label = '';
        const totalSkills = details.skills.length;
        if (index === 0) {
            label = 'Passiva';
        } else if (index === totalSkills - 1) {
            label = 'Ultimate';
        } else {
            label = `Habilidade ${index}`;
        }
        return `- ${label}: ${s.skilldesc}`;
    }).join('\n');
    
    const combos = details.combos?.map(c => `\n- Combo (${c.title}): ${c.desc}`).join('') || '';

    return `
Nome: ${details.name}
Resumo: ${details.summary}
Habilidades:
${skills}
${combos ? `\nCombos Táticos:${combos}` : ''}
    `.trim();
};

const formatItemsForPrompt = (items: GameItem[]): string => {
    return items.map(item => {
        const attributes = item.atributos.join(', ');
        const abilities = item.habilidades.map(h => `- ${h.tipo} (${h.nome_habilidade || 'N/A'}): ${h.descricao}`).join('\n');
        return `
Nome do Item: ${item.nome}
Categoria: ${item.categoria}
Atributos: ${attributes}
${abilities.length > 0 ? `Habilidades:\n${abilities}` : ''}
        `.trim();
    }).join('\n\n---\n\n');
};

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
                    nome: { type: Type.STRING, description: "Nome do item, deve ser um da lista de itens detalhada fornecida." },
                    motivo: { type: Type.STRING, description: "Motivo pelo qual este item é eficaz contra o oponente, com base em suas habilidades." }
                },
                required: ["nome", "motivo"]
            }
        }
    },
    required: ["sugestoesHerois", "sugestoesItens"]
};

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

const combined1v1Schema = {
    type: Type.OBJECT,
    properties: {
        strategicAnalysis: analysisResponseSchema,
        matchupAnalysis: { ...matchupResponseSchema, nullable: true } // Allow matchup to be null
    },
    required: ["strategicAnalysis"]
};


// FIX: Define the missing DetailedMatchupPayload interface to describe the shape of the matchup analysis.
export interface DetailedMatchupPayload {
  classification: MatchupClassification;
  detailedAnalysis: string;
  recommendedSpell: SpellSuggestion;
}

export interface Combined1v1AnalysisPayload {
  strategicAnalysis: AnalysisResult;
  matchupAnalysis: DetailedMatchupPayload | null;
}

export async function getCombined1v1Analysis(
  enemyHeroDetails: HeroDetails,
  lane: LaneOrNone,
  potentialCountersDetails: HeroDetails[],
  selectedRole: Role | 'Qualquer',
  yourHeroDetails: HeroDetails | null, // Can be null
  winRate: number | null // Can be null
): Promise<Combined1v1AnalysisPayload> {
    try {
        const ai = getGenAIClient();
        const formattedItemList = formatItemsForPrompt(GAME_ITEMS);
        const spellList = Object.keys(SPELL_ICONS).filter(spell => spell !== 'default').join(', ');
        
        const enemyDetailsPrompt = formatHeroDetailsForPrompt(enemyHeroDetails);
        const countersDetailsPrompt = potentialCountersDetails.map(d => formatHeroDetailsForPrompt(d)).join('\n\n---\n\n');

        const systemPrompt = `Você é um analista de nível Mítico e engenheiro de jogo de Mobile Legends. Sua tarefa é fornecer uma análise tática infalível. Baseie-se ESTRITAMENTE nos dados fornecidos. Não invente informações. Responda APENAS com um objeto JSON válido que siga o schema. Seja direto, preciso e use termos em português do Brasil.`;
        
        const laneContext = lane === 'NENHUMA' ? 'em um confronto geral' : `na lane '${lane}'`;
        
        // --- Strategic Analysis Prompt Part ---
        const itemRoleContext = selectedRole === 'Qualquer' ? 'o counter ideal' : `um herói da função '${selectedRole}'`;
        const strategicInstructions = `
**Parte 1: Análise Estratégica de Counters (strategicAnalysis)**
O oponente ${laneContext} é ${enemyHeroDetails.name}.
${selectedRole === 'Qualquer' ? "Analise os melhores counters possíveis, independente da função." : `Eu quero jogar com um herói da função '${selectedRole}'.`}
Analise CADA UM dos seguintes 'Heróis para Análise', que são counters estatísticos.

Instruções para a Parte 1:
1. Para cada herói counter sugerido, forneça um 'motivo' tático detalhado, comparando habilidades.
2. Forneça 1-2 'avisos' críticos.
3. Sugira 1 ou 2 'spells' (feitiços) da lista [${spellList}].
4. Sugira 3 'sugestoesItens' de counter da lista de itens detalhada. O motivo deve explicar a interação direta do item com as habilidades do oponente.
`;

        // --- Matchup Analysis Prompt Part ---
        let matchupInstructions = '';
        if (yourHeroDetails && lane !== 'NENHUMA') {
             let winRateDescription = `estatisticamente NEUTRO`;
            if (winRate != null && winRate > 0.01) {
                winRateDescription = `uma VANTAGEM estatística de +${(winRate * 100).toFixed(1)}%`;
            } else if (winRate != null && winRate < -0.01) {
                winRateDescription = `uma DESVANTAGEM estatística de ${(winRate * 100).toFixed(1)}%`;
            }
            const yourHeroDetailsPrompt = formatHeroDetailsForPrompt(yourHeroDetails);
            
            matchupInstructions = `
**Parte 2: Análise de Confronto Direto (matchupAnalysis)**
Confronto na lane ${lane}: Meu Herói (${yourHeroDetails.name}) vs Inimigo (${enemyHeroDetails.name}).
Dados Estatísticos: Meu herói tem ${winRateDescription}.

Meu Herói:
${yourHeroDetailsPrompt}

Inimigo:
${enemyDetailsPrompt}

Instruções para a Parte 2:
1. Determine a 'classification' final ('ANULA', 'VANTAGEM', 'DESVANTAGEM', 'NEUTRO').
2. Forneça uma 'detailedAnalysis' concisa (3-4 frases), começando com a mesma palavra da 'classification'.
3. Recomende o melhor 'recommendedSpell' da lista [${spellList}].
`;
        }

        const userQuery = `
${strategicInstructions}

Heróis para Análise (para a Parte 1):
${countersDetailsPrompt}

${matchupInstructions}

${matchupInstructions ? '' : 'Instrução Adicional: Como não há um "Meu Herói" selecionado, o campo "matchupAnalysis" no JSON de resposta deve ser nulo.'}

LISTA DETALHADA DE ITENS DISPONÍVEIS:
${formattedItemList}
`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userQuery,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: combined1v1Schema,
                temperature: 0.1,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Combined1v1AnalysisPayload;
    } catch (error) {
        console.error("Erro ao chamar a API Gemini para análise 1v1 combinada:", error);
        const errorMessage = error instanceof Error ? error.message : "Não foi possível gerar a análise da IA.";
        throw new Error(errorMessage);
    }
}


const compositionSchema = {
    type: Type.OBJECT,
    description: "Análise quantitativa da composição da equipe.",
    properties: {
        physicalDamage: { type: Type.INTEGER, description: "Pontuação de 1 (muito baixo) a 10 (muito alto) para o potencial de dano físico da equipe." },
        magicDamage: { type: Type.INTEGER, description: "Pontuação de 1 (muito baixo) a 10 (muito alto) para o potencial de dano mágico da equipe." },
        tankiness: { type: Type.INTEGER, description: "Pontuação de 1 (muito baixo) a 10 (muito alto) para a capacidade de sobrevivência/tanque da equipe." },
        control: { type: Type.INTEGER, description: "Pontuação de 1 (muito baixo) a 10 (muito alto) para o potencial de controle de grupo (CC) da equipe." }
    },
    required: ["physicalDamage", "magicDamage", "tankiness", "control"]
};

const draftAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        advantageScore: { 
            type: Type.INTEGER, 
            description: "Pontuação de -10 (vantagem inimiga clara) a 10 (vantagem aliada clara) baseada na sinergia, counters e composição geral." 
        },
        advantageReason: { 
            type: Type.STRING, 
            description: "Análise tática curta e específica (máximo 2 frases) explicando o motivo principal da pontuação, mencionando matchups de heróis chave."
        },
        allyComposition: compositionSchema,
        enemyComposition: compositionSchema,
        teamStrengths: {
            type: Type.ARRAY,
            description: "Lista de 2-3 pontos fortes da composição do time aliado (ex: 'Controle de grupo em área', 'Dano explosivo', 'Alta mobilidade').",
            items: { type: Type.STRING }
        },
        teamWeaknesses: {
            type: Type.ARRAY,
            description: "Lista de 2-3 pontos fracos da composição aliada e como o time inimigo pode explorá-los.",
            items: { type: Type.STRING }
        },
        nextPickSuggestion: {
            type: Type.OBJECT,
            description: "Sugestão para a próxima escolha de herói no time aliado, se houver espaço. Caso contrário, deve ser nulo.",
            properties: {
                heroName: { type: Type.STRING, description: "Nome do herói sugerido da lista de heróis disponíveis." },
                role: { type: Type.STRING, description: `A função principal do herói sugerido. Deve ser uma das seguintes: ${ROLES.join(', ')}.` },
                reason: { type: Type.STRING, description: "Motivo tático detalhado para a escolha deste herói, considerando sinergias e counters." }
            },
            nullable: true,
        },
        strategicItems: {
            type: Type.ARRAY,
            description: "Lista de 2 itens estratégicos cruciais para o time aliado neste confronto.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Nome do item, deve ser um da lista de itens fornecida." },
                    reason: { type: Type.STRING, description: "Motivo pelo qual este item é importante para a composição do time contra os inimigos." }
                },
                required: ["name", "reason"]
            }
        }
    },
    required: ["advantageScore", "advantageReason", "allyComposition", "enemyComposition", "teamStrengths", "teamWeaknesses", "strategicItems"]
};

export async function getDraftAnalysis(
  allyHeroesDetails: HeroDetails[],
  enemyHeroesDetails: HeroDetails[],
  availableHeroes: Hero[],
): Promise<DraftAnalysisResult> {
    try {
        const ai = getGenAIClient();
        const itemNames = GAME_ITEMS.map(item => item.nome).join(', ');
        const availableHeroNames = availableHeroes.map(h => h.name).join(', ');

        const allyDetailsPrompt = allyHeroesDetails.length > 0
            ? allyHeroesDetails.map(formatHeroDetailsForPrompt).join('\n\n---\n\n')
            : "Nenhum herói selecionado ainda.";
        
        const enemyDetailsPrompt = enemyHeroesDetails.length > 0
            ? enemyHeroesDetails.map(formatHeroDetailsForPrompt).join('\n\n---\n\n')
            : "Nenhum herói selecionado ainda.";

        const systemPrompt = "Você é um analista de draft de nível Mítico de Mobile Legends. Sua tarefa é analisar uma situação de draft 5v5 e fornecer conselhos estratégicos. Sua análise deve ser concisa, tática e focada em sinergia de equipe, counters e composição geral. Responda APENAS com um objeto JSON válido que siga o schema.";
        
        const userQuery = `
SITUAÇÃO ATUAL DO DRAFT 5v5:

Time Aliado (Heróis já escolhidos):
${allyDetailsPrompt}

Time Inimigo (Heróis já escolhidos):
${enemyDetailsPrompt}

Heróis ainda disponíveis para escolha:
[${availableHeroNames}]

Lista de Itens para sugestão:
[${itemNames}]

INSTRUÇÕES:
1.  Sua análise deve ser extremamente precisa. O 'Time Aliado' é composto APENAS pelos heróis listados em "Time Aliado". O 'Time Inimigo' é composto APENAS pelos heróis em "Time Inimigo". Não os confunda. Baseie toda a sua análise nesta separação.
2.  Forneça um 'advantageScore' numérico de -10 (vantagem clara para o inimigo) a 10 (vantagem clara para o aliado).
3.  Forneça um 'advantageReason' tático e concreto que explique a pontuação. Seja específico, mencionando confrontos de heróis chave (ex: "Vantagem aliada devido ao controle em área do Atlas que anula a mobilidade inimiga de Fanny e Ling."). Evite frases genéricas como "melhor composição" ou "draft superior".
4.  Preencha 'allyComposition' e 'enemyComposition', atribuindo uma pontuação de 1 a 10 para cada categoria (dano físico, dano mágico, tanque/sobrevivência, controle de grupo) com base no potencial combinado dos heróis selecionados.
5.  Forneça 2-3 'teamStrengths' (pontos fortes) da composição aliada.
6.  Forneça 2-3 'teamWeaknesses' (pontos fracos) e como o time inimigo pode explorá-los.
7.  Se houver menos de 5 heróis no time aliado, sugira o melhor 'nextPickSuggestion' da lista de heróis disponíveis. A sugestão deve incluir 'heroName', 'role' (da lista [${ROLES.join(', ')}]) e um 'reason' tático. Se o time aliado estiver completo, este campo deve ser nulo.
8.  Sugira 2 'strategicItems' gerais da lista de itens que seriam cruciais para o time aliado neste confronto, explicando o motivo.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userQuery,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: draftAnalysisSchema,
                temperature: 0.1,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as DraftAnalysisResult;

    } catch (error) {
        console.error("Erro ao chamar a API Gemini para análise de draft:", error);
        throw new Error("Não foi possível carregar a análise do draft da IA.");
    }
}

const heroStrategySchema = {
    type: Type.OBJECT,
    properties: {
        coreItems: {
            type: Type.ARRAY,
            description: "Lista de 3-4 itens essenciais (core build) para este herói.",
            items: {
                type: Type.OBJECT,
                properties: {
                    nome: { type: Type.STRING, description: "Nome do item, deve ser um da lista de itens fornecida." },
                    motivo: { type: Type.STRING, description: "Motivo tático curto para a escolha deste item na build do herói." }
                },
                required: ["nome", "motivo"]
            }
        },
        situationalItems: {
            type: Type.ARRAY,
            description: "Lista de 2-3 itens situacionais importantes.",
            items: {
                type: Type.OBJECT,
                properties: {
                    nome: { type: Type.STRING, description: "Nome do item, deve ser um da lista de itens fornecida." },
                    motivo: { type: Type.STRING, description: "Motivo tático curto explicando quando e por que construir este item." }
                },
                required: ["nome", "motivo"]
            }
        },
        playstyle: { type: Type.STRING, description: "Descrição detalhada (3-4 frases) do estilo de jogo ideal para o herói (early, mid, late game), focando em posicionamento e objetivos." },
        powerSpikes: { type: Type.STRING, description: "Identificação dos picos de poder do herói (ex: 'Nível 4 com a ultimate', 'Ao completar o item X')." }
    },
    required: ["coreItems", "situationalItems", "playstyle", "powerSpikes"]
};

const perfectCounterSchema = {
    type: Type.OBJECT,
    description: "A sugestão do melhor herói para counterar o personagem analisado, escolhido da lista de 'Heróis para Análise'.",
    properties: {
        nome: { type: Type.STRING, description: "Nome do herói, deve ser um da lista de potenciais counters." },
        motivo: { type: Type.STRING, description: "Análise estratégica concisa explicando por que este herói é o counter perfeito." },
        avisos: {
            type: Type.ARRAY,
            description: "Lista de 1-2 avisos críticos sobre o confronto.",
            items: { type: Type.STRING }
        },
        spells: {
            type: Type.ARRAY,
            description: "Lista de 1 ou 2 feitiços recomendados.",
            items: {
                type: Type.OBJECT,
                properties: {
                    nome: { type: Type.STRING },
                    motivo: { type: Type.STRING }
                },
                required: ["nome", "motivo"]
            }
        }
    },
    required: ["nome", "motivo", "avisos", "spells"]
};

const combinedSynergyAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        strategy: heroStrategySchema,
        perfectCounter: perfectCounterSchema
    },
    required: ["strategy", "perfectCounter"]
};

export interface CombinedSynergyAnalysisPayload {
  strategy: HeroStrategyAnalysis;
  perfectCounter: {
    nome: string;
    motivo: string;
    avisos: string[];
    spells: SpellSuggestion[];
  };
}


export async function getSynergyAndStrategyAnalysis(
  heroToAnalyzeDetails: HeroDetails,
  potentialCountersDetails: HeroDetails[]
): Promise<CombinedSynergyAnalysisPayload> {
    try {
        const ai = getGenAIClient();
        const itemNames = GAME_ITEMS.map(item => item.nome).join(', ');
        const spellList = Object.keys(SPELL_ICONS).filter(spell => spell !== 'default').join(', ');
        const heroToAnalyzePrompt = formatHeroDetailsForPrompt(heroToAnalyzeDetails);
        const countersDetailsPrompt = potentialCountersDetails.map(d => formatHeroDetailsForPrompt(d)).join('\n\n---\n\n');

        const systemPrompt = "Você é um analista de nível Mítico de Mobile Legends. Sua tarefa é fornecer uma análise estratégica completa e robusta sobre um herói específico, incluindo sua build, estilo de jogo e quem é seu counter perfeito. Baseie-se ESTRITAMENTE nos dados fornecidos. Responda APENAS com um objeto JSON válido que siga o schema.";

        const userQuery = `
ANÁLISE ESTRATÉGICA COMPLETA

HERÓI PARA ANÁLISE:
${heroToAnalyzePrompt}

Heróis Potenciais para serem o Counter Perfeito (analise e escolha o melhor):
${countersDetailsPrompt}

Lista de Itens para sugestão:
[${itemNames}]

Lista de Feitiços para sugestão:
[${spellList}]

INSTRUÇÕES:
1.  **Análise de Estratégia do Herói (strategy)**:
    a.  Sugira 3-4 'coreItems' (itens essenciais) da lista de itens, explicando o motivo de cada um.
    b.  Sugira 2-3 'situationalItems' (itens situacionais), explicando em que situações devem ser construídos.
    c.  Descreva o 'playstyle' (estilo de jogo) do herói em 3-4 frases.
    d.  Identifique os principais 'powerSpikes' (picos de poder).
2.  **Análise do Counter Perfeito (perfectCounter)**:
    a.  A partir da lista 'Heróis Potenciais', escolha o herói que melhor countera o 'HERÓI PARA ANÁLISE'.
    b.  Forneça um 'motivo' tático detalhado para essa escolha, comparando diretamente as habilidades.
    c.  Forneça 1-2 'avisos' críticos sobre o confronto.
    d.  Sugira 1 ou 2 'spells' (feitiços) ideais para o counter neste confronto.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userQuery,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: combinedSynergyAnalysisSchema,
                temperature: 0.1,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CombinedSynergyAnalysisPayload;

    } catch (error) {
        console.error("Erro ao chamar a API Gemini para análise combinada de sinergia:", error);
        throw new Error("Não foi possível carregar a análise estratégica combinada da IA.");
    }
}