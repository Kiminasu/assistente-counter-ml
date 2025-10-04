
import { Lane, Role, SpellSuggestion, MatchupClassification, GameItem, ROLES, Hero, DraftAnalysisResult, LaneOrNone, HeroStrategyAnalysis, HeroDetails, AnalysisResult } from "../types";

// Os dados do item são agora incorporados diretamente para remover as dependências de ficheiros de frontend.
const GAME_ITEMS: GameItem[] = [
  {
    "id": 1,
    "nome": "Couraça Antiga",
    "preco": 2170,
    "categoria": "Defesa",
    "atributos": [
      "+920 HP",
      "+40 Defesa Física",
      "+4 Regeneração de HP"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Deter",
        "descricao": "Ao ser atingido por uma habilidade, reduz o Dano Físico do atacante em 6% por 2 segundos (este efeito acumula até 3 vezes)."
      }
    ]
  },
  {
    "id": 2,
    "nome": "Botas Arcanas",
    "preco": 690,
    "categoria": "Movimento",
    "atributos": [
      "+40 Velocidade de Movimento",
      "+10 Penetração Mágica"
    ],
    "habilidades": []
  },
  {
    "id": 3,
    "nome": "Cinto de Ares",
    "preco": 900,
    "categoria": "Defesa",
    "atributos": [
      "+770 HP"
    ],
    "habilidades": []
  },
  {
    "id": 4,
    "nome": "Escudo de Atena",
    "preco": 2150,
    "categoria": "Defesa",
    "atributos": [
      "+900 HP",
      "+48 Defesa Mágica",
      "+2 Regeneração de HP"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Escudo",
        "descricao": "Ao receber Dano Mágico, ganha 25% de Redução de Dano Mágico por 3 segundos. Recupera este efeito 5 segundos após sair de combate."
      }
    ]
  },
  {
    "id": 5,
    "nome": "Lâmina do Azure",
    "preco": 600,
    "categoria": "Dano Mágico",
    "atributos": [
      "+25 Regeneração de Mana",
      "+5% Redução de Recarga"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Julgamento",
        "descricao": "Após usar uma habilidade, o próximo Ataque Básico em 3 segundos causa 50 de Dano Verdadeiro extra (1.5s de recarga)."
      }
    ]
  },
  {
    "id": 6,
    "nome": "Fúria do Berserker",
    "preco": 2390,
    "categoria": "Dano Físico",
    "atributos": [
      "+65 Ataque Físico",
      "+25% de Chance de Crítico"
    ],
    "habilidades": [
      {
        "tipo": "Atributo Único",
        "nome_habilidade": "Aumento Crítico",
        "descricao": "+40% de Dano Crítico"
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Ruína",
        "descricao": "Ataques críticos concedem 5% de Ataque Físico extra por 2 segundos."
      }
    ]
  },
  {
    "id": 7,
    "nome": "Escudo de Gelo Negro",
    "preco": 880,
    "categoria": "Defesa",
    "atributos": [
      "+400 Mana",
      "+18 Defesa Física"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Frio Ártico",
        "descricao": "Receber dano reduzirá a Velocidade de Ataque do atacante para 90% do normal por 1 segundo."
      }
    ]
  },
  {
    "id": 8,
    "nome": "Armadura de Lâminas",
    "preco": 1910,
    "categoria": "Defesa",
    "atributos": [
      "+70 Defesa Física"
    ],
    "habilidades": [
      {
        "tipo": "Atributo Único",
        "nome_habilidade": "Anti-Crítico",
        "descricao": "+20% Redução de Dano Crítico"
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Armadura Laminada",
        "descricao": "Ao ser atingido por um Ataque Básico, causa Dano Físico igual a 30% do dano recebido mais 20% da Defesa Física Total ao atacante e o retarda em 15% por 1 segundo."
      }
    ]
  },
  {
    "id": 9,
    "nome": "Lâmina do Desespero",
    "preco": 3010,
    "categoria": "Dano Físico",
    "atributos": [
      "+160 Ataque Físico",
      "+5% Velocidade de Movimento"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Desespero",
        "descricao": "Causar dano a inimigos (não-minions) com menos de 50% de HP aumenta o Ataque Físico em 25% por 2 segundos."
      }
    ]
  },
  {
    "id": 10,
    "nome": "Lâmina dos Sete Mares",
    "preco": 1950,
    "categoria": "Dano Físico",
    "atributos": [
      "+70 Ataque Físico",
      "+250 HP"
    ],
    "habilidades": [
      {
        "tipo": "Atributo Único",
        "nome_habilidade": "Penetração Física",
        "descricao": "+15 de Penetração Física"
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Emboscada",
        "descricao": "Se nenhum dano for recebido ou causado em 5 segundos, o próximo Ataque Básico causará 160 (+40% do Ataque Físico Total) de Dano Físico adicional e lentidão de 40% por 1.5 segundos."
      }
    ]
  },
  {
    "id": 11,
    "nome": "Asas Sanguinárias",
    "preco": 2100,
    "categoria": "Dano Mágico",
    "atributos": [
      "+90 Poder Mágico"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Guarda",
        "descricao": "Ganha um escudo de 800 (+100% do Poder Mágico) que regenera 20 segundos após ser danificado. O escudo também concede 30 de Velocidade de Movimento enquanto dura e 150 por 1 segundo após quebrar."
      }
    ]
  },
  {
    "id": 12,
    "nome": "Peitoral da Força Bruta",
    "preco": 1870,
    "categoria": "Defesa",
    "atributos": [
      "+600 HP",
      "+23 Defesa Física",
      "+10% Redução de Recarga"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Força Bruta",
        "descricao": "A cada segundo após causar dano, ganha 6 de Ataque Adaptativo extra e 2% de Velocidade de Movimento extra por 4 segundos, até 6 acúmulos. Ganha 15% de Redução de Duração de Controle de Grupo com acúmulos máximos."
      }
    ]
  },
  {
    "id": 13,
    "nome": "Relógio do Destino",
    "preco": 2030,
    "categoria": "Dano Mágico",
    "atributos": [
      "+45 Poder Mágico",
      "+400 HP",
      "+400 Mana",
      "+10% Redução de Recarga"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Destino",
        "descricao": "Ganha 4.5 (+0.5 por nível) de Defesa Híbrida por 5 segundos ao causar Dano Mágico a heróis, acumulando até 6 vezes."
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Dádiva",
        "descricao": "Quando o HP cai abaixo de 50%, recupera 15% do HP em 3 segundos. Quando a Mana cai abaixo de 50%, restaura 15% da Mana em 3 segundos (60s de recarga)."
      }
    ]
  },
  {
    "id": 14,
    "nome": "Energia Concentrada",
    "preco": 2020,
    "categoria": "Dano Mágico",
    "atributos": [
      "+70 Poder Mágico",
      "+400 HP"
    ],
    "habilidades": [
      {
        "tipo": "Atributo Único",
        "nome_habilidade": "Roubo de Vida Híbrido",
        "descricao": "+20% Roubo de Vida Híbrido"
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Recarga",
        "descricao": "Aumenta o Poder Mágico em 5 após causar Dano Mágico (acumula até 6 vezes). Com acúmulos máximos, aumenta o Dano Mágico em 12% por 5 segundos."
      }
    ]
  },
  {
    "id": 15,
    "nome": "Foice da Corrosão",
    "preco": 2050,
    "categoria": "Dano Físico",
    "atributos": [
      "+30 Ataque Físico",
      "+30% Velocidade de Ataque",
      "+5% Velocidade de Movimento"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Corrosivo",
        "descricao": "Ataques Básicos ganham 80 de Dano Físico extra e causam 8% de lentidão (metade para ataques à distância) por 1.5 segundos. Acumula até 5 vezes."
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Impulso",
        "descricao": "Ataques Básicos concedem 6% de Velocidade de Ataque extra por 3 segundos, acumulando até 5 vezes."
      }
    ]
  },
  {
    "id": 16,
    "nome": "Elmo Amaldiçoado",
    "preco": 1760,
    "categoria": "Defesa",
    "atributos": [
      "+1200 HP",
      "+20 Defesa Mágica"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Alma Ardente",
        "descricao": "Causa (1.2% do HP Total) de Dano Mágico a inimigos próximos por segundo. Este dano é aumentado contra creeps e minions."
      }
    ]
  },
  {
    "id": 17,
    "nome": "Espada do Caçador de Demônios",
    "preco": 2180,
    "categoria": "Dano Físico",
    "atributos": [
      "+35 Ataque Físico",
      "+20% Velocidade de Ataque"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Devorar",
        "descricao": "Ataques Básicos causam 8% do HP atual do alvo como dano físico adicional."
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Fome",
        "descricao": "Ataques Básicos concedem 3% de Roubo de Vida Físico por 3 segundos (acumula até 5 vezes)."
      }
    ]
  },
  {
    "id": 18,
    "nome": "Sapatos de Demônio",
    "preco": 720,
    "categoria": "Movimento",
    "atributos": [
      "+40 Velocidade de Movimento",
      "+10 Regeneração de Mana"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Misticismo",
        "descricao": "Obter um abate ou assistência em um Minion restaura 4% da Mana."
      }
    ]
  },
  {
    "id": 19,
    "nome": "Glaive Divino",
    "preco": 1970,
    "categoria": "Dano Mágico",
    "atributos": [
      "+65 Poder Mágico"
    ],
    "habilidades": [
      {
        "tipo": "Atributo Único",
        "nome_habilidade": "Penetração Mágica",
        "descricao": "+40% de Penetração Mágica"
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Quebra-Feitiço",
        "descricao": "Ao atacar um inimigo, ganha 0.1% de Penetração Mágica extra para cada ponto de Defesa Mágica do inimigo, até um máximo de 20%."
      }
    ]
  },
  {
    "id": 20,
    "nome": "Dominância de Gelo",
    "preco": 2010,
    "categoria": "Defesa",
    "atributos": [
      "+500 Mana",
      "+55 Defesa Física",
      "+5% Velocidade de Movimento"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Frio Ártico",
        "descricao": "Receber dano reduzirá a Velocidade de Ataque do atacante para 80% do normal por 1 segundo."
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Maldição da Vida",
        "descricao": "Receber dano reduzirá os efeitos de Escudo e Regeneração de HP do atacante para 50% do normal por 1 segundo."
      }
    ]
  },
  {
    "id": 21,
    "nome": "Armadura Aterrorizante",
    "preco": 730,
    "categoria": "Defesa",
    "atributos": [
      "+30 Defesa Física"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Deter",
        "descricao": "Ao ser atingido por uma habilidade, reduz o Dano Físico do atacante em 4% por 2 segundos (acumula até 3 vezes)."
      }
    ]
  },
  {
    "id": 22,
    "nome": "Gema Elegante",
    "preco": 700,
    "categoria": "Dano Mágico",
    "atributos": [
      "+300 HP",
      "+380 Mana"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Dádiva",
        "descricao": "Quando o HP cai abaixo de 50%, recupera 15% do HP em 3 segundos. Quando a Mana cai abaixo de 50%, restaura 15% da Mana em 3 segundos (60s de recarga)."
      }
    ]
  },
  {
    "id": 23,
    "nome": "Talismã Encantado",
    "preco": 1870,
    "categoria": "Dano Mágico",
    "atributos": [
      "+50 Poder Mágico",
      "+250 HP",
      "+20% Redução de Recarga"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Fonte de Mana",
        "descricao": "Regenera 15% da Mana Máxima a cada 10 segundos."
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Maestria Mágica",
        "descricao": "A Redução de Recarga máxima é aumentada em 5%."
      }
    ]
  },
  {
    "id": 24,
    "nome": "Batalha Infinita",
    "preco": 2330,
    "categoria": "Dano Físico",
    "atributos": [
      "+60 Ataque Físico",
      "+250 HP",
      "+10% Redução de Recarga",
      "+8% Roubo de Vida Híbrido",
      "+5% Velocidade de Movimento",
      "+5 Regeneração de Mana"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Justiça Divina",
        "descricao": "Após usar uma habilidade, o próximo Ataque Básico em 3 segundos causa 60% do Ataque Físico Total como Dano Verdadeiro extra (1.5s de recarga)."
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Perseguir o Destino",
        "descricao": "Ativar a 'Justiça Divina' concede 10% de Velocidade de Movimento extra."
      }
    ]
  },
  {
    "id": 25,
    "nome": "Véu Exótico",
    "preco": 600,
    "categoria": "Dano Mágico",
    "atributos": [
      "+30 Poder Mágico",
      "+5% Velocidade de Movimento"
    ],
    "habilidades": []
  },
  {
    "id": 26,
    "nome": "Pena dos Céus",
    "preco": 2030,
    "categoria": "Dano Mágico",
    "atributos": [
      "+55 Poder Mágico",
      "+20% Velocidade de Ataque",
      "+10% Roubo de Vida",
      "+5% Redução de Recarga"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Aflição",
        "descricao": "Cada Ataque Básico causa 50 (+30% do Poder Mágico Total) de Dano Mágico extra."
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Impulso",
        "descricao": "Ataques Básicos concedem 6% de Velocidade de Ataque extra por 3 segundos, acumulando até 5 vezes."
      }
    ]
  },
  {
    "id": 27,
    "nome": "Frasco do Oásis",
    "preco": 1850,
    "categoria": "Dano Mágico",
    "atributos": [
      "+60 Poder Mágico",
      "+300 HP",
      "+10% Redução de Recarga"
    ],
    "habilidades": [
      {
        "tipo": "Atributo Único",
        "nome_habilidade": "Efeito de Cura",
        "descricao": "+12% Efeito de Cura"
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Bênção",
        "descricao": "Ao usar uma habilidade de cura ou escudo, se o HP do alvo estiver abaixo de 35%, ele receberá um escudo (100 por nível) por 3 segundos. Este efeito reduz a recarga das habilidades do conjurador em 2 segundos (60s de recarga por alvo)."
      }
    ]
  },
  {
    "id": 28,
    "nome": "Tempo Fugaz",
    "preco": 2050,
    "categoria": "Adaptativo",
    "atributos": [
      "+30 Ataque Adaptativo",
      "+600 HP",
      "+15% Redução de Recarga"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Fluxo do Tempo",
        "descricao": "Abates ou assistências em heróis reduzem a recarga atual da Ultimate em 30%."
      }
    ]
  },
  {
    "id": 29,
    "nome": "Martelo da Fúria",
    "preco": 830,
    "categoria": "Dano Físico",
    "atributos": [
      "+35 Ataque Físico"
    ],
    "habilidades": [
      {
        "tipo": "Atributo Único",
        "nome_habilidade": "Penetração Física",
        "descricao": "+12 de Penetração Física"
      }
    ]
  },
  {
    "id": 30,
    "nome": "Varinha Genial",
    "preco": 2000,
    "categoria": "Dano Mágico",
    "atributos": [
      "+75 Poder Mágico",
      "+5% Velocidade de Movimento"
    ],
    "habilidades": [
      {
        "tipo": "Atributo Único",
        "nome_habilidade": "Penetração Mágica",
        "descricao": "+10 de Penetração Mágica"
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Mágica",
        "descricao": "Causar Dano Mágico a heróis inimigos reduzirá a Defesa Mágica deles em 3 (+0.3 por nível) por 2 segundos. Acumula até 3 vezes."
      }
    ]
  },
  {
    "id": 31,
    "nome": "Varinha Brilhante",
    "preco": 2150,
    "categoria": "Dano Mágico",
    "atributos": [
      "+75 Poder Mágico",
      "+400 HP",
      "+5% Velocidade de Movimento"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Chamuscar",
        "descricao": "Causar Dano Mágico queima os alvos por 3 segundos, causando Dano Mágico extra igual a 1% do HP Máximo do alvo por segundo."
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Maldição da Vida",
        "descricao": "Causar dano ao alvo reduzirá os efeitos de Escudo e Regeneração de HP em 50% por 3 segundos."
      }
    ]
  },
  {
    "id": 32,
    "nome": "Bastão Dourado",
    "preco": 2000,
    "categoria": "Dano Físico",
    "atributos": [
      "+55 Ataque Físico",
      "+15% Velocidade de Ataque"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Rápido",
        "descricao": "Cada 1% de Chance de Crítico extra é convertido em 1% de Velocidade de Ataque extra."
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Ataque Infinito",
        "descricao": "Após 2 Ataques Básicos que não sejam críticos, a Velocidade de Ataque do próximo Ataque Básico aumenta em 80% e ativa os efeitos de ataque 2 vezes adicionais."
      }
    ]
  },
  {
    "id": 33,
    "nome": "Lança do Grande Dragão",
    "preco": 2140,
    "categoria": "Dano Físico",
    "atributos": [
      "+70 Ataque Físico",
      "+10% Redução de Recarga",
      "+20% Chance de Crítico"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Guerreiro Supremo",
        "descricao": "Após usar a Ultimate, aumenta a Velocidade de Movimento em 30% por 7.5 segundos (15s de recarga)."
      }
    ]
  },
  {
    "id": 34,
    "nome": "Elmo do Guardião",
    "preco": 2200,
    "categoria": "Defesa",
    "atributos": [
      "+1550 HP",
      "+20 Regeneração de HP"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Recuperação",
        "descricao": "Recupera (2.5% do HP Total) por segundo (reduzido para 0.5% por 5 segundos após receber dano)."
      }
    ]
  },
  {
    "id": 35,
    "nome": "Garras de Haas",
    "preco": 2020,
    "categoria": "Dano Físico",
    "atributos": [
      "+30 Ataque Físico",
      "+15% Velocidade de Ataque",
      "+20% Chance de Crítico"
    ],
    "habilidades": [
      {
        "tipo": "Atributo Único",
        "nome_habilidade": "Roubo de Vida Físico",
        "descricao": "+25% Roubo de Vida Físico"
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Frenesi",
        "descricao": "Ataques críticos concedem 20% de Velocidade de Ataque extra por 2 segundos."
      }
    ]
  },
  {
    "id": 36,
    "nome": "Cristal Sagrado",
    "preco": 3000,
    "categoria": "Dano Mágico",
    "atributos": [
      "+185 Poder Mágico"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Mistério",
        "descricao": "Ganha 21%-35% de Poder Mágico extra (escala com o nível)."
      }
    ]
  },
  {
    "id": 37,
    "nome": "Machado de Caça",
    "preco": 2010,
    "categoria": "Dano Físico",
    "atributos": [
      "+80 Ataque Físico",
      "+10% Redução de Recarga"
    ],
    "habilidades": [
      {
        "tipo": "Atributo Único",
        "nome_habilidade": "Penetração Física",
        "descricao": "+15 de Penetração Física"
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Retribuição",
        "descricao": "Causar dano ao mesmo herói ou monstro 5 vezes seguidas concede 50% de Velocidade de Movimento extra que decai em 3 segundos (8s de recarga)."
      }
    ]
  },
  {
    "id": 38,
    "nome": "Varinha da Rainha de Gelo",
    "preco": 2040,
    "categoria": "Dano Mágico",
    "atributos": [
      "+75 Poder Mágico",
      "+10% Vampirismo Mágico",
      "+300 HP",
      "+7% Velocidade de Movimento"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Prisão de Gelo",
        "descricao": "Habilidades que causam dano a um herói inimigo também o deixarão 10% mais lento por 2 segundos (acumula até 3 vezes)."
      }
    ]
  },
  {
    "id": 39,
    "nome": "Imortalidade",
    "preco": 2120,
    "categoria": "Defesa",
    "atributos": [
      "+800 HP",
      "+15 Defesa Física"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Imortal",
        "descricao": "Ressuscita 2.5 segundos após a morte e ganha 16% do HP Máximo e um escudo que pode absorver 150 (+70 por nível) de dano. O escudo dura 3 segundos (210s de recarga)."
      }
    ]
  },
  {
    "id": 40,
    "nome": "Espada da Legião",
    "preco": 910,
    "categoria": "Dano Físico",
    "atributos": [
      "+60 Ataque Físico"
    ],
    "habilidades": []
  },
  {
    "id": 41,
    "nome": "Cetro Relâmpago",
    "preco": 2250,
    "categoria": "Dano Mágico",
    "atributos": [
      "+75 Poder Mágico",
      "+400 Mana",
      "+10% Redução de Recarga"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Ressonância",
        "descricao": "A cada 6 segundos, a próxima habilidade ecoa, causando (120% do Poder Mágico) de Dano Mágico extra a até 3 inimigos e acelerando o herói em 30% por 2 segundos."
      }
    ]
  },
  {
    "id": 42,
    "nome": "Lâmina Mágica",
    "preco": 1050,
    "categoria": "Dano Físico",
    "atributos": [
      "+40 Ataque Físico",
      "+18 Defesa Mágica"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Linha da Vida",
        "descricao": "Ao receber dano que reduz o HP abaixo de 30%, ganha um escudo de 385 (+35 por nível) e 50% de Velocidade de Movimento que decai rapidamente em 3 segundos (60s de recarga)."
      }
    ]
  },
  {
    "id": 43,
    "nome": "Sapatos Mágicos",
    "preco": 710,
    "categoria": "Movimento",
    "atributos": [
      "+40 Velocidade de Movimento",
      "+10% Redução de Recarga"
    ],
    "habilidades": []
  },
  {
    "id": 44,
    "nome": "Varinha Mágica",
    "preco": 820,
    "categoria": "Dano Mágico",
    "atributos": [
      "+45 Poder Mágico"
    ],
    "habilidades": []
  },
  {
    "id": 45,
    "nome": "Arma Maléfica",
    "preco": 2120,
    "categoria": "Dano Físico",
    "atributos": [
      "+40 Ataque Físico",
      "+20% Velocidade de Ataque"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Quebra-Armadura",
        "descricao": "Aumenta a Penetração Física em 30%."
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Energia Maléfica",
        "descricao": "Aumenta o alcance do Ataque Básico em 15%. Ao atingir um alvo, ganha 10% de Velocidade de Movimento por 1 segundo."
      }
    ]
  },
  {
    "id": 46,
    "nome": "Rugido Maléfico",
    "preco": 2060,
    "categoria": "Dano Físico",
    "atributos": [
      "+60 Ataque Físico"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Quebra-Armadura",
        "descricao": "Aumenta a Penetração Física em 30%."
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Destruidor",
        "descricao": "Ao atacar um inimigo, ganha 0.05% de Penetração Física extra para cada ponto de Defesa Física do inimigo, até um máximo de 30%."
      }
    ]
  },
  {
    "id": 47,
    "nome": "Essência Fundida",
    "preco": 800,
    "categoria": "Defesa",
    "atributos": [
      "+540 HP"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Alma Ardente",
        "descricao": "Causa (0.6% do HP Total) de Dano Mágico a inimigos próximos por segundo. Este dano é aumentado contra creeps e minions."
      }
    ]
  },
  {
    "id": 48,
    "nome": "Recipiente Místico",
    "preco": 500,
    "categoria": "Dano Mágico",
    "atributos": [
      "+15 Poder Mágico",
      "+8% Vampirismo Mágico"
    ],
    "habilidades": []
  },
  {
    "id": 49,
    "nome": "Machadinha de Ogro",
    "preco": 650,
    "categoria": "Dano Físico",
    "atributos": [
      "+25 Ataque Físico",
      "+230 HP"
    ],
    "habilidades": []
  },
  {
    "id": 50,
    "nome": "Oráculo",
    "preco": 1860,
    "categoria": "Defesa",
    "atributos": [
      "+850 HP",
      "+20 Defesa Física",
      "+20 Defesa Mágica",
      "+10% Redução de Recarga"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Bênção",
        "descricao": "Efeitos de Escudo e Regeneração de HP recebidos são aumentados em 30%."
      }
    ]
  },
  {
    "id": 51,
    "nome": "Asas da Rainha",
    "preco": 2250,
    "categoria": "Defesa",
    "atributos": [
      "+40 Ataque Adaptativo",
      "+600 HP",
      "+10% Redução de Recarga",
      "+10% Vampirismo Mágico"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Demonizar",
        "descricao": "Quando o HP cai abaixo de 40%, ganha 30% de Redução de Dano por 3 segundos e reduz a recarga das habilidades em 2 segundos (60s de recarga)."
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Desafio",
        "descricao": "Para cada 1% de HP perdido, o dano aumenta em 0.25%, até 15%."
      }
    ]
  },
  {
    "id": 52,
    "nome": "Armadura Radiante",
    "preco": 1880,
    "categoria": "Defesa",
    "atributos": [
      "+950 HP",
      "+40 Defesa Mágica",
      "+12 Regeneração de HP"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Bênção Sagrada",
        "descricao": "Receber Dano Mágico concede 5 (+1 por nível) de Defesa Mágica por 5 segundos, até 6 acúmulos."
      }
    ]
  },
  {
    "id": 53,
    "nome": "Botas Rápidas",
    "preco": 750,
    "categoria": "Movimento",
    "atributos": [
      "+65 Velocidade de Movimento",
      "+35% Redução de Lentidão"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Efeito Colateral",
        "descricao": "Perde 25 de Velocidade de Movimento por 5 segundos ao causar ou receber dano."
      }
    ]
  },
  {
    "id": 54,
    "nome": "Lança Regular",
    "preco": 600,
    "categoria": "Dano Físico",
    "atributos": [
      "+20 Ataque Físico",
      "+10% Velocidade de Ataque"
    ],
    "habilidades": []
  },
  {
    "id": 55,
    "nome": "Meteoro do Desprezo",
    "preco": 900,
    "categoria": "Dano Físico",
    "atributos": [
      "+15% Velocidade de Ataque",
      "+10% Chance de Crítico"
    ],
    "habilidades": []
  },
  {
    "id": 56,
    "nome": "Meteoro de Ouro Rosa",
    "preco": 1820,
    "categoria": "Dano Físico",
    "atributos": [
      "+60 Ataque Físico",
      "+23 Defesa Mágica",
      "+10% Roubo de Vida Físico"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Linha da Vida",
        "descricao": "Ao receber dano que reduz o HP abaixo de 30%, ganha um escudo de 770 (+70 por nível) e 50% de Velocidade de Movimento que decai rapidamente em 3 segundos (60s de recarga)."
      }
    ]
  },
  {
    "id": 57,
    "nome": "Alabarda dos Mares",
    "preco": 2050,
    "categoria": "Dano Físico",
    "atributos": [
      "+80 Ataque Físico",
      "+20% Velocidade de Ataque"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Maldição da Vida",
        "descricao": "Causar dano a um alvo reduz os efeitos de Escudo e Regeneração de HP em 50% por 3 segundos."
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Punição",
        "descricao": "Aumenta o dano em 8% contra heróis inimigos com mais HP extra."
      }
    ]
  },
  {
    "id": 58,
    "nome": "Manto do Silêncio",
    "preco": 1020,
    "categoria": "Defesa",
    "atributos": [
      "+540 HP",
      "+23 Defesa Mágica"
    ],
    "habilidades": []
  },
  {
    "id": 59,
    "nome": "Perfurador dos Céus",
    "preco": 1500,
    "categoria": "Adaptativo",
    "atributos": [
      "+60 Ataque Adaptativo",
      "+15 Velocidade de Movimento"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Letalidade",
        "descricao": "Após causar dano a um herói inimigo, executa o herói se o HP dele for inferior a 4%. Ganha 10 acúmulos por abate e perde 30% dos acúmulos atuais por morte. Cada acúmulo aumenta o limiar de HP da execução em 0.1%, acumulando até 80 vezes."
      }
    ]
  },
  {
    "id": 60,
    "nome": "Cetro de Starlium",
    "preco": 2220,
    "categoria": "Dano Mágico",
    "atributos": [
      "+70 Poder Mágico",
      "+10% Redução de Recarga",
      "+8% Roubo de Vida Híbrido",
      "+6 Regeneração de Mana"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Crise",
        "descricao": "3 segundos após usar uma habilidade, o próximo Ataque Básico causará 100 (+100% do Poder Mágico Total) de Dano Verdadeiro adicional (1.5s de recarga) e concederá 10% de Velocidade de Movimento."
      }
    ]
  },
  {
    "id": 61,
    "nome": "Placas de Aço",
    "preco": 630,
    "categoria": "Defesa",
    "atributos": [
      "+35 Defesa Física"
    ],
    "habilidades": []
  },
  {
    "id": 62,
    "nome": "Botas Ligeiras",
    "preco": 710,
    "categoria": "Movimento",
    "atributos": [
      "+40 Velocidade de Movimento",
      "+15% Velocidade de Ataque"
    ],
    "habilidades": []
  },
  {
    "id": 63,
    "nome": "Besta Veloz",
    "preco": 1000,
    "categoria": "Dano Físico",
    "atributos": [
      "+20% Velocidade de Ataque"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Besta",
        "descricao": "Cada Ataque Básico causa 40 de Dano Adaptativo extra."
      },
      {
        "tipo": "Passiva",
        "nome_habilidade": "Impulso",
        "descricao": "Ataques Básicos concedem 3% de Velocidade de Ataque extra por 3 segundos, acumulando até 5 vezes."
      }
    ]
  },
  {
    "id": 64,
    "nome": "Cinto do Trovão",
    "preco": 1820,
    "categoria": "Defesa",
    "atributos": [
      "+800 HP",
      "+15 Defesa Física",
      "+15 Defesa Mágica",
      "+20 Velocidade de Movimento"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Relâmpago",
        "descricao": "A cada 4 segundos, o próximo Ataque Básico causa 50 (+100% da Defesa Física Extra) (+100% da Defesa Mágica Extra) de Dano Verdadeiro extra ao alvo e inimigos ao redor, e os retarda em 99%."
      }
    ]
  },
  {
    "id": 65,
    "nome": "Tomo do Mal",
    "preco": 950,
    "categoria": "Dano Mágico",
    "atributos": [
      "+35 Poder Mágico",
      "+20 Regeneração de Mana",
      "+8% Redução de Recarga"
    ],
    "habilidades": []
  },
  {
    "id": 66,
    "nome": "Botas Robustas",
    "preco": 700,
    "categoria": "Movimento",
    "atributos": [
      "+40 Velocidade de Movimento",
      "+22 Defesa Mágica"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Fortitude",
        "descricao": "Duração de Controle de Grupo e Lentidão reduzida em 30%."
      }
    ]
  },
  {
    "id": 67,
    "nome": "Armadura do Crepúsculo",
    "preco": 2100,
    "categoria": "Defesa",
    "atributos": [
      "+1200 HP",
      "+15 Defesa Física"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Crepúsculo",
        "descricao": "Ao receber mais de 500 de dano em uma única instância, o dano excedente é reduzido em 20 + (0.2% do HP Total)%."
      }
    ]
  },
  {
    "id": 68,
    "nome": "Machado de Guerra",
    "preco": 2100,
    "categoria": "Dano Físico",
    "atributos": [
      "+35 Ataque Físico",
      "+400 HP",
      "+10% Redução de Recarga",
      "+12% Vampirismo Mágico"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Espírito de Luta",
        "descricao": "Ataques concedem 12 de Ataque Físico extra por segundo durante 4 segundos, até 6 acúmulos. Causa 10% de Dano Verdadeiro extra com base no dano causado com acúmulos máximos."
      }
    ]
  },
  {
    "id": 69,
    "nome": "Botas de Guerreiro",
    "preco": 720,
    "categoria": "Movimento",
    "atributos": [
      "+40 Velocidade de Movimento",
      "+22 Defesa Física"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Valor",
        "descricao": "Ganha 4 de Defesa Física extra por 3 segundos ao receber Dano Físico, até 20."
      }
    ]
  },
  {
    "id": 70,
    "nome": "Vento da Natureza",
    "preco": 1910,
    "categoria": "Dano Físico",
    "atributos": [
      "+30 Ataque Físico",
      "+20% Velocidade de Ataque",
      "+10% Roubo de Vida Físico"
    ],
    "habilidades": [
      {
        "tipo": "Ativa",
        "nome_habilidade": "Canto do Vento",
        "descricao": "Torna-se imune a todo Dano Físico por 2 segundos (duração reduzida pela metade para não-Atiradores; 70s de recarga)."
      }
    ]
  },
  {
    "id": 71,
    "nome": "Andarilho do Vento",
    "preco": 1880,
    "categoria": "Dano Físico",
    "atributos": [
      "+35% Velocidade de Ataque",
      "+20% Chance de Crítico",
      "+20 Velocidade de Movimento"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Tufão",
        "descricao": "A cada 5-2 segundos, o próximo Ataque Básico atinge até 3 inimigos com 150-362 de Dano Mágico."
      }
    ]
  },
  {
    "id": 72,
    "nome": "Coroa de Inverno",
    "preco": 1910,
    "categoria": "Adaptativo",
    "atributos": [
      "+45 Ataque Adaptativo",
      "+400 HP",
      "+5% Redução de Recarga"
    ],
    "habilidades": [
      {
        "tipo": "Ativa",
        "nome_habilidade": "Congelado",
        "descricao": "Fica congelado, inalvejável e imune a dano por 2 segundos (100s de recarga). Não pode se mover ou usar habilidades enquanto congelado."
      }
    ]
  },
  {
    "id": 73,
    "nome": "Lanterna dos Desejos",
    "preco": 2250,
    "categoria": "Dano Mágico",
    "atributos": [
      "+75 Poder Mágico",
      "+400 Mana",
      "+10% Redução de Recarga"
    ],
    "habilidades": [
      {
        "tipo": "Passiva",
        "nome_habilidade": "Deusa Borboleta",
        "descricao": "Para cada 800 de Dano Mágico causado a um herói inimigo, uma Deusa Borboleta é invocada para atacar, causando Dano Mágico igual a 10% do HP Atual do alvo."
      }
    ]
  }
];

