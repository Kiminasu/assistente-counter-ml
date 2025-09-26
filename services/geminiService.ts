import { GoogleGenAI, Type } from "@google/genai";
import { Lane, Role, SpellSuggestion, MatchupClassification, GameItem, ROLES, Hero, DraftAnalysisResult, LaneOrNone, HeroStrategyAnalysis, HeroDetails, KeySynergy, SynergyAnalysisPayload } from "../types";
import { SPELL_ICONS } from "../constants";
import { GAME_ITEMS } from '../components/data/items';

let genAIInstance: GoogleGenAI | null = null;

function getGenAIClient(): GoogleGenAI {
    if (genAIInstance) {
        return genAIInstance;
    }

    // The API key is retrieved from the VITE_API_KEY environment variable,
    // which is common for projects built with Vite and deployed on platforms like Vercel or Netlify.
    const apiKey = process.env.VITE_API_KEY;

    if (!apiKey) {
        // Clear error message to guide the user in configuration.
        throw new Error("A chave da API do Google (VITE_API_KEY) não foi encontrada. Certifique-se de que a variável de ambiente está configurada corretamente nas configurações do seu projeto na Vercel ou Netlify.");
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
                    nome: { type: Type.STRING, description: "Nome do item, deve ser um da lista de itens detalhada fornecida." },
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
  lane: LaneOrNone,
  potentialCountersDetails: HeroDetails[],
  selectedRole: Role | 'Qualquer',
  isTheoretical: boolean = false
): Promise<AnalysisPayload> {
    try {
        const ai = getGenAIClient();
        const formattedItemList = formatItemsForPrompt(GAME_ITEMS);
        const spellList = Object.keys(SPELL_ICONS).filter(spell => spell !== 'default').join(', ');
        
        const enemyDetailsPrompt = formatHeroDetailsForPrompt(enemyHeroDetails);
        const countersDetailsPrompt = potentialCountersDetails.map(d => formatHeroDetailsForPrompt(d)).join('\n\n---\n\n');

        const systemPrompt = `Você é um analista de nível Mítico e engenheiro de jogo de Mobile Legends. Sua tarefa é fornecer uma análise tática infalível, tratando cada confronto como um problema matemático. Analise variáveis como dano, escalonamento, tempos de recarga e combos de habilidades para formular conclusões lógicas. Responda APENAS com um objeto JSON válido que siga o schema. Seja direto, preciso e use termos em português do Brasil.`;
        
        const laneContext = lane === 'NENHUMA' ? 'em um confronto geral' : `na lane '${lane}'`;
        const itemRoleContext = selectedRole === 'Qualquer' ? 'o counter ideal' : `um herói da função '${selectedRole}'`;

        const commonInstructions = `
1. Para cada herói counter sugerido:
   a. Forneça um 'motivo' tático detalhado. Sua análise deve comparar diretamente as habilidades chave do counter com as do oponente, mencionando a numeração da habilidade (ex: Habilidade 1, Ultimate) para ser didático. Sua análise DEVE considerar: dano base, escalonamento de dano (ex: +80% do Ataque Físico), e tipo de dano (Físico, Mágico, Verdadeiro) de CADA habilidade para determinar a eficácia do counter. Exemplo: 'A Habilidade 2 do counter permite escapar/anular o combo da Eudora porque...'. Foque em anulação de habilidades, timings críticos e vantagens de posicionamento.
   b. Forneça 1-2 'avisos' críticos, como habilidades do oponente que anulam sua vantagem ou combos que você precisa evitar.
   c. Sugira 1 ou 2 'spells' (feitiços) ideais da lista [${spellList}].
2. Sugira 3 'sugestoesItens' de counter da lista de itens detalhada abaixo. As suas escolhas devem ser as mais eficazes contra as habilidades específicas de ${enemyHeroDetails.name} E APROPRIADAS para ${itemRoleContext} ${laneContext}. No 'motivo', explique a interação direta do item com as habilidades do oponente. Exemplo: 'Couraça Antiga reduz o dano da habilidade Y do oponente em X%'.`;
        
        const roleQueryContext = selectedRole === 'Qualquer'
            ? "Analise os melhores counters possíveis, independente da função deles."
            : `Eu quero jogar com um herói da função '${selectedRole}'.`;
        
        const analysisTypeContext = isTheoretical
            ? "Os dados estatísticos são limitados. Portanto, analise CADA UM dos heróis da lista a seguir, que foram pré-selecionados por seu alto potencial tático, e determine os melhores counters."
            : "Analise CADA UM dos seguintes heróis, que são counters estatísticos, e siga as instruções.";
        
        const criticalRule = lane !== 'NENHUMA' 
            ? "REGRA CRÍTICA: É OBRIGATÓRIO que a sua primeira sugestão de herói seja um que ANULE o oponente. A anulação deve ser baseada na neutralização direta de habilidades chave, não apenas em vantagem estatística. Depois, inclua outros heróis com VANTAGEM geral."
            : "";

        const userQuery = `Oponente ${laneContext}:\n${enemyDetailsPrompt}\n\n${roleQueryContext}\n${analysisTypeContext}\n\nHeróis para Análise:\n${countersDetailsPrompt}\n\n${commonInstructions}\n\n${criticalRule}\n\nLISTA DETALHADA DE ITENS DISPONÍVEIS:\n${formattedItemList}`;

        // FIX: Removed thinkingConfig to enable thinking for higher quality analysis, as per guidelines for non-low-latency tasks.
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userQuery,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: analysisResponseSchema,
                temperature: 0.1,
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
    winRate: number
): Promise<DetailedMatchupPayload> {
    try {
        const ai = getGenAIClient();
        const spellList = Object.keys(SPELL_ICONS).filter(spell => spell !== 'default').join(', ');
        
        let winRateDescription = `estatisticamente NEUTRO (ou sem dados)`;
        if (winRate > 0.01) {
            winRateDescription = `uma VANTAGEM estatística de +${(winRate * 100).toFixed(1)}%`;
        } else if (winRate < -0.01) {
            winRateDescription = `uma DESVANTAGEM estatística de ${(winRate * 100).toFixed(1)}%`;
        }

        const yourHeroDetailsPrompt = formatHeroDetailsForPrompt(yourHeroDetails);
        const enemyHeroDetailsPrompt = formatHeroDetailsForPrompt(enemyHeroDetails);

        const consistencyInstruction = `Analise este confronto de forma objetiva, usando as habilidades e combos fornecidos para determinar o resultado.`;
        
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
2. Determine a 'classification' final ('ANULA', 'VANTAGEM', 'DESVANTAGEM', 'NEUTRO'). Use a análise teórica das habilidades e combos como fator decisivo. Sua 'detailedAnalysis' DEVE se basear na interação das habilidades, mencionando a numeração da habilidade (ex: Habilidade 1, Ultimate) para ser didático, e incluir dano base, escalonamento, tipo de dano e tempos de recarga.
3. Forneça uma 'detailedAnalysis'. Comece a análise com a mesma palavra da 'classification' para consistência. Explique o motivo e dê 2 dicas táticas diretas.
4. Recomende o melhor 'recommendedSpell' da lista [${spellList}].`;

        // FIX: Removed thinkingConfig to enable thinking for higher quality analysis, as per guidelines for non-low-latency tasks.
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userQuery,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: matchupResponseSchema,
                temperature: 0.1,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as DetailedMatchupPayload;
    } catch (error) {
        console.error("Erro ao chamar a API Gemini para análise de confronto:", error);
        throw new Error("Não foi possível carregar a análise detalhada da IA.");
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
                temperature: 0.2,
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

export async function getHeroStrategyAnalysis(heroDetails: HeroDetails): Promise<HeroStrategyAnalysis> {
    try {
        const ai = getGenAIClient();
        const itemNames = GAME_ITEMS.map(item => item.nome).join(', ');
        const heroDetailsPrompt = formatHeroDetailsForPrompt(heroDetails);

        const systemPrompt = "Você é um analista de nível Mítico de Mobile Legends especializado em estratégia de heróis. Sua tarefa é fornecer uma análise concisa e tática sobre como jogar com um herói específico. Responda APENAS com um objeto JSON válido que siga o schema.";

        const userQuery = `
HERÓI PARA ANÁLISE:
${heroDetailsPrompt}

Lista de Itens para sugestão:
[${itemNames}]

INSTRUÇÕES:
1. Analise o herói e suas habilidades para determinar a melhor estratégia.
2. Sugira 3-4 'coreItems' (itens essenciais) da lista, explicando o motivo de cada um.
3. Sugira 2-3 'situationalItems' (itens situacionais), explicando em que situações devem ser construídos.
4. Descreva o 'playstyle' (estilo de jogo) do herói em 3-4 frases, cobrindo as fases do jogo.
5. Identifique os principais 'powerSpikes' (picos de poder) do herói.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userQuery,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: heroStrategySchema,
                temperature: 0.2,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as HeroStrategyAnalysis;

    } catch (error) {
        console.error("Erro ao chamar a API Gemini para análise de estratégia do herói:", error);
        throw new Error("Não foi possível carregar a análise estratégica da IA.");
    }
}


const synergyAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        statisticsAnalysis: { type: Type.STRING, description: "Análise geral do herói com base em seu perfil e estatísticas (dano, controle, mobilidade). Identifique seu papel principal na equipe." },
        strengths: {
            type: Type.ARRAY,
            description: "Lista de 2-3 pontos fortes principais do herói.",
            items: { type: Type.STRING }
        },
        weaknesses: {
            type: Type.ARRAY,
            description: "Lista de 2-3 pontos fracos ou vulnerabilidades do herói.",
            items: { type: Type.STRING }
        },
        keySynergies: {
            type: Type.ARRAY,
            description: "Análise de 2 sinergias chave com os aliados fornecidos.",
            items: {
                type: Type.OBJECT,
                properties: {
                    heroName: { type: Type.STRING, description: "Nome do herói aliado." },
                    reason: { type: Type.STRING, description: "Explicação detalhada de como as habilidades dos dois heróis se complementam." }
                },
                required: ["heroName", "reason"]
            }
        },
        counterStrategy: { type: Type.STRING, description: "Estratégia geral sobre como o herói deve se posicionar e usar suas habilidades para counterar os oponentes listados em 'Forte Contra'." }
    },
    required: ["statisticsAnalysis", "strengths", "weaknesses", "keySynergies", "counterStrategy"]
};

