
import { Hero, Lane, HeroDetails, HeroSkill, SkillCombo, HeroRelation } from '../types';
import { HERO_TRANSLATIONS } from '../components/data/heroTranslations';

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

export interface CounterHeroData {
  heroid: number;
  increase_win_rate: number;
}

export interface ApiHeroRankData {
    main_heroid: number;
    main_hero_win_rate: number;
    main_hero_appearance_rate: number;
    main_hero_ban_rate: number;
    main_hero: {
        data: {
            name: string;
            head: string;
        }
    }
}

function cleanSkillDescription(desc: string): string {
    return desc.replace(/<font color="[^"]*">/g, '').replace(/<\/font>/g, '');
}

async function fetchWithCache<T>(cacheKey: string, fetchFunction: () => Promise<T>, ttl: number): Promise<T> {
    try {
        const cachedItem = localStorage.getItem(cacheKey);
        if (cachedItem) {
            const { timestamp, data } = JSON.parse(cachedItem);
            const isCacheValid = (new Date().getTime() - timestamp) < ttl;
            if (isCacheValid) {
                return data as T;
            }
        }
    } catch (e) {
        console.error(`Falha ao ler o cache para a chave ${cacheKey}`, e);
    }

    const fetchedData = await fetchFunction();

    try {
        const itemToCache = {
            timestamp: new Date().getTime(),
            data: fetchedData,
        };
        localStorage.setItem(cacheKey, JSON.stringify(itemToCache));
    } catch (e) {
        console.error(`Falha ao escrever no cache para a chave ${cacheKey}`, e);
    }

    return fetchedData;
}

export async function fetchHeroes(): Promise<Record<string, Hero>> {
    const cacheKey = 'hero_list_cache';
    const ttl = 24 * 60 * 60 * 1000; // 24 horas

    return fetchWithCache(cacheKey, async () => {
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
                        apiId: apiId,
                        name: heroName,
                        roles: [], 
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
    }, ttl);
}

export async function fetchCounters(heroApiId: number): Promise<CounterHeroData[]> {
    const cacheKey = `hero_counters_${heroApiId}`;
    const ttl = 6 * 60 * 60 * 1000; // 6 horas

    return fetchWithCache(cacheKey, async () => {
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
                return []; 
            }

            const counterHeroes = records[0]?.data?.sub_hero;

            if (!counterHeroes || !Array.isArray(counterHeroes)) {
                return []; 
            }

            return counterHeroes;
        } catch (error) {
            console.error(`Falha ao buscar counters para o herói ID ${heroApiId}:`, error);
            throw new Error("Não foi possível carregar os counters do herói.");
        }
    }, ttl);
}

async function fetchSkillCombos(heroApiId: number): Promise<SkillCombo[]> {
    const apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-skill-combo/${heroApiId}/`;
    const proxyUrl = 'https://corsproxy.io/?';
    const fetchUrl = proxyUrl + encodeURIComponent(apiUrl);

    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
            return []; 
        }
        const apiResponse = await response.json();
        const records = apiResponse?.data?.records;

        if (!records || !Array.isArray(records)) {
            return [];
        }

        return records.map((record: any) => ({
            title: record.data.title,
            desc: record.data.desc,
        }));

    } catch (error) {
        console.error(`Falha ao buscar combos para o herói ID ${heroApiId}:`, error);
        return []; 
    }
}

export async function fetchHeroDetails(heroApiId: number): Promise<HeroDetails> {
    const cacheKey = `hero_details_pt_${heroApiId}`;
    const ttl = 24 * 60 * 60 * 1000; // 24 hours

    return fetchWithCache(cacheKey, async () => {
        const apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-detail/${heroApiId}/`;
        const proxyUrl = 'https://corsproxy.io/?';
        const fetchUrl = proxyUrl + encodeURIComponent(apiUrl);

        try {
            const detailsResponse = await fetch(fetchUrl);
            if (!detailsResponse.ok) {
                throw new Error(`A resposta da API de detalhes do herói não foi 'ok': ${detailsResponse.statusText}`);
            }
            const apiResponse = await detailsResponse.json();
            const record = apiResponse?.data?.records?.[0]?.data;

            if (!record) {
                throw new Error('Os registos de detalhes do herói não foram encontrados na resposta da API.');
            }
            
            const heroData = record.hero.data;
            const heroName = heroData.name;

            // Use pre-translated data if available
            if (HERO_TRANSLATIONS[heroName]) {
                return HERO_TRANSLATIONS[heroName];
            }

            // Fallback to English data if no translation is found
            console.warn(`Nenhuma tradução encontrada para ${heroName}. A apresentar dados em inglês.`);
            const combos = await fetchSkillCombos(heroApiId);
            const skillList = heroData.heroskilllist?.[0]?.skilllist ?? [];

            const skills: HeroSkill[] = skillList.map((skill: any) => ({
                skillname: skill.skillname,
                skilldesc: cleanSkillDescription(skill.skilldesc),
            }));

            return {
                name: heroName,
                summary: heroData.story,
                skills: skills,
                combos: combos,
            };

        } catch (error) {
            console.error(`Falha ao buscar detalhes para o herói ID ${heroApiId}:`, error);
            throw new Error("Não foi possível carregar os detalhes do herói.");
        }
    }, ttl);
}

