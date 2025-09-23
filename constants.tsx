import { Role } from './types';

// URLs de imagens de zathong.com, conforme solicitado, para corrigir problemas de visualização.
export const ITEM_ICONS: Record<string, string> = {
    "Dominância de Gelo": "https://zathong.com/wp-content/uploads/2022/10/Dominance-Ice.webp",
    "Escudo de Atena": "https://zathong.com/wp-content/uploads/2022/10/Athenas-Shield.webp",
    "Lâmina dos Sete Mares": "https://zathong.com/wp-content/uploads/2022/10/Blade-of-the-Heptaseas.webp",
    "Vento da Natureza": "https://zathong.com/wp-content/uploads/2022/10/Wind-of-Nature.webp",
    "Quebra-Defesa": "https://zathong.com/wp-content/uploads/2022/10/Malefic-Roar.webp",
    "Oráculo": "https://zathong.com/wp-content/uploads/2022/10/Oracle.webp",
    "default": "https://zathong.com/wp-content/uploads/2022/10/Antique-Cuirass.webp"
};

export const SPELL_ICONS: Record<string, string> = {
    "Executar": "https://lain.mlbb.ninja/assets/spells/execute.png",
    "Caçar": "https://lain.mlbb.ninja/assets/spells/retribution.png",
    "Inspirar": "https://lain.mlbb.ninja/assets/spells/inspire.png",
    "Petrificar": "https://lain.mlbb.ninja/assets/spells/petrify.png",
    "Purificar": "https://lain.mlbb.ninja/assets/spells/purify.png",
    "Teleporte": "https://lain.mlbb.ninja/assets/spells/arrival.png",
    "Vingança": "https://lain.mlbb.ninja/assets/spells/vengeance.png",
    "Proteção": "https://lain.mlbb.ninja/assets/spells/aegis.png",
    "Avançar": "https://lain.mlbb.ninja/assets/spells/sprint.png",
    "Curar": "https://lain.mlbb.ninja/assets/spells/healing-spell.png",
    "Lampejo": "https://lain.mlbb.ninja/assets/spells/flicker.png",
    "default": "https://lain.mlbb.ninja/assets/spells/flicker.png"
};

export const RATING_STYLES: Record<string, { text: string; border: string }> = {
    "ANULA": { text: "text-green-400", border: "border-green-400" },
    "VANTAGEM": { text: "text-blue-400", border: "border-blue-400" },
    "DESVANTAGEM": { text: "text-red-400", border: "border-red-400" },
    "NEUTRO": { text: "text-gray-400", border: "border-gray-400" },
};

// Base de dados de funções de heróis para permitir a filtragem e sugestões contextuais.
export const HERO_ROLES: Record<string, Role[]> = {
    "Miya": ["Atirador"], "Balmond": ["Soldado"], "Saber": ["Assassino"], "Nana": ["Mago", "Suporte"], "Tigreal": ["Tanque"], "Alucard": ["Soldado", "Assassino"], "Karina": ["Assassino"], "Akai": ["Tanque"], "Franco": ["Tanque"], "Bane": ["Soldado"], "Bruno": ["Atirador"], "Clint": ["Atirador"], "Rafaela": ["Suporte"], "Eudora": ["Mago"], "Zilong": ["Soldado", "Assassino"], "Fanny": ["Assassino"], "Layla": ["Atirador"], "Hayabusa": ["Assassino"], "Gord": ["Mago"], "Kagura": ["Mago"], "Chou": ["Soldado"], "Ruby": ["Soldado", "Tanque"], "Yi Sun-shin": ["Atirador", "Assassino"], "Moskov": ["Atirador"], "Johnson": ["Tanque"], "Cyclops": ["Mago"], "Hilda": ["Soldado", "Tanque"], "Aurora": ["Mago"], "Lapu-Lapu": ["Soldado"], "Vexana": ["Mago"], "Roger": ["Soldado", "Atirador"], "Gatotkaca": ["Tanque"], "Harley": ["Mago", "Assassino"], "Irithel": ["Atirador"], "Grock": ["Tanque"], "Argus": ["Soldado"], "Odette": ["Mago"], "Lancelot": ["Assassino"], "Diggie": ["Suporte"], "Hylos": ["Tanque"], "Zhask": ["Mago"], "Helcurt": ["Assassino"], "Pharsa": ["Mago"], "Lesley": ["Atirador", "Assassino"], "Jawhead": ["Soldado"], "Angela": ["Suporte"], "Gusion": ["Assassino", "Mago"], "Valir": ["Mago"], "Martis": ["Soldado"], "Uranus": ["Tanque"], "Hanabi": ["Atirador"], "Chang'e": ["Mago"], "Kaja": ["Soldado", "Suporte"], "Selena": ["Assassino", "Mago"], "Aldous": ["Soldado"], "Claude": ["Atirador"], "Vale": ["Mago"], "Leomord": ["Soldado"], "Lunox": ["Mago"], "Hanzo": ["Assassino"], "Belerick": ["Tanque"], "Kimmy": ["Atirador", "Mago"], "Thamuz": ["Soldado"], "Harith": ["Mago"], "Minsitthar": ["Soldado"], "Kadita": ["Mago", "Assassino"], "Faramis": ["Suporte", "Mago"], "Granger": ["Atirador"], "Esmeralda": ["Mago", "Tanque"], "Terizla": ["Soldado"], "X.Borg": ["Soldado"], "Ling": ["Assassino"], "Dyrroth": ["Soldado"], "Lylia": ["Mago"], "Baxia": ["Tanque"], "Masha": ["Soldado"], "Wanwan": ["Atirador"], "Silvanna": ["Soldado"], "Cecilion": ["Mago"], "Carmilla": ["Suporte"], "Atlas": ["Tanque"], "Popol and Kupa": ["Atirador"], "Yu Zhong": ["Soldado"], "Luo Yi": ["Mago"], "Benedetta": ["Assassino"], "Khaleed": ["Soldado"], "Barats": ["Tanque", "Soldado"], "Brody": ["Atirador"], "Yve": ["Mago"], "Mathilda": ["Suporte", "Assassino"], "Paquito": ["Soldado", "Assassino"], "Gloo": ["Tanque"], "Beatrix": ["Atirador"], "Natan": ["Atirador", "Mago"], "Aulus": ["Soldado"], "Edith": ["Tanque", "Atirador"], "Floryn": ["Suporte"], "Valentina": ["Mago"], "Melissa": ["Atirador"], "Yin": ["Soldado", "Assassino"], "Xavier": ["Mago"], "Julian": ["Mago", "Soldado"], "Fredrinn": ["Tanque", "Soldado"], "Joy": ["Assassino"], "Novaria": ["Mago"], "Arlott": ["Soldado"], "Ixia": ["Atirador"], "Nolan": ["Assassino"], "Cici": ["Soldado"], "Chip": ["Tanque", "Suporte"]
};