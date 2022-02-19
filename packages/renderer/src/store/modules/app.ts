import { defineStore } from 'pinia';

type Theme = 'auto' | 'dark' | 'light';

interface AppStore {
  theme: Theme;
}

const useAppStore = defineStore({
  id: 'air-main',
  state: (): AppStore => ({
    theme: 'auto',
  }),
  getters: {
    getTheme(): Theme {
      return this.theme;
    },
  },
  actions: {
    setTheme(theme: Theme): void {
      this.theme = theme;
    },
  },
});

export default useAppStore;
