import { HeroDetails } from "../../types";

export const HERO_TRANSLATIONS: Record<string, HeroDetails> = {
  "Miya": {
    name: "Miya",
    summary: "Como a sacerdotisa da lua, Miya protege o Templo da Lua na Floresta Sombria. Ela reza para a Deusa da Lua todas as noites, desejando que a guerra termine para que ela possa encontrar o Rei Elfo, Estes.",
    skills: [
      { skillname: "Bênção da Lua", skilldesc: "Cada vez que Miya atinge um alvo com seu Ataque Básico, sua Velocidade de Ataque aumenta em 5%. Este efeito acumula até 5 vezes e dura 4s." },
      { skillname: "Flecha de Fissão", skilldesc: "Miya dispara duas flechas extras, cada uma causando 10 (+105% de Ataque Físico Total) de Dano Físico ao alvo principal e 30% de dano aos outros. Dura 4s." },
      { skillname: "Chuva de Flechas", skilldesc: "Miya dispara uma chuva de flechas em uma área, causando 5 hits de dano. Cada hit causa 30 (+15% de Ataque Físico Total) de Dano Físico e retarda os inimigos em 30% por 2s. Se um inimigo for atingido 4 vezes, ele será imobilizado por 1s." },
      { skillname: "Eclipse da Lua Oculta", skilldesc: "Miya se remove de todos os debuffs e se esconde, ganhando 35% de Velocidade de Movimento extra por 2s. Ela também ganha acúmulos completos de Bênção da Lua imediatamente." }
    ],
    combos: [
      { title: "Engajamento/Dano", desc: "Use a Habilidade 1 para aumentar seu dano. Se o inimigo tentar fugir, use a Habilidade 2 para retardá-lo e imobilizá-lo. Use a Ultimate para escapar de situações perigosas ou para se reposicionar." },
      { title: "Perseguição", desc: "Ative a Ultimate para ganhar velocidade e se esconder, aproxime-se do alvo e use a Habilidade 2 para imobilizá-lo, seguido da Habilidade 1 para dano máximo." }
    ]
  },
  "Balmond": {
    name: "Balmond",
    summary: "Balmond era o líder dos Orcs, que se aliaram aos humanos para derrotar os Elfos de Sangue. Mas após a vitória, os humanos traíram e massacraram os Orcs. Balmond, em sua fúria, jurou destruir os humanos.",
    skills: [
      { skillname: "Sede de Sangue", skilldesc: "Balmond recupera 5% do seu HP máximo ao matar um minion ou creep, e 20% ao matar um herói." },
      { skillname: "Bloqueio de Alma", skilldesc: "Balmond avança, causando 150 (+60% de Ataque Físico Total) de Dano Físico aos inimigos no caminho. Se ele atingir um herói, ele para e o arremessa para trás, causando lentidão de 30% por 2s." },
      { skillname: "Varredura Ciclone", skilldesc: "Balmond gira seu machado por 3s, causando 50 (+50% de Ataque Físico Total) de Dano Físico continuamente. Inimigos atingidos por múltiplos giros recebem dano crescente." },
      { skillname: "Fúria Letal", skilldesc: "Balmond esmaga seu machado no chão, causando 400 (+60% de Ataque Físico Total) + 20% do HP perdido do alvo como Dano Verdadeiro em uma área em forma de leque. Causa lentidão de 40% por 2s." }
    ],
    combos: [
      { title: "Combo de Dano", desc: "Use a Habilidade 2 para dano contínuo. Finalize com a Ultimate para executar alvos com pouca vida." },
      { title: "Iniciação/Fuga", desc: "Use a Habilidade 1 para se aproximar de um alvo ou para escapar de uma luta." }
    ]
  },
  "Saber": {
    name: "Saber",
    summary: "Saber era um ciborgue criado no Laboratório 1718. Ele foi programado para ser a espada perfeita, viajando pelo tempo e espaço para encontrar um oponente digno. Ele acabou na Terra do Amanhecer, procurando seu rival.",
    skills: [
      { skillname: "Inimigo à Vista", skilldesc: "Os ataques de Saber reduzem a Defesa Física do alvo em 3-8 por 5s, acumulando até 5 vezes." },
      { skillname: "Espadas Orbitantes", skilldesc: "Saber libera 4 espadas que orbitam ao seu redor, causando 80 (+30% de Ataque Físico Extra) de Dano Físico. As espadas também voam em direção aos inimigos quando ele causa dano." },
      { skillname: "Carga", skilldesc: "Saber avança, causando 80 (+40% de Ataque Físico Extra) de Dano Físico. Seu próximo Ataque Básico é aprimorado." },
      { skillname: "Golpe Triplo", skilldesc: "Saber avança para um herói inimigo, arremessando-o ao ar por 1.2s e causando três golpes que totalizam 200 (+120% de Ataque Físico Extra) de Dano Físico." }
    ],
    combos: [
      { title: "Combo de Abate", desc: "Use a Habilidade 2 para se aproximar, seguido da Ultimate para prender e causar dano massivo. A Habilidade 1 pode ser usada antes ou durante a Ultimate para dano adicional." }
    ]
  },
  "Nana": {
    name: "Nana",
    summary: "Nana é uma Leonina travessa que vive na Floresta Mágica. Ela tem o poder de transformar qualquer um que a irrite em um pequeno animal com seu bumerangue mágico, Molina.",
    skills: [
      { skillname: "Dádiva de Molina", skilldesc: "Nana se transforma em Molina por 2.5s quando recebe dano fatal, tornando-se imune a dano, ganhando velocidade de movimento e recuperando 10% do HP. Este efeito tem 120s de recarga." },
      { skillname: "Bumerangue Mágico", skilldesc: "Nana lança um bumerangue que causa 220 (+100% de Poder Mágico Total) de Dano Mágico aos inimigos na ida e na volta." },
      { skillname: "Beijo de Molina", skilldesc: "Nana invoca Molina em uma área. Molina persegue o inimigo mais próximo, o transforma em um bichinho por 1.5s e causa 250 (+50% de Poder Mágico Total) de Dano Mágico, além de lentidão." },
      { skillname: "Pancada de Molina", skilldesc: "Nana invoca um grande dragão-gato que ataca uma área 3 vezes. Cada ataque causa 400 (+180% de Poder Mágico Total) de Dano Mágico e retarda os inimigos." }
    ],
    combos: [
      { title: "Combo de Controle", desc: "Use a Habilidade 2 para transformar um inimigo, seguido da Ultimate para atordoar e causar dano em área. Use a Habilidade 1 para pokear à distância." }
    ]
  },
  "Tigreal": {
    name: "Tigreal",
    summary: "Tigreal é o capitão dos Cavaleiros do Império Moniyan. Ele é um guerreiro justo e leal, dedicado a proteger o império de todas as ameaças com seu escudo e espada.",
    skills: [
      { skillname: "Coragem", skilldesc: "Tigreal ganha um acúmulo de Coragem sempre que usa uma habilidade ou é atingido por um Ataque Básico. Após 4 acúmulos, seu próximo Ataque Básico causa dano em área." },
      { skillname: "Onda de Ataque", skilldesc: "Tigreal esmaga o chão, causando 270 (+70% de Ataque Físico Total) de Dano Físico em uma área e retardando os inimigos em 20% por 1.5s." },
      { skillname: "Martelo Sagrado", skilldesc: "Tigreal avança com seu escudo, empurrando os inimigos. Se ele usar a habilidade novamente, ele arremessa os inimigos ao ar." },
      { skillname: "Implosão", skilldesc: "Tigreal suga os inimigos ao seu redor, causando 270 (+130% de Ataque Físico Total) de Dano Físico e os atordoando por 1.5s." }
    ],
    combos: [
      { title: "Combo de Iniciação", desc: "Use Lampejo e a Ultimate para agrupar os inimigos. Em seguida, use a Habilidade 2 para empurrá-los em direção aos seus aliados e arremessá-los ao ar." }
    ]
  },
   "Aamon": {
    name: "Aamon",
    summary: "Como o Duque dos Fragmentos, Aamon se move nas sombras, um assassino invisível que julga o mal. Ele é o irmão mais velho de Gusion, manipulando fragmentos de vidro para executar seus alvos com precisão mortal.",
    skills: [
      { skillname: "Armadura Invisível", skilldesc: "Após atingir um inimigo com uma habilidade, Aamon entra em estado de camuflagem, tornando-se inalvejável e se curando. Seu próximo Ataque Básico é aprimorado e causa dano extra." },
      { skillname: "Fragmentos da Alma", skilldesc: "Aamon lança um fragmento em um alvo, causando dano. Acertar um inimigo ou usar um Ataque Básico durante a camuflagem gera um fragmento no chão, que pode ser coletado." },
      { skillname: "Fragmentos do Carrasco", skilldesc: "Aamon lança fragmentos em forma de leque, causando dano e retardando os inimigos. Ele também avança na direção oposta ao lançamento." },
      { skillname: "Fragmentos Infinitos", skilldesc: "Aamon lança todos os seus fragmentos em um alvo, que então caem e atacam a área, causando dano massivo com base no número de fragmentos e no HP perdido do alvo." }
    ],
    combos: [
      { title: "Combo de Abate Rápido", desc: "Use a Habilidade 2 para se aproximar ou causar dano, ativando a camuflagem. Use a Habilidade 1 no alvo, use um Ataque Básico aprimorado, e finalize com a Ultimate para dano explosivo." },
      { title: "Poke e Fuga", desc: "Use a Habilidade 1 para pokear à distância. Se um inimigo se aproximar, use a Habilidade 2 para causar dano e criar distância com o recuo." }
    ]
  },
  "Akai": {
    name: "Akai",
    summary: "Akai é um panda desajeitado, mas poderoso, de uma vila distante. Ele sonha em se tornar um grande guerreiro e viaja para a Terra do Amanhecer para provar seu valor.",
    skills: [
      { skillname: "Tai Chi", skilldesc: "Akai ganha um escudo que absorve 50 (+5% do HP Máximo) de dano sempre que usa uma habilidade. Dura 2s." },
      { skillname: "Guardião de Mil Quilos", skilldesc: "Akai salta para uma área, causando 300 (+50% de Ataque Físico Total) de Dano Físico e retardando os inimigos." },
      { skillname: "Mistura", skilldesc: "Akai rola como uma bola, causando 180 (+100% de Ataque Físico Total) de Dano Físico. Inimigos atingidos são marcados, e ataques básicos em alvos marcados causam dano extra." },
      { skillname: "Furacão Dançante", skilldesc: "Akai gira como um tornado por 3.5s, repelindo e causando 180 (+100% de Poder Mágico Total) de Dano Mágico. Ele se torna imune a lentidão durante o efeito." }
    ],
    combos: [
      { title: "Combo de Controle", desc: "Use a Habilidade 2 para marcar um inimigo, seguido da Habilidade 1 para pular e atordoá-lo. Use a Ultimate para empurrar os inimigos contra paredes ou para longe de seus aliados." }
    ]
  },
   "Alpha": {
    name: "Alpha",
    summary: "Alpha é uma das criações do Laboratório 1718, feito de carne humana e um meteorito espacial. Ele foi criado junto com seu irmão gêmeo, Beta. Juntos, eles são uma máquina de caça implacável.",
    skills: [
      { skillname: "Beta, Avance!", skilldesc: "Cada vez que Alpha usa uma habilidade, Beta marca o alvo. Após 2 marcas, Beta atacará o alvo, causando Dano Verdadeiro contínuo e retardando-o." },
      { skillname: "Impacto Rotativo", skilldesc: "Alpha desfere um golpe para a frente, causando Dano Físico e lentidão. Após o golpe, Beta ataca a área, causando dano adicional." },
      { skillname: "Balanço de Força", skilldesc: "Após carregar, Alpha ataca em uma área em forma de leque, causando Dano Físico e recuperando HP para cada inimigo atingido. Beta então ataca a área-alvo." },
      { skillname: "Lança de Alpha", skilldesc: "Alpha comanda Beta para esmagar um local, causando Dano Físico e atordoando os inimigos. Alpha então avança para a área, causando dano e arremessando os inimigos ao ar." }
    ],
    combos: [
      { title: "Iniciação e Dano em Área", desc: "Use a Ultimate para pular em um inimigo, atordoando e arremessando-o ao ar. Siga com a Habilidade 2 para dano e cura, e use a Habilidade 1 para lentidão e dano adicional, maximizando as marcas de Beta." },
      { title: "Perseguição", desc: "Use a Habilidade 1 para retardar o alvo. Use a Habilidade 2 para se curar e continuar o ataque. Se o inimigo estiver longe, use a Ultimate para fechar a distância e garantir o abate." }
    ]
  },
  "Alucard": {
    name: "Alucard",
    summary: "Alucard é um caçador de demônios cujos pais foram mortos por demônios. Ele foi treinado pelo Templo da Luz e agora vaga pelo mundo, caçando e eliminando demônios para vingar sua família.",
    skills: [
      { skillname: "Perseguidor", skilldesc: "Após usar uma habilidade, o próximo Ataque Básico de Alucard causa 1.2x o dano e o faz avançar para o alvo." },
      { skillname: "Quebra-chão", skilldesc: "Alucard salta e ataca, causando 250 (+110% de Ataque Físico Extra) de Dano Físico e retardando os inimigos." },
      { skillname: "Giro Whirling", skilldesc: "Alucard gira sua espada, causando 230 (+120% de Ataque Físico Extra) de Dano Físico aos inimigos próximos." },
      { skillname: "Onda de Fissão", skilldesc: "Alucard absorve a energia dos inimigos, aumentando seu Roubo de Vida Físico em 40% e retardando os alvos em 40% por 4s. Ele pode reativar para lançar uma onda de choque, causando 400 (+200% de Ataque Físico Extra) de Dano Físico." }
    ],
    combos: [
      { title: "Combo de Dano", desc: "Ative a Ultimate, use a Habilidade 1 para se aproximar, use Ataques Básicos para ativar a passiva, use a Habilidade 2 para dano em área e finalize com a reativação da Ultimate." }
    ]
  },
    "Alice": {
    name: "Alice",
    summary: "Alice, a Rainha dos Demônios de Sangue, seduz suas presas com sua beleza antes de drenar sua força vital. Com cada gota de sangue que absorve, seu poder cresce, tornando-a uma ameaça imortal no campo de batalha.",
    skills: [
      { skillname: "Ancestral de Sangue", skilldesc: "Quando um minion inimigo morre perto de Alice, ele gera uma orbe de sangue. Cada orbe que Alice absorve aumenta permanentemente seu HP máximo e Mana máxima." },
      { skillname: "Fluxo de Sangue", skilldesc: "Alice lança uma esfera de sangue em uma direção, causando Dano Mágico. Ela pode reativar a habilidade para se teletransportar para a localização da esfera." },
      { skillname: "Temor de Sangue", skilldesc: "Alice causa Dano Mágico aos inimigos próximos e os imobiliza por 1.2s." },
      { skillname: "Ode de Sangue", skilldesc: "Alice entra em modo de drenagem de sangue por 5s, causando Dano Mágico contínuo aos inimigos próximos e se curando. Este efeito custa mana continuamente." }
    ],
    combos: [
      { title: "Iniciação e Dano em Área", desc: "Use a Habilidade 1 para se teletransportar para o meio da equipe inimiga. Imediatamente use a Habilidade 2 para imobilizá-los e, em seguida, ative a Ultimate para causar dano massivo e se curar." },
      { title: "Fuga", desc: "Jogue a Habilidade 1 em uma direção segura e use a reativação para escapar de situações perigosas." }
    ]
  },
  "Karina": {
    name: "Karina",
    summary: "Karina é uma Elfa Negra que sacrificou sua alma para se tornar a assassina perfeita e proteger sua irmã, Selena. Ela agora serve o Abismo, eliminando qualquer um que ameace seus planos.",
    skills: [
      { skillname: "Dança das Sombras", skilldesc: "Atingir um inimigo com 3 ataques consecutivos causa Dano Verdadeiro adicional igual a 50 + 5% do HP perdido do alvo. Reduz a recarga de suas habilidades em 1.5s." },
      { skillname: "Dança das Lâminas", skilldesc: "Karina gira suas lâminas, causando 180 (+55% de Poder Mágico Total) de Dano Mágico. Seu próximo Ataque Básico é aprimorado." },
      { skillname: "Elusividade", skilldesc: "Karina se torna imune a Ataques Básicos e aumenta sua velocidade de movimento. Seu próximo Ataque Básico causa dano extra e retarda o alvo." },
      { skillname: "Assalto Sombrio", skilldesc: "Karina avança para um alvo, causando 350 (+160% de Poder Mágico Total) de Dano Mágico. Matar um herói ou obter uma assistência reseta a recarga desta habilidade." }
    ],
    combos: [
      { title: "Combo de Abate", desc: "Use a Habilidade 1 para se aproximar e causar dano, use a Habilidade 2 para imunidade e dano adicional, e finalize com a Ultimate." }
    ]
  },
  "Franco": {
    name: "Franco",
    summary: "Franco é um guerreiro do norte congelado. Ele acredita que a única maneira de sobreviver ao inverno rigoroso é lutar e se tornar mais forte.",
    skills: [
      { skillname: "Força do Ermo", skilldesc: "Se Franco não receber dano em 5s, sua Velocidade de Movimento aumenta em 10% e ele regenera 1% do HP Máximo por segundo." },
      { skillname: "Gancho de Ferro", skilldesc: "Franco lança um gancho que puxa o primeiro inimigo atingido em sua direção, causando 400 (+100% de Ataque Físico Total) de Dano Físico." },
      { skillname: "Choque Furioso", skilldesc: "Franco ataca o chão, causando 300 (+100% de Ataque Físico Total) de Dano Físico e retardando os inimigos." },
      { skillname: "Caça Sangrenta", skilldesc: "Franco suprime um inimigo por 1.8s, atingindo-o 6 vezes e causando 50 (+70% de Ataque Físico Total) de Dano Físico por golpe." }
    ],
    combos: [
      { title: "Combo de Pickoff", desc: "Use a Habilidade 1 para puxar um inimigo vulnerável. Imediatamente use a Ultimate para suprimi-lo, e use a Habilidade 2 para retardá-lo se ele tentar escapar." }
    ]
  },
  "Bane": {
    name: "Bane",
    summary: "Bane era um tirano dos mares, conhecido como o Lorde dos Sete Mares. Após ser derrotado e ressuscitado, ele agora busca recuperar sua antiga glória e seu navio, a Pérola Negra.",
    skills: [
      { skillname: "Toxina de Tubarão", skilldesc: "A cada 10s, a arma de Bane é infundida, fazendo com que seu próximo Ataque Básico cause dano em área e retarde os inimigos." },
      { skillname: "Caranguejo-Canhão", skilldesc: "Bane dispara em uma direção, causando 180 (+140% de Ataque Físico Total) de Dano Físico. A bala ricocheteia para um inimigo atrás, causando 150% do dano." },
      { skillname: "Rum", skilldesc: "Bane bebe rum, recuperando 160 (+150% de Poder Mágico Total) de HP e ganhando 30% de Velocidade de Movimento. Ele pode cuspir veneno, causando dano mágico." },
      { skillname: "Armadilha Mortal", skilldesc: "Bane convoca um cardume de tubarões que avança, causando 600 (+200% de Ataque Físico Total) de Dano Físico aos inimigos e arremessando-os ao ar." }
    ],
    combos: [
      { title: "Combo de Poke/Burst", desc: "Use a Habilidade 1 para pokear à distância. Se engajar, use a Habilidade 2 para se curar e a Ultimate para controle de grupo e dano massivo." }
    ]
  },
  "Bruno": {
    name: "Bruno",
    summary: "Bruno era um menino pobre que perdeu as pernas em um acidente. Os Eruditos lhe deram pernas mecânicas e ele se tornou o protetor de sua cidade, usando sua bola de energia para lutar.",
    skills: [
      { skillname: "Equipamento Mecânico", skilldesc: "Os Ataques Básicos de Bruno infundem sua bola com energia. Quando a energia está cheia, seu próximo Ataque Básico causa dano extra e retarda o alvo." },
      { skillname: "Chute Voleio", skilldesc: "Bruno chuta uma bola de energia em um alvo, causando 200 (+100% de Ataque Físico Total) de Dano Físico e retardando-o. A bola ricocheteia para Bruno." },
      { skillname: "Carrinho Voador", skilldesc: "Bruno dá um carrinho, causando 140 (+40% de Ataque Físico Total) de Dano Físico e atordoando os inimigos. Ele pode pegar sua bola para reduzir a recarga desta habilidade." },
      { skillname: "Onda do Mundo", skilldesc: "Bruno chuta uma bola de energia com força total, que ricocheteia entre os inimigos, causando 250 (+100% de Ataque Físico Total) de Dano Físico e reduzindo a Defesa Física deles." }
    ],
    combos: [
      { title: "Combo de Dano", desc: "Use a Habilidade 1 para pokear e carregar a passiva. Use a Habilidade 2 para se reposicionar ou atordoar. A Ultimate é ideal para lutas em equipe para maximizar os ricochetes." }
    ]
  },
  "Clint": {
    name: "Clint",
    summary: "Clint é um pistoleiro do oeste que busca justiça. Ele vaga pelas terras áridas, usando suas pistolas duplas para punir os fora-da-lei e proteger os inocentes.",
    skills: [
      { skillname: "Pistola Rápida", skilldesc: "Após usar uma habilidade, o próximo Ataque Básico de Clint em 4s penetra em uma linha, causando 100% do Ataque Físico Total como Dano Físico." },
      { skillname: "Tiro Ofuscante", skilldesc: "Clint dispara uma cortina de fumaça, causando 250 (+80% de Ataque Físico Total) de Dano Físico e reduzindo a taxa de acerto dos inimigos na área." },
      { skillname: "Corda de Armadilha", skilldesc: "Clint lança uma rede que imobiliza o primeiro inimigo atingido e recua uma curta distância." },
      { skillname: "Granada Howitzer", skilldesc: "Clint lança uma granada, causando 280 (+100% de Ataque Físico Total) de Dano Físico. Ele pode armazenar até 5 granadas." }
    ],
    combos: [
      { title: "Combo de Burst", desc: "Use a Habilidade 1, seguido de um Ataque Básico (passiva). Use a Habilidade 3 para dano e lentidão. Use a Habilidade 2 para escapar ou imobilizar um inimigo que se aproxima." }
    ]
  },
  "Rafaela": {
    name: "Rafaela",
    summary: "Rafaela é um anjo que desceu à Terra do Amanhecer para curar a dor e o sofrimento. Ela usa sua luz sagrada para punir o mal e trazer esperança aos corações dos desesperados.",
    skills: [
      { skillname: "Deidade Curadora", skilldesc: "As habilidades de cura de Rafaela também retardam os inimigos próximos, enquanto suas habilidades de dano revelam a posição dos inimigos." },
      { skillname: "Luz da Punição", skilldesc: "Rafaela invoca a luz sagrada para punir 3 inimigos próximos, causando 225 (+120% de Poder Mágico Total) de Dano Mágico e revelando-os." },
      { skillname: "Luz Sagrada", skilldesc: "Rafaela cura a si mesma e o aliado próximo com menos HP em 370 (+70% de Poder Mágico Total) e aumenta a Velocidade de Movimento deles." },
      { skillname: "Batismo Sagrado", skilldesc: "Rafaela libera a luz sagrada em uma linha, causando 460 (+120% de Poder Mágico Total) de Dano Mágico e atordoando os inimigos por 1.5s." }
    ],
    combos: [
      { title: "Combo de Suporte", desc: "Use a Habilidade 2 para curar e dar velocidade aos aliados. Use a Habilidade 1 para pokear e revelar inimigos. A Ultimate é crucial para iniciar lutas ou proteger seus aliados com o atordoamento em área." }
    ]
  },
  "Eudora": {
    name: "Eudora",
    summary: "Eudora é uma maga que controla o poder do relâmpago. Ela se juntou à Academia de Magia para aprimorar suas habilidades e se tornou uma das magas mais poderosas do império.",
    skills: [
      { skillname: "Supercondutor", skilldesc: "As habilidades de Eudora aplicam uma marca de Supercondutor no alvo. Efeitos adicionais ocorrerão se ela atingir o alvo novamente." },
      { skillname: "Relâmpago Bifurcado", skilldesc: "Eudora lança um relâmpago que causa 350 (+150% de Poder Mágico Total) de Dano Mágico. Se o alvo estiver com a marca, o relâmpago se espalha para inimigos próximos." },
      { skillname: "Bola de Relâmpago", skilldesc: "Eudora lança uma bola de relâmpago que atordoa o alvo por 1.2s e causa 340 (+90% de Poder Mágico Total) de Dano Mágico. Se o alvo estiver com a marca, a bola explode e atordoa inimigos próximos." },
      { skillname: "Trovão da Fúria", skilldesc: "Eudora invoca uma tempestade de raios, causando 480 (+180% de Poder Mágico Total) de Dano Mágico. Se o alvo estiver com a marca, a tempestade causa dano adicional massivo." }
    ],
    combos: [
      { title: "Combo de Burst Completo", desc: "Use a Habilidade 2 para atordoar e aplicar a marca, seguido da Habilidade 1 para dano e, em seguida, a Ultimate para finalizar o alvo com dano massivo." }
    ]
  },
  "Zilong": {
    name: "Zilong",
    summary: "Zilong é um discípulo do Grande Dragão, jurado a proteger as terras do amanhecer. Ele é um mestre da lança, rápido e mortal, capaz de virar o jogo com sua coragem.",
    skills: [
      { skillname: "Resolução do Dragão", skilldesc: "Após cada 3 Ataques Básicos, o próximo Ataque Básico de Zilong ataca várias vezes, causando 150% do dano do Ataque Básico e recuperando HP." },
      { skillname: "Lança Giratória", skilldesc: "Zilong arremessa um inimigo para trás por cima de seus ombros, causando 250 (+80% de Ataque Físico Total) de Dano Físico." },
      { skillname: "Ataque de Lança", skilldesc: "Zilong avança em um alvo, causando 250 (+60% de Ataque Físico Total) de Dano Físico e reduzindo a Defesa Física do alvo." },
      { skillname: "Guerreiro Supremo", skilldesc: "Zilong ganha 40% de Velocidade de Movimento, 45% de Velocidade de Ataque e imunidade a lentidão por 7.5s." }
    ],
    combos: [
      { title: "Combo de Pickoff", desc: "Ative a Ultimate para velocidade. Use a Habilidade 2 para se aproximar do alvo, seguido da Habilidade 1 para jogá-lo em direção à sua equipe. Use Ataques Básicos para finalizar." }
    ]
  },
  "Fanny": {
    name: "Fanny",
    summary: "Fanny sonhava em voar. Ela criou um par de ganchos de aço e, após anos de treinamento, dominou a arte de voar entre penhascos, tornando-se uma protetora de sua terra natal.",
    skills: [
      { skillname: "Vantagem Aérea", skilldesc: "Enquanto voa, o dano de Fanny aumenta de 15% a 30% e deixa uma Marca da Presa no alvo (acumula até 2 vezes). Cada acúmulo regenera 10 de energia ao atingir um inimigo." },
      { skillname: "Ataque Tornado", skilldesc: "Fanny gira sua lâmina, causando 320 (+80% de Ataque Físico Total) de Dano Físico aos inimigos próximos." },
      { skillname: "Cabos de Aço", skilldesc: "Fanny lança um cabo que a puxa para o primeiro obstáculo que atingir. Cada uso consecutivo dentro de 2s reduz o custo de energia." },
      { skillname: "Corte do Carniceiro", skilldesc: "Fanny inicia um ataque rápido em um inimigo, causando 500 (+240% de Ataque Físico Extra) de Dano Físico. Cada acúmulo da Marca da Presa no alvo aumentará o dano em 20%." }
    ],
    combos: [
      { title: "Combo de Voo", desc: "Use a Habilidade 2 para voar pelo mapa, atingindo os inimigos para aplicar marcas. Use a Habilidade 1 enquanto voa para causar dano em área. Finalize um alvo marcado com a Ultimate." }
    ]
  },
  "Layla": {
    name: "Layla",
    summary: "Layla vive em um mundo cheio de uma energia maléfica chamada Malefic. Seu pai criou um canhão de energia para ela, permitindo-lhe lutar contra os monstros e proteger seu lar.",
    skills: [
      { skillname: "Tiro Maléfico", skilldesc: "O dano do Ataque Básico de Layla aumenta com a distância, de 100% a 130%. Sua visão também aumenta ligeiramente conforme ela sobe de nível." },
      { skillname: "Bomba Maléfica", skilldesc: "Layla dispara uma bomba de energia que causa 200 (+80% de Ataque Físico Total) de Dano Físico e aplica uma marca. Inimigos marcados recebem dano e lentidão quando atingidos por Layla." },
      { skillname: "Projétil do Vazio", skilldesc: "Layla dispara uma bola de energia que explode, causando 170 (+65% de Ataque Físico Total) de Dano Físico e aplicando uma marca de Projétil do Vazio. Atacar um alvo marcado causa dano extra e atordoa por um curto período." },
      { skillname: "Destruição Apressada", skilldesc: "Layla dispara um canhão de energia, causando 500 (+150% de Ataque Físico Total) de Dano Físico em uma linha. O alcance de seus Ataques Básicos aumenta temporariamente." }
    ],
    combos: [
      { title: "Combo de Longo Alcance", desc: "Use a Habilidade 1 e Habilidade 2 à distância para aplicar marcas. Ative a Ultimate para dano massivo e aumento de alcance para finalizar alvos em fuga." }
    ]
  },
  "Hayabusa": {
    name: "Hayabusa",
    summary: "Hayabusa é o melhor ninja do Clã da Sombra. Ele viajou para a Terra do Amanhecer em busca do ninja traidor que matou seu amigo, jurando vingança.",
    skills: [
      { skillname: "Mestre das Sombras Ninjutsu", skilldesc: "O dano de Hayabusa aplica 1 acúmulo de Marca Sombria. Cada acúmulo aumenta o dano de Hayabusa ao alvo em 5%." },
      { skillname: "Shuriken Fantasma", skilldesc: "Hayabusa lança três shurikens em forma de leque, cada uma causando 170 (+70% de Ataque Físico Extra) de Dano Físico e retardando os inimigos." },
      { skillname: "Ninjutsu: Sombra Quádrupla", skilldesc: "Hayabusa se move em uma direção e libera quatro sombras. Ele pode se teletransportar para as sombras." },
      { skillname: "Ougi: Matança Sombria", skilldesc: "Hayabusa se funde com as sombras e causa múltiplos ataques em uma área, causando 130 (+75% de Ataque Físico Extra) de Dano Físico. Prioriza inimigos com a Marca Sombra." }
    ],
    combos: [
      { title: "Combo de Assassino", desc: "Use a Habilidade 2 para se aproximar ou posicionar sombras. Use a Habilidade 1 para pokear e aplicar marcas. Ative a Ultimate em um alvo marcado para dano máximo e, em seguida, use a Habilidade 2 para escapar." }
    ]
  },
  "Gord": {
    name: "Gord",
    summary: "Gord é um mago que se entregou à magia arcana e se fundiu com sua prancha de surf mística. Ele agora vaga pelo mundo, buscando o poder supremo.",
    skills: [
      { skillname: "Favor Arcano", skilldesc: "Causar dano a um inimigo com uma habilidade 4 vezes em um curto período causa 140 (+60% de Poder Mágico Total) de Dano Verdadeiro extra." },
      { skillname: "Projétil Místico", skilldesc: "Gord lança um projétil que quica, causando 270 (+80% de Poder Mágico Total) de Dano Mágico e atordoando os inimigos na área de impacto." },
      { skillname: "Injeção Mística", skilldesc: "Gord invoca um campo de energia que causa 80 (+20% de Poder Mágico Total) de Dano Mágico a cada 0.3s." },
      { skillname: "Êxtase Místico", skilldesc: "Gord dispara um raio de energia, causando 200 (+50% de Poder Mágico Total) de Dano Mágico a cada 0.2s e retardando os inimigos em 20%." }
    ],
    combos: [
      { title: "Combo de Controle e Dano", desc: "Use a Habilidade 1 para atordoar o alvo. Imediatamente coloque a Habilidade 2 sob ele e ative a Ultimate para dano contínuo massivo." }
    ]
  },
  "Kagura": {
    name: "Kagura",
    summary: "Kagura é uma mestra Onmyouji que carrega o Guarda-Chuva Seimei, um artefato de família. Ela viajou para a Terra do Amanhecer para encontrar seu amigo de infância, Hayabusa.",
    skills: [
      { skillname: "Reunião do Yin Yang", skilldesc: "Quando Kagura se reúne com seu guarda-chuva, ela ganha um escudo e atordoa os inimigos próximos." },
      { skillname: "Guarda-Chuva Seimei Aberto", skilldesc: "Kagura move seu guarda-chuva para um local, causando 290 (+135% de Poder Mágico Total) de Dano Mágico e retardando os inimigos." },
      { skillname: "Fuga do Rakshasa", skilldesc: "Kagura se move em uma direção, deixando seu guarda-chuva para trás. Ela remove debuffs ao usar esta habilidade." },
      { skillname: "Reversão do Yin Yang", skilldesc: "Com o guarda-chuva, ele repele inimigos próximos. Sem o guarda-chuva, ele puxa os inimigos em direção a ele, causando dano e retardando-os." }
    ],
    combos: [
      { title: "Combo de Burst Completo", desc: "Jogue o guarda-chuva (Habilidade 1), use a Ultimate para puxar os inimigos, use a Habilidade 1 novamente para reposicionar o guarda-chuva, e use a segunda parte da Ultimate para causar dano massivo." }
    ]
  },
  "Chou": {
    name: "Chou",
    summary: "Chou é um lutador de Kung Fu de um bairro pobre. Ele se levantou contra a injustiça e se tornou um herói para o povo, usando suas habilidades para proteger os fracos.",
    skills: [
      { skillname: "Só Rápido", skilldesc: "Após cada 8 jardas de movimento, o próximo Ataque Básico de Chou causa 180% do dano e retarda o alvo." },
      { skillname: "Jeet Kune Do", skilldesc: "Chou soca para a frente 3 vezes. Os dois primeiros golpes causam dano, e o terceiro arremessa os inimigos ao ar." },
      { skillname: "Shunpo", skilldesc: "Chou avança, tornando-se imune a efeitos de controle durante o avanço. Ele ganha penetração física e um escudo após o avanço." },
      { skillname: "O Caminho do Dragão", skilldesc: "Chou chuta um alvo, repelindo-o e causando 400 (+200% de Ataque Físico Extra) de Dano Físico. Ele pode reativar para perseguir o alvo chutado." }
    ],
    combos: [
      { title: "Combo de Insec", desc: "Use a Habilidade 2 para se posicionar atrás de um alvo, use a Ultimate para chutá-lo em direção à sua equipe, e use a Habilidade 1 para controle adicional." }
    ]
  },
  "Ruby": {
    name: "Ruby",
    summary: "Ruby é uma garotinha que foi salva pelo caçador de lobos, Roger. Ela agora luta ao lado dele, usando sua foice para proteger aqueles que ama e punir os lobos que ameaçam sua vila.",
    skills: [
      { skillname: "Vamos Dançar!", skilldesc: "Ruby pode dar um pequeno salto após cada habilidade. Ela tem 10% de Roubo de Vida Físico e herda 115% do efeito de Roubo de Vida de equipamentos." },
      { skillname: "Seja Bom!", skilldesc: "Ruby balança sua foice, causando 80 (+75% de Ataque Físico Total) de Dano Físico e enviando uma onda de choque que causa dano adicional." },
      { skillname: "Não Fuja, Rei Lobo!", skilldesc: "Ruby gira sua foice duas vezes, causando 60 (+55% de Ataque Físico Total) de Dano Físico e atordoando os inimigos ao seu redor." },
      { skillname: "Eu Estou Ofendida!", skilldesc: "Ruby usa sua foice para puxar todos os inimigos em uma grande área em sua direção, causando 200 (+200% de Ataque Físico Total) de Dano Físico e atordoando-os." }
    ],
    combos: [
      { title: "Combo de Controle em Massa", desc: "Use a Ultimate para puxar vários inimigos, seguido da Habilidade 2 para atordoá-los em grupo. Use a Habilidade 1 e Ataques Básicos para se curar com o Roubo de Vida." }
    ]
  },
  "Yi Sun-shin": {
    name: "Yi Sun-shin",
    summary: "Yi Sun-shin é um lendário almirante coreano que comanda uma frota de navios-tartaruga. Ele é um mestre estrategista e um guerreiro formidável, defendendo sua pátria de invasores.",
    skills: [
      { skillname: "General da Montanha", skilldesc: "Yi Sun-shin escolhe sua arma (espada ou arco) e ganha efeitos diferentes. Seus Ataques Básicos após usar uma habilidade são aprimorados." },
      { skillname: "Avanço Destemido", skilldesc: "Yi Sun-shin avança e ataca, causando dano com sua espada. Ele se torna imune a controle de grupo durante o avanço." },
      { skillname: "Flecha de Sangue e Fogo", skilldesc: "Yi Sun-shin dispara uma flecha poderosa que causa dano e retarda os inimigos com base no tempo de carregamento." },
      { skillname: "Chuva de Flechas da Montanha", skilldesc: "Yi Sun-shin comanda a frota para lançar 3 ondas de flechas de fogo em todos os heróis inimigos no mapa, causando dano e revelando sua posição." }
    ],
    combos: [
      { title: "Combo de Dano Híbrido", desc: "Use a Habilidade 3 para pokear à distância. Use a Habilidade 2 para se aproximar ou escapar. Alterne entre arco e espada para maximizar o dano da passiva. A Ultimate é global e pode ser usada para garantir abates ou ajudar aliados." }
    ]
  },
  "Moskov": {
    name: "Moskov",
    summary: "Moskov era o líder de seu clã, mas foi corrompido pelo Abismo após uma tragédia. Agora ele é um servo da escuridão, buscando poder e vingança com sua lança penetrante.",
    skills: [
      { skillname: "Lança do Silêncio", skilldesc: "Os Ataques Básicos de Moskov penetram os alvos e atingem inimigos atrás deles." },
      { skillname: "Passo do Abismo", skilldesc: "Moskov se teletransporta para um local, ganhando Velocidade de Ataque. Seu próximo ataque é aprimorado." },
      { skillname: "Lança da Morte", skilldesc: "Moskov ataca com força, repelindo um inimigo. Se o inimigo colidir com outro herói ou parede, ambos ficam atordoados." },
      { skillname: "Lança da Destruição", skilldesc: "Moskov lança uma lança poderosa que viaja pelo mapa, causando dano massivo com base na distância percorrida." }
    ],
    combos: [
      { title: "Combo de Atordoamento e Dano", desc: "Use a Habilidade 1 para se reposicionar. Use a Habilidade 2 para empurrar um inimigo contra uma parede e atordoá-lo. Use Ataques Básicos para causar dano penetrante. A Ultimate pode ser usada para finalizar alvos em fuga em qualquer lugar do mapa." }
    ]
  },
  "Johnson": {
    name: "Johnson",
    summary: "Johnson era um jogador de rúgbi que, após um acidente, teve sua consciência transferida para um carro. Agora ele pode se transformar em um veículo, protegendo seus aliados e atropelando seus inimigos.",
    skills: [
      { skillname: "Carro Elétrico", skilldesc: "Quando o HP de Johnson cai abaixo de 30%, ele ganha um escudo que absorve 300 (+700% da Defesa Física Total) de dano por 10s." },
      { skillname: "Míssil Mortal", skilldesc: "Johnson lança uma chave inglesa que causa dano e atordoa os inimigos em uma pequena área." },
      { skillname: "Ataque Eletromagnético", skilldesc: "Johnson levanta seu escudo, causando dano e retardando os inimigos em uma área frontal." },
      { skillname: "Aceleração Máxima", skilldesc: "Johnson se transforma em um carro, acelerando gradualmente. Ele pode levar um aliado com ele. Colidir com um inimigo causa dano e atordoamento em área." }
    ],
    combos: [
      { title: "Combo de Gank", desc: "Ative a Ultimate e dirija pelo mapa com um aliado. Ao encontrar um alvo, colida com ele para atordoar. Use a Habilidade 1 para atordoar novamente e a Habilidade 2 para causar lentidão e dano." }
    ]
  },
  "Cyclops": {
    name: "Cyclops",
    summary: "Cyclops é um gigante de um olho só fascinado por estrelas e planetas. Ele usa seu poder cósmico para manipular o tempo e o espaço, prendendo seus inimigos em esferas planetárias.",
    skills: [
      { skillname: "Relógio das Estrelas", skilldesc: "Atingir inimigos com habilidades reduz a recarga de todas as suas habilidades em 0.5s." },
      { skillname: "Ataque Planetário", skilldesc: "Cyclops envia duas ondas de planetas, cada uma causando 275 (+60% de Poder Mágico Total) de Dano Mágico." },
      { skillname: "Planetas em Ataque", skilldesc: "Cyclops cria esferas de estrelas que orbitam ao seu redor, causando 210 (+50% de Poder Mágico Total) de Dano Mágico ao primeiro inimigo que tocarem. Ele também ganha velocidade de movimento." },
      { skillname: "Bloqueio Estelar", skilldesc: "Cyclops cria uma esfera gigante que persegue um herói, imobilizando-o por 1-2s e causando 500 (+220% de Poder Mágico Total) de Dano Mágico." }
    ],
    combos: [
      { title: "Combo de Perseguição e Dano", desc: "Use a Ultimate para prender um alvo. Aproxime-se com a Habilidade 2 ativada para dano contínuo e use a Habilidade 1 para dano em área. A passiva reduzirá suas recargas rapidamente." }
    ]
  },
  "Hilda": {
    name: "Hilda",
    summary: "Hilda é a líder de um clã de guerreiros das montanhas. Ela é feroz e protetora, usando seu machado para defender seu povo e seu território de qualquer invasor.",
    skills: [
      { skillname: "Bênção do Deserto", skilldesc: "Hilda regenera 2% do seu HP máximo por segundo e ganha um escudo quando está em um arbusto. O escudo dura 5s." },
      { skillname: "Ritual de Combate", skilldesc: "Hilda ativa o poder de seu machado, aumentando sua velocidade de movimento. Seu próximo Ataque Básico causa dano extra e retarda o alvo." },
      { skillname: "Arte da Caça", skilldesc: "Hilda se prende a um alvo, podendo usar a habilidade até 3 vezes. O segundo ataque causa dano em área, e o terceiro repele os inimigos." },
      { skillname: "Poder da Megalitia", skilldesc: "Hilda salta e ataca um alvo, causando 800 (+250% de Ataque Físico Extra) de Dano Físico. A habilidade ganha acúmulos a cada abate ou assistência, aumentando seu dano." }
    ],
    combos: [
      { title: "Combo de Caça", desc: "Fique nos arbustos para ativar a passiva. Use a Habilidade 1 para se aproximar rapidamente, use a Habilidade 2 para prender o alvo e, em seguida, finalize com a Ultimate para dano massivo." }
    ]
  },
  "Aurora": {
    name: "Aurora",
    summary: "Aurora é a Rainha do Norte, controlando o gelo e a neve. Ela guarda as terras do norte, congelando qualquer um que ouse perturbar a paz de seu reino gelado.",
    skills: [
      { skillname: "Orgulho do Gelo", skilldesc: "Cada vez que Aurora usa uma habilidade, ela ganha uma unidade de energia de gelo. Com 4 unidades, sua próxima habilidade congelará o alvo." },
      { skillname: "Onda de Gelo", skilldesc: "Aurora dispara uma onda de gelo que explode, causando 300 (+130% de Poder Mágico Total) de Dano Mágico e retardando os inimigos." },
      { skillname: "Geada Amarga", skilldesc: "Aurora causa 450 (+160% de Poder Mágico Total) de Dano Mágico em um alvo e o retarda." },
      { skillname: "Destruição Fria", skilldesc: "Aurora invoca um meteoro de gelo gigante que atinge uma área, causando 800 (+240% de Poder Mágico Total) de Dano Mágico e retardando muito os inimigos." }
    ],
    combos: [
      { title: "Combo de Congelamento em Massa", desc: "Carregue a passiva com 4 acúmulos. Use a Habilidade 2 ou Habilidade 1 para congelar um alvo (ou a Ultimate para congelar em área), seguido das outras habilidades para dano máximo enquanto estão imobilizados." }
    ]
  },
  "Lapu-Lapu": {
    name: "Lapu-Lapu",
    summary: "Lapu-Lapu é um chefe tribal corajoso que defendeu sua terra de invasores. Ele empunha lâminas gêmeas e é um mestre do combate, inspirando seu povo com sua bravura.",
    skills: [
      { skillname: "Coragem do Herói", skilldesc: "Lapu-Lapu ganha bravura ao causar dano. Quando a bravura está cheia, seu próximo Ataque Básico ou Habilidade 1 causa dano extra e concede um escudo." },
      { skillname: "Lâmina da Justiça", skilldesc: "Lapu-Lapu lança suas lâminas, causando dano. Na postura de Lâminas Pesadas, ele lança uma roda de energia." },
      { skillname: "Lâmina da Bravura", skilldesc: "Lapu-Lapu avança, causando dano. Na postura de Lâminas Pesadas, ele gira e causa dano contínuo." },
      { skillname: "O Mais Corajoso Lutador", skilldesc: "Lapu-Lapu salta e combina suas lâminas, entrando na postura de Lâminas Pesadas com habilidades aprimoradas. Ele causa dano massivo na aterrissagem." }
    ],
    combos: [
      { title: "Combo de Transformação", desc: "Use a Habilidade 1 e 2 para carregar a passiva. Ative a Ultimate para pular nos inimigos, entre na postura de Lâminas Pesadas e use suas habilidades aprimoradas para dano massivo e controle." }
    ]
  },
  "Vexana": {
    name: "Vexana",
    summary: "Vexana era uma rainha bondosa, mas a traição de seu marido a levou a fazer um pacto com o Abismo. Ela se tornou a Rainha Necromante, controlando os mortos e espalhando a praga.",
    skills: [
      { skillname: "Abraço do Necromante", skilldesc: "Inimigos que recebem dano de Vexana ou seu Cavaleiro Amaldiçoado explodirão ao morrer, causando dano em área." },
      { skillname: "Encanto da Morte", skilldesc: "Vexana lança uma mão fantasma que aterroriza o primeiro herói inimigo atingido, fazendo-o fugir." },
      { skillname: "Sopro Etéreo", skilldesc: "Vexana invoca um poder do submundo em um local, causando dano mágico contínuo." },
      { skillname: "Guardião Eterno", skilldesc: "Vexana invoca um Cavaleiro Amaldiçoado que ataca junto com ela, causando dano e arremessando os inimigos ao ar com seu ataque inicial." }
    ],
    combos: [
      { title: "Combo de Controle e Invocação", desc: "Use a Habilidade 1 para aterrorizar um alvo, coloque a Habilidade 2 sob ele e invoque a Ultimate para dano contínuo e controle adicional do cavaleiro." }
    ]
  },
  "Roger": {
    name: "Roger",
    summary: "Roger é um caçador que vive na floresta. Ele foi amaldiçoado e agora se transforma em um lobisomem sob a lua cheia. Ele usa seus poderes para proteger os inocentes dos perigos da floresta.",
    skills: [
      { skillname: "Maldição da Lua Cheia", skilldesc: "Na forma humana, seus ataques básicos retardam. Na forma de lobo, causam dano extra com base no HP perdido do alvo." },
      { skillname: "Fogo Aberto / Passos de Lobo", skilldesc: "Humano: Dispara uma rede que retarda e uma rede que causa dano. Lobo: Salta para frente." },
      { skillname: "Passos de Caçador / Uivo de Sangue", skilldesc: "Humano: Aumenta a velocidade de movimento. Lobo: Aumenta a velocidade de ataque." },
      { skillname: "Forma de Lobo / Restaurar Forma Humana", skilldesc: "Roger se transforma em lobo, saltando e causando dano. Retornar à forma humana causa dano em área e concede um escudo." }
    ],
    combos: [
      { title: "Combo de Caça", desc: "Na forma humana, use a Habilidade 1 para pokear. Use a Ultimate para pular em um alvo com pouca vida. Na forma de lobo, use a Habilidade 2 para velocidade de ataque e a Habilidade 1 para finalizar." }
    ]
  },
  "Gatotkaca": {
    name: "Gatotkaca",
    summary: "Gatotkaca é um herói mítico da Indonésia, conhecido como 'o homem com ossos de ferro e músculos de arame'. Ele é um guerreiro poderoso que pode voar e possui força sobre-humana.",
    skills: [
      { skillname: "Força de Aço", skilldesc: "Gatotkaca converte 4% do seu HP perdido em Defesa Física. Atingir inimigos com HP mais alto com ataques básicos causa dano extra e cura." },
      { skillname: "Explosão de Punho", skilldesc: "Gatotkaca quebra o chão, causando dano e lentidão em uma linha." },
      { skillname: "Ataque Ininterrupto", skilldesc: "Gatotkaca avança e provoca os inimigos, forçando-os a atacá-lo e refletindo dano." },
      { skillname: "Avatar do Guardião", skilldesc: "Gatotkaca salta para uma área, arremessando os inimigos ao ar e causando dano massivo. Inimigos próximos à borda da área são puxados para o centro." }
    ],
    combos: [
      { title: "Combo de Iniciação e Provocação", desc: "Use a Ultimate para pular no meio da equipe inimiga. Em seguida, use a Habilidade 2 para provocar e forçá-los a atacá-lo, enquanto sua equipe causa dano." }
    ]
  },
  "Harley": {
    name: "Harley",
    summary: "Harley é um jovem mago genial da Academia de Magia. Ele é um mestre das cartas e da ilusão, capaz de enganar seus inimigos e desaparecer em um piscar de olhos.",
    skills: [
      { skillname: "Mestre da Magia", skilldesc: "O Ataque Básico de Harley causa Dano Mágico." },
      { skillname: "Truque de Pôquer", skilldesc: "Harley lança 3 rodadas de cartas, causando 130 (+25% de Poder Mágico Total) de Dano Mágico por rodada." },
      { skillname: "Fuga Espacial", skilldesc: "Harley se teletransporta, deixando seu chapéu para trás e ganhando velocidade de movimento. Ele pode reativar para voltar ao chapéu." },
      { skillname: "Anel de Fogo Mortal", skilldesc: "Harley lança um anel de fogo em um alvo, causando 200 (+60% de Poder Mágico Total) de Dano Mágico e criando um anel ao redor dele. O anel explode após 4s, causando dano massivo com base no dano que Harley causou ao alvo enquanto o anel estava ativo." }
    ],
    combos: [
      { title: "Combo de Burst e Fuga", desc: "Use a Habilidade 2 para se aproximar, ative a Ultimate no alvo, use a Habilidade 1 para causar o máximo de dano possível e, em seguida, reative a Habilidade 2 para retornar com segurança antes que o anel exploda." }
    ]
  },
  "Irithel": {
    name: "Irithel",
    summary: "Abandonada na selva, Irithel foi adotada por um Smilodon. Juntos, eles caçam e protegem seu território. Irithel é a única atiradora que pode se mover enquanto ataca.",
    skills: [
      { skillname: "Arco da Selva", skilldesc: "Irithel pode se mover enquanto dispara com seu arco. Ela dispara 3 flechas por Ataque Básico, cada uma causando 35% do dano." },
      { skillname: "Saraivada de Flechas", skilldesc: "Irithel dispara uma saraivada de flechas, causando 450 (+60% de Ataque Físico Total) de Dano Físico e reduzindo a Defesa Física dos inimigos." },
      { skillname: "Força da Rainha", skilldesc: "Leo, seu Smilodon, ruge, causando 200 (+60% de Ataque Físico Total) de Dano Físico e retardando os inimigos." },
      { skillname: "Besta Pesada", skilldesc: "Irithel ordena que Leo salte, ganhando dano de Ataque Básico aumentado e dano em área por 15s." }
    ],
    combos: [
      { title: "Combo de Dano em Movimento", desc: "Ative a Ultimate para dano em área. Use a Habilidade 1 para reduzir a defesa dos alvos e a Habilidade 2 para retardá-los, enquanto se move e ataca continuamente." }
    ]
  },
  "Grock": {
    name: "Grock",
    summary: "Grock é um antigo guardião de pedra que despertou para encontrar seu lar destruído. Ele agora viaja com sua torre, procurando um novo lugar para chamar de lar.",
    skills: [
      { skillname: "Dádiva Ancestral", skilldesc: "Quando perto de uma parede ou torre, Grock ganha Defesa Física e Mágica, regeneração de HP e velocidade de movimento." },
      { skillname: "Poder da Natureza", skilldesc: "Grock carrega sua arma e a balança, causando 300 (+150% de Ataque Físico Extra) de Dano Físico. Ele se torna imune a controle de grupo enquanto carrega." },
      { skillname: "Barreira do Guardião", skilldesc: "Grock invoca uma parede de pedra que bloqueia o caminho dos inimigos." },
      { skillname: "Carga Selvagem", skilldesc: "Grock avança, repelindo os inimigos. Se ele colidir com uma parede ou torre, causa dano massivo em área e atordoa." }
    ],
    combos: [
      { title: "Combo de Parede", desc: "Use a Habilidade 2 para criar uma parede atrás de um inimigo. Em seguida, use a Ultimate para avançar e colidir com o inimigo contra a parede, causando atordoamento e dano massivo." }
    ]
  },
  "Argus": {
    name: "Argus",
    summary: "Argus era um anjo da luz que caiu na tentação do poder. Ele se entregou a uma lâmina amaldiçoada para obter a imortalidade, tornando-se um anjo caído.",
    skills: [
      { skillname: "Aquecendo Demônio", skilldesc: "Atingir inimigos com habilidades ou ataques básicos carrega sua lâmina. Quando cheia, seu próximo Ataque Básico ataca 3 vezes rapidamente." },
      { skillname: "Aperto Demoníaco", skilldesc: "Argus lança uma mão demoníaca que o puxa para o alvo, causando dano e atordoando." },
      { skillname: "Lâmina Meteórica", skilldesc: "Argus ataca com sua lâmina, causando dano e deixando um rastro amaldiçoado que concede velocidade de movimento." },
      { skillname: "Eterno Mal", skilldesc: "Argus se transforma em um anjo caído por 4s, tornando-se imune à morte. 40% do dano recebido durante este período o curará." }
    ],
    combos: [
      { title: "Combo de Imortalidade", desc: "Use a Habilidade 1 para se aproximar. Ative a Ultimate quando estiver com pouca vida para se tornar imortal e se curar. Use a Habilidade 2 e Ataques Básicos para causar dano enquanto estiver invulnerável." }
    ]
  },
  "Odette": {
    name: "Odette",
    summary: "Odette é uma princesa do Castelo Swan, graciosa e bela. Ela é uma maga poderosa que usa a música e a magia dos cisnes para encantar e destruir seus inimigos.",
    skills: [
      { skillname: "Canção dos Lagos", skilldesc: "Após usar uma habilidade, o próximo Ataque Básico ou habilidade de Odette envia uma onda sonora que ricocheteia, causando Dano Mágico." },
      { skillname: "Cisne Aviano", skilldesc: "Odette concentra energia para invocar um cisne que ataca os inimigos, causando 250 (+150% de Poder Mágico Total) de Dano Mágico e retardando-os." },
      { skillname: "Energia Nova Azul", skilldesc: "Odette dispara uma bola de energia que imobiliza os dois primeiros inimigos atingidos." },
      { skillname: "Canção do Cisne", skilldesc: "Odette canta uma canção, causando dano contínuo em uma grande área e retardando os inimigos. Ela também ganha um escudo." }
    ],
    combos: [
      { title: "Combo de Dano em Área", desc: "Use a Habilidade 2 para imobilizar os alvos. Em seguida, ative a Ultimate para causar dano massivo em área. Use a Habilidade 1 para pokear e ativar a passiva." }
    ]
  },
  "Lancelot": {
    name: "Lancelot",
    summary: "Lancelot é um espadachim nobre e arrogante da Casa Baroque. Ele é um mestre da esgrima, movendo-se com graça e precisão mortais no campo de batalha.",
    skills: [
      { skillname: "Código da Alma", skilldesc: "A cada 10s, a próxima habilidade de Lancelot quebra a defesa do alvo, causando dano extra." },
      { skillname: "Perfuração", skilldesc: "Lancelot avança, causando 100 (+50% de Ataque Físico Total) de Dano Físico. Se ele atingir um inimigo que não tenha a marca, a recarga da habilidade é zerada." },
      { skillname: "Rosa de Espinhos", skilldesc: "Lancelot ataca 3 vezes em uma área triangular, causando 250 (+100% de Ataque Físico Extra) de Dano Físico e retardando os inimigos." },
      { skillname: "Execução Fantasma", skilldesc: "Lancelot se torna invulnerável e ataca em uma direção, causando 400 (+250% de Ataque Físico Extra) de Dano Físico." }
    ],
    combos: [
      { title: "Combo de Dano e Mobilidade", desc: "Use a Habilidade 1 para avançar através de minions e heróis, zerando a recarga. Use a Habilidade 2 para dano em área e para desviar de habilidades. Finalize com a Ultimate para dano e invulnerabilidade." }
    ]
  },
  "Diggie": {
    name: "Diggie",
    summary: "Diggie é um pequeno e sábio pássaro, um estudioso do tempo de Eruditio. Ele pode manipular o tempo para proteger seus aliados e prender seus inimigos em bombas-relógio.",
    skills: [
      { skillname: "Jovem de Novo", skilldesc: "Quando Diggie morre, ele se transforma em um ovo. Ele pode se mover e usar habilidades que não causam dano. Ele renasce mais rápido." },
      { skillname: "Bomba-Relógio Automática", skilldesc: "Diggie joga um despertador que explode após um tempo, causando 500 (+120% de Poder Mágico Total) de Dano Mágico em área. Ele pode detoná-lo mais cedo." },
      { skillname: "Tempo Reverso", skilldesc: "Diggie marca um alvo. Após 4s, o alvo é puxado de volta para o local marcado, recebendo dano." },
      { skillname: "Jornada do Tempo", skilldesc: "Diggie cria um escudo para si e seus aliados próximos que os torna imunes a efeitos de controle de grupo por 2.5s." }
    ],
    combos: [
      { title: "Combo de Proteção e Controle", desc: "Use a Habilidade 1 para zoneamento e dano. Use a Habilidade 2 em um alvo que está fugindo para puxá-lo de volta. A Ultimate é crucial para salvar sua equipe de habilidades de controle de grupo em massa." }
    ]
  },
  "Hylos": {
    name: "Hylos",
    summary: "Hylos é o Grande Guardião, uma criatura mística que protege a Fonte da Lua. Ele usa o poder da natureza para punir os invasores e curar a terra.",
    skills: [
      { skillname: "Sangue Grosso", skilldesc: "Cada ponto de mana máximo de Hylos concede 1.5 de HP. Quando sem mana, ele pode usar HP para conjurar habilidades." },
      { skillname: "Lei e Ordem", skilldesc: "Hylos se prende a um alvo, causando 120 (+80% de Poder Mágico Total) de Dano Mágico e atordoando-o por 1s." },
      { skillname: "Anel da Punição", skilldesc: "Hylos libera um anel de energia que causa 120 (+20% de Poder Mágico Total) de Dano Mágico por segundo e retarda os inimigos, além de reduzir a velocidade de ataque deles." },
      { skillname: "Caminho Glorioso", skilldesc: "Hylos cria um caminho que aumenta sua velocidade de movimento e cura, enquanto retarda os inimigos que estão nele." }
    ],
    combos: [
      { title: "Combo de Tanque e Suporte", desc: "Ative a Habilidade 2 para causar dano e lentidão contínuos. Use a Habilidade 1 para atordoar um alvo prioritário. Use a Ultimate para iniciar uma luta, dar velocidade à sua equipe ou para escapar." }
    ]
  },
  "Zhask": {
    name: "Zhask",
    summary: "Zhask é um ser de um enxame alienígena que viaja pelo universo, consumindo planetas. Ele pode invocar crias do enxame para lutar por ele.",
    skills: [
      { skillname: "Decaimento", skilldesc: "Ao morrer, Zhask ordena que sua cria exploda, causando Dano Verdadeiro." },
      { skillname: "Pesadelo da Prole", skilldesc: "Zhask invoca uma cria que ataca inimigos próximos. Seus ataques básicos aumentam o dano da cria." },
      { skillname: "Mente Devoradora", skilldesc: "Zhask dispara um raio de energia que causa dano e atordoa o primeiro inimigo atingido." },
      { skillname: "Enxame de Colmeias", skilldesc: "Zhask lança um enxame de colmeias que explodem ao entrar em contato com inimigos, causando dano e lentidão." },
      { skillname: "Dominador do Descenso", skilldesc: "Zhask se funde com sua cria, aumentando muito seus atributos e aprimorando suas habilidades." }
    ],
    combos: [
      { title: "Combo de Invocador", desc: "Posicione sua cria (Habilidade 1). Use a Habilidade 3 para dano em área e a Habilidade 2 para atordoar. Ative a Ultimate para se fundir com a cria e maximizar seu dano e sobrevivência." }
    ]
  },
  "Helcurt": {
    name: "Helcurt",
    summary: "Helcurt é uma criatura do Abismo que caça na escuridão. Ele pode silenciar seus inimigos e mergulhar o campo de batalha em trevas, aterrorizando suas presas.",
    skills: [
      { skillname: "Caçador da Raça", skilldesc: "Inimigos próximos que usarem habilidades perto de Helcurt serão silenciados por 1.5s." },
      { skillname: "Sombra Transitória", skilldesc: "Helcurt se teletransporta, causando dano e silenciando os inimigos na área de chegada." },
      { skillname: "Ferrão Mortal", skilldesc: "Helcurt dispara ferrões venenosos para a frente. Cada ferrão causa dano e retarda. Coletar ferrões aprimora seu próximo ataque." },
      { skillname: "Olho da Noite", skilldesc: "Helcurt mergulha o mapa inteiro na escuridão, reduzindo a visão de todos os heróis inimigos. Ele ganha velocidade de movimento e ataque durante o efeito." }
    ],
    combos: [
      { title: "Combo de Emboscada", desc: "Ative a Ultimate para criar escuridão. Use a Habilidade 1 para se teletransportar para um alvo, silenciando-o. Use a Habilidade 2 para dano massivo." }
    ]
  },
  "Pharsa": {
    name: "Pharsa",
    summary: "Pharsa era a princesa do Povo Corvo. Após seu casamento ser atacado, ela ficou cega, mas despertou seu poder, permitindo que ela se transformasse em um pássaro e usasse magia devastadora.",
    skills: [
      { skillname: "Conexão Espiritual", skilldesc: "A cada 10s, Verri (seu pássaro) ataca um inimigo que Pharsa atingiu, causando Dano Mágico extra e retardando-o." },
      { skillname: "Maldição do Corvo", skilldesc: "Pharsa lança uma magia que marca os inimigos. Atingir um inimigo marcado com outra habilidade o atordoará." },
      { skillname: "Asas por Asas", skilldesc: "Pharsa se transforma em um pássaro e pode voar sobre o terreno por 5s." },
      { skillname: "Ataque Aéreo Emplumado", skilldesc: "Pharsa voa e pode lançar 4 rodadas de bombardeios aéreos em uma grande área, causando dano massivo." }
    ],
    combos: [
      { title: "Combo de Bombardeio", desc: "Use a Habilidade 1 para marcar os alvos. Ative a Ultimate para bombardeá-los à distância. A marca da Habilidade 1 os atordoará se forem atingidos pela Ultimate. Use a Habilidade 2 para escapar ou se reposicionar." }
    ]
  },
  "Lesley": {
    name: "Lesley",
    summary: "Adotada pela família Vance, Lesley é a irmã mais velha de Harley. Ela é uma atiradora mortal que protege seu irmão mais novo das sombras, eliminando seus inimigos de longe.",
    skills: [
      { skillname: "Tiro Letal", skilldesc: "Atingir um inimigo com um Ataque Básico concede 5 de energia. Se Lesley não receber dano por 5s, seu próximo Ataque Básico tem alcance extra e causa dano crítico." },
      { skillname: "Mestre da Camuflagem", skilldesc: "Lesley entra em estado de camuflagem, aumentando sua velocidade de movimento e Ataque Físico." },
      { skillname: "Granada Tática", skilldesc: "Lesley joga uma granada que causa dano e repele os inimigos, enquanto ela salta para trás." },
      { skillname: "Tiro Final", skilldesc: "Lesley mira em um herói inimigo e dispara 4 balas mortais. Cada bala pode ser bloqueada por outros heróis." }
    ],
    combos: [
      { title: "Combo de Atiradora", desc: "Use a Habilidade 1 para se posicionar e aprimorar seu próximo ataque. Use a Habilidade 2 para se afastar de inimigos que se aproximam. Finalize alvos em fuga com a Ultimate." }
    ]
  },
  "Jawhead": {
    name: "Jawhead",
    summary: "Jawhead é um robô controlado por uma garotinha chamada Alice. Juntos, eles são uma dupla travessa e destrutiva, causando caos e confusão por onde passam.",
    skills: [
      { skillname: "Compressão de Mecha", skilldesc: "A cada vez que Jawhead causa dano, ele aplica uma marca no alvo. Acumulando marcas, seus Ataques Básicos causam dano extra." },
      { skillname: "Ejetor", skilldesc: "Jawhead arremessa o alvo mais próximo (minion ou herói) em um local, causando dano e atordoando em área." },
      { skillname: "Míssil Inteligente", skilldesc: "Jawhead dispara mísseis que perseguem alvos próximos." },
      { skillname: "Incontrolável", skilldesc: "Jawhead se prende a um alvo, avança e o esmaga no chão, causando dano e atordoamento." }
    ],
    combos: [
      { title: "Combo de Arremesso", desc: "Ative a Habilidade 2 para pegar velocidade. Use a Ultimate para se prender a um alvo. Use a Habilidade 1 para arremessar o alvo em direção à sua equipe." }
    ]
  },
  "Angela": {
    name: "Angela",
    summary: "Criada pelo Dr. Baker, Angela é uma boneca mecânica com um coração. Ela anseia por explorar o mundo e ajudar os outros com suas habilidades de cura e proteção.",
    skills: [
      { skillname: "Coração Inteligente", skilldesc: "Usar habilidades aumenta a velocidade de movimento de Angela." },
      { skillname: "Amor em Ondas", skilldesc: "Angela libera energia de amor que causa dano e aplica marcas. Inimigos marcados recebem dano extra e são retardados." },
      { skillname: "Marionete de Cordas", skilldesc: "Angela prende um alvo com cordas, causando dano contínuo. Se o alvo permanecer preso, ele será imobilizado." },
      { skillname: "Guarda-Coração", skilldesc: "Angela se anexa a um herói aliado, concedendo-lhe um escudo massivo. Ela pode usar suas outras habilidades enquanto estiver anexada." }
    ],
    combos: [
      { title: "Combo de Suporte Global", desc: "Use a Ultimate para se anexar a um aliado em perigo em qualquer lugar do mapa. Enquanto estiver anexada, use a Habilidade 1 para curar/causar dano e a Habilidade 2 para prender inimigos." }
    ]
  },
  "Gusion": {
    name: "Gusion",
    summary: "Gusion é um membro da nobre família Paxley, que desaprovava sua paixão por lâminas em vez de magia. Ele partiu para provar que seu próprio caminho era o correto.",
    skills: [
      { skillname: "Especialista em Adagas", skilldesc: "Cada conjuração de habilidade adiciona uma runa à adaga de Gusion. Após 3 acúmulos, seu próximo Ataque Básico causa dano extra com base no HP perdido do alvo e o cura." },
      { skillname: "Ponta da Espada", skilldesc: "Gusion joga uma adaga, causando dano e marcando o alvo. Ele pode reativar para se mover para trás do alvo." },
      { skillname: "Chuva de Lâminas", skilldesc: "Gusion joga cinco adagas para a frente, causando dano. Ele pode reativar para chamá-las de volta, causando dano novamente." },
      { skillname: "Incandescência", skilldesc: "Gusion avança e zera a recarga da Habilidade 1 e 2. Ele pode reativar para avançar novamente." }
    ],
    combos: [
      { title: "Combo de Burst Rápido", desc: "Use a Habilidade 1 para marcar, reative para se aproximar. Use a Habilidade 2, ative a Ultimate para zerar as recargas, use a Habilidade 2 novamente, e traga as adagas de volta para dano massivo." }
    ]
  },
  "Valir": {
    name: "Valir",
    summary: "Valir é um prodígio do fogo da Academia de Magia, rival de Vale. Ele busca dominar as chamas arcanas e provar que seu poder é superior.",
    skills: [
      { skillname: "Calcinar", skilldesc: "As habilidades de Valir aplicam um efeito de queimadura que causa Dano Mágico contínuo. Acumular 3 marcas em um alvo causa uma explosão que o atordoa." },
      { skillname: "Bola de Fogo Explosiva", skilldesc: "Valir lança uma bola de fogo que explode, causando dano e lentidão. Ele pode armazenar até 2 cargas." },
      { skillname: "Chamas Sorentes", skilldesc: "Valir libera um fluxo de chamas que repele os inimigos e causa dano." },
      { skillname: "Vingança Flamejante", skilldesc: "Valir remove todos os debuffs e aprimora suas outras habilidades, aumentando seu dano e alcance por um período." }
    ],
    combos: [
      { title: "Combo de Controle e Queimadura", desc: "Use a Habilidade 1 para pokear e aplicar marcas. Use a Habilidade 2 para repelir inimigos que se aproximam. Ative a Ultimate para aprimorar suas habilidades e use a Habilidade 1 repetidamente para atordoar e causar dano massivo." }
    ]
  },
  "Martis": {
    name: "Martis",
    summary: "Martis é o rei do clã Ashura, um guerreiro que lutou em inúmeras batalhas. Ele empunha lâminas gêmeas e busca oponentes dignos para satisfazer sua sede de combate.",
    skills: [
      { skillname: "Fúria de Ashura", skilldesc: "Cada vez que Martis usa uma habilidade, sua Velocidade de Ataque aumenta. Este efeito acumula." },
      { skillname: "Aura Ashura", skilldesc: "Martis puxa os inimigos para uma área, causando dano." },
      { skillname: "Espiral Mortal", skilldesc: "Martis ataca 3 vezes em uma direção, causando dano. Ele é imune a controle de grupo durante o efeito." },
      { skillname: "Dizimação", skilldesc: "Martis avança em um herói, causando Dano Verdadeiro massivo. Se o alvo for morto, a recarga é zerada e ele ganha velocidade de movimento." }
    ],
    combos: [
      { title: "Combo de Aniquilação", desc: "Use a Habilidade 1 para agrupar os inimigos. Use a Habilidade 2 para causar dano e evitar controle de grupo. Finalize alvos com pouca vida com a Ultimate e repita em outros inimigos." }
    ]
  },
  "Uranus": {
    name: "Uranus",
    summary: "Uranus é o guardião etéreo do Palácio Celestial. Despertado de seu sono, ele agora protege a cidade dos invasores do Abismo com seu poder de regeneração.",
    skills: [
      { skillname: "Esplendor", skilldesc: "Uranus absorve a energia dos ataques que recebe, regenerando HP. Este efeito acumula." },
      { skillname: "Lâminas Iônicas", skilldesc: "Uranus libera duas lâminas de energia que orbitam ao seu redor, causando Dano Mágico." },
      { skillname: "Escudo Etéreo", skilldesc: "Uranus avança e cria um escudo, causando dano e retardando os inimigos. O escudo explode causando dano adicional." },
      { skillname: "Consagração", skilldesc: "Uranus remove efeitos de lentidão e se cura, ganhando velocidade de movimento e aumentando o poder de sua passiva e escudo." }
    ],
    combos: [
      { title: "Combo de Regeneração", desc: "Ative a Habilidade 1 para dano contínuo. Use a Habilidade 2 para se aproximar ou escapar. Ative a Ultimate para aumentar drasticamente sua regeneração e sobrevivência no meio da luta." }
    ]
  },
  "Hanabi": {
    name: "Hanabi",
    summary: "Hanabi é uma ninja do Clã Escarlate, rival de Hayabusa. Ela roubou a arma secreta de seu clã, o Higanbana, para provar que era digna, mas acabou sendo corrompida por seu poder.",
    skills: [
      { skillname: "Ninjutsu: Equinócio", skilldesc: "Quando Hanabi está com a vida cheia, ela ganha um escudo que a torna imune a controle de grupo. 60% do seu roubo de vida é convertido em escudo." },
      { skillname: "Pergaminho Ninjutsu: Pétala", skilldesc: "Hanabi dispara uma kunai que ricocheteia entre os inimigos, causando Dano Físico. A primeira kunai arremessada também aplica efeitos de ataque." },
      { skillname: "Pergaminho Ninjutsu: Flor da Alma", skilldesc: "Hanabi lança uma kunai de energia que causa dano e retarda os inimigos em uma linha." },
      { skillname: "Técnica Proibida: Higanbana", skilldesc: "Hanabi joga o Higanbana que floresce, imobilizando o primeiro inimigo atingido. A flor se espalha para inimigos próximos, imobilizando-os também." }
    ],
    combos: [
      { title: "Combo de Luta em Equipe", desc: "Ative a Habilidade 1 para ricochetear seus ataques em lutas em equipe. Use a Ultimate para prender um grupo de inimigos. Use a Habilidade 2 para retardar e pokear." }
    ]
  },
  "Chang'e": {
    name: "Chang'e",
    summary: "Chang'e é a jovem discípula do Grande Dragão. Ela carrega um coelho da lua e usa sua magia para proteger seu mestre e amigos.",
    skills: [
      { skillname: "Coelho Sortudo", skilldesc: "Após causar dano a um herói, Chang'e ganha uma bênção que aumenta o dano de sua próxima habilidade." },
      { skillname: "Chuva de Meteoros Estelar", skilldesc: "Chang'e invoca meteoros em uma área, causando Dano Mágico contínuo." },
      { skillname: "Bênção da Lua Crescente", skilldesc: "Chang'e ganha um escudo e aumenta sua velocidade de movimento. Seus Ataques Básicos e habilidades são aprimorados." },
      { skillname: "Chuva de Meteoros", skilldesc: "Chang'e dispara uma torrente de meteoros para a frente, causando dano massivo. Sua velocidade de movimento aumenta durante a habilidade." }
    ],
    combos: [
      { title: "Combo de Dano Contínuo", desc: "Use a Habilidade 2 para ganhar escudo e aprimorar suas habilidades. Use a Ultimate para dano massivo à distância e finalize com a Habilidade 1." }
    ]
  },
  "Kaja": {
    name: "Kaja",
    summary: "Kaja é o guardião do Palácio Celestial, um Nazar com o poder de controlar a eletricidade. Ele patrulha os céus, punindo demônios que ousam invadir.",
    skills: [
      { skillname: "Ira do Relâmpago", skilldesc: "A cada 6s, o próximo Ataque Básico de Kaja libera um raio que atinge inimigos próximos, causando Dano Mágico." },
      { skillname: "Ordem do Anel", skilldesc: "Kaja libera um anel de eletricidade que se expande e contrai, causando dano e retardando os inimigos." },
      { skillname: "Bomba de Raios", skilldesc: "Kaja avança, deixando para trás 3 bombas de raios que explodem ao entrar em contato com inimigos." },
      { skillname: "Julgamento Divino", skilldesc: "Kaja prende e suprime um herói inimigo com seu chicote, puxando-o por 2s e causando dano. Ele rouba a Defesa Física e Mágica do alvo." }
    ],
    combos: [
      { title: "Combo de Pickoff Supremo", desc: "Use a Habilidade 2 para se aproximar. Use a Ultimate para prender um alvo importante e use Lampejo para puxá-lo instantaneamente para sua equipe." }
    ]
  },
  "Selena": {
    name: "Selena",
    summary: "Selena era uma jovem sacerdotisa que se sacrificou ao Abismo para ganhar poder. Agora, ela é uma maga que pode alternar entre sua forma élfica e abissal, controlando a magia e as sombras.",
    skills: [
      { skillname: "Simbionte", skilldesc: "Selena pode alternar entre sua Forma Élfica e Abissal. Habilidades usadas em uma forma aplicam uma marca. Atingir uma marca com uma habilidade da outra forma causa dano extra." },
      { skillname: "Armadilha Abissal / Garra Abissal", skilldesc: "Élfica: Coloca uma armadilha que retarda e causa dano. Abissal: Avança causando dano." },
      { skillname: "Flecha Abissal / Alma Devoradora", skilldesc: "Élfica: Dispara uma flecha que atordoa com base na distância. Abissal: Ataca em área, concedendo um escudo." },
      { skillname: "Queda Primeva / Bênção da Lua Negra", skilldesc: "Muda para a forma Abissal, ganhando velocidade e aprimorando seu próximo ataque. Retorna para a forma Élfica, ganhando velocidade." }
    ],
    combos: [
      { title: "Combo de Atordoamento e Abate", desc: "Na forma élfica, acerte uma Flecha Abissal (Habilidade 2) de longa distância. Mude para a forma abissal (Ultimate), use a Habilidade 1 para se aproximar e a Habilidade 2 para finalizar com dano." }
    ]
  },
  "Aldous": {
    name: "Aldous",
    summary: "Aldous é um contratado que guarda o Labirinto de Minos. Ele foi amaldiçoado com um braço que absorve a alma de suas vítimas, tornando-se mais forte a cada abate.",
    skills: [
      { skillname: "Contrato: Transformar", skilldesc: "Após 2 ataques, o próximo Ataque Básico de Aldous causa dano extra e concede um escudo." },
      { skillname: "Contrato: Soco Anímico", skilldesc: "Aldous fortalece seu próximo Ataque Básico. Se ele matar um inimigo com este ataque, ele ganha permanentemente acúmulos de dano para esta habilidade." },
      { skillname: "Contrato: Explosão", skilldesc: "Aldous ganha um escudo e se torna imune a Ataques Básicos. Ele pode reativar para explodir, causando dano e atordoando." },
      { skillname: "Contrato: Perseguir o Destino", skilldesc: "Aldous revela a posição de todos os heróis inimigos. Ele pode reativar para voar em direção a um herói, causando dano e repelindo-o na chegada." }
    ],
    combos: [
      { title: "Combo de Abate Global", desc: "Farme acúmulos com a Habilidade 1 em minions e monstros. Use a Ultimate para voar até um alvo com pouca vida em qualquer lugar do mapa e finalize-o com um soco fortalecido da Habilidade 1." }
    ]
  },
  "Claude": {
    name: "Claude",
    summary: "Claude é um ladrão mestre, acompanhado por seu parceiro macaco, Dexter. Juntos, eles roubam dos ricos e poderosos, causando travessuras e escapando com agilidade.",
    skills: [
      { skillname: "Lado a Lado na Batalha", skilldesc: "Dexter também ataca os alvos de Claude. Ataques básicos de Claude têm chance de atacar duas vezes." },
      { skillname: "Arte do Roubo", skilldesc: "Claude rouba velocidade de ataque e movimento dos inimigos em uma área." },
      { skillname: "Imagem Espelhada de Batalha", skilldesc: "Claude deixa uma imagem espelhada de Dexter para trás e pode se teletransportar para ela." },
      { skillname: "Dueto Ardente", skilldesc: "Claude e Dexter disparam uma barragem de balas ao redor, causando dano em área. Concede um escudo a Claude." }
    ],
    combos: [
      { title: "Combo de Dano em Área", desc: "Use a Habilidade 2 para posicionar a imagem. Use a Habilidade 1 para roubar status dos inimigos, ative a Ultimate para dano massivo e, se necessário, use a Habilidade 2 para escapar." }
    ]
  },
  "Vale": {
    name: "Vale",
    summary: "Vale é o príncipe do vale dos ventos, rival de Valir. Ele pode controlar os ventos e aprimorar suas habilidades para causar dano ou controle, dependendo de sua escolha.",
    skills: [
      { skillname: "Sopro do Vento", skilldesc: "Quando Vale atinge o nível 4, 6 e 8, ele pode aprimorar uma de suas habilidades, seja para dano ou controle." },
      { skillname: "Lâmina de Vento", skilldesc: "Vale lança duas lâminas de vento. Pode ser aprimorado para aumentar o dano ou a área." },
      { skillname: "Vento Conector", skilldesc: "Vale invoca um tornado que arremessa os inimigos ao ar. Pode ser aprimorado para puxar os inimigos para o centro." },
      { skillname: "Lufada de Vento", skilldesc: "Vale invoca uma tempestade de vento em uma área, causando dano massivo. Pode ser aprimorado para puxar os inimigos." }
    ],
    combos: [
      { title: "Combo de Controle e Burst (Aprimorado para Controle)", desc: "Use a Habilidade 2 aprimorada para arremessar o alvo. Imediatamente use a Ultimate para dano e controle adicionais, seguido da Habilidade 1 para finalizar." }
    ]
  },
  "Leomord": {
    name: "Leomord",
    summary: "Leomord era um cavaleiro leal traído e morto em batalha. Vexana o ressuscitou como um cavaleiro morto-vivo, agora eternamente ligado ao seu cavalo espectral, Barbiel.",
    skills: [
      { skillname: "O Juramento", skilldesc: "Se o HP de Leomord cair abaixo de 30%, ele ganha um escudo e aumenta seu ataque." },
      { skillname: "Impulso / Golpe Fantasma", skilldesc: "Sem cavalo: Causa dano e lentidão. Com cavalo: Avança, causando dano." },
      { skillname: "Carga Decisiva / Golpe Fantasmagórico", skilldesc: "Sem cavalo: Avança com um escudo. Com cavalo: Barbiel salta, causando dano e lentidão." },
      { skillname: "Chamado do Cavalo Fantasma", skilldesc: "Leomord convoca Barbiel, que corre pelo campo de batalha, repelindo e retardando os inimigos. Leomord pode então montar Barbiel, ganhando novas habilidades." }
    ],
    combos: [
      { title: "Combo Montado", desc: "Use a Ultimate para convocar Barbiel e derrubar os inimigos. Monte no cavalo e use suas habilidades aprimoradas (Habilidade 1 e 2) para perseguir e causar dano." }
    ]
  },
  "Lunox": {
    name: "Lunox",
    summary: "Lunox é uma maga que detém o equilíbrio entre a ordem (luz) e o caos (escuridão). Ela caiu em um sono profundo para selar o poder do Abismo e despertou para um mundo em desequilíbrio.",
    skills: [
      { skillname: "Onirismo", skilldesc: "Lunox não pode se beneficiar da redução de recarga. Em vez disso, ela ganha efeitos diferentes: a redução de recarga se converte em defesa (Brilho) ou penetração mágica (Escuridão)." },
      { skillname: "Ataque do Caos", skilldesc: "Lunox libera energia do caos, causando dano contínuo que aumenta contra alvos com marcas." },
      { skillname: "Pulso Estelar", skilldesc: "Lunox libera orbes de luz estelar que causam dano e a curam." },
      { skillname: "Ordem e Caos", skilldesc: "Brilho (Luz): Lunox se torna invulnerável, causando dano em área. Escuridão (Trevas): Lunox pisca em uma direção, causando dano e aprimorando sua Habilidade 1." }
    ],
    combos: [
      { title: "Combo de Dano (Escuridão)", desc: "Use a Habilidade 1 (escura) repetidamente nos inimigos para maximizar o dano. Se estiver em perigo, use a Ultimate (escura) para piscar e escapar." },
      { title: "Combo de Sobrevivência (Luz)", desc: "Use a Habilidade 2 para se curar. Se for focada, use a Ultimate (luz) para se tornar invulnerável e causar dano." }
    ]
  },
  "Hanzo": {
    name: "Hanzo",
    summary: "Hanzo era o líder do clã ninja Akakage, mas se entregou a uma lâmina demoníaca para ganhar poder, sacrificando o sangue de seu próprio clã. Ele agora é um assassino das sombras.",
    skills: [
      { skillname: "Ame no Habakiri", skilldesc: "Hanzo absorve a alma de unidades mortas próximas, ganhando Sangue Demoníaco." },
      { skillname: "Ninjutsu: Devorador Demoníaco", skilldesc: "Hanzo devora um minion ou creep, ganhando buffs e Sangue Demoníaco." },
      { skillname: "Ninjutsu: Festa da Alma", skilldesc: "Hanzo abre um portal da alma, causando dano contínuo." },
      { skillname: "Kinjutsu: Pináculo Ninja", skilldesc: "Hanzo envia seu espírito para fora do corpo, ganhando novas habilidades e mobilidade, mas seu corpo real fica vulnerável. Consome Sangue Demoníaco." }
    ],
    combos: [
      { title: "Combo de Assassino Espectral", desc: "Use a Habilidade 1 para farmar Sangue Demoníaco. Esconda seu corpo real e use a Ultimate para enviar seu espírito. Na forma de espírito, use a Habilidade 1 para dano em área e a Habilidade 2 para se aproximar e finalizar." }
    ]
  },
  "Belerick": {
    name: "Belerick",
    summary: "Belerick é uma antiga árvore senciente, o guardião da natureza. Ele se sacrifica para proteger a vida e renasce das sementes da esperança.",
    skills: [
      { skillname: "Flor da Vida", skilldesc: "Belerick espalha sementes que se anexam aos inimigos. Atingir inimigos marcados com Ataques Básicos causa dano extra." },
      { skillname: "Ira da Natureza", skilldesc: "Belerick libera vinhas que causam dano e imobilizam os inimigos." },
      { skillname: "Semente da Natureza", skilldesc: "Belerick avança, ganhando velocidade de movimento e aprimorando seu próximo Ataque Básico para causar dano e lentidão." },
      { skillname: "Guardião da Natureza", skilldesc: "Belerick invoca uma área de vinhas que causa dano contínuo e provoca os inimigos que entram nela." }
    ],
    combos: [
      { title: "Combo de Controle de Área", desc: "Use a Habilidade 2 para se posicionar, use a Ultimate para provocar vários inimigos, e então use a Habilidade 1 para imobilizá-los, permitindo que sua equipe cause dano." }
    ]
  },
  "Kimmy": {
    name: "Kimmy",
    summary: "Kimmy é uma inventora genial e rebelde, filha de um general imperial. Ela combina sua paixão por química e engenharia em sua arma, um spray químico que também dispara balas de energia.",
    skills: [
      { skillname: "Síntese Química", skilldesc: "Kimmy pode mirar e atirar enquanto se move. Seus Ataques Básicos restauram energia. Sua velocidade de ataque é fixa." },
      { skillname: "Transformação de Energia", skilldesc: "Kimmy dispara esferas químicas que explodem, causando Dano Mágico." },
      { skillname: "Refinamento Químico", skilldesc: "Kimmy recua e deixa um rastro químico no chão, que causa dano e retarda os inimigos." },
      { skillname: "Carga Máxima", skilldesc: "Kimmy carrega e dispara um projétil químico de longo alcance que explode, causando dano em área com base na distância percorrida." }
    ],
    combos: [
      { title: "Combo de Kite e Dano", desc: "Mantenha distância usando o joystick de ataque. Use a Habilidade 1 para dano contínuo. Use a Habilidade 2 para escapar de ameaças. Finalize inimigos em fuga com a Ultimate." }
    ]
  },
  "Thamuz": {
    name: "Thamuz",
    summary: "Thamuz é o rei do Abismo de Fogo, um demônio que comanda as chamas. Ele empunha foices gêmeas e queima qualquer um que se oponha ao Lorde do Abismo.",
    skills: [
      { skillname: "Deus da Grand Lava", skilldesc: "Os ataques de Thamuz aplicam um efeito de queimadura. Quando ele recupera suas foices, seu próximo Ataque Básico é aprimorado." },
      { skillname: "Foices Ardentes", skilldesc: "Thamuz joga suas foices, que causam dano na ida e na volta, além de retardar os inimigos." },
      { skillname: "Salto Abissal", skilldesc: "Thamuz salta para um local, causando dano e repelindo os inimigos. Usar esta habilidade puxa suas foices de volta para ele." },
      { skillname: "Inferno Cauterizante", skilldesc: "Thamuz explode em chamas, causando dano contínuo ao seu redor e se curando. Ele ganha velocidade de ataque e aprimora sua passiva." }
    ],
    combos: [
      { title: "Combo de Dano Contínuo", desc: "Jogue as foices (Habilidade 1), pule no inimigo com a Habilidade 2 para recuperar as foices e causar dano. Ative a Ultimate para dano em área, cura e aumento de velocidade de ataque." }
    ]
  },
  "Harith": {
    name: "Harith",
    summary: "Harith é um Leonino e um mestre do tempo. Ele pode criar fendas no tempo para se mover rapidamente e prender seus inimigos em um fluxo temporal.",
    skills: [
      { skillname: "Chave do Conhecimento", skilldesc: "Harith ganha resiliência com base no número de heróis inimigos próximos. Após usar uma habilidade 3 vezes, seu próximo ataque causa dano extra e o cura." },
      { skillname: "Fissura Temporal", skilldesc: "Harith cria uma sombra de si mesmo que dispara uma energia, causando dano em área." },
      { skillname: "Chave Crono", skilldesc: "Harith avança e ganha um escudo. Seu próximo Ataque Básico causa dano e retarda." },
      { skillname: "Era da Força", skilldesc: "Harith invoca uma cruz de força que retarda os inimigos. Se ele tocar a cruz com sua Habilidade 2, a recarga da Habilidade 2 é reduzida drasticamente." }
    ],
    combos: [
      { title: "Combo de Mobilidade Infinita", desc: "Use a Ultimate para criar o campo. Use a Habilidade 2 para avançar e ganhar escudo. Continue usando a Habilidade 2 dentro do campo da ultimate para ter recargas quase instantâneas, enquanto causa dano com a Habilidade 1 e ataques básicos aprimorados." }
    ]
  },
  "Minsitthar": {
    name: "Minsitthar",
    summary: "Minsitthar é um príncipe guerreiro de um reino esquecido. Ele lidera o exército real com sua lança dourada, inspirando coragem e prendendo seus inimigos com seu gancho.",
    skills: [
      { skillname: "Marca do Rei", skilldesc: "Atingir inimigos com habilidades aplica uma marca. Aliados que atacam inimigos marcados causam dano extra." },
      { skillname: "Lança da Glória", skilldesc: "Minsitthar lança sua lança, puxando o primeiro inimigo atingido." },
      { skillname: "Escudo de Assalto", skilldesc: "Minsitthar avança com um escudo, causando dano e atordoando os inimigos." },
      { skillname: "Chamado do Rei", skilldesc: "Minsitthar invoca 4 guardas reais que formam uma área. Inimigos dentro da área não podem usar habilidades de avanço e são atacados pelos guardas." }
    ],
    combos: [
      { title: "Combo Anti-Avanço", desc: "Puxe um alvo com a Habilidade 1. Use a Habilidade 2 para atordoá-lo. Ative a Ultimate para prender a equipe inimiga e impedir que usem habilidades de mobilidade para escapar." }
    ]
  },
  "Kadita": {
    name: "Kadita",
    summary: "Kadita é a Rainha dos Mares do Sul. Traída e amaldiçoada, ela se jogou no oceano, onde foi salva pelos espíritos do mar e recebeu o poder de controlar as águas.",
    skills: [
      { skillname: "Talassofobia", skilldesc: "4s após receber dano, Kadita regenera 65% do HP perdido ao longo do tempo." },
      { skillname: "Tirania do Oceano", skilldesc: "Kadita invoca uma onda para arremessar os inimigos ao ar. Ela pode reativar para sair da onda." },
      { skillname: "Sopro do Oceano", skilldesc: "Kadita se torna uma onda e avança, tornando-se imune a dano e controle. Causa dano aos inimigos no caminho." },
      { skillname: "Ondas Impetuosas", skilldesc: "Kadita invoca um tsunami que ataca ao seu redor. As ondas retornam a ela, causando dano massivo. Ela é imune a dano e mais lenta durante a conjuração." }
    ],
    combos: [
      { title: "Combo de Mergulho e Explosão", desc: "Use a Habilidade 1 para arremessar o alvo. Use a Habilidade 2 para se aproximar e se tornar imune. Ative a Ultimate para causar dano massivo enquanto estão próximos." }
    ]
  },
  "Faramis": {
    name: "Faramis",
    summary: "Faramis é um alquimista que acidentalmente causou uma catástrofe em sua cidade. Atormentado pela culpa, ele busca a imortalidade para trazer de volta aqueles que perdeu.",
    skills: [
      { skillname: "Vingança Amaldiçoada", skilldesc: "Quando Faramis morre, ele deixa para trás uma alma. Coletar almas reduz seu tempo de ressurreição." },
      { skillname: "Abraço das Sombras", skilldesc: "Faramis entra em um estado de sombra, avançando e puxando os inimigos que toca, causando dano." },
      { skillname: "Onda Espectral", skilldesc: "Faramis libera energia fantasma, causando Dano Mágico." },
      { skillname: "Altar Cultista", skilldesc: "Faramis cria um altar que ressuscita os heróis aliados que morrerem dentro dele, dando-lhes 80% de HP e 100% de ataque por um curto período." }
    ],
    combos: [
      { title: "Combo de Suporte e Ressurreição", desc: "Use a Habilidade 1 para agrupar inimigos. Use a Habilidade 2 para causar dano. Em lutas de equipe, posicione a Ultimate para que seus aliados possam lutar sem medo da morte, ressuscitando para continuar o combate." }
    ]
  },
  "Granger": {
    name: "Granger",
    summary: "Granger é um caçador de demônios e músico órfão. Ele carrega um estojo de violino que se transforma em uma poderosa arma de fogo, disparando balas com ritmo e precisão mortais.",
    skills: [
      { skillname: "Capricho", skilldesc: "A arma de Granger pode conter 6 balas. A sexta bala sempre causa dano crítico." },
      { skillname: "Rapsódia", skilldesc: "Granger dispara todas as suas balas em uma direção." },
      { skillname: "Rondó", skilldesc: "Granger avança em uma direção. Seu próximo Ataque Básico causa dano extra." },
      { skillname: "Serenata da Morte", skilldesc: "Granger transforma seu estojo em um super canhão e dispara 3 super balas de longo alcance que explodem, causando dano e lentidão." }
    ],
    combos: [
      { title: "Combo de Dano Explosivo", desc: "Use a Habilidade 2 para se posicionar e aprimorar seu próximo tiro. Descarregue suas balas com a Habilidade 1, garantindo que a sexta bala (crítica) acerte. Finalize com a Ultimate em alvos distantes ou em fuga." }
    ]
  },
  "Esmeralda": {
    name: "Esmeralda",
    summary: "Esmeralda é uma astróloga que guarda a Caixa Estelar. Ela pode manipular o poder das estrelas e da lua, dançando entre o dano físico e mágico, e ignorando escudos inimigos.",
    skills: [
      { skillname: "Caixa Estelar", skilldesc: "Os ataques de Esmeralda causam dano duas vezes. Ela manipula escudos, convertendo os escudos dos inimigos em seu próprio HP." },
      { skillname: "Lua Gélida", skilldesc: "Esmeralda concede um escudo a si mesma e aumenta sua velocidade de movimento, enquanto gradualmente transforma os escudos de inimigos próximos em seu próprio escudo." },
      { skillname: "Poeira Estelar", skilldesc: "Esmeralda dança com seus lenços, causando Dano Físico e Mágico aos inimigos próximos." },
      { skillname: "Estrela Cadente", skilldesc: "Esmeralda carrega poder e salta para uma área, causando dano massivo e imobilizando os inimigos." }
    ],
    combos: [
      { title: "Combo de Roubo de Escudo", desc: "Use a Habilidade 1 para ganhar escudo e velocidade. Aproxime-se dos inimigos e use a Habilidade 2 para causar dano e roubar mais escudos. Use a Ultimate para iniciar uma luta ou finalizar alvos." }
    ]
  },
  "Terizla": {
    name: "Terizla",
    summary: "Terizla era um ferreiro que foi capturado e torturado. Ele escapou, mas com um desejo de vingança, empunhando um martelo gigante para esmagar seus opressores.",
    skills: [
      { skillname: "Corpo de Ferreiro", skilldesc: "Terizla converte sua Velocidade de Ataque em Dano Físico. Ele também tem redução de dano com base no HP perdido." },
      { skillname: "Golpe de Vingança", skilldesc: "Terizla esmaga o chão com seu martelo 3 vezes, causando dano e lentidão. O terceiro golpe é mais forte." },
      { skillname: "Salto de Execução", skilldesc: "Terizla salta e esmaga o chão, causando dano e imobilizando os inimigos." },
      { skillname: "Zona de Pênalti", skilldesc: "Terizla esmaga o chão, criando uma zona que puxa os inimigos para o centro continuamente e causa dano." }
    ],
    combos: [
      { title: "Combo de Controle em Massa", desc: "Use a Habilidade 2 para se aproximar e imobilizar. Use a Ultimate para prender os inimigos na zona e, em seguida, use a Habilidade 1 para causar dano massivo enquanto eles estão sendo puxados." }
    ]
  },
  "X.Borg": {
    name: "X.Borg",
    summary: "X.Borg é um jovem que teve seu corpo destruído em um acidente tecnológico. Ele se reconstruiu com uma armadura Firaga, buscando vingança contra a tecnologia que o arruinou.",
    skills: [
      { skillname: "Armadura Firaga", skilldesc: "X.Borg tem uma barra de armadura. Quando a armadura se esgota, ele rola para fora dela. Seus ataques aplicam um efeito de superaquecimento." },
      { skillname: "Mísseis de Fogo", skilldesc: "X.Borg dispara chamas de seu lança-chamas, causando dano contínuo. Inimigos superaquecidos recebem Dano Verdadeiro." },
      { skillname: "Estaca de Fogo", skilldesc: "X.Borg dispara estacas de fogo que são puxadas de volta para ele, causando dano e puxando os inimigos." },
      { skillname: "Última Insanidade", skilldesc: "X.Borg avança e começa a girar, causando dano de fogo contínuo antes de explodir sua armadura, causando Dano Verdadeiro massivo." }
    ],
    combos: [
      { title: "Combo de Dano Verdadeiro", desc: "Use a Habilidade 1 para superaquecer os inimigos. Use a Habilidade 2 para puxá-los. Ative a Ultimate para causar dano massivo e explodir a armadura para finalizar." }
    ]
  },
  "Ling": {
    name: "Ling",
    summary: "Ling é um assassino ágil do Clã Pavo Real. Ele é conhecido por sua habilidade de saltar entre paredes, movendo-se como o vento para atacar seus inimigos de surpresa.",
    skills: [
      { skillname: "Caminhante das Nuvens", skilldesc: "Ling pode saltar sobre paredes. Enquanto estiver nas paredes, ele regenera pontos de Leveza e fica camuflado." },
      { skillname: "Andorinha Voadora", skilldesc: "Ling salta para uma parede. Estando na parede, ele pode saltar para outra." },
      { skillname: "Espada Desafiadora", skilldesc: "Ling avança e apunhala os inimigos, causando dano. Se o ataque for crítico, causa dano extra." },
      { skillname: "Tempestade de Lâminas", skilldesc: "Ling salta, tornando-se invulnerável, e cria um campo de espadas. Ele pode então atacar livremente dentro do campo, enquanto os inimigos na borda são repelidos." }
    ],
    combos: [
      { title: "Combo de Ataque Aéreo", desc: "Use a Habilidade 1 para pular nas paredes. Aproxime-se de um alvo e use a Habilidade 2 para atacar. Use a Ultimate para ficar invulnerável e prender os inimigos, e então use a Habilidade 2 e ataques básicos para finalizar." }
    ]
  },
  "Dyrroth": {
    name: "Dyrroth",
    summary: "Dyrroth é o Príncipe do Abismo. Roubado quando bebê, ele foi criado nas profundezas do Abismo e se tornou um guerreiro poderoso, pronto para liderar o exército abissal.",
    skills: [
      { skillname: "Fúria do Abismo", skilldesc: "Quando a Fúria de Dyrroth atinge 50%, ele aprimora suas Habilidades 1 e 2. Seus Ataques Básicos também se aprimoram." },
      { skillname: "Golpe de Explosão", skilldesc: "Dyrroth libera uma onda de choque que causa dano e lentidão. Aprimorado, tem maior alcance e dano." },
      { skillname: "Passo do Espectro", skilldesc: "Dyrroth avança. Se ele atingir um alvo, ele pode avançar novamente, reduzindo a defesa do alvo." },
      { skillname: "O Golpe da Destruição", skilldesc: "Dyrroth carrega e ataca, causando dano massivo com base no HP perdido do alvo e retardando-os." }
    ],
    combos: [
      { title: "Combo de Execução", desc: "Use a Habilidade 2 para se aproximar e reduzir a defesa. Use a Habilidade 1 para causar dano e lentidão. Finalize com a Ultimate carregada para dano de execução massivo." }
    ]
  },
  "Lylia": {
    name: "Lylia",
    summary: "Lylia é uma jovem maga da Academia de Magia, fascinada pela magia negra. Ela usa seu companheiro, Gloom, para plantar bombas de energia sombria e voltar no tempo.",
    skills: [
      { skillname: "Gloom Nervoso", skilldesc: "Gloom aumenta a velocidade de movimento de Lylia quando está perto. Cada vez que Gloom é aprimorado, a velocidade aumenta." },
      { skillname: "Onda de Choque Mágica", skilldesc: "Lylia lança uma bola de energia que causa dano e retarda. Se tocar em uma Sombra Energizada, ela detonará." },
      { skillname: "Energia Sombria", skilldesc: "Lylia coloca uma Sombra Energizada no chão. Essas sombras podem ser detonadas pela Habilidade 1 para causar dano em área." },
      { skillname: "Sapatos Negros", skilldesc: "Lylia volta no tempo 4s, restaurando seu HP, mana e recargas de Energia Sombria para o estado em que estavam. Ela também pode se teletransportar para a localização de seus sapatos." }
    ],
    combos: [
      { title: "Combo de Bomba", desc: "Use a Habilidade 2 para posicionar várias bombas. Use a Habilidade 1 para detoná-las e causar dano massivo. Se estiver em perigo, use a Ultimate para voltar no tempo e recuperar todos os recursos." }
    ]
  },
  "Baxia": {
    name: "Baxia",
    summary: "Baxia é um místico do Oriente, um dos quatro Guardiões do Dragão. Ele se transforma em uma roda, rolando pelo campo de batalha e queimando seus inimigos com seu escudo.",
    skills: [
      { skillname: "Marca de Baxia", skilldesc: "Baxia reduz o efeito de regeneração e escudo dos inimigos atingidos por suas habilidades." },
      { skillname: "Unidade de Escudo-Baxia", skilldesc: "Baxia se transforma em uma roda e acelera. Colidir com um inimigo causa dano e atordoamento." },
      { skillname: "Escudo de Espírito", skilldesc: "Baxia joga seu escudo, que causa dano contínuo aos inimigos atingidos." },
      { skillname: "Poder da Tartaruga", skilldesc: "Baxia cria um escudo frontal e avança, repelindo os inimigos e deixando um rastro de lava que causa dano." }
    ],
    combos: [
      { title: "Combo de Iniciação e Anti-Cura", desc: "Use a Habilidade 1 para rolar rapidamente e atordoar um alvo. Use a Ultimate para criar um campo de dano e aplicar o efeito anti-cura em massa, e use a Habilidade 2 para dano contínuo." }
    ]
  },
  "Masha": {
    name: "Masha",
    summary: "Masha é uma guerreira de uma terra gelada que possui o poder de um Urso Místico. Ela tem 3 barras de vida e pode desferir ataques poderosos, sacrificando seu próprio HP.",
    skills: [
      { skillname: "Poder Ancestral", skilldesc: "Masha tem 3 barras de HP. Quando perde uma barra, ela pode bloquear o dano uma vez. Ela ganha velocidade de ataque com base no HP perdido." },
      { skillname: "Poder Selvagem", skilldesc: "Masha desperta seu poder, aumentando sua velocidade de movimento e causando dano extra em seus Ataques Básicos, ao custo de HP." },
      { skillname: "Uivo de Choque", skilldesc: "Masha ruge, liberando uma onda de energia que causa dano e desarma os inimigos, impedindo-os de usar Ataques Básicos." },
      { skillname: "Rugido do Trovão", skilldesc: "Masha consome 30% de seu HP atual para avançar e repelir os inimigos, causando dano e lentidão." },
      { skillname: "Recuperação de Vida", skilldesc: "Masha recupera a energia e restaura uma barra de HP. Esta habilidade só pode ser usada fora de combate." }
    ],
    combos: [
      { title: "Combo de Dano Total", desc: "Ative a Habilidade 1 para aumentar seu dano. Use a Habilidade 3 para se aproximar e repelir o alvo. Use a Habilidade 2 para desarmá-lo e finalize com ataques básicos poderosos." }
    ]
  },
  "Wanwan": {
    name: "Wanwan",
    summary: "Wanwan é uma atiradora ágil e alegre do Oriente. Ela pode atingir todos os pontos fracos de um inimigo para liberar sua ultimate, tornando-se inalvejável e disparando uma barragem de flechas.",
    skills: [
      { skillname: "Salto do Tigre", skilldesc: "Wanwan pode dar um pequeno salto após cada Ataque Básico. A velocidade do salto aumenta com a Velocidade de Ataque." },
      { skillname: "Caminho das Andorinhas", skilldesc: "Wanwan joga um Dardo de Andorinha que causa dano e retarda. Ela pode recuperar o dardo para reduzir a recarga." },
      { skillname: "Agulhas nas Flores", skilldesc: "Wanwan remove todos os debuffs e dispara agulhas ao redor, causando dano." },
      { skillname: "Besta de Tang", skilldesc: "Wanwan ativa sua besta e ataca um inimigo no ar, tornando-se inalvejável. Para ativar, ela precisa atingir todos os pontos fracos do alvo." }
    ],
    combos: [
      { title: "Combo de Inalvejabilidade", desc: "Use ataques básicos e a Habilidade 1 para atingir todos os pontos fracos de um inimigo. Uma vez que a Ultimate esteja disponível, ative-a para se tornar inalvejável e causar dano massivo. Use a Habilidade 2 para se purificar de controle de grupo." }
    ]
  },
  "Silvanna": {
    name: "Silvanna",
    summary: "Silvanna é a princesa do Império Moniyan. Após a morte de seu irmão, ela se juntou aos Cavaleiros da Luz, empunhando uma lança para lutar contra o Abismo e proteger seu reino.",
    skills: [
      { skillname: "Resolução do Cavaleiro", skilldesc: "Os Ataques Básicos de Silvanna causam Dano Mágico. Suas habilidades marcam os inimigos, e seus ataques básicos em alvos marcados causam dano extra." },
      { skillname: "Lance Cósmico", skilldesc: "Silvanna ataca com sua lança, atordoando o primeiro inimigo atingido. Ela pode então avançar em uma direção." },
      { skillname: "Estrangulamento Espiral", skilldesc: "Silvanna gira sua lança, puxando os inimigos para o centro e causando dano contínuo. Ela também ganha um escudo." },
      { skillname: "Julgamento Imperial", skilldesc: "Silvanna salta para uma área, criando um Círculo de Luz que prende o inimigo mais próximo. Dentro do círculo, ela ganha velocidade de ataque e roubo de vida mágico." }
    ],
    combos: [
      { title: "Combo de Duelo", desc: "Use a Habilidade 1 para atordoar o alvo. Use a Ultimate para prendê-lo no círculo. Dentro do círculo, use a Habilidade 2 para dano contínuo e ataques básicos para finalizar." }
    ]
  },
  "Cecilion": {
    name: "Cecilion",
    summary: "Cecilion é um cantor de ópera amaldiçoado que se apaixonou por uma Sanguessuga, Carmilla. Ele usa magia de sangue para atacar seus inimigos à distância, tornando-se mais forte a cada habilidade que acerta.",
    skills: [
      { skillname: "Transbordando", skilldesc: "Cecilion aumenta sua mana máxima a cada vez que atinge um inimigo com uma habilidade." },
      { skillname: "Impacto de Morcego", skilldesc: "Cecilion invoca um morcego gigante que ataca em uma área, causando Dano Mágico. O dano aumenta com a mana." },
      { skillname: "Garras Sanguessugas", skilldesc: "Cecilion invoca um par de garras que se fecham, puxando os inimigos para o centro e imobilizando-os." },
      { skillname: "Festa de Morcegos", skilldesc: "Cecilion libera seu poder de sangue, ganhando velocidade de movimento e tornando-se imune a lentidão. Ele dispara projéteis de sangue que causam dano e o curam." },
      { skillname: "Pouso da Lua", skilldesc: "Cecilion pode puxar Carmilla para si, concedendo a ela um escudo. (Habilidade especial com Carmilla na equipe)." }
    ],
    combos: [
      { title: "Combo de Poke e Dano", desc: "Use a Habilidade 2 para prender os inimigos. Siga com a Habilidade 1 para dano massivo. Use a Ultimate para se curar, causar dano e perseguir ou escapar." }
    ]
  },
  "Carmilla": {
    name: "Carmilla",
    summary: "Carmilla era uma nobre que se apaixonou por Cecilion. Para ficar com ele para sempre, ela se tornou uma Sanguessuga, ganhando poderes de sangue e imortalidade.",
    skills: [
      { skillname: "Pacto de Vampira", skilldesc: "Carmilla rouba Defesa Física e Mágica dos inimigos que ela danifica. O efeito acumula." },
      { skillname: "Flor Carmesim", skilldesc: "Carmilla invoca duas flores que giram ao seu redor, causando dano e a curando." },
      { skillname: "Banho de Sangue", skilldesc: "Carmilla acumula energia, ganhando velocidade de movimento. Ela pode reativar para avançar e atordoar um inimigo." },
      { skillname: "Maldição de Sangue", skilldesc: "Carmilla lança uma maldição que se espalha entre os heróis inimigos próximos, causando dano e lentidão. 90% do dano e controle recebido por um alvo amaldiçoado é compartilhado com os outros." }
    ],
    combos: [
      { title: "Combo de Controle e Debuff", desc: "Use a Habilidade 2 para se aproximar e atordoar. Ative a Habilidade 1 para dano contínuo e cura. Use a Ultimate em um grupo de inimigos para que sua equipe possa causar dano em todos ao mesmo tempo." }
    ]
  },
  "Atlas": {
    name: "Atlas",
    summary: "Atlas é um mecha pilotado por uma criatura abissal. Ele foi congelado no mar profundo e despertou para se tornar um guardião dos oceanos, usando suas correntes para prender seus inimigos.",
    skills: [
      { skillname: "Respiração Gelada", skilldesc: "Inimigos próximos a Atlas são retardados por sua aura gelada." },
      { skillname: "Aniquilar", skilldesc: "Atlas esmaga o chão, causando três explosões que causam Dano Mágico." },
      { skillname: "Companheiro Perfeito", skilldesc: "Atlas ejeta seu corpo mecha e se move mais rápido. Ele pode reativar para que o mecha volte a ele, atordoando os inimigos no caminho." },
      { skillname: "Laços Fatais", skilldesc: "Atlas lança correntes que prendem os heróis inimigos próximos. Ele pode reativar para arrastar os alvos presos e jogá-los em um local, atordoando-os." }
    ],
    combos: [
      { title: "Combo de Iniciação Perfeito", desc: "Use a Habilidade 2 para se aproximar rapidamente dos inimigos. Ative a Ultimate para prender o máximo de alvos possível e jogue-os em direção à sua equipe. Siga com a Habilidade 1 para dano." }
    ]
  },
  "Popol and Kupa": {
    name: "Popol and Kupa",
    summary: "Popol é um jovem caçador e seu melhor amigo é Kupa, um lobo do gelo. Juntos, eles protegem sua terra natal de invasores, combinando as armadilhas de Popol com a ferocidade de Kupa.",
    skills: [
      { skillname: "Companheiros", skilldesc: "Kupa ajuda Popol em batalha. Após 4 ataques, Kupa aprimora o próximo Ataque Básico de Popol." },
      { skillname: "Mordida de Kupa!", skilldesc: "Popol joga uma lança, e Kupa ataca o alvo, causando dano e lentidão." },
      { skillname: "Ajuda de Kupa!", skilldesc: "Kupa corre para proteger Popol, ganhando um escudo e provocando os inimigos." },
      { skillname: "A Surpresa de Popol", skilldesc: "Popol coloca uma armadilha que imobiliza os inimigos." },
      { skillname: "Nós Estamos com Raiva!", skilldesc: "Popol e Kupa entram em modo de fúria, ganhando velocidade de ataque, movimento e aprimorando suas outras habilidades." }
    ],
    combos: [
      { title: "Combo de Caça e Controle", desc: "Use a Habilidade 3 para posicionar armadilhas. Use a Habilidade 1 para dano e lentidão. Ative a Ultimate para aumentar o dano, e use a Habilidade 2 para proteger Popol se ele for atacado." }
    ]
  },
  "Yu Zhong": {
    name: "Yu Zhong",
    summary: "Yu Zhong é o Dragão Negro, um antigo ser que busca unificar as Terras do Amanhecer sob seu domínio. Ele pode se transformar em um dragão, trazendo destruição a seus inimigos.",
    skills: [
      { skillname: "Maldição do Toque", skilldesc: "Atingir inimigos aplica Resíduo de Sha. Com 5 acúmulos, o Resíduo explode, causando dano com base no HP perdido e curando Yu Zhong." },
      { skillname: "Arrasto do Dragão", skilldesc: "Yu Zhong infunde seu manto e ataca em uma área, causando dano." },
      { skillname: "Golpe da Alma", skilldesc: "Yu Zhong libera a alma do dragão, causando dano e retardando os inimigos." },
      { skillname: "Ataque Furioso", skilldesc: "Yu Zhong avança, causando dano. Seus Ataques Básicos são aprimorados após o avanço." },
      { skillname: "Dragão Negro Furioso", skilldesc: "Yu Zhong se transforma em um Dragão Negro, voando sobre o terreno e repelindo os inimigos. Ele então entra na forma de Dragão Humano com habilidades aprimoradas." }
    ],
    combos: [
      { title: "Combo de Transformação", desc: "Use a Ultimate para voar sobre a equipe inimiga. Na forma de Dragão Humano, use a Habilidade 1 e 2 para dano em área, e a Habilidade 3 para se aproximar e aplicar acúmulos da passiva para cura e dano." }
    ]
  },
  "Luo Yi": {
    name: "Luo Yi",
    summary: "Luo Yi é uma maga do Yin-Yang que busca o equilíbrio. Ela pode manipular as forças opostas para criar reações em cadeia devastadoras e teletransportar sua equipe pelo campo de batalha.",
    skills: [
      { skillname: "Dualidade", skilldesc: "As habilidades de Luo Yi criam marcas de Yin (branco) ou Yang (preto) nos inimigos. Juntar duas marcas opostas em um inimigo causa uma reação que o atordoa." },
      { skillname: "Dispersão", skilldesc: "Luo Yi conjura um sigilo de Yang/Yin em uma área, causando dano e aplicando a marca correspondente." },
      { skillname: "Rotação", skilldesc: "Luo Yi invoca um círculo de fogo que causa dano contínuo e aplica a marca oposta à sua Habilidade 1." },
      { skillname: "Diversão", skilldesc: "Luo Yi cria um círculo de teletransporte para si mesma e para os aliados, permitindo que se movam instantaneamente para outro local no mapa." }
    ],
    combos: [
      { title: "Combo de Reação em Cadeia", desc: "Use a Habilidade 1 para aplicar uma marca, e imediatamente use a Habilidade 2 no mesmo local para aplicar a marca oposta, causando atordoamento em área. A Ultimate é usada para ganks surpresa ou para reposicionar a equipe." }
    ]
  },
  "Benedetta": {
    name: "Benedetta",
    summary: "Benedetta é uma assassina renegada que vaga pelas terras devastadas. Ela é uma mestre da espada longa, movendo-se com velocidade e precisão para cortar seus inimigos.",
    skills: [
      { skillname: "Sombra do Olho por Olho", skilldesc: "Segurar o botão de Ataque Básico permite que Benedetta entre em modo de espada desembainhada. Soltar o botão a faz avançar, causando dano." },
      { skillname: "Lâmina Fantasma", skilldesc: "Benedetta avança e ataca, deixando uma sombra para trás. A sombra então ataca, causando dano." },
      { skillname: "Olho por Olho", skilldesc: "Benedetta levanta sua arma para se defender, tornando-se imune a controle de grupo e bloqueando um dano. Se ela bloquear um CC, ela atordoa o inimigo." },
      { skillname: "Alecto: Golpe Final", skilldesc: "Benedetta avança e corta a área, tornando-se invulnerável e causando dano e lentidão contínuos." }
    ],
    combos: [
      { title: "Combo de Dano e Imunidade", desc: "Use a passiva para se aproximar. Use a Habilidade 1 para dano. Use a Habilidade 2 para bloquear um CC e atordoar. Finalize com a Ultimate para dano em área e invulnerabilidade." }
    ]
  },
  "Khaleed": {
    name: "Khaleed",
    summary: "Khaleed é o príncipe do deserto. Ele pode controlar a areia para surfar pelo campo de batalha e invocar tempestades de areia para destruir seus inimigos.",
    skills: [
      { skillname: "Caminhada na Areia", skilldesc: "Khaleed acumula poder do deserto enquanto se move. Quando cheio, ele surfa na areia, ganhando velocidade de movimento e aprimorando seu próximo Ataque Básico." },
      { skillname: "Tempestade do Deserto", skilldesc: "Khaleed gira sua cimitarra, causando dano em área. A velocidade do giro aumenta a cada acerto." },
      { skillname: "Guarda do Deserto", skilldesc: "Khaleed canaliza para se curar e reduzir o dano recebido. A área ao redor dele causa dano e retarda os inimigos." },
      { skillname: "Guarda da Tempestade de Areia", skilldesc: "Khaleed invoca uma tempestade de areia e avança para um local, causando dano e atordoando os inimigos. Ele é imune a controle de grupo durante a habilidade." }
    ],
    combos: [
      { title: "Combo de Iniciação e Sobrevivência", desc: "Use a Ultimate para iniciar uma luta e atordoar os inimigos. Use a Habilidade 1 para dano em área. Se ficar com pouca vida, use a Habilidade 2 para se curar e reduzir o dano." }
    ]
  },
  "Barats": {
    name: "Barats",
    summary: "Barats é um jovem que monta seu companheiro dinossauro, Detona. Juntos, eles crescem em tamanho e poder durante a batalha, devorando seus inimigos.",
    skills: [
      { skillname: "Grande Sujeito", skilldesc: "Barats e Detona ganham acúmulos de 'Robustez' ao causar dano, aumentando seu tamanho, defesa e resiliência." },
      { skillname: "Óleo do Time", skilldesc: "Barats derrama óleo em uma área que retarda os inimigos. Sua Habilidade 2 e Ataques Básicos incendeiam o óleo, causando dano extra." },
      { skillname: "Mísseis 'Fogo'!", skilldesc: "Barats dispara mísseis que causam dano e repelem os inimigos." },
      { skillname: "Festa do Detona", skilldesc: "Detona devora um herói inimigo, suprimindo-o. Ele pode então cuspir o herói, causando dano e atordoamento se ele colidir com uma parede ou outro herói." }
    ],
    combos: [
      { title: "Combo de Controle e Devorar", desc: "Acumule a passiva para ficar maior. Use a Habilidade 1 para retardar. Use a Habilidade 2 para empurrar os inimigos para o óleo. Use a Ultimate para devorar um alvo prioritário e cuspi-lo contra uma parede." }
    ]
  },
  "Brody": {
    name: "Brody",
    summary: "Brody é um atirador que foi corrompido pelo Abismo, ganhando um braço demoníaco. Ele pode marcar seus inimigos e travar em alvos para ataques devastadores.",
    skills: [
      { skillname: "Corrosão Abissal", skilldesc: "Os Ataques Básicos de Brody são lentos, mas causam muito dano, aplicam lentidão e uma Marca do Abismo. Cada marca aumenta o dano de Brody ao alvo." },
      { skillname: "Impacto Corrosivo", skilldesc: "Brody avança, causando dano, atordoando e deixando uma Marca do Abismo." },
      { skillname: "Golpe Corrosivo", skilldesc: "Brody dispara uma onda de choque que causa dano e lentidão." },
      { skillname: "Memória Despedaçada", skilldesc: "Brody trava em todos os alvos com Marca do Abismo em um alcance e dispara orbes de energia neles, causando dano com base no HP perdido e no número de marcas." }
    ],
    combos: [
      { title: "Combo de Marca e Execução", desc: "Use a Habilidade 2 e a Habilidade 1 para aplicar marcas e controlar os inimigos. Use Ataques Básicos para adicionar mais marcas. Quando os alvos estiverem marcados e com pouca vida, ative a Ultimate para dano de execução massivo." }
    ]
  },
  "Yve": {
    name: "Yve",
    summary: "Yve é uma maga cósmica que flutua sobre o campo de batalha. Ela pode criar um tabuleiro de xadrez galáctico, bombardeando seus inimigos com energia estelar de uma distância segura.",
    skills: [
      { skillname: "Pacto Galáctico", skilldesc: "Yve ganha acúmulos de 'Poder Galáctico' ao causar dano, que aumentam a velocidade de movimento." },
      { skillname: "Explosão do Vazio", skilldesc: "Yve detona energia galáctica em uma área, causando Dano Mágico." },
      { skillname: "Cristal do Vazio", skilldesc: "Yve invoca um cristal que causa dano contínuo e lentidão." },
      { skillname: "Manipulação do Plano Real", skilldesc: "Yve cria um tabuleiro estelar. Ela se torna imune a controle aéreo e pode tocar no tabuleiro para causar dano ou deslizar para causar dano e lentidão contínuos." }
    ],
    combos: [
      { title: "Combo de Zoneamento", desc: "Use a Habilidade 2 para retardar os inimigos. Use a Habilidade 1 para dano. Ative a Ultimate em lutas de equipe para criar um campo de controle massivo, usando toques para dano e deslizes para lentidão." }
    ]
  },
  "Mathilda": {
    name: "Mathilda",
    summary: "Mathilda é a guia espiritual de seu povo. Ela carrega a sabedoria de seus ancestrais e pode guiar seus aliados pelo campo de batalha, voando e concedendo escudos.",
    skills: [
      { skillname: "Orientação Ancestral", skilldesc: "Mathilda ganha acúmulos de 'Sabedoria' ao se mover. Quando cheia, seu próximo Ataque Básico é aprimorado." },
      { skillname: "Poder Ancestral", skilldesc: "Mathilda invoca mechas que circulam ao seu redor. Eles atacam inimigos próximos." },
      { skillname: "Vento Guiador", skilldesc: "Mathilda avança e cria um campo. Aliados que entrarem no campo ganham velocidade de movimento e podem usar uma habilidade especial para piscar em direção a Mathilda." },
      { skillname: "Círculo da Águia", skilldesc: "Mathilda marca um herói e circula ao redor dele. Ela pode então voar em direção ao alvo, repelindo e atordoando os inimigos no caminho." }
    ],
    combos: [
      { title: "Combo de Suporte e Engajamento", desc: "Use a Habilidade 2 para dar mobilidade à sua equipe. Use a Ultimate para marcar um alvo, voar em sua direção e atordoar os inimigos. Use a Habilidade 1 para dano enquanto circula ou voa." }
    ]
  },
  "Paquito": {
    name: "Paquito",
    summary: "Paquito é um boxeador determinado que luta para vingar sua terra natal. Ele acumula fúria para aprimorar suas habilidades, desferindo combos de socos devastadores.",
    skills: [
      { skillname: "Postura de Campeão", skilldesc: "Após usar 3 habilidades ou ataques básicos, Paquito entra na 'Postura de Campeão', aprimorando sua próxima habilidade e zerando sua recarga." },
      { skillname: "Jab de Mão Esquerda", skilldesc: "Paquito dá um soco para a frente. Aprimorado, o dano é maior." },
      { skillname: "Golpe de Nocaute", skilldesc: "Paquito avança e dá um gancho. Aprimorado, o dano é maior e não tem recarga." },
      { skillname: "Nocaute", skilldesc: "Paquito dá um soco de cotovelo que repele, seguido de um gancho que causa dano e lentidão. Aprimorado, ele dá um gancho que arremessa ao ar em vez de retardar." }
    ],
    combos: [
      { title: "Combo de Dano Explosivo", desc: "Acumule a passiva. Use a Habilidade 2 aprimorada para se aproximar, use a Ultimate aprimorada para controle, seguido da Habilidade 1 aprimorada para dano massivo. Use ataques básicos e habilidades normais entre os combos." }
    ]
  },
  "Gloo": {
    name: "Gloo",
    summary: "Gloo é uma criatura travessa feita de gosma. Ele pode se dividir em pedaços menores e se prender a inimigos, usando seu corpo para controlá-los e regenerar sua vida.",
    skills: [
      { skillname: "Grudar, Grudar", skilldesc: "Inimigos atingidos pelas habilidades de Gloo ganham um acúmulo de 'Pegajoso', que os retarda. Com 5 acúmulos, eles ficam imobilizados." },
      { skillname: "Soco, Soco", skilldesc: "Gloo estica seu braço, causando dano e imobilizando o primeiro inimigo atingido. Ele deixa uma poça de gosma que explode." },
      { skillname: "Passar, Passar", skilldesc: "Gloo se estica para a frente, causando dano e imobilizando os inimigos no caminho." },
      { skillname: "Dividir, Dividir", skilldesc: "Gloo se divide em vários Goos. Ele pode se prender a um herói inimigo, recuperando HP e transferindo parte do dano que recebe para o hospedeiro. Ele pode controlar a direção do hospedeiro." }
    ],
    combos: [
      { title: "Combo de Controle e Anexação", desc: "Use a Habilidade 1 para imobilizar e a Habilidade 2 para se aproximar, aplicando acúmulos da passiva. Ative a Ultimate para se dividir, e use a Ultimate novamente para se prender a um inimigo e levá-lo para sua equipe." }
    ]
  },
  "Beatrix": {
    name: "Beatrix",
    summary: "Beatrix é uma cientista genial de Eruditio. Ela usa quatro armas únicas que pode trocar a qualquer momento, adaptando seu estilo de luta para qualquer situação.",
    skills: [
      { skillname: "Visão Mecânica", skilldesc: "Beatrix carrega 4 armas: Renner (Sniper), Bennett (Lança-granadas), Wesker (Espingarda) e Nibiru (Submetralhadora)." },
      { skillname: "Mestre das Armas", skilldesc: "Troca para a arma secundária." },
      { skillname: "Recarga Tática", skilldesc: "Beatrix rola e recarrega completamente sua arma atual." },
      { skillname: "Aniquilação de Renner", skilldesc: "Ultimate (Sniper): Dispara um tiro de longo alcance que causa dano massivo." },
      { skillname: "Bombardeio de Bennett", skilldesc: "Ultimate (Lança-granadas): Lança 5 granadas em uma área." },
      { skillname: "Fúria de Wesker", skilldesc: "Ultimate (Espingarda): Dispara uma rajada de balas em leque." },
      { skillname: "Frenesi de Nibiru", skilldesc: "Ultimate (Submetralhadora): Dispara 6 tiros rápidos em um alvo." }
    ],
    combos: [
      { title: "Combo de Sniper", desc: "Use a Renner para pokear à distância e finalize com sua Ultimate." },
      { title: "Combo de Curto Alcance", desc: "Use a Wesker para dano explosivo de perto, trocando para a Nibiru para dano contínuo." }
    ]
  },
  "Natan": {
    name: "Natan",
    summary: "Natan é um viajante do tempo de Eruditio. Ele busca reverter uma catástrofe que destruiu sua cidade, usando sua tecnologia para manipular o tempo e o espaço.",
    skills: [
      { skillname: "Teoria de Tudo", skilldesc: "A cada vez que Natan atinge um inimigo com uma habilidade, ele ganha um acúmulo de 'Emaranhamento', que aumenta sua velocidade de ataque e movimento." },
      { skillname: "Superposição", skilldesc: "Natan invoca uma massa instável que explode, causando Dano Mágico." },
      { skillname: "Interferência", skilldesc: "Natan lança uma força gravitacional que repele os inimigos." },
      { skillname: "Entropia", skilldesc: "Natan abre um buraco de minhoca e invoca um clone reverso de si mesmo. O clone copia seus movimentos e ataques. Usar a habilidade novamente teletransporta Natan." }
    ],
    combos: [
      { title: "Combo de Dano Duplo", desc: "Use a Ultimate para invocar o clone. Use a Habilidade 1 e Habilidade 2 para causar dano duplo e controle. Acumule a passiva para velocidade de ataque máxima." }
    ]
  },
  "Aulus": {
    name: "Aulus",
    summary: "Aulus é um Leonino que empunha um machado de guerra pesado. Ele ganha poder e velocidade a cada golpe, tornando-se uma força imparável no final do jogo.",
    skills: [
      { skillname: "Fúria de Combate", skilldesc: "Os Ataques Básicos de Aulus aumentam seu dano e velocidade de movimento. Atingir inimigos com a Habilidade 1 aumenta o dano do machado." },
      { skillname: "Aulus, Avante!", skilldesc: "Aulus entra em fúria, ganhando velocidade de movimento e redução de dano. Ele pode segurar a habilidade para correr mais rápido." },
      { skillname: "O Poder do Machado", skilldesc: "Aulus gira seu machado, causando dano em área." },
      { skillname: "Fúria Imortal", skilldesc: "Aulus esmaga seu machado no chão, criando uma zona de fogo que causa dano contínuo e retarda os inimigos. Ele ganha acúmulos de sua passiva." }
    ],
    combos: [
      { title: "Combo de Dano Contínuo", desc: "Use a Habilidade 1 para se aproximar e ganhar buffs. Ative a Ultimate para dano em área e lentidão. Use a Habilidade 2 para dano contínuo enquanto usa ataques básicos." }
    ]
  },
  "Edith": {
    name: "Edith",
    summary: "Edith é uma antiga guardiã que se funde com sua armadura mecha, Phylax. Ela pode alternar entre ser uma tanque resistente e uma atiradora de alto dano.",
    skills: [
      { skillname: "Sobrecarga", skilldesc: "Edith e Phylax se sobrecarregam após cada uso de habilidade. Os Ataques Básicos de Edith em cadeia causam dano mágico." },
      { skillname: "Tremor de Terra", skilldesc: "Phylax atinge o chão, arremessando os inimigos ao ar." },
      { skillname: "Ataque Aéreo", skilldesc: "Phylax avança, ganhando um escudo." },
      { skillname: "Fúria Primordial", skilldesc: "Edith ejeta de Phylax, ganhando novas habilidades de atiradora, velocidade de ataque e roubo de vida mágico. Ela pode acumular 'Ira' para aumentar a velocidade de ataque." }
    ],
    combos: [
      { title: "Combo de Controle e Dano", desc: "Na forma de tanque, use a Habilidade 1 e 2 para controle de grupo. Quando a Ira estiver cheia, use a Ultimate para ejetar e causar dano massivo com suas habilidades de atiradora." }
    ]
  },
  "Floryn": {
    name: "Floryn",
    summary: "Floryn é uma criatura da floresta que carrega uma flor brilhante. Ela pode compartilhar o poder da flor com um aliado, concedendo-lhe um item extra e curando a equipe globalmente.",
    skills: [
      { skillname: "Orvalho", skilldesc: "A flor de Floryn concede a um aliado um item extra que não ocupa espaço no inventário. A flor acumula energia." },
      { skillname: "Semear", skilldesc: "Floryn lança uma semente que causa dano e cura aliados próximos." },
      { skillname: "Brotar", skilldesc: "Floryn lança uma bola de energia que atordoa o primeiro inimigo atingido." },
      { skillname: "Florescer", skilldesc: "Floryn cura todos os heróis aliados no mapa duas vezes, independentemente da distância. Inimigos na área da cura recebem dano." }
    ],
    combos: [
      { title: "Combo de Cura e Suporte", desc: "Use a Habilidade 1 para pokear e curar. Use a Habilidade 2 para atordoar inimigos. A Ultimate é uma cura global que pode salvar aliados em todo o mapa." }
    ]
  },
  "Valentina": {
    name: "Valentina",
    summary: "Valentina é a matriarca da Casa Paxley, uma maga poderosa que pode roubar a ultimate de seus inimigos e assumir sua forma, usando seu próprio poder contra eles.",
    skills: [
      { skillname: "Sombra Primeva", skilldesc: "Valentina ganha EXP extra e seu roubo de vida mágico aumenta com seu nível." },
      { skillname: "Sombra Impactante", skilldesc: "Valentina lança uma sombra que causa dano e aterroriza os inimigos." },
      { skillname: "Sombra Arcana", skilldesc: "Valentina avança e dispara 3 projéteis de sombra no inimigo mais próximo." },
      { skillname: "Eu Sou Você", skilldesc: "Valentina rouba a ultimate do herói inimigo alvo e pode usá-la. Se o inimigo for um herói de transformação, ela também pode se transformar e usar suas habilidades." }
    ],
    combos: [
      { title: "Combo de Flexibilidade", desc: "O combo depende da ultimate roubada. Geralmente, use a Habilidade 1 para controle, a Habilidade 2 para se aproximar ou escapar, e a Ultimate roubada para virar a luta." }
    ]
  },
  "Melissa": {
    name: "Melissa",
    summary: "Melissa é uma jovem que comanda bonecos de vodu com agulhas. Ela pode criar uma barreira protetora para se defender enquanto seus bonecos atacam os inimigos.",
    skills: [
      { skillname: "Poder da Boneca", skilldesc: "Melissa causa dano extra a minions, creeps e unidades invocadas." },
      { skillname: "Agulha Caindo!", skilldesc: "Melissa avança e ganha velocidade de ataque." },
      { skillname: "Olhos em Você!", skilldesc: "Melissa joga seu boneco Muddles, que liga os inimigos próximos com fios de energia. Inimigos ligados recebem dano quando Melissa ataca o boneco." },
      { skillname: "Vai! Muddles!", skilldesc: "Melissa cria um campo de proteção ao seu redor por 5s. Inimigos que tentarem entrar no campo serão repelidos." }
    ],
    combos: [
      { title: "Combo de Proteção e Dano", desc: "Use a Habilidade 2 para ligar os inimigos ao boneco. Use a Habilidade 1 para se reposicionar e ganhar velocidade de ataque. Ative a Ultimate para se proteger de heróis de curto alcance enquanto causa dano." }
    ]
  },
  "Yin": {
    name: "Yin",
    summary: "Yin é um artista marcial que foi possuído por um deus maligno, Lieh. Ele pode arrastar seus inimigos para seu domínio e lutar contra eles um contra um como Lieh.",
    skills: [
      { skillname: "Deixe a Briga Comigo", skilldesc: "Quando não há aliados por perto, o dano de Yin aumenta." },
      { skillname: "Golpe Carregado / Golpe Frenético", skilldesc: "Yin avança, ganhando velocidade e aprimorando seu próximo ataque. Como Lieh, ele ataca o chão, causando dano em área." },
      { skillname: "Golpe Instantâneo", skilldesc: "Yin avança, deixando anéis dourados para trás. Após um tempo, os anéis o alcançam, causando dano e atordoando." },
      { skillname: "Meu Turno", skilldesc: "Yin puxa um herói inimigo para seu domínio por 8s, transformando-se em Lieh. Se ele matar o inimigo no domínio, ele pode continuar como Lieh no campo de batalha." }
    ],
    combos: [
      { title: "Combo de Duelo", desc: "Use a Habilidade 2 para se aproximar e atordoar. Use a Habilidade 1 para dano. Ative a Ultimate para levar um alvo para o domínio e use as habilidades aprimoradas de Lieh para garantir o abate." }
    ]
  },
  "Xavier": {
    name: "Xavier",
    summary: "Xavier é o Árbitro da Luz, um membro da Ordem dos Cavaleiros que busca erradicar a heresia. Ele pode criar barreiras místicas e disparar um raio de luz global.",
    skills: [
      { skillname: "Transcendência", skilldesc: "As habilidades de Xavier aprimoram sua próxima habilidade. Com 3 acúmulos, sua próxima habilidade cria um círculo de transcendência que imobiliza os inimigos." },
      { skillname: "Aniquilação Infinita", skilldesc: "Xavier dispara uma bala mística que causa dano." },
      { skillname: "Barreira Mística", skilldesc: "Xavier cria uma barreira que retarda os inimigos e acelera os aliados." },
      { skillname: "Luz Ofuscante", skilldesc: "Xavier dispara um raio de luz global que causa dano a todos os inimigos em uma linha. Ele entra em estado de transcendência ao usar a habilidade." }
    ],
    combos: [
      { title: "Combo de Controle e Dano", desc: "Use a Habilidade 1 para pokear e acumular a passiva. Use a Habilidade 2 para retardar e, com a passiva carregada, use a Habilidade 1 novamente para imobilizar. A Ultimate pode ser usada para finalizar alvos em todo o mapa." }
    ]
  },
  "Julian": {
    name: "Julian",
    summary: "Julian é um membro da casa dos Corvos, um lutador que se recusa a usar armas. Ele aprimora suas habilidades em sequência, criando combos únicos sem uma ultimate tradicional.",
    skills: [
      { skillname: "Corrente do Ferreiro", skilldesc: "Após usar duas habilidades diferentes, a terceira habilidade de Julian é aprimorada." },
      { skillname: "Foice", skilldesc: "Julian lança uma foice voadora. Aprimorada, ela causa dano contínuo e retarda." },
      { skillname: "Espada", skilldesc: "Julian invoca uma espada voadora e avança. Aprimorada, ela ataca mais rápido e teletransporta Julian." },
      { skillname: "Corrente", skilldesc: "Julian lança correntes que causam dano e imobilizam. Aprimorada, ela arremessa os inimigos ao ar." }
    ],
    combos: [
      { title: "Combo de Controle", desc: "Use Habilidade 1 -> Habilidade 2 -> Habilidade 3 Aprimorada (arremesso ao ar)." },
      { title: "Combo de Dano", desc: "Use Habilidade 2 -> Habilidade 3 -> Habilidade 1 Aprimorada (dano contínuo)." }
    ]
  },
  "Fredrinn": {
    name: "Fredrinn",
    summary: "Fredrinn é um caçador de tesouros robusto que pode absorver dano e convertê-lo em poder para seus próprios ataques, provocando seus inimigos e finalizando-os com um golpe devastador.",
    skills: [
      { skillname: "Cristal Cúbico", skilldesc: "Fredrinn armazena o dano que recebe como Cristal de Energia. Ele pode converter essa energia em HP." },
      { skillname: "Golpe Perfurante", skilldesc: "Fredrinn ataca com sua espada, causando dano e lentidão. Seu próximo Ataque Básico tem alcance aumentado." },
      { skillname: "Assalto Corajoso", skilldesc: "Fredrinn avança, ganhando um escudo e provocando os inimigos próximos." },
      { skillname: "Impacto Energético", skilldesc: "Fredrinn ataca, arremessando o inimigo ao ar." },
      { skillname: "Fúria do Perito", skilldesc: "Fredrinn ataca em uma área, causando dano massivo com base no Cristal de Energia que ele acumulou." }
    ],
    combos: [
      { title: "Combo de Tanque e Dano", desc: "Use a Habilidade 2 para provocar os inimigos e absorver dano. Use a Habilidade 1 e 3 para controle. Quando tiver acumulado bastante dano, use a Ultimate para causar dano de execução em área." }
    ]
  },
  "Joy": {
    name: "Joy",
    summary: "Joy é uma Leonina enérgica que se move ao ritmo da batida. Ela pode avançar em sincronia com a música, tornando-se imune a controle de grupo e desferindo um ataque final devastador.",
    skills: [
      { skillname: "Hum, Nós Não Brincamos!", skilldesc: "As habilidades de Joy são sincronizadas com a batida. Acertar uma habilidade no ritmo perfeito concede um escudo e velocidade de movimento." },
      { skillname: "Olha, Leonin de Cristal!", skilldesc: "Joy invoca um cristal que causa dano." },
      { skillname: "Miau, Ritmo de Alegria!", skilldesc: "Joy avança em uma direção. Usar esta habilidade no ritmo permite que ela a use novamente até 5 vezes. No último avanço, ela ganha imunidade a CC." },
      { skillname: "Ha, Eletrizante Batida!", skilldesc: "Joy remove todos os debuffs e libera sua energia, causando dano contínuo ao seu redor. O dano aumenta a cada vez que ela acerta a batida com sua Habilidade 2." }
    ],
    combos: [
      { title: "Combo Rítmico", desc: "Use a Habilidade 2 no ritmo da batida para avançar continuamente e ganhar imunidade. Após acertar a batida 5 vezes, ative a Ultimate para causar dano máximo." }
    ]
  },
  "Novaria": {
    name: "Novaria",
    summary: "Novaria é uma maga astral que se tornou uma com as estrelas. Ela pode se mover através do terreno e disparar um projétil de longo alcance que causa dano com base na distância.",
    skills: [
      { skillname: "Pacto Estelar", skilldesc: "As habilidades de Novaria revelam a posição dos inimigos atingidos." },
      { skillname: "Gota Astral", skilldesc: "Novaria invoca uma esfera que causa dano e lentidão contínuos." },
      { skillname: "Meteoro Astral", skilldesc: "Novaria entra em um estado astral, permitindo que ela passe através de paredes. Ela pode disparar uma esfera que explode, causando dano com base na distância percorrida." },
      { skillname: "Eco Astral", skilldesc: "Novaria dispara um projétil que se anexa a um herói, revelando-o e aumentando o tamanho de sua caixa de colisão." }
    ],
    combos: [
      { title: "Combo de Sniper Astral", desc: "Use a Ultimate para revelar e marcar um alvo. Use a Habilidade 2 para atravessar paredes e ganhar distância, e então dispare o meteoro para dano massivo de longa distância. Use a Habilidade 1 para lentidão e zoneamento." }
    ]
  },
  "Arlott": {
    name: "Arlott",
    summary: "Arlott é um guerreiro demoníaco que empunha uma lança dupla. Ele pode marcar seus inimigos e avançar neles com golpes implacáveis, recuperando-se a cada ataque.",
    skills: [
      { skillname: "Olho Demoníaco", skilldesc: "Arlott revela a posição de heróis inimigos próximos a cada 10s." },
      { skillname: "Golpe Destemido", skilldesc: "Arlott balança sua lança, causando dano e repelindo os inimigos. Inimigos na borda externa são atordoados." },
      { skillname: "Vingança", skilldesc: "Arlott avança em um inimigo marcado pela sua passiva, causando dano e se curando. A recarga é zerada se ele acertar." },
      { skillname: "Golpe Final", skilldesc: "Arlott varre o campo de batalha com sua lança, empurrando todos os inimigos em uma linha para o final do alcance da habilidade." }
    ],
    combos: [
      { title: "Combo de Controle e Dano", desc: "Use a Habilidade 1 para marcar os inimigos com a passiva. Use a Habilidade 2 para avançar neles repetidamente. Use a Ultimate para varrer e agrupar a equipe inimiga." }
    ]
  },
  "Ixia": {
    name: "Ixia",
    summary: "Ixia é uma jovem inventora de Eruditio que usa uma arma de arco de energia. Ela pode armazenar energia para desferir ataques em leque, controlando o campo de batalha com suas rajadas.",
    skills: [
      { skillname: "Gatilho Sifão", skilldesc: "Os Ataques Básicos de Ixia aplicam uma marca. Atacar um alvo marcado com outro Ataque Básico causa dano extra e a cura." },
      { skillname: "Arco Duplo", skilldesc: "Ixia dispara dois feixes de energia que causam dano e retardam." },
      { skillname: "Hélice de Sifão", skilldesc: "Ixia puxa os inimigos em uma área para o centro após um curto atraso." },
      { skillname: "Barragem de Arclight", skilldesc: "Ixia entra em modo de barragem, e seus Ataques Básicos atingem uma área em forma de leque por 5s." }
    ],
    combos: [
      { title: "Combo de Dano em Área", desc: "Use a Habilidade 2 para agrupar os inimigos. Ative a Ultimate e use seus ataques em leque para atingir múltiplos alvos. Use a Habilidade 1 para dano e lentidão adicionais." }
    ]
  },
  "Nolan": {
    name: "Nolan",
    summary: "Nolan é um detetive cósmico que pode cortar o tecido do espaço. Ele deixa fendas dimensionais para trás, que ele pode usar para se mover rapidamente e causar dano em cadeia.",
    skills: [
      { skillname: "Visão Dimensional", skilldesc: "As habilidades de Nolan cortam o espaço, deixando uma fenda que retarda os inimigos. Se duas fendas se conectarem, elas explodem, puxando os inimigos e causando dano." },
      { skillname: "Expansão", skilldesc: "Nolan avança e causa dano, deixando uma fenda." },
      { skillname: "Calibre", skilldesc: "Nolan ataca em uma área, causando dano e deixando uma fenda." },
      { skillname: "Fratura", skilldesc: "Nolan corta a área à sua frente 3 vezes, causando dano e deixando fendas. Ele também remove todos os debuffs de si mesmo." }
    ],
    combos: [
      { title: "Combo de Fenda Dimensional", desc: "Use a Habilidade 2 para se aproximar, seguido da Habilidade 1 para criar uma segunda fenda e causar a explosão. Use a Ultimate para dano massivo e para criar múltiplas fendas para explosões em cadeia." }
    ]
  },
  "Cici": {
    name: "Cici",
    summary: "Cici é uma artista de rua animada que luta com um ioiô. Ela ganha 'Deleite' ao causar dano, aumentando sua velocidade de movimento e permitindo que ela salte e ataque com agilidade.",
    skills: [
      { skillname: "Alegria do Artista", skilldesc: "Cici ganha acúmulos de 'Deleite' ao causar dano, aumentando sua velocidade de movimento. Com acúmulos máximos, ela ganha roubo de vida." },
      { skillname: "Explosão de Ioiô", skilldesc: "Cici lança seu ioiô em um alvo, prendendo-se a ele e podendo atacá-lo duas vezes enquanto se move." },
      { skillname: "Link Animoso", skilldesc: "Cici salta para um local. Se ela pousar em um inimigo, ela salta novamente." },
      { skillname: "Cortina Final", skilldesc: "Cici joga seu ioiô em um herói inimigo, ligando-o a outro herói próximo. Ela pode reativar para puxá-los juntos, causando dano e atordoando." }
    ],
    combos: [
      { title: "Combo de Mobilidade e Dano", desc: "Use a Habilidade 1 para se prender a um alvo e causar dano contínuo. Use a Habilidade 2 para saltar e se reposicionar. Use a Ultimate para prender dois inimigos e puxá-los para um controle em grupo." }
    ]
  },
  "Chip": {
    name: "Chip",
    summary: "Chip é um gênio da tecnologia que pode criar portais para teletransporte rápido pelo mapa, oferecendo mobilidade global para sua equipe.",
    skills: [
      { skillname: "Hora do Lanche!", skilldesc: "Quando Chip está fora de combate, ele come batatas fritas para se curar. Ao ajudar um aliado, ele oferece uma batata para curá-lo também." },
      { skillname: "Curso de Colisão", skilldesc: "Chip avança com sua hovercraft, ganhando um escudo. Seu próximo Ataque Básico o faz avançar e arremessar o inimigo." },
      { skillname: "Excesso de Velocidade", skilldesc: "Chip acelera sua hovercraft, ganhando velocidade de movimento e causando dano contínuo aos inimigos próximos." },
      { skillname: "Atalho", skilldesc: "Chip joga um portal principal em um local e pode conectar portais próximos a ele. Aliados (e inimigos) podem usar os portais para se teletransportar." }
    ],
    combos: [
      { title: "Combo de Mobilidade Global", desc: "Use a Ultimate para criar um portal principal perto de um objetivo ou luta. Conecte portais para que seus aliados possam se juntar rapidamente. Use a Habilidade 1 e 2 para controle e dano no combate." }
    ]
  },
  "Zhuxin": {
    name: "Zhuxin",
    summary: "Zhuxin, a Feiticeira das Borboletas, comanda enxames de borboletas espirituais para punir o mal. Com sua lanterna, ela guia almas perdidas, mas não hesita em usar seu poder para prender e consumir a força vital de seus inimigos em um campo carmesim.",
    skills: [
      { skillname: "Borboletas Carmesins", skilldesc: "As habilidades de Zhuxin aplicam Pilhas de Borboleta Carmesim nos inimigos. Ao atingir 3 pilhas, as borboletas irrompem, causando dano com base no HP perdido do alvo. Zhuxin também recupera HP ao recuperar Mana." },
      { skillname: "Graça Flutuante", skilldesc: "Zhuxin lança sua lanterna de seda como um bumerangue, causando dano mágico na ida e na volta e aplicando uma Pilha de Borboleta." },
      { skillname: "Armadilha da Alma", skilldesc: "Zhuxin lança uma armadilha de seda que se prende ao primeiro herói inimigo atingido, causando dano e puxando-o levemente. Se não atingir um herói, a armadilha permanece no chão e se ativará em inimigos que se aproximarem." },
      { skillname: "Campo Carmesim", skilldesc: "Zhuxin cria um grande campo de borboletas. Inimigos dentro do campo são revelados, retardados e continuamente recebem Pilhas de Borboleta Carmesim. O campo também aumenta a velocidade de recarga das Pilhas de Borboleta." }
    ],
    combos: [
      { title: "Combo de Controle e Explosão", desc: "Use a Habilidade 2 para prender um inimigo. Imediatamente use a Habilidade 1 para aplicar mais pilhas e acionar a explosão da passiva para um dano massivo." },
      { title: "Combo de Luta em Equipe", desc: "Posicione a Ultimate em uma área estratégica para retardar e aplicar pilhas em vários inimigos. Use a Habilidade 1 e a Habilidade 2 para focar em alvos prioritários e detonar a passiva repetidamente." }
    ]
  }
}