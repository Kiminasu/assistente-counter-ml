export interface MetaSynergy {
  heroNames: [string, string];
  description: string;
}

// Data for the new "Key Meta Synergies" panel
export const META_SYNERGIES: MetaSynergy[] = [
  {
    heroNames: ["Atlas", "Pharsa"],
    description: "A iniciação em área do Atlas agrupa os inimigos, criando o cenário perfeito para o dano massivo da ultimate da Pharsa."
  },
  {
    heroNames: ["Johnson", "Odette"],
    description: "A clássica 'Uber'. Johnson transforma-se, leva Odette até o time inimigo e a ultimate de ambos causa um dano em área devastador."
  },
  {
    heroNames: ["Angela", "Fredrinn"],
    description: "Angela anexa-se a Fredrinn, fornecendo escudo e cura, tornando o já resistente caçador de tesouros quase imortal no meio da luta."
  },
  {
    heroNames: ["Luo Yi", "Tigreal"],
    description: "O teleporte global de Luo Yi permite que Tigreal inicie uma luta de forma inesperada, pegando a equipe inimiga completamente desprevenida."
  },
];
