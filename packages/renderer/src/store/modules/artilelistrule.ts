import { defineStore } from 'pinia';
import { store } from '/@/store';
import * as Models from '#/models';
import storage from '/@/utils/storage';
import { union, uniq } from 'lodash';
import naturalCompare from 'string-natural-compare';

interface ArtilelistruleState {
  list: Models.Articlelistrules;
  searchList: Models.Articlelistrules;
  lastSearchList: Models.Articlelistrules;
  listMap: Map<number, Models.Articlelistrule>;
  lastSearchIds: number[];
  defaultSearchId: number | null;
  groups: string[];
}

export const useArtilelistruleStore = defineStore({
  id: 'artilelistrule',
  state: (): ArtilelistruleState => ({
    list: [],
    searchList: [],
    lastSearchList: [],
    listMap: new Map(),
    lastSearchIds: storage.get('lastSearchIds', []),
    defaultSearchId: null,
    groups: [],
  }),
  getters: {
    getList(): Models.Articlelistrules {
      return this.list;
    },
    getLastSearchIds(): number[] {
      return this.lastSearchIds;
    },
  },
  actions: {
    initArtilelistrule(artilelistrule: Models.Articlelistrules) {
      const list = artilelistrule;
      const groups: string[] = [];
      const searchList: Models.Articlelistrules = [];

      // 初始化 Map
      this.listMap.clear();

      list.forEach((item) => {
        // 设置列表 Map 方便之后查找
        this.listMap.set(item.id, item);
        // 设置搜索列表
        item.search_url && searchList.push(item);
        // 添加分组
        item.group_lpcolumn && groups.push(item.group_lpcolumn);

        if (this.lastSearchIds.findIndex((id) => id === item.id) === -1) {
          this.removeLastSearchIds(item.id);
        }
      });

      // 设置状态
      this.list = list;
      this.searchList = searchList;
      this.groups = uniq(groups).sort((a, b) => naturalCompare(a, b));
    },

    pushLastSearchIds(id: number): void {
      this.lastSearchIds = union([id], this.lastSearchIds);
      this.lastSearchIds = this.lastSearchIds.slice(0, 10);
      storage.set('lastSearchIds', this.lastSearchIds);
    },

    removeLastSearchIds(id: number): void {
      if (this.lastSearchIds.includes(id)) {
        this.lastSearchIds.splice(this.lastSearchIds.indexOf(id), 1);
      }
      storage.set('lastSearchIds', this.lastSearchIds);
    },
  },
});

// Need to be used outside the setup
export function useDesignSettingWithOut() {
  return useArtilelistruleStore(store);
}
