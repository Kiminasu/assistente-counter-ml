import { Hero } from '../../types';

/**
 * This file contains manual data for heroes who may not yet be available in the external API.
 * The data here acts as a fallback and will be merged with the API response.
 * API data takes precedence if a hero exists in both sources.
 */
export const MANUAL_HERO_DATA: Record<string, Omit<Hero, 'roles'>> = {
    "obsidia": {
        id: "obsidia",
        apiId: 999, // Placeholder API ID
        name: "Obsidia",
        imageUrl: "https://i.postimg.cc/3w0d8vYv/obsidia-avatar.png", // Avatar based on user's screenshot
    }
};
