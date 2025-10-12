import { Hero, Lane, Role, HeroDetails, HeroSkill, SkillCombo, HeroRelation, FullHeroStats, SynergyStat, HeroDailyStats, TimeWinRate } from '../types';
import { HERO_TRANSLATIONS } from '../components/data/heroTranslations';
import { MANUAL_SYNERGY_DATA } from '../components/data/synergyData';

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

export interface HeroCounterStats {
    counters: CounterHeroData[];
    counteredBy: CounterHeroData[];
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

// New interface for the position data from the API
interface ApiPositionRecord {
  data: {
    hero_id: number;
    hero: {
      data: {
        roadsort: { data: { road_sort_title: string } }[];
        sortid: { data: { sort_title: string } }[];
      }
    }
  }
}

// Interface for the sub-hero data from the API
interface ApiSubHeroStat {
    heroid: number;
    increase_win_rate: number;
    min_win_rate6_8: number;
    min_win_rate8_10: number;
    min_win_rate10_12: number;
    min_win_rate12_14: number;
    min_win_rate14_16: number;
    min_win_rate16_18: number;
    min_win_rate18_20: number;
    min_win_rate20: number;
}

// Interface for the hero detail stats response (main stats only)
interface ApiHeroMainStatsRecord {
    data: {
        main_hero_win_rate: number;
        main_hero_appearance_rate: number; // This is pick rate
        main_hero_ban_rate: number;
    }
}

// Interface for the compatibility stats response
interface ApiHeroCompatibilityRecord {
    data: {
        sub_hero: ApiSubHeroStat[];
        sub_hero_last: ApiSubHeroStat[];
    }
}


interface ApiSkillComboRecord {
    data: {
        title: string;
        desc: string;
        skill_id: {
            data: {
                skillicon: string;
            }
        }[];
    }
}

interface ApiDailyRateData {
    date: string;
    win_rate: number;
    app_rate: number;
    ban_rate: number;
}


// Mappings from API string to our enums
const apiRoleMap: Record<string, Role> = {
    'tank': 'Tanque',
    'fighter': 'Soldado',
    'assassin': 'Assassino',
    'mage': 'Mago',
    'Marksman': 'Atirador',
    'support': 'Suporte'
};

const apiLaneMap: Record<string, Lane> = {
    'Exp Lane': 'EXP',
    'Mid Lane': 'MEIO',
    'Roam': 'ROTAÇÃO',
    'Jungle': 'SELVA',
    'Gold Lane': 'OURO'
};


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
        const apiUrl = 'https://mlbb-stats.ridwaanhall.com/api/hero-list/';
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

export async function fetchHeroPositionsData(): Promise<Record<number, { roles: Role[], lanes: Lane[] }>> {
    const cacheKey = 'hero_positions_data_cache';
    const ttl = 24 * 60 * 60 * 1000; // 24 horas

    return fetchWithCache(cacheKey, async () => {
        const apiUrl = 'https://mlbb-stats.ridwaanhall.com/api/hero-position/?size=200'; // Fetch all
        const proxyUrl = 'https://corsproxy.io/?';
        const fetchUrl = proxyUrl + encodeURIComponent(apiUrl);

        try {
            const response = await fetch(fetchUrl);
            if (!response.ok) {
                throw new Error(`A resposta da API de posição não foi 'ok': ${response.statusText}`);
            }

            const apiResponse = await response.json();
            const records: ApiPositionRecord[] = apiResponse?.data?.records;

            if (!records || !Array.isArray(records)) {
                console.error("Estrutura da resposta da API de posição inesperada:", apiResponse);
                throw new Error('Os registos de posição de herói não foram encontrados na resposta da API.');
            }
            
            const positionsDatabase: Record<number, { roles: Role[], lanes: Lane[] }> = {};

            for (const record of records) {
                const apiId = record?.data?.hero_id;
                const heroData = record?.data?.hero?.data;

                if (apiId && heroData) {
                    const roles = (heroData.sortid || [])
                        .map(s => apiRoleMap[s?.data?.sort_title])
                        .filter((r): r is Role => r !== undefined);
                    
                    const lanes = (heroData.roadsort || [])
                        .map(r => apiLaneMap[r?.data?.road_sort_title])
                        .filter((l): l is Lane => l !== undefined);
                    
                    positionsDatabase[apiId] = {
                        roles: [...new Set(roles)], // Ensure uniqueness
                        lanes: [...new Set(lanes)], // Ensure uniqueness
                    };
                }
            }
            return positionsDatabase;

        } catch (error) {
            console.error("Falha ao buscar ou processar os dados de posição dos heróis:", error);
            // Return an empty object on failure to avoid breaking the app
            return {};
        }
    }, ttl);
}

export async function fetchHeroCounterStats(heroApiId: number): Promise<HeroCounterStats> {
    const cacheKey = `hero_counter_stats_${heroApiId}`;
    const ttl = 6 * 60 * 60 * 1000; // 6 horas

    return fetchWithCache(cacheKey, async () => {
        const apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-counter/${heroApiId}/`;
        const proxyUrl = 'https://corsproxy.io/?';
        const fetchUrl = proxyUrl + encodeURIComponent(apiUrl);

        try {
            const response = await fetch(fetchUrl);
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn(`Nenhum dado de counter encontrado para o herói ID ${heroApiId} (404).`);
                    return { counters: [], counteredBy: [] };
                }
                throw new Error(`A resposta da API de counter não foi 'ok': ${response.statusText}`);
            }
            const apiResponse = await response.json();
            const record = apiResponse?.data?.records?.[0]?.data;
            
            if (!record) {
                 return { counters: [], counteredBy: [] };
            }

            const counters = record.sub_hero || [];
            const counteredBy = record.sub_hero_last || [];
            
            return { counters, counteredBy };
        } catch (error) {
            console.error(`Falha ao buscar stats de counter para o herói ID ${heroApiId}:`, error);
            // Retornar um objeto vazio em caso de falha para evitar que a UI quebre
            return { counters: [], counteredBy: [] };
        }
    }, ttl);
}

export async function fetchSkillCombos(heroApiId: number): Promise<SkillCombo[]> {
    const cacheKey = `hero_skill_combos_${heroApiId}`;
    const ttl = 24 * 60 * 60 * 1000; // 24 horas

    return fetchWithCache(cacheKey, async () => {
        const apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-skill-combo/${heroApiId}/`;
        const proxyUrl = 'https://corsproxy.io/?';
        const fetchUrl = proxyUrl + encodeURIComponent(apiUrl);

        try {
            const response = await fetch(fetchUrl);
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn(`Nenhum combo de habilidade encontrado para o herói ID ${heroApiId} (404).`);
                    return [];
                }
                throw new Error(`A resposta da API de combo de habilidade não foi 'ok': ${response.statusText}`);
            }
            const apiResponse = await response.json();
            const records: ApiSkillComboRecord[] = apiResponse?.data?.records;

            if (!records || !Array.isArray(records)) {
                return [];
            }
            
            const combos: SkillCombo[] = records.map(record => {
                const skillIcons = record.data.skill_id.map(skill => skill.data.skillicon);
                return {
                    title: record.data.title,
                    desc: record.data.desc,
                    skillIcons: skillIcons
                };
            });

            return combos;

        } catch (error) {
            console.error(`Falha ao buscar combos de habilidade para o herói ID ${heroApiId}:`, error);
            return [];
        }
    }, ttl);
}

