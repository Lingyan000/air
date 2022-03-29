import { defineStore } from 'pinia';
import storage from '/@/utils/storage';
import { union } from 'lodash';

export const searchHistoryKey = 'searchHistory';

interface SearchStore {
  historyList: string[];
}

const useSearchStore = defineStore({
  id: 'air-search',
  state: (): SearchStore => ({
    historyList: storage.get(searchHistoryKey, []),
  }),
  getters: {
    getHistoryList: (state) => state.historyList,
  },
  actions: {
    addHistory(keyWord): void {
      if (this.historyList.length === 100) {
        this.historyList.pop();
      }
      this.historyList = union([keyWord], this.historyList);
      storage.set(searchHistoryKey, this.historyList);
    },
    deleteHistoryList(): void {
      this.historyList = [];
      storage.set(searchHistoryKey, this.historyList);
    },
  },
});

export default useSearchStore;