// Importa dinamicamente o módulo @google/genai de uma URL CDN para compatibilidade com o ambiente serverless.
const genaiModule = await import("https://aistudiocdn.com/@google/genai@^1.22.0");
const { GoogleGenAI, Type } = genaiModule;

// A inicialização do cliente GenAI acontece aqui, no lado do servidor.
// Ele usará a variável de ambiente 'API_KEY' configurada na Vercel.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Lista autônoma de nomes de feitiços para remover a dependência do arquivo constants.tsx do frontend.
const SPELL_NAMES = [
    "Executar", "Caçar", "Caçar de Fogo", "Caçar de Gelo", "Caçar Sangrento",
    "Inspirar", "Avançar", "Revitalizar", "Proteção", "Petrificar",
    "Purificar", "Tiro de Chamas", "Lampejo", "Teleporte", "Vingança", "Curar"
];


// --- Funções Auxiliares e Esquemas (Movido de geminiService.ts) ---

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
                    nome: { type: Type.STRING, description: "Nome do item, deve ser um da lista de nomes de itens fornecida." },
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
        matchupAnalysis: { ...matchupResponseSchema, nullable: true }
    },
    required: ["strategicAnalysis"]
};

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


// --- Manipuladores de Análise ---

async function handle1v1Analysis(payload: any) {
    const { enemyHeroDetails, lane, potentialCountersDetails, selectedRole, yourHeroDetails, winRate } = payload;
    
    const itemNames = GAME_ITEMS.map(item => item.nome).join(', ');
    const spellList = SPELL_NAMES.join(', ');
    
    const enemyDetailsPrompt = formatHeroDetailsForPrompt(enemyHeroDetails);
    const countersDetailsPrompt = potentialCountersDetails.map((d: HeroDetails) => formatHeroDetailsForPrompt(d)).join('\n\n---\n\n');

    const systemPrompt = `Você é um analista de nível Mítico e engenheiro de jogo de Mobile Legends. Sua tarefa é fornecer uma análise tática infalível. Baseie-se ESTRITAMENTE nos dados fornecidos. Não invente informações. Responda APENAS com um objeto JSON válido que siga o schema. Seja direto, preciso e use termos em português do Brasil.`;
    
    const laneContext = lane === 'NENHUMA' ? 'em um confronto geral' : `na lane '${lane}'`;
    
    const strategicInstructions = `
**Parte 1: Análise Estratégica de Counters (strategicAnalysis)**
O oponente ${laneContext} é ${enemyHeroDetails.name}.
${selectedRole === 'Qualquer' ? "Analise os melhores counters possíveis, independente da função." : `Eu quero jogar com um herói da função '${selectedRole}'.`}
Analise CADA UM dos seguintes 'Heróis para Análise', que são counters estatísticos.

Instruções para a Parte 1:
1. Para cada herói counter sugerido, forneça um 'motivo' tático detalhado, comparando habilidades.
2. Forneça 1-2 'avisos' críticos.
3. Sugira 1 ou 2 'spells' (feitiços) da lista [${spellList}].
4. Sugira 3 'sugestoesItens' de counter da seguinte lista de nomes de itens: [${itemNames}]. O motivo deve explicar a interação direta do item com as habilidades do oponente.
`;

    let matchupInstructions = '';
    if (yourHeroDetails) {
        let winRateDescription = `estatisticamente NEUTRO`;
        if (winRate != null && winRate > 0.01) {
            winRateDescription = `uma VANTAGEM estatística de +${(winRate * 100).toFixed(1)}%`;
        } else if (winRate != null && winRate < -0.01) {
            winRateDescription = `uma DESVANTAGEM estatística de ${(winRate * 100).toFixed(1)}%`;
        }
        const yourHeroDetailsPrompt = formatHeroDetailsForPrompt(yourHeroDetails);
        
        const matchupContextText = lane === 'NENHUMA' 
            ? `Confronto direto geral (sem lane específica): Meu Herói (${yourHeroDetails.name}) vs Inimigo (${enemyHeroDetails.name}).`
            : `Confronto na lane ${lane}: Meu Herói (${yourHeroDetails.name}) vs Inimigo (${enemyHeroDetails.name}).`;

        matchupInstructions = `
**Parte 2: Análise de Confronto Direto (matchupAnalysis)**
${matchupContextText}
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
    return JSON.parse(jsonText);
}

async function handleDraftAnalysis(payload: any) {
    const { allyHeroesDetails, enemyHeroesDetails, availableHeroes } = payload;
    
    const itemNames = GAME_ITEMS.map(item => item.nome).join(', ');
    const availableHeroNames = availableHeroes.map((h: Hero) => h.name).join(', ');

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
    return JSON.parse(jsonText);
}

async function handleSynergyAnalysis(payload: any) {
    const { heroToAnalyzeDetails, potentialCountersDetails } = payload;
    
    const itemNames = GAME_ITEMS.map(item => item.nome).join(', ');
    const spellList = SPELL_NAMES.join(', ');
    const heroToAnalyzePrompt = formatHeroDetailsForPrompt(heroToAnalyzeDetails);
    const countersDetailsPrompt = potentialCountersDetails.map((d: HeroDetails) => formatHeroDetailsForPrompt(d)).join('\n\n---\n\n');

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
    return JSON.parse(jsonText);
}


// --- Manipulador Principal da API (Serverless Function) ---

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método Não Permitido' });
    }

    if (!process.env.API_KEY) {
        return res.status(500).json({ error: "A chave da API do Gemini não está configurada no servidor." });
    }

    try {
        const { analysisType, payload } = req.body;

        let result;

        switch (analysisType) {
            case '1v1':
                result = await handle1v1Analysis(payload);
                break;
            case 'draft':
                result = await handleDraftAnalysis(payload);
                break;
            case 'synergy':
                result = await handleSynergyAnalysis(payload);
                break;
            default:
                return res.status(400).json({ error: 'Tipo de análise inválido' });
        }

        return res.status(200).json(result);

    } catch (error: any) {
        console.error("Erro no manipulador da API Gemini:", error);
        const errorMessage = error.message || "Erro interno do servidor ao processar a solicitação da IA.";
        return res.status(500).json({ error: errorMessage });
    }
}
