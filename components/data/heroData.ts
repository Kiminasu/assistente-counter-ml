// Ranking de "potencial de counter" baseado em versatilidade, mobilidade, e habilidades de anulação.
// Quanto maior o número, maior a prioridade para análise teórica quando faltam dados estatísticos.
export const HERO_EXPERT_RANK: Record<string, number> = {
    // Assassinos com alta mobilidade/imunidade
    "Lancelot": 10,
    "Fanny": 10,
    "Ling": 9,
    "Joy": 9,
    "Benedetta": 9,
    "Hayabusa": 8,
    "Gusion": 8,
    "Nolan": 8,
    
    // Magos com anulação/mobilidade/burst seguro
    "Kagura": 10,
    "Valentina": 9,
    "Pharsa": 9,
    "Lylia": 8,
    "Lunox": 8,
    "Kadita": 8,
    "Novaria": 7,
    
    // Soldados versáteis
    "Chou": 10,
    "Fredrinn": 9,
    "Arlott": 9,
    "Paquito": 8,
    "Yu Zhong": 8,
    "Lapu-Lapu": 7,
    "Terizla": 7,

    // Atiradores com escape/utilidade
    "Wanwan": 9,
    "Claude": 8,
    "Beatrix": 8,
    "Melissa": 7,
    "Brody": 7,

    // Tanques com CC forte/iniciação
    "Kaja": 9,
    "Atlas": 8,
    "Gloo": 7,

    // Suportes de anulação
    "Diggie": 10,
    "Mathilda": 8,
    "Angela": 7,
    "Floryn": 7,
};
