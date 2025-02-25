import urlJoin from 'url-join';

import { appEnv } from '@/config/app';
import { DEFAULT_LANG, isLocaleNotSupport } from '@/const/locale';
import { Locales, normalizeLocale } from '@/locales/resources';
import { EdgeConfig } from '@/server/modules/EdgeConfig';
import { AgentStoreIndex, AgentSortIndex } from '@/types/discover';
import { RevalidateTag } from '@/types/requestCache';

export class AssistantStore {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || appEnv.AGENTS_INDEX_URL;
  }

  private getAgentIndexUrl = (lang: Locales = DEFAULT_LANG) => {
    if (isLocaleNotSupport(lang)) return this.baseUrl;

    return urlJoin(this.baseUrl, `index.${normalizeLocale(lang)}.json`);
  };

  getAgentUrl = (identifier: string, lang: Locales = DEFAULT_LANG) => {
    if (isLocaleNotSupport(lang)) return urlJoin(this.baseUrl, `${identifier}.json`);

    return urlJoin(this.baseUrl, `${identifier}.${normalizeLocale(lang)}.json`);
  };

  getAgentIndex = async (locale: Locales = DEFAULT_LANG, revalidate?: number) => {
    try {
      let res: Response;

      res = await fetch(this.getAgentIndexUrl(locale as any), {
        next: { revalidate, tags: [RevalidateTag.AgentIndex] },
      });

      if (res.status === 404) {
        res = await fetch(this.getAgentIndexUrl(DEFAULT_LANG), {
          next: { revalidate, tags: [RevalidateTag.AgentIndex] },
        });
      }

      if (!res.ok) {
        console.warn('fetch agent index error:', await res.text());
        return [];
      }
      let resindexData = await fetch('https://chat.hyhospital.com:3210/public/data/agentsIndex.json');

      let indexData: AgentSortIndex = await resindexData.json();

      let data: AgentStoreIndex = await res.json();

      if (EdgeConfig.isEnabled()) {
        // Get the assistant whitelist from Edge Config
        const edgeConfig = new EdgeConfig();

        const { whitelist, blacklist } = await edgeConfig.getAgentRestrictions();

        // use whitelist mode first
        if (whitelist && whitelist?.length > 0) {
          data.agents = data.agents.filter((item) => whitelist.includes(item.identifier));
        }

        // if no whitelist, use blacklist mode
        else if (blacklist && blacklist?.length > 0) {
          data.agents = data.agents.filter((item) => !blacklist.includes(item.identifier));
        }
      }
      data.agents = data.agents.sort((a, b) => {
        const indexA = indexData.agentsIndex.indexOf(a.identifier);
        const indexB = indexData.agentsIndex.indexOf(b.identifier);
      
        // 如果 a 在 agentsIndex 中，b 不在，a 应该排在前面
        if (indexA !== -1 && indexB === -1) return -1;
        
        // 如果 b 在 agentsIndex 中，a 不在，b 应该排在前面
        if (indexB !== -1 && indexA === -1) return 1;
        
        // 如果都在 agentsIndex 中，按照 agentsIndex 的顺序排序
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        
        // 如果都不在 agentsIndex 中，保持原有顺序
        return 0;
      });

      return data;
    } catch (e) {
      console.error('[AgentIndexFetchError] failed to fetch agent index, error detail:');
      console.error(e);

      throw e;
    }
  };
}