export async function fetchHeroRankings(
    days: number,
    rank: string,
    sortField: string
): Promise<ApiHeroRankData[]> {
    const cacheKey = `hero_rankings_cache_${days}_${rank}_${sortField}`;
    const ttl = 1 * 60 * 60 * 1000; // 1 hora

    return fetchWithCache(cacheKey, async () => {
        const apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-rank/?days=${days}&rank=${rank}&sort_field=${sortField}&sort_order=desc&size=50`;
        const proxyUrl = 'https://corsproxy.io/?';
        const fetchUrl = proxyUrl + encodeURIComponent(apiUrl);

        try {
            const response = await fetch(fetchUrl);
            if (!response.ok) {
                throw new Error(`A resposta da API de ranking não foi 'ok': ${response.statusText}`);
            }
            const apiResponse = await response.json();
            const records = apiResponse?.data?.records;

            if (!records || !Array.isArray(records)) {
                console.error("Estrutura da resposta da API de ranking inesperada:", apiResponse);
                return [];
            }

            return records.map((r: any) => r.data as ApiHeroRankData);
        } catch (error) {
            console.error(`Falha ao buscar ranking de heróis:`, error);
            throw new Error("Não foi possível carregar o ranking de heróis.");
        }
    }, ttl);
}

export async function fetchHeroRelations(heroApiId: number): Promise<HeroRelation | null> {
    const cacheKey = `hero_relations_${heroApiId}`;
    const ttl = 24 * 60 * 60 * 1000; // 24 horas

    return fetchWithCache(cacheKey, async () => {
        const relationApiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-relation/${heroApiId}/`;
        const proxyUrl = 'https://corsproxy.io/?';
        const fetchUrl = proxyUrl + encodeURIComponent(relationApiUrl);

        try {
            const [relationResponse, countersData] = await Promise.all([
                fetch(fetchUrl),
                fetchCounters(heroApiId)
            ]);

            let assistIds: number[] = [];
            let strongIds: number[] = [];

            if (relationResponse.ok) {
                const apiResponse = await relationResponse.json();
                const record = apiResponse?.data?.records?.[0]?.data;
                if (record && record.relation) {
                    const relations = record.relation;
                    assistIds = (relations.assist?.target_hero_id || []).filter((id: number) => id !== 0);
                    strongIds = (relations.strong?.target_hero_id || []).filter((id: number) => id !== 0);
                }
            } else if (relationResponse.status !== 404) {
                 console.warn(`A resposta da API de relações não foi 'ok': ${relationResponse.statusText}`);
            }

            const weakIds = countersData
                .sort((a, b) => b.increase_win_rate - a.increase_win_rate)
                .map(counter => counter.heroid);

            if (assistIds.length === 0 && strongIds.length === 0 && weakIds.length === 0) {
                return null;
            }

            return {
                assist: { target_hero_id: assistIds },
                strong: { target_hero_id: strongIds },
                weak: { target_hero_id: weakIds },
            };

        } catch (error) {
            console.error(`Falha ao buscar relações combinadas para o herói ID ${heroApiId}:`, error);
            throw new Error("Não foi possível carregar os dados de sinergia do herói.");
        }
    }, ttl);
}