export async function fetchHeroDetails(heroApiId: number): Promise<HeroDetails> {
    const cacheKey = `hero_details_v2_${heroApiId}`;
    const ttl = 24 * 60 * 60 * 1000; // 24 horas

    return fetchWithCache(cacheKey, async () => {
        const detailApiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-detail/${heroApiId}/`;
        const proxyUrl = 'https://corsproxy.io/?';
        const fetchDetailUrl = proxyUrl + encodeURIComponent(detailApiUrl);

        try {
            const [detailsResponse, combos] = await Promise.all([
                fetch(fetchDetailUrl),
                fetchSkillCombos(heroApiId)
            ]);

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

            const skillList = heroData.heroskilllist?.[0]?.skilllist ?? [];
            const apiSkills: HeroSkill[] = skillList.map((skill: any) => ({
                skillname: skill.skillname,
                skilldesc: cleanSkillDescription(skill.skilldesc),
                skillicon: skill.skillicon,
            }));

            const translatedData = HERO_TRANSLATIONS[heroName];
            if (translatedData) {
                const finalCombos: SkillCombo[] = translatedData.combos.map((manualCombo, index) => {
                    const apiCombo = combos[index];
                    return {
                        title: manualCombo.title,
                        desc: manualCombo.desc,
                        skillIcons: apiCombo ? apiCombo.skillIcons : [],
                    };
                });
                
                const finalSkills: HeroSkill[] = translatedData.skills.map((manualSkill, index) => ({
                    ...manualSkill,
                    skillicon: apiSkills[index]?.skillicon,
                }));

                return {
                    name: heroName,
                    summary: translatedData.summary,
                    skills: finalSkills,
                    combos: finalCombos,
                };
            }

            console.warn(`Nenhuma tradução encontrada para ${heroName}. A apresentar dados em inglês.`);

            return {
                name: heroName,
                summary: heroData.story,
                skills: apiSkills,
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
        const apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-rank/?days=${days}&rank=${rank}&sort_field=${sortField}&sort_order=desc&size=200`;
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

export async function fetchHeroDetailStats(
    heroApiId: number,
    heroApiIdMap: Record<number, Hero>
): Promise<FullHeroStats | null> {
    const cacheKey = `hero_detail_stats_v2_${heroApiId}`; // Nova versão para cache
    const ttl = 6 * 60 * 60 * 1000; // 6 horas

    return fetchWithCache(cacheKey, async () => {
        const proxyUrl = 'https://corsproxy.io/?';
        const detailStatsApiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-detail-stats/${heroApiId}/`;
        const compatibilityApiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-compatibility/${heroApiId}/`;

        const fetchDetailStatsUrl = proxyUrl + encodeURIComponent(detailStatsApiUrl);
        const fetchCompatibilityUrl = proxyUrl + encodeURIComponent(compatibilityApiUrl);

        try {
            const [detailStatsResponse, compatibilityResponse] = await Promise.all([
                fetch(fetchDetailStatsUrl).catch(e => { console.warn('Falha ao buscar API de stats detalhados', e); return null; }),
                fetch(fetchCompatibilityUrl).catch(e => { console.warn('Falha ao buscar API de compatibilidade', e); return null; })
            ]);

            // Processar estatísticas do herói principal de hero-detail-stats
            let stats = { winRate: 0, pickRate: 0, banRate: 0 };
            if (detailStatsResponse && detailStatsResponse.ok) {
                const apiResponse = await detailStatsResponse.json();
                const record: ApiHeroMainStatsRecord | undefined = apiResponse?.data?.records?.[0];
                if (record?.data) {
                    stats = {
                        winRate: record.data.main_hero_win_rate,
                        pickRate: record.data.main_hero_appearance_rate,
                        banRate: record.data.main_hero_ban_rate,
                    };
                }
            } else if (detailStatsResponse) {
                console.warn(`A resposta da API de stats detalhados não foi 'ok': ${detailStatsResponse.statusText}`);
            }
            
            // Processar sinergias de hero-compatibility
            const processSubHeroes = (subHeroes: ApiSubHeroStat[]): SynergyStat[] => {
                if (!subHeroes) return [];
                return subHeroes.map(subHeroData => {
                    const hero = heroApiIdMap[subHeroData.heroid];
                    if (!hero) return null;

                    const winRateOverTime: TimeWinRate[] = [
                        { time: '6-8m', winRate: subHeroData.min_win_rate6_8 },
                        { time: '8-10m', winRate: subHeroData.min_win_rate8_10 },
                        { time: '10-12m', winRate: subHeroData.min_win_rate10_12 },
                        { time: '12-14m', winRate: subHeroData.min_win_rate12_14 },
                        { time: '14-16m', winRate: subHeroData.min_win_rate14_16 },
                        { time: '16-18m', winRate: subHeroData.min_win_rate16_18 },
                        { time: '18-20m', winRate: subHeroData.min_win_rate18_20 },
                        { time: '20m+', winRate: subHeroData.min_win_rate20 },
                    ].filter(point => typeof point.winRate === 'number');

                    return {
                        hero,
                        increaseWinRate: subHeroData.increase_win_rate,
                        winRateOverTime,
                    };
                }).filter((s): s is SynergyStat => s !== null);
            };

            let bestSynergies: SynergyStat[] = [];
            let worstSynergies: SynergyStat[] = [];
            if (compatibilityResponse && compatibilityResponse.ok) {
                const apiResponse = await compatibilityResponse.json();
                const record: ApiHeroCompatibilityRecord | undefined = apiResponse?.data?.records?.[0];
                if (record?.data) {
                    bestSynergies = processSubHeroes(record.data.sub_hero);
                    worstSynergies = processSubHeroes(record.data.sub_hero_last);
                }
            } else if (compatibilityResponse) {
                console.warn(`A resposta da API de compatibilidade não foi 'ok': ${compatibilityResponse.statusText}`);
            }

            if (stats.winRate === 0 && bestSynergies.length === 0 && worstSynergies.length === 0) {
                return null;
            }

            return {
                stats,
                bestSynergies,
                worstSynergies,
            };
        } catch (error) {
            console.error(`Falha ao buscar estatísticas detalhadas para o herói ID ${heroApiId}:`, error);
            return null;
        }
    }, ttl);
}

export async function fetchHeroRelations(
    heroApiId: number,
    heroes: Record<string, Hero>,
    heroApiIdMap: Record<number, Hero>
): Promise<HeroRelation | null> {
    const cacheKey = `hero_relations_v3_${heroApiId}`; // new version
    const ttl = 24 * 60 * 60 * 1000; // 24 horas

    return fetchWithCache(cacheKey, async () => {
        const relationApiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-relation/${heroApiId}/`;
        const proxyUrl = 'https://corsproxy.io/?';
        const fetchRelationUrl = proxyUrl + encodeURIComponent(relationApiUrl);

        try {
            // Fetch both in parallel
            const [relationResponse, counterStats] = await Promise.all([
                fetch(fetchRelationUrl).catch(e => { console.warn('Falha ao buscar API de Relações', e); return null; }),
                fetchHeroCounterStats(heroApiId).catch(e => { console.warn('Falha ao buscar API de Counter Stats', e); return null; })
            ]);

            let assistIds: number[] = [];
            let strongIds: number[] = [];
            let weakIds: number[] = [];

            // Process relation API for assists
            if (relationResponse && relationResponse.ok) {
                const apiResponse = await relationResponse.json();
                const record = apiResponse?.data?.records?.[0]?.data;
                if (record && record.relation) {
                    assistIds = (record.relation.assist?.target_hero_id || []).filter((id: number) => id !== 0);
                }
            } else if (relationResponse) {
                 console.warn(`A resposta da API de relações não foi 'ok': ${relationResponse.statusText}`);
            }

            // Process counter API for strong/weak
            if (counterStats) {
                // sub_hero_last are heroes that main_hero is strong against
                strongIds = (counterStats.counteredBy || []).map(h => h.heroid);
                // sub_hero are heroes that are strong against main_hero
                weakIds = (counterStats.counters || []).map(h => h.heroid);
            }

            // Augment with manual data
            const hero = heroApiIdMap[heroApiId];
            const manualData = hero ? MANUAL_SYNERGY_DATA[hero.name] : undefined;
            const nameToHeroMap = Object.values(heroes).reduce((acc, h) => {
                acc[h.name] = h;
                return acc;
            }, {} as Record<string, Hero>);

            const mergedAssistIds = new Set(assistIds);
            const mergedStrongIds = new Set(strongIds);
            
            if (manualData) {
                manualData.allies.forEach(name => {
                    const allyHero = nameToHeroMap[name];
                    if (allyHero && allyHero.apiId) mergedAssistIds.add(allyHero.apiId);
                });
                manualData.strongAgainst.forEach(name => {
                    const strongHero = nameToHeroMap[name];
                    if (strongHero && strongHero.apiId) mergedStrongIds.add(strongHero.apiId);
                });
            }

            const finalAssistIds = Array.from(mergedAssistIds);
            const finalStrongIds = Array.from(mergedStrongIds);
            
            if (finalAssistIds.length === 0 && finalStrongIds.length === 0 && weakIds.length === 0) {
                return null;
            }
            
            return {
                assist: { target_hero_id: finalAssistIds },
                strong: { target_hero_id: finalStrongIds },
                weak: { target_hero_id: weakIds },
            };

        } catch (error) {
            console.error(`Falha ao buscar relações para o herói ID ${heroApiId}:`, error);
            throw new Error("Não foi possível carregar os dados de sinergia do herói.");
        }
    }, ttl);
}

export async function fetchHeroRate(
    heroApiId: number,
    pastDays: 7 | 15 | 30
): Promise<HeroDailyStats[]> {
    const cacheKey = `hero_rate_${heroApiId}_${pastDays}`;
    const ttl = 6 * 60 * 60 * 1000; // 6 horas

    return fetchWithCache(cacheKey, async () => {
        const apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-rate/${heroApiId}/?past-days=${pastDays}`;
        const proxyUrl = 'https://corsproxy.io/?';
        const fetchUrl = proxyUrl + encodeURIComponent(apiUrl);

        try {
            const response = await fetch(fetchUrl);
            if (!response.ok) {
                throw new Error(`A resposta da API de taxas do herói não foi 'ok': ${response.statusText}`);
            }
            const apiResponse = await response.json();
            
            const rateData: ApiDailyRateData[] | undefined = apiResponse?.data?.records?.[0]?.data?.win_rate;

            if (!rateData || !Array.isArray(rateData)) {
                console.warn(`Nenhum dado de taxa diária encontrado para o herói ID ${heroApiId}.`);
                return [];
            }
            
            // Map API response to our internal type and sort by date ascending
            return rateData.map(d => ({
                date: d.date,
                winRate: d.win_rate,
                pickRate: d.app_rate,
                banRate: d.ban_rate,
            })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        } catch (error) {
            console.error(`Falha ao buscar taxas para o herói ID ${heroApiId}:`, error);
            return []; // Return empty array on failure to avoid breaking UI
        }
    }, ttl);
}