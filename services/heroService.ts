
import { Hero } from '../types';

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

export interface HeroSkill {
    skillname: string;
    skilldesc: string;
}

export interface SkillCombo {
    title: string;
    desc: string;
}

export interface HeroDetails {
    name: string;
    summary: string;
    skills: HeroSkill[];
    combos: SkillCombo[];
}

function cleanSkillDescription(desc: string): string {
    return desc.replace(/<font color="[^"]*">/g, '').replace(/<\/font>/g, '');
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
            return []; // Retorna um array vazio se não houver counters para não quebrar a aplicação
        }

        const counterHeroes = records[0]?.data?.sub_hero;

        if (!counterHeroes || !Array.isArray(counterHeroes)) {
            return []; // Retorna um array vazio se a estrutura for inesperada
        }

        return counterHeroes;
    } catch (error) {
        console.error(`Falha ao buscar counters para o herói ID ${heroApiId}:`, error);
        throw new Error("Não foi possível carregar os counters do herói.");
    }
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
    const apiUrl = `https://mlbb-stats.ridwaanhall.com/api/hero-detail/${heroApiId}/`;
    const proxyUrl = 'https://corsproxy.io/?';
    const fetchUrl = proxyUrl + encodeURIComponent(apiUrl);

    try {
        const [detailsResponse, combos] = await Promise.all([
            fetch(fetchUrl),
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
        const skillList = heroData.heroskilllist?.[0]?.skilllist ?? [];

        const skills = skillList.map((skill: any) => ({
            skillname: skill.skillname,
            skilldesc: cleanSkillDescription(skill.skilldesc),
        }));

        return {
            name: heroData.name,
            summary: heroData.story,
            skills: skills,
            combos: combos,
        };

    } catch (error) {
        console.error(`Falha ao buscar detalhes para o herói ID ${heroApiId}:`, error);
        throw new Error("Não foi possível carregar os detalhes do herói.");
    }
}
