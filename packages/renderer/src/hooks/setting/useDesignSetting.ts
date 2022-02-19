import { computed } from 'vue';
import { useDesignSettingStore } from '/@/store/modules/designSetting';

export function useDesignSetting() {
  const designStore = useDesignSettingStore();

  const getThemeMode = computed(() => designStore.themeMode);

  const getAppTheme = computed(() => designStore.appTheme);

  const getAppThemeList = computed(() => designStore.appThemeList);

  return {
    getThemeMode,
    getAppTheme,
    getAppThemeList,
  };
}
