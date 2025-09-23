// Simple Levenshtein distance implementation to find similarity between two strings.
const levenshteinDistance = (s1: string, s2: string): number => {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) {
            costs[s2.length] = lastValue;
        }
    }
    return costs[s2.length];
};

/**
 * Finds the best match for a target string from a list of candidate strings.
 * This is used to correct minor typos or variations from the AI's response.
 * @param target The string we want to find a match for (e.g., "Lâmina dos 7 Mares").
 * @param candidates A list of valid strings to match against (e.g., ["Lâmina dos Sete Mares", ...]).
 * @returns The best matching string from the candidates, or the original target if no close match is found.
 */
export const findClosestString = (target: string, candidates: string[]): string => {
    if (!target || candidates.length === 0) return target;

    let minDistance = Infinity;
    let bestMatch = target; // Default to original string

    for (const candidate of candidates) {
        const distance = levenshteinDistance(target, candidate);
        if (distance < minDistance) {
            minDistance = distance;
            bestMatch = candidate;
        }
    }

    // If the best match is still too different (e.g., Levenshtein distance > 4),
    // it's likely not the intended string. In that case, we might still default to the original,
    // but for item names, a small threshold is usually effective.
    if (minDistance <= 4) {
        return bestMatch;
    }

    return target; // Return original if no confident match is found
};
