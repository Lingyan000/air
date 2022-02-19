import { defineStore } from 'pinia';
import { store } from '/@/store';
import designSetting from '/@/settings/designSetting';

const { themeMode, appTheme, appThemeList } = designSetting;

type ThemeModeType = 'light' | 'dark' | 'system';

interface DesignSettingState {
  themeMode: ThemeModeType;
  //系统风格
  appTheme: string;
  //系统内置风格
  appThemeList: string[];
}

export const useDesignSettingStore = defineStore({
  id: 'app-design-setting',
  state: (): DesignSettingState => ({
    themeMode: themeMode as ThemeModeType,
    appTheme,
    appThemeList,
  }),
  getters: {
    getThemeMode(): ThemeModeType {
      return this.themeMode;
    },
    getAppTheme(): string {
      return this.appTheme;
    },
    getAppThemeList(): string[] {
      return this.appThemeList;
    },
  },
  actions: {
    setThemeMode(themeMode: ThemeModeType): void {
      this.themeMode = themeMode;
    },
  },
});

// Need to be used outside the setup
export function useDesignSettingWithOut() {
  return useDesignSettingStore(store);
}
