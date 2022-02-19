<script lang="ts" setup>
  import { computed } from 'vue';
  import {
    zhCN,
    dateZhCN,
    darkTheme,
    NConfigProvider,
    useOsTheme,
    GlobalThemeOverrides,
  } from 'naive-ui';
  import { useDesignSettingStore } from './store/modules/designSetting';
  import { lighten } from './utils';
  import { AppProvider } from '/@/components/AppProvider/index';
  import { merge, cloneDeep } from 'lodash';
  import hljs from 'highlight.js/lib/core';
  import javascript from 'highlight.js/lib/languages/javascript';
  import accesslog from 'highlight.js/lib/languages/accesslog';

  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('logs', accesslog);

  const designStore = useDesignSettingStore();
  const osThemeRef = useOsTheme();

  const getThemeOverrides = computed<GlobalThemeOverrides>(() => {
    const appTheme = designStore.appTheme;
    const lightenStr = lighten(designStore.appTheme, 6);
    return {
      common: {
        primaryColor: appTheme,
        primaryColorHover: lightenStr,
        primaryColorPressed: lightenStr,
      },
      LoadingBar: {
        colorLoading: appTheme,
      },
      Menu: {
        borderRadius: '10px',
      },
    };
  });

  const getLightThemeOverrides = computed<GlobalThemeOverrides>(() => {
    return merge<GlobalThemeOverrides, GlobalThemeOverrides>(cloneDeep(getThemeOverrides.value), {
      Layout: {
        siderBorderColorInverted: 'rgb(239, 239, 245)',
        siderColorInverted: 'rgb(239, 239, 245)',
        headerColorInverted: '#e8e8e9',
      },
      Menu: {
        borderRadius: '10px',
        itemTextColorInverted: lighten('#25262BFF', 20),
        itemIconColorHoverInverted: '#25262BFF',
        itemTextColorHoverInverted: '#25262BFF',
        itemIconColorActiveInverted: '#25262BFF',
        itemTextColorActiveInverted: '#25262BFF',
        itemColorActiveInverted: '#e3e3e5',
        itemColorActiveCollapsedInverted: '#e3e3e5',
        itemIconColorCollapsedInverted: lighten('#25262BFF', 20),
        itemIconColorInverted: lighten('#25262BFF', 20),
      },
    });
  });

  const getDarkThemeOverrides = computed<GlobalThemeOverrides>(() => {
    return merge<GlobalThemeOverrides, GlobalThemeOverrides>(
      cloneDeep(getThemeOverrides.value),
      {}
    );
  });

  const getTheme = computed(() => {
    switch (designStore.themeMode) {
      case 'light':
        return null;
      case 'dark':
        return darkTheme;
      case 'system':
        return osThemeRef.value === 'dark' ? darkTheme : null;
      default:
        return null;
    }
  });
</script>

<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="getTheme"
    :theme-overrides="getTheme === null ? getLightThemeOverrides : getDarkThemeOverrides"
    :hljs="hljs"
  >
    <app-provider>
      <router-view />
    </app-provider>
  </n-config-provider>
</template>