export async function getSynergyAnalysis(
    selectedHero: HeroDetails,
    allies: HeroDetails[],
    strongAgainst: HeroDetails[]
): Promise<SynergyAnalysisPayload> {
    try {
        const ai = getGenAIClient();
        const selectedHeroPrompt = formatHeroDetailsForPrompt(selectedHero);
        const alliesPrompt = allies.map(formatHeroDetailsForPrompt).join('\n\n---\n\n');
        const strongAgainstPrompt = strongAgainst.map(formatHeroDetailsForPrompt).join('\n\n---\n\n');

        const systemPrompt = "Você é um analista de nível Mítico de Mobile Legends, especializado em sinergias e estratégias de equipe. Sua análise deve ser tática, objetiva e baseada nas habilidades fornecidas. Responda APENAS com um objeto JSON válido que siga o schema.";

        const userQuery = `
HERÓI SELECIONADO:
${selectedHeroPrompt}

ALIADOS POTENCIAIS (Bons Aliados):
${alliesPrompt}

OPONENTES (Forte Contra):
${strongAgainstPrompt}

INSTRUÇÕES:
1. Forneça uma 'statisticsAnalysis' do Herói Selecionado, descrevendo seu papel na equipe (ex: iniciador, dano em área, etc.).
2. Liste 2-3 'strengths' (pontos fortes) e 'weaknesses' (pontos fracos) claros.
3. Para 'keySynergies', escolha os 2 melhores aliados da lista e explique detalhadamente a sinergia entre suas habilidades.
4. Descreva uma 'counterStrategy' geral sobre como o Herói Selecionado pode usar suas vantagens para dominar os oponentes listados.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userQuery,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: synergyAnalysisSchema,
                temperature: 0.2,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as SynergyAnalysisPayload;

    } catch (error) {
        console.error("Erro ao chamar a API Gemini para análise de sinergia:", error);
        throw new Error("Não foi possível carregar a análise de sinergia da IA.");
    }
}