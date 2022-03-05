<script lang="ts" setup>
  import { ref, defineExpose, watch, Ref } from 'vue';
  import { NDrawer, NDrawerContent } from 'naive-ui';
  import { SET_DEFAULT_HEADERS, UPDATE_REQUEST_HEADERS } from '#/events/constants';
  import { camelCase, cloneDeep, isObject } from 'lodash';
  import { PC_UA } from '#/parse/constants';
  import Artplayer from '/@/components/Artplayer/Artplayer.vue';
  import flvjs from 'flv.js';
  import Hls from 'hls.js';
  import artplayerPluginDanmuku from '/@/plugins/artplayer-plugin-danmuku/src/index';
  import { isHlsUrl } from '/@/utils';
  import ploadingGif from '/@/assets/images/ploading.gif';
  import stateSvg from '/@/assets/svg/state.svg';
  import indicatorSvg from '/@/assets/svg/indicator.svg';
  import { useDesignSettingStore } from '/@/store/modules/designSetting';

  const { api } = window;

  const designSettingStore = useDesignSettingStore();

  const videoTitle = ref('');

  const activeRef = ref(false);

  const userAgent = ref(PC_UA);
  const referer = ref<any>(null);

  const options = ref<any>({});

  const filter: Ref<{
    urls: string[];
  }> = ref({
    urls: [],
  });

  const isNeedSetHeader = ref(false);

  const artRef: Ref<typeof Artplayer | null> = ref(null);

  function open(title: string, url: string, otherOptions: any = {}) {
    videoTitle.value = title;
    const { headers, danmu, subtitle } = otherOptions;

    if (/;{.*}$/.test(url)) {
      const urlHeader = url.replace(/.*;{(.*)}$/, '$1').replace(/；；/g, ';');
      urlHeader.split(';').forEach((item) => {
        const [key, value] = item.split('@');
        headers[key] = value;
      });
      url = url.replace(/;{.*}$/, '');
    }

    if (isObject(headers)) {
      Object.keys(headers).forEach((key) => {
        switch (camelCase(key)) {
          case 'userAgent':
            userAgent.value = headers[key];
            break;
          case 'referer':
            referer.value = headers[key];
            break;
        }
      });
      let url2 = new URL(url);
      let hostname = url2.hostname;
      filter.value.urls.push(`*://${hostname}:*/*`);
      isNeedSetHeader.value = true;
      watch(
        filter,
        (v) => {
          api.send(UPDATE_REQUEST_HEADERS, cloneDeep(v), headers || {});
        },
        {
          deep: true,
          immediate: true,
        }
      );
    }

    activeRef.value = true;

    options.value = {
      title,
      autoSize: true,
      mutex: false,
      url: url,
      subtitle: {
        url: subtitle ? subtitle : '',
      },
      autoplay: true,
      fullscreen: true,
      pip: true,
      screenshot: true,
      setting: true,
      controls: [
        {
          position: 'right',
          html: '弹幕大小：<input type="range" min="12" max="50" step="1" value="25">',
          style: {
            display: 'flex',
            alignItems: 'center',
          },
          mounted: function ($setting) {
            const $range = $setting.querySelector('input[type=range]');
            $range.addEventListener('change', () => {
              artRef.value?.instance.plugins.artplayerPluginDanmuku.config({
                fontSize: Number($range.value),
              });
            });
          },
        },
      ],
      playbackRate: true,
      type: isHlsUrl(url) ? 'm3u8' : '',
      theme: designSettingStore.appTheme,
      customType: {
        flv: function (video, url) {
          const flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: url,
          });
          flvPlayer.attachMediaElement(video);
          flvPlayer.load();
          watch(activeRef, (v) => {
            if (!v) flvPlayer.unload();
          });
        },
        m3u8: function (video, url) {
          const hls = new Hls({
            xhrSetup: (xhr, url) => {
              if (isNeedSetHeader.value) {
                let url2 = new URL(url);
                let hostname = url2.hostname;
                if (!filter.value.urls.includes(`*://${hostname}:*/*`)) {
                  filter.value.urls.push(`*://${hostname}:*/*`);
                }
              }
            },
          });
          hls.loadSource(url);
          hls.attachMedia(video);
          watch(activeRef, (v) => {
            if (!v) hls.stopLoad();
          });
        },
      },
      plugins: [
        artplayerPluginDanmuku({
          danmuku: danmu ? danmu : [],
          speed: 5,
          maxlength: 50,
          margin: [10, 100],
          opacity: 1,
          fontSize: 25,
          synchronousPlayback: false,
        }),
      ],
      icons: {
        loading: `<img src="${ploadingGif}" width="90">`,
        state: `<img width="150" heigth="150" src="${stateSvg}">`,
        indicator: `<img width="16" heigth="16" src="${indicatorSvg}">`,
      },
    };
  }

  watch(activeRef, (v) => {
    if (!v) {
      document.exitPictureInPicture();
      isNeedSetHeader.value = false;
      filter.value.urls = [];
      api.send(SET_DEFAULT_HEADERS);
    }
  });

  const style = {
    height: '80%',
  };

  defineExpose({
    open,
  });
</script>

<template>
  <n-drawer
    v-model:show="activeRef"
    :close-on-esc="false"
    width="100%"
    to="#layout-body"
    display-directive="if"
  >
    <n-drawer-content :native-scrollbar="false" body-content-style="height: 100%">
      <template #header>
        <n-page-header :title="videoTitle" @back="activeRef = false"></n-page-header>
      </template>
      <template #default>
        <artplayer ref="artRef" :option="options" :style="style" />
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
