import { GameItem } from "../types";

export const GAME_ITEMS: GameItem[] = [
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
]
