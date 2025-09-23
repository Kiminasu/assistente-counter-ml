import { Hero } from '../types';

// Updated interface to capture the numerical hero_id from the API.
interface ApiHeroRecord {
  data: {
    hero_id: number;
    hero: {
      data: {
        name: string;
        head: string;
      }
    }
  }
}

// Interface for the data returned by the new counter API.
export interface CounterHeroData {
  heroid: number;
  increase_win_rate: number;
}

export async function fetchHeroes(): Promise<Record<string, Hero>> {
    const apiUrl = 'https://mlbb-stats.ridwaanhall.com/api/hero-list-new/';
    const proxyUrl = 'https://corsproxy.io/?';
    const fetchUrl = proxyUrl + encodeURIComponent(apiUrl);
    
    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
            throw new Error(`A resposta da rede não foi 'ok': ${response.statusText}`);
        }

        const apiResponse = await response.json();
        const records: ApiHeroRecord[] = apiResponse?.data?.records;

        if (!records || !Array.isArray(records)) {
            console.error("Estrutura da resposta da API inesperada:", apiResponse);
            throw new Error('Os registos de heróis não foram encontrados na resposta da API.');
        }

        const heroDatabase: Record<string, Hero> = {};

        for (const record of records) {
            const heroInfo = record?.data?.hero?.data;
            const apiId = record?.data?.hero_id;

            if (heroInfo && heroInfo.name && heroInfo.head && apiId) {
                const heroName = heroInfo.name;
                const heroId = heroName.toLowerCase().replace(/[^a-z0-9]/g, '');
                heroDatabase[heroId] = {
                    id: heroId,
                    apiId: apiId, // Storing the numerical ID
                    name: heroName,
                    role: '', 
                    imageUrl: heroInfo.head,
                };
            }
        }
        
        if (Object.keys(heroDatabase).length === 0) {
            throw new Error("Não foi possível processar dados de heróis válidos da API.");
        }

        return heroDatabase;

    } catch (error) {
        console.error("Falha ao buscar ou processar os dados dos heróis:", error);
        throw new Error("Não foi possível carregar os dados dos heróis. O serviço pode estar temporariamente indisponível.");
    }
}


export async function fetchCounters(heroApiId: number): Promise<CounterHeroData[]> {
    const apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-counter/${heroApiId}/`;
    const proxyUrl = 'https://corsproxy.io/?';
    const fetchUrl = proxyUrl + encodeURIComponent(apiUrl);

    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
            throw new Error(`A resposta da API de counter não foi 'ok': ${response.statusText}`);
        }
        const apiResponse = await response.json();
        const records = apiResponse?.data?.records;

        if (!records || !Array.isArray(records) || records.length === 0) {
            throw new Error('Os registos de counter não foram encontrados na resposta da API.');
        }

        const counterHeroes = records[0]?.data?.sub_hero;

        if (!counterHeroes || !Array.isArray(counterHeroes)) {
            throw new Error('O array sub_hero não foi encontrado na resposta da API de counter.');
        }

        return counterHeroes;
    } catch (error) {
        console.error(`Falha ao buscar counters para o herói ID ${heroApiId}:`, error);
        throw new Error("Não foi possível carregar os counters do herói.");
    }
}

export async function fetchDirectMatchup(yourHeroApiId: number, enemyHeroApiId: number): Promise<CounterHeroData | null> {
    try {
        // We look for how well our hero performs against the enemy.
        // So we fetch the enemy's counters and see if our hero is on that list.
        const enemyCounters = await fetchCounters(enemyHeroApiId);
        const matchup = enemyCounters.find(counter => counter.heroid === yourHeroApiId);
        
        // The API also tells us who our hero is weak against.
        // We can fetch our counters to see if the enemy is a known counter to us.
        const yourCounters = await fetchCounters(yourHeroApiId);
        const counterMatchup = yourCounters.find(counter => counter.heroid === enemyHeroApiId);

        if (matchup) {
            return matchup; // Our hero has a statistical advantage
        }

        if (counterMatchup) {
            // The enemy is a counter to us, so we return a negative win rate.
            return {
                heroid: yourHeroApiId,
                increase_win_rate: -counterMatchup.increase_win_rate
            };
        }

        return null; // No significant statistical relationship found
    } catch (error) {
        console.error(`Falha ao buscar confronto direto entre ${yourHeroApiId} e ${enemyHeroApiId}:`, error);
        // Don't throw, just return null so the app can continue without this data.
        return null; 
    }
}